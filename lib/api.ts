// lib/api.ts
import { Client, handle_file } from "@gradio/client";

export interface PredictionResult {
  label: string;
  score: number;
}

interface SpaceOutput {
  predicted_label: string;
  fracture_probability: number;
  normal_probability: number;
}

const SPACE_ID = "Dawgggggg/bone-fracture";
const ENDPOINT = "/predict";

// Konfigurasi retry untuk Space yang sleep/bangun
const MAX_RETRIES = 5;          // berapa kali dicoba ulang
const INITIAL_DELAY_MS = 2000;  // jeda awal 2 detik
const BACKOFF_FACTOR = 1.5;     // jeda = jeda * 1.5 setiap gagal

async function predictWithRetry(
  client: Client,
  file: File,
  maxRetries = MAX_RETRIES,
  initialDelay = INITIAL_DELAY_MS
): Promise<any> {
  let attempt = 0;
  let delay = initialDelay;

  // Bungkus file dengan handle_file agar sesuai dengan format input Gradio
  const inputPayload = [handle_file(file)];

  while (true) {
    try {
      const result = await client.predict(ENDPOINT, inputPayload);
      return result;
    } catch (err: any) {
      attempt += 1;

      // Kalau sudah mencapai batas retry → lempar error ke atas
      if (attempt > maxRetries) {
        console.error("Max retries reached when calling Space:", err);
        throw new Error(
          "Gagal memanggil model di Hugging Face Space setelah beberapa percobaan. " +
          "Space mungkin sedang sibuk atau tidak tersedia."
        );
      }

      console.warn(
        `Gagal memanggil Space (attempt ${attempt}/${maxRetries}). ` +
        `Menunggu ${delay} ms sebelum retry...`,
        err
      );

      // Tunggu sebelum retry berikutnya (exponential backoff)
      await new Promise((res) => setTimeout(res, delay));
      delay = Math.round(delay * BACKOFF_FACTOR);
    }
  }
}

export async function classifyImage(file: File): Promise<PredictionResult[]> {
  try {
    // Connect ke Space sekali di awal
    const client = await Client.connect(SPACE_ID);

    // Panggil predict dengan mekanisme retry (untuk handle Space sleep/wake)
    const result: any = await predictWithRetry(client, file);

    const raw: SpaceOutput | undefined = result?.data?.[0];

    if (!raw) {
      throw new Error("Response dari Space kosong / tidak sesuai format.");
    }

    const mapped: PredictionResult[] = [
      {
        label: "fracture",
        score: raw.fracture_probability,
      },
      {
        label: "normal",
        score: raw.normal_probability,
      },
    ];

    mapped.sort((a, b) => b.score - a.score);

    return mapped;
  } catch (error) {
    console.error("Error classifying image via Space:", error);
    throw error;
  }
}
