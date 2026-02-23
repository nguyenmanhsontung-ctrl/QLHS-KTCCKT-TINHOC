import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateQuestions(subject: string, content: string, count: number = 5) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Tạo ${count} câu hỏi trắc nghiệm về chủ đề "${subject}" dựa trên nội dung sau: ${content}. 
    Mỗi câu hỏi phải có 4 lựa chọn (A, B, C, D) và chỉ có 1 đáp án đúng. 
    Trả về định dạng JSON mảng các đối tượng.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            optionA: { type: Type.STRING },
            optionB: { type: Type.STRING },
            optionC: { type: Type.STRING },
            optionD: { type: Type.STRING },
            correctAnswer: { type: Type.STRING, description: "Chỉ 'A', 'B', 'C', hoặc 'D'" },
            explanation: { type: Type.STRING }
          },
          required: ["question", "optionA", "optionB", "optionC", "optionD", "correctAnswer"]
        }
      }
    }
  });

  return JSON.parse(response.text || "[]");
}
