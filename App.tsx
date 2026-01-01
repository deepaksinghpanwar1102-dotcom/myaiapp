
import React, { useState, useEffect } from 'react';
import { UserSession, Student, SchoolSettings } from './types';
import { ADMIN_CREDENTIALS, DEFAULT_STUDENT_PASSWORD } from './constants';
import { findStudentByRollNo, getSchoolSettings } from './services/storageService';
import Layout from './components/Layout';
import StudentView from './components/StudentView';
import AdminView from './components/AdminView';
import { ShieldCheck, GraduationCap, Lock, User, AlertCircle, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');
  const [settings, setSettings] = useState<SchoolSettings>(getSchoolSettings());
  
  const [rollNo, setRollNo] = useState('');
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [error, setError] = useState('');

  // Update CSS Variables when settings change
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
    // Rough darken for hover effect
    const darkenColor = (hex: string) => {
      return hex; // In a real app, use a proper color library
    };
    document.documentElement.style.setProperty('--primary-hover', settings.primaryColor + 'ee');
  }, [settings.primaryColor]);

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const student = findStudentByRollNo(rollNo);
    if (student && password === DEFAULT_STUDENT_PASSWORD) {
      setSession({ role: 'student', data: student });
    } else {
      setError('Invalid Roll Number or Password.');
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (adminUser === ADMIN_CREDENTIALS.username && adminPass === ADMIN_CREDENTIALS.password) {
      setSession({ role: 'admin', data: null });
    } else {
      setError('Invalid Admin Credentials.');
    }
  };

  const handleLogout = () => {
    setSession(null);
    setRollNo('');
    setPassword('');
    setAdminUser('');
    setAdminPass('');
    setError('');
  };

  const onSettingsUpdate = () => {
    setSettings(getSchoolSettings());
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-maroon flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl"></div>

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-in zoom-in duration-500">
          <div className="bg-maroon p-8 text-center text-white relative transition-colors duration-500">
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg transform rotate-45">
              <GraduationCap className="w-8 h-8 text-maroon -rotate-45" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-widest">{settings.name}</h1>
            <p className="text-xs opacity-80 mt-1">{settings.location}</p>
          </div>

          <div className="p-8 pt-12">
            <div className="flex bg-gray-100 p-1 rounded-xl mb-8">
              <button 
                onClick={() => { setActiveTab('student'); setError(''); }}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'student' ? 'bg-white text-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <User className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button 
                onClick={() => { setActiveTab('admin'); setError(''); }}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'admin' ? 'bg-white text-maroon shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start space-x-2 rounded">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {activeTab === 'student' ? (
              <form onSubmit={handleStudentLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Roll Number</label>
                  <input 
                    type="text" required placeholder="e.g. 1001"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all"
                    value={rollNo} onChange={(e) => setRollNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password (12345)</label>
                  <input 
                    type="password" required placeholder="•••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-maroon text-white font-bold py-3.5 rounded-xl hover:opacity-90 transition-all shadow-xl shadow-maroon/20">
                  Login & View Result
                </button>
              </form>
            ) : (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin User</label>
                  <input 
                    type="text" required placeholder="admin"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all"
                    value={adminUser} onChange={(e) => setAdminUser(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Admin Password</label>
                  <input 
                    type="password" required placeholder="••••••••"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-maroon outline-none transition-all"
                    value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                  />
                </div>
                <button type="submit" className="w-full bg-gray-800 text-white font-bold py-3.5 rounded-xl hover:bg-black transition-all shadow-xl">
                  Admin Login
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      onLogout={handleLogout} 
      title={session.role === 'admin' ? "Admin Dashboard" : "Annual Result Report"}
      userName={session.role === 'admin' ? "School Admin" : session.data?.name}
    >
      {session.role === 'student' && session.data ? (
        <StudentView student={session.data} />
      ) : (
        <AdminView onSettingsChange={onSettingsUpdate} />
      )}
    </Layout>
  );
};

export default App;
