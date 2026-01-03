
import { GoogleGenAI, Type } from "@google/genai";
import { Symptom, UserProfile, AssessmentResult } from "../types";

export const analyzeSymptoms = async (
  symptoms: Symptom[],
  profile: UserProfile
): Promise<AssessmentResult> => {
  // Always use new GoogleGenAI({apiKey: process.env.API_KEY});
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const symptomText = symptoms.map(s => 
    `${s.name} (${s.severity} severity, duration: ${s.duration}): ${s.description}`
  ).join("\n");

  const prompt = `
    As a clinical health assistant, analyze the following user-reported symptoms and provide a structured assessment.
    
    User Context:
    Age: ${profile.age}
    Gender: ${profile.gender}
    Medical History: ${profile.medicalHistory}
    
    Symptoms Reported:
    ${symptomText}
    
    Provide an analysis that includes:
    1. Potential considerations (not a diagnosis).
    2. Recommended care steps.
    3. An overall urgency level.
    4. General advice and disclaimers.
    
    Maintain a calm, clinical, and reassuring tone. Avoid alarming language. Ensure the response clearly states it is not a diagnosis.
  `;

  // Always use ai.models.generateContent to query GenAI with both the model name and prompt.
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          urgencyLevel: { 
            type: Type.STRING, 
            description: 'One of: normal, urgent, emergency' 
          },
          potentialConditions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                likelihood: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["name", "likelihood", "explanation"]
            }
          },
          careGuidance: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                instruction: { type: Type.STRING },
                priority: { type: Type.STRING }
              },
              required: ["title", "instruction", "priority"]
            }
          },
          generalAdvice: { type: Type.STRING }
        },
        required: ["urgencyLevel", "potentialConditions", "careGuidance", "generalAdvice"]
      }
    }
  });

  // Extracting text output directly from response.text property.
  const text = response.text || "{}";
  const rawResult = JSON.parse(text);
  
  return {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    symptoms,
    ...rawResult
  };
};
