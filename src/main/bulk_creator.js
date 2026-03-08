const { FingerprintGenerator } = require('browserforge');
const { v4: uuidv4 } = require('uuid');

const generator = new FingerprintGenerator();

const generateRandomFingerprint = (overrides = {}) => {
  const fp = generator.getFingerprint({
    os: ['windows', 'macos', 'linux'],
    browsers: ['chrome', 'edge'],
    devices: ['desktop']
  });

  return {
    userAgent: fp.fingerprint.navigator.userAgent,
    screen: {
      width: fp.fingerprint.screen.width,
      height: fp.fingerprint.screen.height
    },
    canvasNoise: true,
    webglSpoofing: true,
    audioNoise: true,
    webRTC: 'spoof',
    hardwareConcurrency: fp.fingerprint.navigator.hardwareConcurrency || 8,
    deviceMemory: fp.fingerprint.navigator.deviceMemory || 8,
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
