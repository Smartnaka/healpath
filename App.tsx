
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  Activity, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  ClipboardPlus, 
  HeartPulse,
  Info,
  ChevronRight,
  User,
  BookOpen,
  LogOut
} from 'lucide-react';
import SymptomInput from './components/SymptomInput';
import Results from './components/Results';
import History from './components/History';
import Settings from './components/Settings';
import HowToUse from './components/HowToUse';
import { UserProfile, AssessmentResult } from './types';

const App: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('healpath_profile');
    return saved ? JSON.parse(saved) : { name: 'Guest', age: '30', gender: 'Other', medicalHistory: 'None' };
  });

  const [assessments, setAssessments] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('healpath_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('healpath_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('healpath_history', JSON.stringify(assessments));
  }, [assessments]);

  const addAssessment = (assessment: AssessmentResult) => {
    setAssessments(prev => [assessment, ...prev]);
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform">
                  <HeartPulse size={24} />
                </div>
                <span className="text-xl font-bold tracking-tight text-teal-800">HealPath</span>
              </Link>
              <div className="hidden sm:flex items-center gap-6">
                <NavLink to="/" icon={<ClipboardPlus size={18} />} label="New Assessment" />
                <NavLink to="/history" icon={<HistoryIcon size={18} />} label="History" />
                <NavLink to="/guide" icon={<BookOpen size={18} />} label="Guide" />
                <NavLink to="/settings" icon={<SettingsIcon size={18} />} label="Settings" />
              </div>
              <div className="flex sm:hidden">
                <Link to="/settings" className="p-2 text-slate-500 hover:text-teal-600">
                  <User size={24} />
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 py-8">
          {/* Disclaimer Banner */}
          <div className="mb-8 bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 items-start">
            <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
            <p className="text-sm text-blue-700 leading-relaxed">
              <strong>Important:</strong> HealPath is an AI-powered informational tool, not a diagnostic service. If you are experiencing a medical emergency, call 911 or your local emergency services immediately.
            </p>
          </div>

          <Routes>
            <Route path="/" element={<SymptomInput onComplete={addAssessment} profile={userProfile} />} />
            <Route path="/results/:id" element={<Results assessments={assessments} />} />
            <Route path="/history" element={<History assessments={assessments} />} />
            <Route path="/guide" element={<HowToUse />} />
            <Route path="/settings" element={<Settings profile={userProfile} onUpdate={setUserProfile} />} />
          </Routes>
        </main>

        {/* Mobile Navigation Bar */}
        <div className="sm:hidden sticky bottom-0 z-50 bg-white border-t border-slate-200 px-4 py-2">
          <div className="flex justify-around items-center h-14">
            <MobileNavLink to="/" icon={<ClipboardPlus size={20} />} label="Analyze" />
            <MobileNavLink to="/history" icon={<HistoryIcon size={20} />} label="History" />
            <MobileNavLink to="/guide" icon={<BookOpen size={20} />} label="Guide" />
            <MobileNavLink to="/settings" icon={<SettingsIcon size={20} />} label="Account" />
          </div>
        </div>

        <footer className="hidden sm:block py-8 border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-6 text-center text-slate-400 text-sm">
            <p>© 2024 HealPath Health Technologies. For demonstration only.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive ? 'text-teal-700 bg-teal-50' : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

const MobileNavLink: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex flex-col items-center justify-center gap-1 w-full transition-colors ${
        isActive ? 'text-teal-600' : 'text-slate-400'
      }`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </Link>
  );
};

export default App;
