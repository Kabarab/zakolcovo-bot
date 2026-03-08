import { chromium } from 'playwright';
import { createCursor } from 'ghost-cursor';

export async function launchBrowser(profile) {
  const { name, proxy, fingerprint } = profile;
  
  const launchOptions = {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
    ],
  };

  if (proxy && proxy.host) {
    launchOptions.proxy = {
      server: `${proxy.protocol || 'http'}://${proxy.host}:${proxy.port}`,
      username: proxy.username,
      password: proxy.password,
    };
  }

  const browser = await chromium.launch(launchOptions);
  
  const contextOptions = {
    userAgent: fingerprint.userAgent,
    viewport: fingerprint.screen,
    proxy: proxy.host ? {
      server: `${proxy.protocol || 'http'}://${proxy.host}:${proxy.port}`,
      username: proxy.username,
      password: proxy.password,
    } : undefined,
    locale: fingerprint.locale || 'ru-RU',
    timezoneId: fingerprint.timezone || 'Europe/Moscow',
    geolocation: fingerprint.geo ? {
      longitude: parseFloat(fingerprint.geo.longitude),
      latitude: parseFloat(fingerprint.geo.latitude),
      accuracy: 100
    } : undefined,
    permissions: ['geolocation', 'notifications'],
    deviceScaleFactor: fingerprint.deviceScaleFactor || 1,
    hasTouch: fingerprint.platform === 'mobile',
  };

  const context = await browser.newContext(contextOptions);
  
  // Ghost Cursor integration
  const page = await context.newPage();
  const cursor = createCursor(page);
  
  // Set cookies
  if (fingerprint.cookies) {
    try {
      const parsedCookies = JSON.parse(fingerprint.cookies);
      await context.addCookies(parsedCookies);
    } catch (e) {
      console.error('Failed to parse cookies:', e);
    }
  }

  // Inject stealth script
  await context.addInitScript((fp) => {
    // Basic Navigator Overrides
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => [fp.locale || 'ru-RU', 'ru', 'en-US', 'en'] });
    
    // Hardware
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => fp.hardwareConcurrency || 8 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => fp.deviceMemory || 8 });

    // WebRTC
    if (fp.webRTC === 'disable') {
      delete window.RTCPeerConnection;
    } else if (fp.webRTC === 'spoof') {
      const orig = window.RTCPeerConnection;
      window.RTCPeerConnection = function(config) {
        const pc = new orig(config);
        const origCreateOffer = pc.createOffer;
        pc.createOffer = function() {
          return origCreateOffer.apply(pc, arguments).then(offer => {
            offer.sdp = offer.sdp.replace(/(\d{1,3}\.){3}\d{1,3}/g, '192.168.1.100');
            return offer;
          });
        };
        return pc;
      };
    }

    // Canvas/WebGL/Audio (Simplified injection)
    if (fp.canvasNoise) {
      const toDataURL = HTMLCanvasElement.prototype.toDataURL;
      HTMLCanvasElement.prototype.toDataURL = function() {
        const ctx = this.getContext('2d');
        if (ctx) {
          const imgData = ctx.getImageData(0, 0, 1, 1);
          imgData.data[0] = (imgData.data[0] + 1) % 256;
          ctx.putImageData(imgData, 0, 0);
        }
        return toDataURL.apply(this, arguments);
      };
    }

    // Pro-Stealth: Speech API & Battery
    if (navigator.getBattery) {
      const origGetBattery = navigator.getBattery;
      navigator.getBattery = () => Promise.resolve({
        level: 0.9,
        charging: true,
        chargingTime: 0,
        dischargingTime: Infinity,
        addEventListener: () => {}
      });
    }

  }, fingerprint);

  await page.goto('https://pixelscan.net');
  
  // Example of human-like interaction after load
  try {
    await page.waitForTimeout(2000);
    await cursor.move({ x: 500, y: 500 });
  } catch (e) {
    console.error('Ghost cursor interaction failed:', e);
  }
}
