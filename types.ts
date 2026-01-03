
export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface Symptom {
  id: string;
  name: string;
  duration: string;
  severity: Severity;
  description: string;
}

export interface Condition {
  name: string;
  likelihood: string;
  explanation: string;
}

export interface CareStep {
  title: string;
  instruction: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AssessmentResult {
  id: string;
  date: string;
  symptoms: Symptom[];
  potentialConditions: Condition[];
  careGuidance: CareStep[];
  urgencyLevel: 'normal' | 'urgent' | 'emergency';
  generalAdvice: string;
}

export interface UserProfile {
  name: string;
  age: string;
  gender: string;
  medicalHistory: string;
}
