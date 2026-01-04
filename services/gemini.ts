
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function generateGlassyImage(prompt: string) {
  const ai = getAI();
  const fullPrompt = `A high-resolution, modern glassy wallpaper with the following theme: ${prompt}. Style: Glassmorphism, 4k, vibrant gradients, depth, blurred translucent surfaces, futuristic UI aesthetics, abstract.`;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
}

export async function chatAssistant(message: string) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: message,
    config: {
      systemInstruction: "You are AuraOS AI, a helpful and minimalist assistant for a futuristic glassy operating system. Keep responses concise and sleek."
    }
  });
  return response.text;
}
