
import { GoogleGenAI } from "@google/genai";

export async function getMessageSuggestion(language: 'en' | 'bn'): Promise<string> {
  // Correctly initializing GoogleGenAI according to the SDK guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = 'gemini-3-flash-preview';

  const prompt = language === 'bn' 
    ? "একটি মজার বা রহস্যময় বেনামী মেসেজ লিখে দাও (এক লাইনে), যা কাউকে পাঠানো যায়। শুধু মেসেজটি দিবে, আর কিছু না।"
    : "Write a short, funny, or mysterious anonymous message (one liner) that someone could send to a friend. Return only the message text.";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.9,
      }
    });

    // Directly accessing the .text property from GenerateContentResponse
    return response.text?.trim() || (language === 'bn' ? "কেমন আছেন?" : "How are you doing?");
  } catch (error) {
    console.error("Gemini Error:", error);
    return language === 'bn' ? "শুভকামনা রইল আপনার জন্য!" : "Wishing you the best!";
  }
}
