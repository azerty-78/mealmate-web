// Configuration pour l'API Gemini
export const GEMINI_CONFIG = {
  apiKey: (import.meta as any)?.env?.VITE_GEMINI_API_KEY || 'AIzaSyAGyYDydVRJ5tkAkEoIHLVp6HpES3Of4cw',
  // Modèle cible (2.5)
  modelName: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.5,        // Plus bas pour des réponses plus cohérentes
    maxOutputTokens: 300,    // Réduit pour des réponses courtes
    topP: 0.7,               // Réduit pour plus de précision
    topK: 20                 // Réduit pour des réponses plus ciblées
  }
};

// URL de base (non utilisée avec le SDK, conservée pour compat)
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
