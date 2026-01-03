
import React from 'react';
import { 
  BookOpen, 
  Target, 
  MessageSquareText, 
  AlertCircle, 
  ShieldCheck, 
  UserCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HowToUse: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">How to use HealPath</h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto">
          Learn how to provide the best information to receive accurate, personalized health guidance.
        </p>
      </header>

      {/* Guide Steps */}
      <div className="grid gap-6">
        <GuideStep 
          icon={<UserCheck className="text-blue-500" />}
          title="1. Complete Your Profile"
          description="Medical context is vital. Before starting an assessment, ensure your age, gender, and history are accurate in the Settings tab. This helps the AI filter out irrelevant conditions."
        />
        <GuideStep 
          icon={<MessageSquareText className="text-teal-500" />}
          title="2. Be Specific with Symptoms"
          description="Instead of just 'pain,' describe its nature (e.g., sharp, dull, throbbing) and exactly where it is located. Mention what makes it better or worse."
        />
        <GuideStep 
          icon={<Target className="text-purple-500" />}
          title="3. Tracking Duration"
          description="Always specify how long you've had the symptom (e.g., 'since this morning' or 'for 3 weeks'). Timing is a key indicator for many health patterns."
        />
        <GuideStep 
          icon={<ShieldCheck className="text-green-500" />}
          title="4. Review & Share"
          description="Use the summary view to print a report for your doctor. HealPath is designed to facilitate conversations with healthcare professionals, not replace them."
        />
      </div>

      {/* Important Disclaimer Section */}
      <section className="bg-amber-50 border border-amber-100 rounded-3xl p-8 space-y-4">
        <div className="flex items-center gap-3 text-amber-700">
          <AlertCircle size={24} />
          <h2 className="text-xl font-bold">Medical Disclaimer</h2>
        </div>
        <div className="space-y-4 text-amber-800/80 leading-relaxed text-sm">
          <p>
            <strong>HealPath is not a diagnostic service.</strong> The results provided are for informational and educational purposes only. They are based on AI pattern matching and do not constitute professional medical advice, diagnosis, or treatment.
          </p>
          <p>
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this application.
          </p>
          <p className="font-bold text-amber-900">
            If you are experiencing a life-threatening emergency, call 911 (or your local emergency number) or go to the nearest emergency room immediately.
          </p>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20"
        >
          Start Assessment
          <ArrowRight size={18} />
        </Link>
        <Link 
          to="/settings" 
          className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
        >
          Update Profile
        </Link>
      </div>
    </div>
  );
};

const GuideStep: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-5 items-start transition-shadow hover:shadow-md">
    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  </div>
);

export default HowToUse;
