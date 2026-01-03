
import React from 'react';
import { User, Shield, Key, Bell, Save } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const Settings: React.FC<Props> = ({ profile, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onUpdate({ ...profile, [name]: value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Settings & Profile</h1>
        <p className="text-slate-500">Manage your health profile to improve analysis accuracy.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <User className="text-teal-600" size={20} />
          <h2 className="font-bold text-slate-800">Personal Information</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Display Name</label>
              <input 
                name="name"
                type="text"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
                value={profile.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
              <input 
                name="age"
                type="number"
                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
                value={profile.age}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Gender Identity</label>
            <select 
              name="gender"
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
              value={profile.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">General Medical History</label>
            <textarea 
              name="medicalHistory"
              rows={4}
              placeholder="List any chronic conditions, allergies, or regular medications."
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
              value={profile.medicalHistory}
              onChange={handleChange}
            />
            <p className="mt-2 text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest font-bold">
              Data is stored locally on this device.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-teal-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Shield size={20} />
            </div>
            <div className="text-sm font-semibold text-slate-700">Privacy & Data</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 flex items-center justify-between group hover:border-teal-200 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Bell size={20} />
            </div>
            <div className="text-sm font-semibold text-slate-700">Notifications</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-100 p-4 rounded-2xl flex items-start gap-3">
        <Shield className="text-slate-400 shrink-0 mt-0.5" size={16} />
        <p className="text-xs text-slate-500">
          Your personal data and health history are encrypted and stored solely within your browser&apos;s local storage. HealPath does not sell your health information to third parties.
        </p>
      </div>
    </div>
  );
};

export default Settings;
