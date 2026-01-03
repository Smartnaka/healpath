
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, Loader2, Sparkles, AlertCircle, ClipboardPlus, Search, HelpCircle, Info, Activity } from 'lucide-react';
import { Symptom, Severity, UserProfile, AssessmentResult } from '../types';
import { analyzeSymptoms } from '../services/gemini';

interface Props {
  onComplete: (assessment: AssessmentResult) => void;
  profile: UserProfile;
}

interface SymptomDatabaseEntry {
  name: string;
  description: string;
  typicalSeverity: Severity;
}

const SYMPTOM_DATABASE: SymptomDatabaseEntry[] = [
  { name: "Abdominal pain", description: "Cramps or dull ache in the stomach area", typicalSeverity: Severity.MEDIUM },
  { name: "Anxiety", description: "Feelings of worry, nervousness, or unease", typicalSeverity: Severity.LOW },
  { name: "Back pain", description: "Aching or sharp pain along the spine or lower back", typicalSeverity: Severity.MEDIUM },
  { name: "Bloating", description: "Feeling of fullness or swelling in the abdomen", typicalSeverity: Severity.LOW },
  { name: "Blurred vision", description: "Loss of sharpness of eyesight", typicalSeverity: Severity.MEDIUM },
  { name: "Chest pain", description: "Pressure, tightness, or sharp pain in the chest", typicalSeverity: Severity.HIGH },
  { name: "Chills", description: "Feeling cold with shivering, often with fever", typicalSeverity: Severity.MEDIUM },
  { name: "Congestion", description: "Stuffy nose or restricted airflow", typicalSeverity: Severity.LOW },
  { name: "Constipation", description: "Difficulty passing stools", typicalSeverity: Severity.LOW },
  { name: "Cough", description: "Dry or productive expulsion of air from lungs", typicalSeverity: Severity.LOW },
  { name: "Depression", description: "Persistent low mood or loss of interest", typicalSeverity: Severity.MEDIUM },
  { name: "Diarrhea", description: "Loose, watery stools", typicalSeverity: Severity.LOW },
  { name: "Dizziness", description: "Feeling lightheaded or unsteady", typicalSeverity: Severity.MEDIUM },
  { name: "Dry mouth", description: "Lack of saliva production", typicalSeverity: Severity.LOW },
  { name: "Earache", description: "Sharp or dull pain in the ear", typicalSeverity: Severity.MEDIUM },
  { name: "Fatigue", description: "Extreme tiredness or lack of energy", typicalSeverity: Severity.MEDIUM },
  { name: "Fever", description: "Elevated body temperature", typicalSeverity: Severity.MEDIUM },
  { name: "Headache", description: "Pain in the head or upper neck", typicalSeverity: Severity.MEDIUM },
  { name: "Heart palpitations", description: "Sensation of racing or fluttering heart", typicalSeverity: Severity.HIGH },
  { name: "Insomnia", description: "Difficulty falling or staying asleep", typicalSeverity: Severity.LOW },
  { name: "Itchy eyes", description: "Irritation or redness in the eyes", typicalSeverity: Severity.LOW },
  { name: "Joint pain", description: "Soreness or stiffness in joints", typicalSeverity: Severity.MEDIUM },
  { name: "Loss of appetite", description: "Decreased desire to eat", typicalSeverity: Severity.LOW },
  { name: "Muscle ache", description: "Soreness in various muscle groups", typicalSeverity: Severity.LOW },
  { name: "Nausea", description: "Feeling like you might vomit", typicalSeverity: Severity.MEDIUM },
  { name: "Night sweats", description: "Excessive sweating during sleep", typicalSeverity: Severity.MEDIUM },
  { name: "Numbness", description: "Loss of sensation in a part of the body", typicalSeverity: Severity.HIGH },
  { name: "Rash", description: "Area of irritated or swollen skin", typicalSeverity: Severity.LOW },
  { name: "Runny nose", description: "Excess mucus production in nasal passages", typicalSeverity: Severity.LOW },
  { name: "Shortness of breath", description: "Difficulty breathing or air hunger", typicalSeverity: Severity.HIGH },
  { name: "Sneezing", description: "Sudden involuntary expulsion of air", typicalSeverity: Severity.LOW },
  { name: "Sore throat", description: "Pain or irritation in the throat", typicalSeverity: Severity.LOW },
  { name: "Tingling", description: "Prickling sensation (pins and needles)", typicalSeverity: Severity.MEDIUM },
  { name: "Weakness", description: "Lack of physical strength", typicalSeverity: Severity.MEDIUM },
  { name: "Wheezing", description: "Whistling sound when breathing", typicalSeverity: Severity.HIGH }
];

