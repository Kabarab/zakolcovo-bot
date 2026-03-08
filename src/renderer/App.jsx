import React, { useState, useEffect } from 'react';
import { Plus, Play, Square, Settings, Trash2, Globe, Monitor, ShieldCheck } from 'lucide-react';
import ProfileModal from './components/ProfileModal';

const App = () => {
  const [profiles, setProfiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const data = await window.electron.getProfiles();
      setProfiles(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (profile) => {
    await window.electron.saveProfile(profile);
    loadProfiles();
  };

  const handleLaunch = async (profile) => {
    const result = await window.electron.launchProfile(profile);
    if (!result.success) {
      alert('Launch failed: ' + result.error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this profile?')) {
      await window.electron.deleteProfile(id);
      loadProfiles();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col p-8">
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            AntiDetect Browser
          </h1>
          <p className="text-slate-400 mt-2">Manage independent browsing environments</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-semibold"
        >
          <Plus size={20} />
          Create Profile
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map(profile => (
          <div key={profile.id} className="bg-slate-800/50 border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                <Globe size={24} />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-white"><Settings size={18} /></button>
                <button onClick={() => handleDelete(profile.id)} className="p-2 text-slate-400 hover:text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
            
            <h3 className="text-xl font-bold mb-1">{profile.name}</h3>
            <p className="text-slate-400 text-sm mb-6 flex items-center gap-2">
              <ShieldCheck size={14} /> {profile.fingerprint.userAgent.split(') ')[0].split('(')[1]}
            </p>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6">
              <div className="flex items-center gap-1">
                <Monitor size={14} /> {profile.fingerprint.screen.width}x{profile.fingerprint.screen.height}
              </div>
              <div className="flex items-center gap-1">
                <Globe size={14} /> {profile.proxy?.host ? profile.proxy.host : 'No Proxy'}
              </div>
            </div>

            <button 
              onClick={() => handleLaunch(profile)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors font-medium"
            >
              <Play size={16} fill="currentColor" />
              Launch
            </button>
          </div>
        ))}
        {profiles.length === 0 && !loading && (
          <div className="col-span-full py-20 border-2 border-dashed border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-500">
            <p>No profiles found. Create your first one to get started.</p>
          </div>
        )}
      </div>

      <ProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveProfile} 
      />
    </div>
  );
};

export default App;
