import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, PredictionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const predictStrokeRisk = async (data: PatientData): Promise<PredictionResult> => {
  const modelId = "gemini-2.5-flash";

  const prompt = `
    Analyze the following patient data for stroke risk assessment. 
    Based on general medical knowledge and patterns similar to the stroke prediction dataset, predict the likelihood of a stroke.
    
    Patient Data:
    ${JSON.stringify(data)}
    
    Provide the output strictly in JSON format matching the schema.
    - strokePrediction: true if high risk/likely stroke, false otherwise.
    - probability: A number between 0 and 100 representing the percentage chance.
    - riskLevel: One of "Low Risk", "Moderate Risk", "High Risk".
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strokePrediction: { type: Type.BOOLEAN },
            probability: { type: Type.NUMBER },
            riskLevel: { type: Type.STRING, enum: ["Low Risk", "Moderate Risk", "High Risk"] },
          },
          required: ["strokePrediction", "probability", "riskLevel"],
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as PredictionResult;
    } else {
      throw new Error("No response from AI model");
    }
  } catch (error) {
    console.error("Prediction error:", error);
    // Fallback or re-throw
    throw error;
  }
};
