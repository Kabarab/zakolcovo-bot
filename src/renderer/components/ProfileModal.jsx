import React, { useState } from 'react';
import { X, Globe, Monitor, ShieldCheck, Mail, Lock } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [proxy, setProxy] = useState({ host: '', port: '', username: '', password: '', protocol: 'http' });
  const [fingerprint, setFingerprint] = useState({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    screen: { width: 1920, height: 1080 },
    deviceScaleFactor: 1
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name, proxy, fingerprint });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-2xl font-bold">New Profile</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 overflow-y-auto flex-1">
          {/* General Section */}
          <section>
            <label className="block text-slate-400 text-sm font-medium mb-3">Profile Name</label>
            <input 
              required
              className="w-full bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 rounded-xl px-4 py-3 outline-none transition-colors"
              placeholder="e.g., Marketing Account 1"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </section>

          {/* Proxy Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Globe size={18} className="text-indigo-400" />
              <h3 className="font-semibold text-lg">Proxy Settings</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                placeholder="Proxy Server Host"
                value={proxy.host}
                onChange={(e) => setProxy({ ...proxy, host: e.target.value })}
              />
              <input 
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                placeholder="Port"
                value={proxy.port}
                onChange={(e) => setProxy({ ...proxy, port: e.target.value })}
              />
              <div className="relative">
                <input 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Username"
                  value={proxy.username}
                  onChange={(e) => setProxy({ ...proxy, username: e.target.value })}
                />
                <Mail size={16} className="absolute left-3 top-4 text-slate-500" />
              </div>
              <div className="relative">
                <input 
                  type="password"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-indigo-500 transition-colors"
                  placeholder="Password"
                  value={proxy.password}
                  onChange={(e) => setProxy({ ...proxy, password: e.target.value })}
                />
                <Lock size={16} className="absolute left-3 top-4 text-slate-500" />
              </div>
            </div>
          </section>

          {/* Fingerprint Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className="text-indigo-400" />
              <h3 className="font-semibold text-lg">Digital Fingerprint</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-xs mb-2">User Agent</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm h-20 outline-none focus:border-indigo-500"
                  value={fingerprint.userAgent}
                  onChange={(e) => setFingerprint({ ...fingerprint, userAgent: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-slate-400 text-xs mb-2">Width</label>
                   <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.screen.width}
                    onChange={(e) => setFingerprint({ ...fingerprint, screen: { ...fingerprint.screen, width: parseInt(e.target.value) } })}
                  />
                </div>
                <div>
                   <label className="block text-slate-400 text-xs mb-2">Height</label>
                   <input 
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500"
                    value={fingerprint.screen.height}
                    onChange={(e) => setFingerprint({ ...fingerprint, screen: { ...fingerprint.screen, height: parseInt(e.target.value) } })}
                  />
                </div>
              </div>
            </div>
          </section>
        </form>

        <div className="p-6 bg-slate-800/50 border-t border-slate-800 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-3 text-slate-400 hover:text-white transition-colors">Cancel</button>
          <button onClick={handleSubmit} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20">
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
