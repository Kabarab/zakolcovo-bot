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
  
  // Inject stealth script
  await context.addInitScript(() => {
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
  });

  const page = await context.newPage();
  await page.goto('https://pixelscan.net');
}
