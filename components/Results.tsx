
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Stethoscope, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  Download,
  Printer,
  Calendar
} from 'lucide-react';
import { AssessmentResult } from '../types';

interface Props {
  assessments: AssessmentResult[];
}

const Results: React.FC<Props> = ({ assessments }) => {
  const { id } = useParams();
  const assessment = assessments.find(a => a.id === id);

  if (!assessment) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500 mb-4">Assessment not found.</p>
        <Link to="/" className="text-teal-600 font-semibold hover:underline">Start New Analysis</Link>
      </div>
    );
  }

  const urgencyColors = {
    normal: 'bg-green-100 text-green-800 border-green-200',
    urgent: 'bg-amber-100 text-amber-800 border-amber-200',
    emergency: 'bg-red-100 text-red-800 border-red-200'
  };

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600'
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Link to="/history" className="flex items-center text-slate-500 hover:text-teal-600 transition-colors">
          <ChevronLeft size={20} />
          <span>Back to History</span>
        </Link>
        <div className="flex gap-2">
          <button onClick={handlePrint} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Print for Provider">
            <Printer size={20} />
          </button>
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Download Report">
            <Download size={20} />
          </button>
        </div>
      </div>

      <header className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-slate-900">Analysis Result</h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Calendar size={14} />
              <span>{new Date(assessment.date).toLocaleString()}</span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${urgencyColors[assessment.urgencyLevel]}`}>
            {assessment.urgencyLevel} Priority
          </span>
        </div>

        <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl">
          <p className="text-teal-800 text-sm leading-relaxed italic">
            &quot;{assessment.generalAdvice}&quot;
          </p>
        </div>
      </header>

      {/* Main Analysis Sections */}
      <div className="grid gap-6">
        {/* Considerations */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Stethoscope className="text-teal-600" size={24} />
            Potential Considerations
          </h2>
          <p className="text-slate-500 text-sm">Based on your symptoms, these are common causes that could be relevant. Discuss these with your healthcare provider.</p>
          <div className="space-y-4">
            {assessment.potentialConditions.map((condition, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">{condition.name}</h3>
                  <span className="text-xs font-medium text-slate-400 bg-white px-2 py-0.5 rounded-md shadow-sm">{condition.likelihood} Likelihood</span>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{condition.explanation}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Care Guidance */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ShieldCheck className="text-teal-600" size={24} />
            Recommended Care Steps
          </h2>
          <div className="space-y-4">
            {assessment.careGuidance.map((step, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 rounded-2xl hover:bg-teal-50/30 transition-colors">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${step.priority === 'high' ? 'bg-orange-500' : 'bg-blue-400'}`} />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">{step.title}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* When to Seek Help */}
        <section className="bg-orange-50 p-6 rounded-3xl border border-orange-100 space-y-4">
          <h2 className="text-xl font-bold text-orange-800 flex items-center gap-2">
            <AlertTriangle className="text-orange-600" size={24} />
            Red Flags & Professional Care
          </h2>
          <ul className="space-y-3 list-disc list-inside text-sm text-orange-700 font-medium">
            <li>Shortness of breath or difficulty breathing</li>
            <li>Sudden, severe chest pain</li>
            <li>Inability to speak or confusion</li>
            <li>Sudden weakness or numbness, especially on one side</li>
          </ul>
          <p className="text-xs text-orange-600/80">If you experience any of these, call emergency services immediately.</p>
        </section>
      </div>

      <div className="pt-8 text-center">
        <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20">
          Start New Analysis
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default Results;
