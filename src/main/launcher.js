import { chromium } from 'playwright';

export async function launchBrowser(profile) {
  const { name, proxy, fingerprint } = profile;
  
  const launchOptions = {
    headless: false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled',
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
  
  // Set context options based on fingerprint
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
    permissions: ['geolocation'],
    deviceScaleFactor: fingerprint.deviceScaleFactor || 1,
    hasTouch: fingerprint.platform === 'mobile',
  };

  const context = await browser.newContext(contextOptions);
  
  // Set cookies if provided
  if (fingerprint.cookies) {
    try {
      const parsedCookies = JSON.parse(fingerprint.cookies);
      await context.addCookies(parsedCookies);
    } catch (e) {
      console.error('Failed to parse cookies:', e);
    }
  }

  // Inject stealth script
  await context.addInitScript((fingerprint) => {
    // Overwrite the `navigator.webdriver` property
    Object.defineProperty(navigator, 'webdriver', {
      get: () => undefined,
    });
    
    // Mock languages
    Object.defineProperty(navigator, 'languages', {
      get: () => ['en-US', 'en'],
    });

    // Mock plugins
    Object.defineProperty(navigator, 'plugins', {
      get: () => [1, 2, 3, 4, 5],
    });

    // Hardware Spoofing
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => fingerprint.hardwareConcurrency || 8 });
    Object.defineProperty(navigator, 'deviceMemory', { get: () => fingerprint.deviceMemory || 8 });

    // WebRTC Protection
    if (fingerprint.webRTC === 'disable') {
      delete window.RTCPeerConnection;
      delete window.RTCSessionDescription;
      delete window.RTCIceCandidate;
    } else if (fingerprint.webRTC === 'spoof') {
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

    // Media Devices Spoofing
    if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices = async function() {
        return [
          { kind: 'audioinput', label: 'Default Audio Input', deviceId: 'default', groupId: 'group1' },
          { kind: 'videoinput', label: 'FaceTime HD Camera', deviceId: 'camera1', groupId: 'group2' },
          { kind: 'audiooutput', label: 'Internal Speakers', deviceId: 'speakers1', groupId: 'group3' }
        ];
      };
    }

    // Font Fingerprinting Protection (Basic)
    const origMeasure = CanvasRenderingContext2D.prototype.measureText;
    CanvasRenderingContext2D.prototype.measureText = function(text) {
      const result = origMeasure.apply(this, arguments);
      Object.defineProperty(result, 'width', { value: result.width + (Math.random() * 0.01) });
      return result;
    };

    // --- Advanced Stealth: Canvas Noise ---
    if (fingerprint.canvasNoise) {
      const { toDataURL, getImageData } = HTMLCanvasElement.prototype;
      
      HTMLCanvasElement.prototype.toDataURL = function(type, encoderOptions) {
        const context = this.getContext('2d');
        if (context) {
          const imageData = context.getImageData(0, 0, this.width || 1, this.height || 1);
          // Add subtle noise to the first pixel
          imageData.data[0] = (imageData.data[0] + 1) % 256;
          context.putImageData(imageData, 0, 0);
        }
        return toDataURL.apply(this, arguments);
      };

      CanvasRenderingContext2D.prototype.getImageData = function(x, y, width, height) {
        const res = getImageData.apply(this, arguments);
        // Add subtle noise
        res.data[0] = (res.data[0] + 1) % 256;
        return res;
      };
    }

    // --- Advanced Stealth: WebGL Spoofing ---
    if (fingerprint.webglSpoofing) {
      const getParameter = WebGLRenderingContext.prototype.getParameter;
      WebGLRenderingContext.prototype.getParameter = function(parameter) {
        // UNMASKED_VENDOR_WEBGL
        if (parameter === 37445) return 'Google Inc. (Apple)';
        // UNMASKED_RENDERER_WEBGL
        if (parameter === 37446) return 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)';
        return getParameter.apply(this, arguments);
      };

      const getParameter2 = WebGL2RenderingContext.prototype.getParameter;
      WebGL2RenderingContext.prototype.getParameter = function(parameter) {
        if (parameter === 37445) return 'Google Inc. (Apple)';
        if (parameter === 37446) return 'ANGLE (Apple, Apple M1 Pro, OpenGL 4.1)';
        return getParameter2.apply(this, arguments);
      };
    }

    // --- Advanced Stealth: Audio Noise ---
    if (fingerprint.audioNoise) {
      const getChannelData = AudioBuffer.prototype.getChannelData;
      AudioBuffer.prototype.getChannelData = function() {
        const res = getChannelData.apply(this, arguments);
        for (let i = 0; i < 10; i++) {
          res[i] = res[i] + Math.random() * 0.0000001;
        }
        return res;
      };
    }
  }, fingerprint);

  const page = await context.newPage();
  await page.goto('https://pixelscan.net');
}
