
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  ChevronRight, 
  Calendar, 
  Activity,
  Trash2
} from 'lucide-react';
import { AssessmentResult } from '../types';

interface Props {
  assessments: AssessmentResult[];
}

const History: React.FC<Props> = ({ assessments }) => {
  if (assessments.length === 0) {
    return (
      <div className="text-center py-20 space-y-4 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
          <HistoryIcon size={40} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">No Assessment History</h2>
          <p className="text-slate-500">Your past health analyses will appear here.</p>
        </div>
        <Link to="/" className="inline-block px-6 py-2 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
          Start First Analysis
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Assessment History</h1>
        <span className="text-sm font-medium text-slate-400">{assessments.length} total assessments</span>
      </div>

      <div className="space-y-3">
        {assessments.map((assessment) => (
          <Link 
            key={assessment.id} 
            to={`/results/${assessment.id}`}
            className="block group"
          >
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group-hover:border-teal-300 group-hover:shadow-md transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                assessment.urgencyLevel === 'emergency' ? 'bg-red-50 text-red-500' :
                assessment.urgencyLevel === 'urgent' ? 'bg-amber-50 text-amber-500' :
                'bg-teal-50 text-teal-500'
              }`}>
                <Activity size={24} />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 truncate">
                    {assessment.symptoms.map(s => s.name).join(', ')}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(assessment.date).toLocaleDateString()}
                  </span>
                  <span className="capitalize px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 font-medium">
                    {assessment.urgencyLevel}
                  </span>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-teal-500 transition-colors" size={20} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
