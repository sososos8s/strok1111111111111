export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum WorkType {
  Private = 'Private',
  SelfEmployed = 'Self-employed',
  GovtJob = 'Govt_job',
  Children = 'children',
  NeverWorked = 'Never_worked',
}

export enum ResidenceType {
  Urban = 'Urban',
  Rural = 'Rural',
}

export enum SmokingStatus {
  NeverSmoked = 'never smoked',
  FormerlySmoked = 'formerly smoked',
  Smokes = 'smokes',
  Unknown = 'Unknown',
}

export interface PatientData {
  gender: Gender;
  age: number | '';
  hypertension: boolean;
  heartDisease: boolean;
  everMarried: boolean;
  workType: WorkType;
  residenceType: ResidenceType;
  avgGlucoseLevel: number | '';
  bmi: number | '';
  smokingStatus: SmokingStatus;
}

export interface PredictionResult {
  strokePrediction: boolean;
  probability: number;
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
}
