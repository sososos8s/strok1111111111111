import React, { useState } from 'react';
import { 
  PatientData, 
  Gender, 
  WorkType, 
  ResidenceType, 
  SmokingStatus, 
  PredictionResult 
} from './types';
import { predictStrokeRisk } from './services/predictionService';
import { 
  Activity, 
  User, 
  Briefcase, 
  HeartPulse, 
  Stethoscope, 
  Cigarette, 
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<PatientData>({
    gender: Gender.Male,
    age: '' as any,
    hypertension: false,
    heartDisease: false,
    everMarried: true,
    workType: WorkType.Private,
    residenceType: ResidenceType.Urban,
    avgGlucoseLevel: '' as any,
    bmi: '' as any,
    smokingStatus: SmokingStatus.NeverSmoked,
  });

  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof PatientData, string>>>({});

  const handleInputChange = (field: keyof PatientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateInputs = (): boolean => {
    const errors: Partial<Record<keyof PatientData, string>> = {};
    let isValid = true;

    // Age Validation: 0 to 120
    if (formData.age === '' || typeof formData.age !== 'number') {
      errors.age = "Age is required.";
      isValid = false;
    } else if (formData.age < 0 || formData.age > 120) {
      errors.age = "Please enter a valid age (0-120).";
      isValid = false;
    }

    // Glucose Validation: 30 to 600 mg/dL (covering extreme hypoglycemia to extreme hyperglycemia)
    if (formData.avgGlucoseLevel === '' || typeof formData.avgGlucoseLevel !== 'number') {
      errors.avgGlucoseLevel = "Glucose level is required.";
      isValid = false;
    } else if (formData.avgGlucoseLevel < 30 || formData.avgGlucoseLevel > 600) {
      errors.avgGlucoseLevel = "Value must be between 30 and 600 mg/dL.";
      isValid = false;
    }

    // BMI Validation: 10 to 100 (covering severe underweight to severe obesity)
    if (formData.bmi === '' || typeof formData.bmi !== 'number') {
      errors.bmi = "BMI is required.";
      isValid = false;
    } else if (formData.bmi < 10 || formData.bmi > 100) {
      errors.bmi = "Value must be between 10 and 100.";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!validateInputs()) {
      setError("Please correct the errors in the highlighted fields.");
      return;
    }
    
    setLoading(true);

    try {
      const prediction = await predictStrokeRisk(formData);
      setResult(prediction);
    } catch (err) {
      setError("Failed to generate prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (field: keyof PatientData) => {
    const baseClass = "w-full rounded-lg border p-2.5 text-slate-700 outline-none transition focus:ring-2 focus:ring-teal-500 bg-white";
    return validationErrors[field] 
      ? `${baseClass} border-red-500 focus:border-red-500 focus:ring-red-200`
      : `${baseClass} border-slate-300 focus:border-teal-500`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      
      {/* Header */}
      <header className="mb-8 text-center max-w-2xl">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Activity className="text-teal-600 w-8 h-8" />
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Stroke Prediction System</h1>
        </div>
        <p className="text-slate-500 text-sm md:text-base">
          Enter patient clinical and demographic data to assess stroke risk factors using AI analysis.
        </p>
      </header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A) Demographic Information */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-700 border-b border-slate-100 pb-2">
              <User className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Demographic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select 
                  className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                >
                  {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                <input 
                  type="number" 
                  min="0"
                  max="120"
                  className={getInputClass('age')}
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 45"
                />
                {validationErrors.age && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.age}</p>
                )}
              </div>
            </div>
          </section>

          {/* B) Social & Work Information */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-700 border-b border-slate-100 pb-2">
              <Briefcase className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Social & Work Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Work Type</label>
                <select 
                  className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                  value={formData.workType}
                  onChange={(e) => handleInputChange('workType', e.target.value)}
                >
                  {Object.values(WorkType).map(w => <option key={w} value={w}>{w.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Residence Type</label>
                <select 
                  className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                  value={formData.residenceType}
                  onChange={(e) => handleInputChange('residenceType', e.target.value)}
                >
                  {Object.values(ResidenceType).map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ever Married</label>
                <select 
                  className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                  value={formData.everMarried ? 'Yes' : 'No'}
                  onChange={(e) => handleInputChange('everMarried', e.target.value === 'Yes')}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
            </div>
          </section>

          {/* C) Medical History */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-700 border-b border-slate-100 pb-2">
              <HeartPulse className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Medical History</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer" onClick={() => handleInputChange('hypertension', !formData.hypertension)}>
                <label className="text-sm font-medium text-slate-700 cursor-pointer">Hypertension</label>
                <div className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${formData.hypertension ? 'bg-teal-500' : ''}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${formData.hypertension ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition cursor-pointer" onClick={() => handleInputChange('heartDisease', !formData.heartDisease)}>
                <label className="text-sm font-medium text-slate-700 cursor-pointer">Heart Disease</label>
                <div className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${formData.heartDisease ? 'bg-teal-500' : ''}`}>
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${formData.heartDisease ? 'translate-x-6' : ''}`}></div>
                </div>
              </div>
            </div>
          </section>

          {/* D) Clinical Measurements */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-700 border-b border-slate-100 pb-2">
              <Stethoscope className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Clinical Measurements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Average Glucose Level (mg/dL)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className={getInputClass('avgGlucoseLevel')}
                  value={formData.avgGlucoseLevel}
                  onChange={(e) => handleInputChange('avgGlucoseLevel', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 105.5"
                />
                {validationErrors.avgGlucoseLevel && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.avgGlucoseLevel}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">BMI (Body Mass Index)</label>
                <input 
                  type="number" 
                  step="0.1"
                  className={getInputClass('bmi')}
                  value={formData.bmi}
                  onChange={(e) => handleInputChange('bmi', e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 28.4"
                />
                {validationErrors.bmi && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.bmi}</p>
                )}
              </div>
            </div>
          </section>

          {/* E) Lifestyle Factors */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center gap-2 mb-4 text-teal-700 border-b border-slate-100 pb-2">
              <Cigarette className="w-5 h-5" />
              <h2 className="font-semibold text-lg">Lifestyle Factors</h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Smoking Status</label>
              <select 
                className="w-full rounded-lg border-slate-300 border p-2.5 text-slate-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white"
                value={formData.smokingStatus}
                onChange={(e) => handleInputChange('smokingStatus', e.target.value)}
              >
                {Object.values(SmokingStatus).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </section>

          {/* 4) Action Button */}
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all transform active:scale-95 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : "Predict Stroke Risk"}
          </button>

          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2 mt-4">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Output Section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            
            {/* Placeholder state if no result */}
            {!result && !loading && (
              <div className="bg-white rounded-xl p-8 text-center h-full min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                <Activity className="w-16 h-16 text-slate-300 mb-4" />
                <h3 className="text-slate-500 font-semibold text-lg">No Prediction Yet</h3>
                <p className="text-slate-400 text-sm mt-2">Enter patient details and run the model to see the risk assessment.</p>
              </div>
            )}

            {/* 5) Prediction Output */}
            {result && (
              <div className="bg-white rounded-xl shadow-lg border border-teal-100 overflow-hidden animate-fade-in-up">
                <div className={`p-6 text-white text-center ${result.strokePrediction ? 'bg-red-500' : 'bg-green-500'}`}>
                  <h3 className="text-sm uppercase tracking-wider font-semibold opacity-90 mb-1">Prediction Result</h3>
                  <div className="text-3xl font-bold flex items-center justify-center gap-2">
                    {result.strokePrediction ? (
                      <>
                        <AlertTriangle className="w-8 h-8" />
                        <span>Stroke: YES</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-8 h-8" />
                        <span>Stroke: NO</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* B) Probability */}
                  <div>
                    <div className="flex justify-between text-sm font-medium text-slate-600 mb-2">
                      <span>Stroke Probability</span>
                      <span className="text-slate-900 font-bold">{result.probability}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${result.probability > 50 ? 'bg-red-500' : result.probability > 20 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${result.probability}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* C) Risk Level */}
                  <div className="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
                    <p className="text-sm text-slate-500 uppercase tracking-wide font-medium">Risk Level</p>
                    <p className={`text-2xl font-bold mt-1 ${
                      result.riskLevel === 'High Risk' ? 'text-red-600' : 
                      result.riskLevel === 'Moderate Risk' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {result.riskLevel}
                    </p>
                  </div>

                  {/* D) Disclaimer */}
                  <div className="border-t border-slate-100 pt-4">
                    <p className="text-xs text-slate-400 text-center leading-relaxed">
                      <strong>Disclaimer:</strong> This system is for educational purposes only and does not replace professional medical diagnosis. Please consult a qualified healthcare provider for medical advice.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;