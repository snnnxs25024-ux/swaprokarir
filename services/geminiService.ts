import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult } from "../types";

// Helper to clean markdown json fences robustly
const cleanJsonText = (text: string): string => {
  // 1. Try to find content between ```json and ```
  const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonBlockMatch) return jsonBlockMatch[1];

  // 2. Try to find content between first { and last }
  const objectMatch = text.match(/\{[\s\S]*\}/);
  if (objectMatch) return objectMatch[0];

  // 3. Fallback: return text as is (likely will fail parse if dirty)
  return text;
};

export const analyzeResumeWithGemini = async (resumeText: string, jobDescription: string): Promise<AIAnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Bertindaklah sebagai HR Manager senior. Analisis resume kandidat berikut terhadap deskripsi pekerjaan yang diberikan.
    
    RESUME KANDIDAT:
    ${resumeText}
    
    DESKRIPSI PEKERJAAN:
    ${jobDescription}
    
    Berikan output HANYA dalam format JSON murni yang valid sesuai skema. 
    JANGAN tambahkan teks pembuka atau penutup di luar JSON.
    
    Struktur JSON harus:
    {
      "score": number (0-100),
      "summary": "string",
      "strengths": ["string", "string"],
      "weaknesses": ["string", "string"],
      "improvementTips": ["string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            strengths: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            weaknesses: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            improvementTips: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["score", "summary", "strengths", "weaknesses", "improvementTips"]
        }
      }
    });

    if (response.text) {
      try {
        const cleanedText = cleanJsonText(response.text);
        return JSON.parse(cleanedText) as AIAnalysisResult;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, "Raw Text:", response.text);
        throw new Error("Gagal memproses format data dari AI. Silakan coba lagi.");
      }
    }
    throw new Error("Tidak ada respon teks dari model.");

  } catch (error) {
    console.error("Error analyzing resume:", error);
    // Return mock/fallback data on error to prevent crash
    return {
      score: 0,
      summary: "Maaf, terjadi kesalahan saat menganalisis. Pastikan input Anda tidak terlalu panjang atau coba lagi nanti.",
      strengths: [],
      weaknesses: [],
      improvementTips: ["Coba perpendek teks resume atau deskripsi pekerjaan."]
    };
  }
};

export const getCareerAdvice = async (userMessage: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Kamu adalah konsultan karir profesional bernama 'Aira' di SWAPRO KARIR. Jawablah pertanyaan pengguna berikut dengan ramah, profesional, singkat, padat, dan memotivasi dalam Bahasa Indonesia. Gunakan format Markdown untuk formatting (bold, list) jika perlu agar mudah dibaca. Pertanyaan: ${userMessage}`,
    });
    return response.text || "Maaf, saya sedang berpikir keras namun tidak menemukan jawaban.";
  } catch (error) {
    console.error("Error getting chat response:", error);
    return "Maaf, terjadi kesalahan pada sistem AI kami. Silakan coba lagi nanti.";
  }
};

// --- NEW FUNCTION FOR VOICE VALIDATION ---
export interface VoiceValidationResult {
  isValid: boolean;
  feedback: string; // Pesan dari Swapers ke User
}

export const validateVoiceAnswer = async (transcript: string, question: string): Promise<VoiceValidationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Anda adalah 'Swapers', AI Interviewer. 
    Tugas Anda: Mengecek kualitas jawaban suara (transcript) dari kandidat untuk pertanyaan: "${question}".

    TRANSKRIP JAWABAN KANDIDAT:
    "${transcript}"

    ATURAN VALIDASI:
    1. Jika jawaban sangat pendek (kurang dari 3 kata), tidak relevan, bergumam, atau terdengar seperti gangguan suara (noise), maka isValid = false.
    2. Jika jawaban masuk akal (walaupun tata bahasa berantakan/logat daerah), isValid = true.
    3. Berikan 'feedback' singkat (1 kalimat) yang akan dibacakan kembali ke kandidat.
       - Jika False: Minta kandidat mengulangi dengan sopan (Contoh: "Maaf suara kurang jelas, bisa ulangi?").
       - Jika True: Berikan respons natural singkat (Contoh: "Baik, jawaban diterima.", "Menarik.", "Oke, saya catat.").

    Return JSON: { "isValid": boolean, "feedback": "string" }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING }
          },
          required: ["isValid", "feedback"]
        }
      }
    });

    if (response.text) {
       const cleaned = cleanJsonText(response.text);
       return JSON.parse(cleaned) as VoiceValidationResult;
    }
    return { isValid: false, feedback: "Maaf, sistem mengalami gangguan. Silakan ulangi." };
  } catch (error) {
    console.error("Voice validation error:", error);
    // Fallback to true to not block user flow on error
    return { isValid: true, feedback: "Baik, mari lanjut." };
  }
};