const SymptomInput: React.FC<Props> = ({ onComplete, profile }) => {
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New Symptom State
  const [newSymptomName, setNewSymptomName] = useState('');
  const [newSymptomSeverity, setNewSymptomSeverity] = useState<Severity>(Severity.MEDIUM);
  const [newSymptomDuration, setNewSymptomDuration] = useState('');
  const [newSymptomDesc, setNewSymptomDesc] = useState('');

  // Auto-complete state
  const [suggestions, setSuggestions] = useState<SymptomDatabaseEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSymptomNameChange = (val: string) => {
    setNewSymptomName(val);
    const searchVal = val.trim().toLowerCase();
    
    if (searchVal.length >= 2) {
      // Simple robust matching: 
      // 1. Starts with query
      // 2. Contains query
      // 3. Simple character-based fuzzy (optional, let's stick to scored containment)
      const matches = SYMPTOM_DATABASE.map(entry => {
        const name = entry.name.toLowerCase();
        let score = 0;
        if (name === searchVal) score = 100;
        else if (name.startsWith(searchVal)) score = 50;
        else if (name.includes(searchVal)) score = 25;
        
        return { entry, score };
      })
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(m => m.entry);

      setSuggestions(matches);
      setShowSuggestions(matches.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (entry: SymptomDatabaseEntry) => {
    setNewSymptomName(entry.name);
    setNewSymptomSeverity(entry.typicalSeverity);
    setShowSuggestions(false);
  };

  const handleAddSymptom = () => {
    if (!newSymptomName.trim()) return;
    
    const symptom: Symptom = {
      id: crypto.randomUUID(),
      name: newSymptomName,
      severity: newSymptomSeverity,
      duration: newSymptomDuration,
      description: newSymptomDesc
    };

    setSymptoms([...symptoms, symptom]);
    setNewSymptomName('');
    setNewSymptomDuration('');
    setNewSymptomDesc('');
    setShowSuggestions(false);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(symptoms.filter(s => s.id !== id));
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) {
      setError("Please add at least one symptom to analyze.");
      return;
    }
    
    setError(null);
    setIsAnalyzing(true);
    try {
      const result = await analyzeSymptoms(symptoms, profile);
      onComplete(result);
      navigate(`/results/${result.id}`);
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your connection and try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">How are you feeling today?</h1>
        <div className="flex items-center justify-center gap-4">
          <p className="text-slate-500">Describe your symptoms to receive personalized health guidance.</p>
          <Link to="/guide" className="flex items-center gap-1 text-teal-600 text-sm font-semibold hover:text-teal-700 transition-colors">
            <HelpCircle size={16} />
            Need help?
          </Link>
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        {/* Symptom Builder */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="text-teal-600" size={20} />
              Add a Symptom
            </h2>
            
            <div className="space-y-4">
              <div className="relative" ref={suggestionRef}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  What is the symptom?
                  <div className="group relative cursor-help">
                    <Info size={14} className="text-slate-300" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      Be specific (e.g., "Left shoulder pain" instead of just "Pain").
                    </div>
                  </div>
                </label>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="e.g. Headache, Cough, Fatigue"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all"
                    value={newSymptomName}
                    onChange={(e) => handleSymptomNameChange(e.target.value)}
                    onFocus={() => handleSymptomNameChange(newSymptomName)}
                  />
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                </div>

                {/* Advanced Auto-complete dropdown */}
                {showSuggestions && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 ring-1 ring-slate-200">
                    <div className="py-1">
                      {suggestions.map((entry, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors flex items-start gap-3 group border-b last:border-0 border-slate-50"
                          onClick={() => selectSuggestion(entry)}
                        >
                          <div className={`mt-1 p-1.5 rounded-lg shrink-0 ${
                            entry.typicalSeverity === Severity.HIGH ? 'bg-red-50 text-red-500' :
                            entry.typicalSeverity === Severity.MEDIUM ? 'bg-amber-50 text-amber-500' :
                            'bg-teal-50 text-teal-500'
                          }`}>
                            <Activity size={14} />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <span className="font-semibold text-slate-900 text-sm group-hover:text-teal-700">{entry.name}</span>
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                                entry.typicalSeverity === Severity.HIGH ? 'bg-red-100 text-red-700' :
                                entry.typicalSeverity === Severity.MEDIUM ? 'bg-amber-100 text-amber-700' :
                                'bg-teal-100 text-teal-700'
                              }`}>
                                {entry.typicalSeverity}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 truncate">{entry.description}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                  <select 
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    value={newSymptomSeverity}
                    onChange={(e) => setNewSymptomSeverity(e.target.value as Severity)}
                  >
                    <option value={Severity.LOW}>Mild</option>
                    <option value={Severity.MEDIUM}>Moderate</option>
                    <option value={Severity.HIGH}>Severe</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                    Duration
                    <div className="group relative cursor-help">
                      <Info size={14} className="text-slate-300" />
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                        Knowing if a symptom is new or chronic helps determine urgency.
                      </div>
                    </div>
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. 2 days"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none"
                    value={newSymptomDuration}
                    onChange={(e) => setNewSymptomDuration(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400">Example: "since 3pm", "3 weeks"</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1">
                  Any other details? (Optional)
                  <div className="group relative cursor-help">
                    <Info size={14} className="text-slate-300" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-slate-800 text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                      Mention triggers, quality of sensation (stabbing, dull), or if it radiates to other areas.
                    </div>
                  </div>
                </label>
                <textarea 
                  rows={3}
                  placeholder="Describe triggers, specific locations, or what makes it better/worse..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 outline-none resize-none"
                  value={newSymptomDesc}
                  onChange={(e) => setNewSymptomDesc(e.target.value)}
                />
                <p className="text-[10px] text-slate-400">Describe the quality (e.g. sharp, throbbing) and any triggers.</p>
              </div>

              <button 
                onClick={handleAddSymptom}
                disabled={!newSymptomName.trim()}
                className="w-full py-2 bg-teal-50 text-teal-700 font-semibold rounded-xl hover:bg-teal-100 transition-colors disabled:opacity-50"
              >
                Add to List
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 border border-red-100">
              <AlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Current List */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-100/50 p-6 rounded-2xl border border-slate-200 min-h-[300px] flex flex-col">
            <h2 className="text-lg font-semibold text-slate-700 mb-4">Symptom List ({symptoms.length})</h2>
            
            {symptoms.length === 0 ? (
              <div className="flex-grow flex flex-col items-center justify-center text-slate-400 space-y-2">
                <ClipboardPlus size={48} strokeWidth={1} />
                <p className="text-sm">No symptoms added yet</p>
              </div>
            ) : (
              <div className="flex-grow space-y-3">
                {symptoms.map((s) => (
                  <div key={s.id} className="bg-white p-3 rounded-xl border border-slate-200 flex justify-between items-start group">
                    <div>
                      <p className="font-semibold text-slate-900">{s.name}</p>
                      <p className="text-xs text-slate-500 capitalize">{s.severity} severity · {s.duration}</p>
                    </div>
                    <button 
                      onClick={() => removeSymptom(s.id)}
                      className="p-1 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzing || symptoms.length === 0}
              className={`mt-6 w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-white shadow-xl shadow-teal-600/20 transition-all ${
                isAnalyzing ? 'bg-teal-700' : 'bg-teal-600 hover:bg-teal-700 active:scale-[0.98]'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Analyzing Pattern...
                </>
              ) : (
                <>
                  <Sparkles size={24} />
                  Run Analysis
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SymptomInput;
