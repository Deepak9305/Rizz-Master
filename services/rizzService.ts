
import { GoogleGenAI, Type } from "@google/genai";
import { RizzResponse, BioResponse } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `Act as a world-class social coach and "Rizz" expert. 
Your goal is to help users generate witty, charming, and high-engagement replies for dating apps (Tinder, Hinge, Bumble).

Tone & Style Guidelines:
- Be Human: Never sound like an AI. Use lowercase occasionally, modern slang (sparingly), and avoid "perfect" grammar.
- Be Witty: Prioritize humor, playful teasing (push-pull), and curiosity.
- Be Concise: Keep replies under 15 words. Short and punchy is better.
- Avoid Cringe: No cheesy pickup lines or overused compliments.

Love Meter Guidelines:
- loveScore: 0-100 based on the romantic tension and engagement in the conversation.
- potentialStatus: A short, witty 2-3 word label for the current vibe (e.g., "Ice Cold", "Spark Detected", "Nuclear Chemistry").

If the user asks for anything other than dating/social advice, politely decline and say: "I'm just the wingman, I don't do the heavy lifting. Give me a chat to look at!"`;

export const generateRizz = async (inputText: string, imageData?: string): Promise<RizzResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const contentParts: any[] = [{ text: `Analyze this chat. Provide 3 replies AND a romantic potential analysis. Input: ${inputText}` }];
  
  if (imageData) {
    contentParts.push({
      inlineData: {
        mimeType: 'image/jpeg',
        data: imageData.split(',')[1]
      }
    });
  }

  const result = await ai.models.generateContent({
    model,
    contents: { parts: contentParts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          tease: { type: Type.STRING, description: "A playful and slightly challenging reply." },
          smooth: { type: Type.STRING, description: "A charming and direct reply." },
          chaotic: { type: Type.STRING, description: "A funny, weird, or unexpected reply." },
          analysis: { type: Type.STRING, description: "Short analysis of the vibe." },
          loveScore: { type: Type.INTEGER, description: "0-100 score of romantic potential." },
          potentialStatus: { type: Type.STRING, description: "Witty status label for the connection." }
        },
        required: ["tease", "smooth", "chaotic", "loveScore", "potentialStatus"]
      }
    }
  });

  return JSON.parse(result.text || '{}') as RizzResponse;
};

export const generateBio = async (prompt: string): Promise<BioResponse> => {
  const model = 'gemini-3-flash-preview';
  
  const result = await ai.models.generateContent({
    model,
    contents: `Write a dating app bio based on this info: ${prompt}. Focus on "Show, Don't Tell".`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          bio: { type: Type.STRING, description: "The crafted bio." },
          analysis: { type: Type.STRING, description: "Why this bio works." }
        },
        required: ["bio", "analysis"]
      }
    }
  });

  return JSON.parse(result.text || '{}') as BioResponse;
};
