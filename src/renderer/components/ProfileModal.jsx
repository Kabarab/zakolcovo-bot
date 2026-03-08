import React, { useState } from 'react';
import { X, Globe, Monitor, ShieldCheck, Mail, Lock } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [proxy, setProxy] = useState({ host: '', port: '', username: '', password: '', protocol: 'http' });
  const [fingerprint, setFingerprint] = useState({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    screen: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    canvasNoise: true,
    webglSpoofing: true,
    audioNoise: true,
    cookies: '',
    webRTC: 'spoof', // 'disable' | 'real' | 'spoof'
    hardwareConcurrency: 8,
    deviceMemory: 8,
    timezone: 'Europe/Moscow',
    locale: 'ru-RU',
    geo: { latitude: 55.7558, longitude: 37.6173 }
  });
  const [proxyStatus, setProxyStatus] = useState({ loading: false, result: null });

  if (!isOpen) return null;

  const handleSyncIP = async () => {
    setProxyStatus({ loading: true, result: null });
    const result = await window.electron.syncProxyData(proxy);
    if (result.success) {
      setFingerprint(prev => ({
        ...prev,
        timezone: result.timezone,
        geo: result.geo,
        locale: result.locale
      }));
      setProxyStatus({ loading: false, result: { success: true, ip: `Синхронизировано (${result.city})` } });
    } else {
      setProxyStatus({ loading: false, result: { success: false, error: result.error } });
    }
  };

  const handleCheckProxy = async () => {
    setProxyStatus({ loading: true, result: null });
    const result = await window.electron.checkProxy(proxy);
    setProxyStatus({ loading: false, result });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, proxy, fingerprint });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Новый профиль</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* General Section */}
          <section>
            <label className="block text-slate-400 text-sm font-medium mb-3">Название профиля</label>
            <input 
              required
              className="w-full bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none transition-colors"
              placeholder="например, Маркетинговый Аккаунт 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </section>

          {/* Proxy Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-indigo-400" />
              <h3 className="font-semibold text-lg">Настройки прокси</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                placeholder="Хост прокси-сервера"
                value={proxy.host}
                onChange={(e) => setProxy({ ...proxy, host: e.target.value })}
              />
              <input 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                placeholder="Порт"
                value={proxy.port}
                onChange={(e) => setProxy({ ...proxy, port: e.target.value })}
              />
              <div className="relative">
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Имя пользователя"
                  value={proxy.username}
                  onChange={(e) => setProxy({ ...proxy, username: e.target.value })}
                />
                <Mail size={16} className="absolute left-3 top-4 text-slate-500" />
              </div>
              <div className="relative">
                <input 
                  type="password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Пароль"
                  value={proxy.password}
                  onChange={(e) => setProxy({ ...proxy, password: e.target.value })}
                />
                <Lock size={16} className="absolute left-3 top-4 text-slate-500" />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <button 
                type="button"
                onClick={handleSyncIP}
                disabled={!proxy.host || proxyStatus.loading}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {proxyStatus.loading ? 'Синхронизация...' : 'Синхронизировать по IP'}
              </button>
              {proxyStatus.result && (
                <span className={`text-xs ${proxyStatus.result.success ? 'text-green-400' : 'text-red-400'}`}>
                  {proxyStatus.result.success ? `Успех! ${proxyStatus.result.ip}` : `Ошибка: ${proxyStatus.result.error}`}
                </span>
              )}
            </div>
          </section>

          {/* Fingerprint Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-indigo-400" />
                <h3 className="font-semibold text-lg">Цифровой отпечаток</h3>
              </div>
              <button 
                type="button"
                onClick={async () => setFingerprint(await window.electron.getRandomFingerprint())}
                className="text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg font-semibold transition-all"
              >
                Рандомизировать
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Платформа</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.platform || 'desktop'}
                    onChange={(e) => setFingerprint({ ...fingerprint, platform: e.target.value })}
                  >
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile (Android/iOS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">User Agent</label>
                  <textarea 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm h-20 outline-none focus:border-indigo-500"
                    value={fingerprint.userAgent}
                    onChange={(e) => setFingerprint({ ...fingerprint, userAgent: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-slate-400 text-xs mb-2">Ширина</label>
                   <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.screen.width}
                    onChange={(e) => setFingerprint({ ...fingerprint, screen: { ...fingerprint.screen, width: parseInt(e.target.value) } })}
                  />
                </div>
                <div>
                   <label className="block text-slate-400 text-xs mb-2">Высота</label>
                   <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.screen.height}
                    onChange={(e) => setFingerprint({ ...fingerprint, screen: { ...fingerprint.screen, height: parseInt(e.target.value) } })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Ядра процессора</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.hardwareConcurrency}
                    onChange={(e) => setFingerprint({ ...fingerprint, hardwareConcurrency: parseInt(e.target.value) })}
                  >
                    {[2, 4, 6, 8, 12, 16].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-xs mb-2">Память (ГБ)</label>
                  <select 
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.deviceMemory}
                    onChange={(e) => setFingerprint({ ...fingerprint, deviceMemory: parseInt(e.target.value) })}
                  >
                    {[2, 4, 8, 16, 32].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                <label className="block text-slate-400 text-xs mb-3">Режим WebRTC</label>
                <div className="flex gap-2">
                  {['real', 'spoof', 'disable'].map(mode => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setFingerprint({ ...fingerprint, webRTC: mode })}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                        fingerprint.webRTC === mode 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                      }`}
                    >
                      {mode === 'real' ? 'Реальный' : mode === 'spoof' ? 'Подмена' : 'Отключить'}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fingerprint.canvasNoise ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Шум Canvas</p>
                    <p className="text-xs text-slate-500">Добавляет шум для защиты от фингерпринтинга Canvas</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFingerprint({ ...fingerprint, canvasNoise: !fingerprint.canvasNoise })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${fingerprint.canvasNoise ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fingerprint.canvasNoise ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fingerprint.webglSpoofing ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Подмена WebGL</p>
                    <p className="text-xs text-slate-500">Подменяет данные о видеокарте и вендоре</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFingerprint({ ...fingerprint, webglSpoofing: !fingerprint.webglSpoofing })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${fingerprint.webglSpoofing ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fingerprint.webglSpoofing ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fingerprint.audioNoise ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-700 text-slate-500'}`}>
                    <Monitor size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Защита Audio</p>
                    <p className="text-xs text-slate-500">Добавляет шум к отпечатку AudioContext</p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setFingerprint({ ...fingerprint, audioNoise: !fingerprint.audioNoise })}
                  className={`w-12 h-6 rounded-full transition-colors relative ${fingerprint.audioNoise ? 'bg-indigo-600' : 'bg-slate-700'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${fingerprint.audioNoise ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </section>

          {/* Cookies Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={18} className="text-indigo-400" />
              <h3 className="font-semibold text-lg">Cookies (JSON)</h3>
            </div>
            <textarea 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-xs h-32 outline-none focus:border-indigo-500 font-mono"
              placeholder='[{"name": "session", "value": "...", "domain": "..."}]'
              value={fingerprint.cookies}
              onChange={(e) => setFingerprint({ ...fingerprint, cookies: e.target.value })}
            />
            <p className="text-[10px] text-slate-500 mt-2">Вставьте куки в формате JSON для восстановления сессий.</p>
          </section>
        </form>

        <div className="p-6 bg-slate-800/50 border-t border-slate-800 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">Отмена</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
            Сохранить профиль
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
