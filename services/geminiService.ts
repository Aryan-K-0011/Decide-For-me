import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Lazy initialization of the client.
// This prevents the application from crashing immediately on load if the API key is missing.
let aiInstance: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!aiInstance) {
        // Guideline: Use process.env.API_KEY directly.
        // If it's missing, we let it throw or handle it gracefully here, 
        // rather than at the top level of the module.
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
             throw new Error("API Key is missing. Please check your environment variables.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

export const generateDecisionResponse = async (
  currentMessage: string,
  history: ChatMessage[],
  imageBase64?: string
): Promise<string> => {
  try {
    const ai = getAiClient();

    // Select model based on task
    // gemini-3-flash-preview supports both text and image input.
    const modelName = 'gemini-3-flash-preview';

    // Construct the prompt context from history (simplified for single-turn formatted request or short history)
    const systemPrompt = `You are DecideForMe, a trendy, Gen Z-friendly AI decision assistant. 
    Tone: Fun, concise, premium, helpful, and objective. 
    Goal: Help the user make a decision about outfits, food, travel, or shopping.
    Format: Use emojis. Be direct. If comparing, give pros/cons.`;

    // Add history context (limited to last 5 turns to save context window and complexity)
    const recentHistory = history.slice(-5);
    let contextStr = recentHistory.map(m => `${m.role === 'user' ? 'User' : 'AI'}: ${m.text}`).join('\n');

    const finalPrompt = `${systemPrompt}\n\nContext:\n${contextStr}\n\nUser Question: ${currentMessage}`;

    if (imageBase64) {
        let mimeType = 'image/jpeg';
        let cleanBase64 = imageBase64;

        if (imageBase64.includes('base64,')) {
            const parts = imageBase64.split(';base64,');
            if (parts.length === 2) {
                 mimeType = parts[0].replace('data:', '');
                 cleanBase64 = parts[1];
            }
        }

        // Multimodal request
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType: mimeType, 
                            data: cleanBase64
                        }
                    },
                    { text: finalPrompt }
                ]
            }
        });
        return response.text || "I couldn't generate a response based on that image.";
    } else {
        // Text-only request
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: modelName,
            contents: finalPrompt,
        });
        return response.text || "I'm having trouble thinking right now.";
    }

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    // Return a friendly error message to the chat instead of crashing
    if (error.message.includes("API Key is missing")) {
        return "System Error: API Key configuration is missing.";
    }
    return "Oops! My brain froze. Please try again later.";
  }
};

export const generateComparisonData = async (topicA: string, topicB: string): Promise<any> => {
    try {
        const ai = getAiClient();

        const prompt = `Compare "${topicA}" and "${topicB}" for a user deciding between them. 
        Return ONLY a JSON object with this structure:
        {
            "analysis": "Short text summary of the comparison.",
            "data": [
                {"subject": "Price", "A": 1-100 score, "B": 1-100 score},
                {"subject": "Quality", "A": 1-100 score, "B": 1-100 score},
                {"subject": "Trendiness", "A": 1-100 score, "B": 1-100 score},
                {"subject": "Utility", "A": 1-100 score, "B": 1-100 score},
                {"subject": "Vibe", "A": 1-100 score, "B": 1-100 score}
            ]
        }
        Do not add markdown formatting like \`\`\`json. Just the raw JSON string.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: { responseMimeType: 'application/json' }
        });
        
        if (response.text) {
             return JSON.parse(response.text);
        }
        throw new Error("No data returned");
    } catch (e) {
        console.error("Comparison Gen Error", e);
        return null;
    }
}