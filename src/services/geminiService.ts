import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_CONFIG } from '../config/gemini';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: GEMINI_CONFIG.modelName,
      generationConfig: GEMINI_CONFIG.generationConfig
    });
  }

  private extractTextSafely(result: any): string {
    try {
      const text = result?.response?.text?.() ?? '';
      if (text && typeof text === 'string' && text.trim().length > 0) return text;
    } catch {}

    try {
      const candidates = result?.response?.candidates || result?.candidates;
      const firstText = candidates?.[0]?.content?.parts?.[0]?.text;
      if (firstText && typeof firstText === 'string' && firstText.trim().length > 0) return firstText;
    } catch {}

    return '';
  }

  async generateContent(prompt: string): Promise<string> {
    try {
      console.log(`🤖 Génération de contenu avec ${GEMINI_CONFIG.modelName}...`);
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête a pris trop de temps')), 30000); // 30 secondes
      });
      
      const generatePromise = this.model.generateContent(prompt);
      const result = await Promise.race([generatePromise, timeoutPromise]);
      const text = this.extractTextSafely(result);
      
      console.log('✅ Réponse générée avec succès');
      return text && text.trim().length > 0
        ? text
        : 'Je suis désolé, je ne peux pas répondre à votre question pour le moment.';
    } catch (error) {
      console.error('❌ Erreur lors de la génération de contenu:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard.";
    }
  }

  async chatWithAI(messages: GeminiMessage[]): Promise<string> {
    try {
      console.log(`💬 Chat avec ${GEMINI_CONFIG.modelName}...`);
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête de chat a pris trop de temps')), 30000); // 30 secondes
      });
      
      // Convertir les messages au format attendu par la nouvelle API
      const chat = this.model.startChat({
        history: messages.slice(0, -1).map(msg => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: msg.parts
        }))
      });
      
      const lastMessage = messages[messages.length - 1];
      const chatPromise = chat.sendMessage(lastMessage.parts[0].text);
      const result = await Promise.race([chatPromise, timeoutPromise]);
      const text = this.extractTextSafely(result);
      
      console.log('✅ Réponse de chat générée avec succès');
      return text && text.trim().length > 0
        ? text
        : 'Je suis désolé, je ne peux pas répondre à votre question pour le moment.';
    } catch (error) {
      console.error('❌ Erreur lors du chat avec l\'IA:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas répondre à votre question pour le moment. Veuillez réessayer plus tard.";
    }
  }

  async generateContentWithImage(prompt: string, imageData: string): Promise<string> {
    try {
      console.log('🖼️ Génération de contenu avec image...');
      
      // Ajouter un timeout pour éviter les attentes trop longues
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout: La requête avec image a pris trop de temps')), 30000); // 30 secondes
      });
      
      const imagePromise = this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg'
          }
        }
      ]);
      
      const result = await Promise.race([imagePromise, timeoutPromise]);
      const text = this.extractTextSafely(result);
      
      console.log('✅ Réponse avec image générée avec succès');
      return text && text.trim().length > 0
        ? text
        : 'Je suis désolé, je ne peux pas analyser cette image pour le moment.';
    } catch (error) {
      console.error('❌ Erreur lors de la génération avec image:', error);
      
      // Retourner une réponse de fallback en cas d'erreur
      if (error instanceof Error && error.message.includes('Timeout')) {
        return "Désolé, je rencontre des difficultés techniques avec l'analyse de l'image. Veuillez réessayer dans quelques instants.";
      }
      
      return "Je suis désolé, je ne peux pas analyser cette image pour le moment. Veuillez réessayer plus tard.";
    }
  }
}

export const geminiService = new GeminiService();
