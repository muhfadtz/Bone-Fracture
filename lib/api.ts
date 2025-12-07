// lib/api.ts

export interface PredictionResult {
  label: string;
  score: number;
}

export async function classifyImage(file: File): Promise<PredictionResult[]> {
  const API_URL = process.env.NEXT_PUBLIC_HF_API_URL || "https://api-inference.huggingface.co/models/Dawgggggg/vure-bonefracture";
  const API_TOKEN = process.env.NEXT_PUBLIC_HF_TOKEN;

  if (!API_TOKEN) {
    console.warn("API Token is missing. Please set NEXT_PUBLIC_HF_TOKEN.");
  }
  
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": file.type, 
      },
      body: file,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error classifying image:", error);
    throw error;
  }
}
