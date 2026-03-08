const { v4: uuidv4 } = require('uuid');

const OS_PLATFORMS = ['Windows', 'MacOS', 'Linux'];
const COMMON_RESOLUTIONS = [
  { width: 1920, height: 1080 },
  { width: 1366, height: 768 },
  { width: 1440, height: 900 },
  { width: 1536, height: 864 }
];

const generateRandomFingerprint = (overrides = {}) => {
  const os = OS_PLATFORMS[Math.floor(Math.random() * OS_PLATFORMS.length)];
  const res = COMMON_RESOLUTIONS[Math.floor(Math.random() * COMMON_RESOLUTIONS.length)];
  
  const uaMap = {
    'Windows': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'MacOS': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Linux': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  };

  return {
    userAgent: uaMap[os],
    screen: res,
    canvasNoise: true,
    webglSpoofing: true,
    audioNoise: true,
    webRTC: 'spoof',
    hardwareConcurrency: [4, 8, 12][Math.floor(Math.random() * 3)],
    deviceMemory: [4, 8, 16][Math.floor(Math.random() * 3)],
    timezone: 'Europe/Moscow',
    locale: 'ru-RU',
    geo: { latitude: 55.7558, longitude: 37.6173 },
    cookies: '',
    ...overrides
  };
};

const bulkCreate = (baseName, count, proxyTemplate = {}) => {
  const newProfiles = [];
  for (let i = 1; i <= count; i++) {
    newProfiles.push({
      id: uuidv4(),
      name: `${baseName} ${i}`,
      proxy: { ...proxyTemplate },
      fingerprint: generateRandomFingerprint()
    });
  }
  return newProfiles;
};

module.exports = { generateRandomFingerprint, bulkCreate };
