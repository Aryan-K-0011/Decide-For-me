import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage } from "../types";

// Initialize the client. API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDecisionResponse = async (
  currentMessage: string,
  history: ChatMessage[],
  imageBase64?: string
): Promise<string> => {
  try {
    // Select model based on presence of image
    // gemini-3-flash-preview supports both text and image input.
    const modelName = 'gemini-3-flash-preview';

    // Construct the prompt context from history (simplified for single-turn formatted request or short history)
    // We will build a system instruction via the prompt itself or config if supported.
    const systemPrompt = `You are DecideForMe, a trendy, Gen Z-friendly AI decision assistant. 
    Tone: Fun, concise, premium, helpful, and objective. 
    Goal: Help the user make a decision about outfits, food, travel, or shopping.
    Format: Use emojis. Be direct. If comparing, give pros/cons.`;

    const contents = [];
    
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

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oops! My brain froze. Please try again later.";
  }
};

export const generateComparisonData = async (topicA: string, topicB: string): Promise<any> => {
    try {
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