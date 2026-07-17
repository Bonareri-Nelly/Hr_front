import React, { useState } from 'react';

interface Setting {
  id: string;
  label: string;
  value: string | boolean;
  type: 'text' | 'toggle' | 'select';
  options?: string[];
}

const SystemSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([
    { id: 'company_name', label: 'Company Name', value: 'Optimum Computer Solutions', type: 'text' },
    { id: 'timezone', label: 'Timezone', value: 'Africa/Nairobi', type: 'select', options: ['Africa/Nairobi', 'Africa/Lagos', 'Africa/Johannesburg'] },
    { id: 'currency', label: 'Currency', value: 'KES', type: 'select', options: ['KES', 'USD', 'EUR', 'GBP'] },
    { id: 'email_notifications', label: 'Email Notifications', value: true, type: 'toggle' },
    { id: 'two_factor_auth', label: 'Two-Factor Authentication', value: false, type: 'toggle' },
    { id: 'session_timeout', label: 'Session Timeout (minutes)', value: '30', type: 'text' },
  ]);

  const [saved, setSaved] = useState(false);

  const handleToggle = (id: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, value: !s.value as boolean } : s
    ));
  };

  const handleChange = (id: string, value: string) => {
    setSettings(prev => prev.map(s => 
      s.id === id ? { ...s, value } : s
    ));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="bg-navy-900 rounded-xl border border-gold-500/20 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gold-500">⚙️ System Settings</h1>
            <p className="text-off-white/60 text-sm mt-1">Configure your system preferences and settings</p>
          </div>
          {saved && (
            <span className="text-green-400 text-sm font-medium">✓ Settings saved!</span>
          )}
        </div>

        <div className="space-y-4">
          {settings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-navy-800/50 rounded-lg border border-white/5 hover:border-gold-500/30 transition-colors">
              <label className="text-off-white font-medium">{setting.label}</label>
              
              {setting.type === 'toggle' ? (
                <button
                  onClick={() => handleToggle(setting.id)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    setting.value ? 'bg-gold-500' : 'bg-navy-700'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      setting.value ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              ) : setting.type === 'select' ? (
                <select
                  value={setting.value as string}
                  onChange={(e) => handleChange(setting.id, e.target.value)}
                  className="bg-navy-700 border border-white/10 rounded-lg px-3 py-1.5 text-off-white outline-none focus:border-gold-500"
                >
                  {setting.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={setting.value as string}
                  onChange={(e) => handleChange(setting.id, e.target.value)}
                  className="bg-navy-700 border border-white/10 rounded-lg px-3 py-1.5 text-off-white outline-none focus:border-gold-500 min-w-[200px]"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSave}
            className="bg-gold-500 text-navy-950 px-6 py-2.5 rounded-lg font-semibold hover:bg-gold-400 transition-colors"
          >
            Save Changes
          </button>
          <button
            onClick={() => window.location.reload()}
            className="border border-white/20 text-off-white/70 px-6 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;