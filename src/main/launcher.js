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
  
  const contextOptions = {
    userAgent: fingerprint.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: fingerprint.screen || { width: 1920, height: 1080 },
    deviceScaleFactor: fingerprint.deviceScaleFactor || 1,
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
