import dotenv from "npm:dotenv";

dotenv.config();

const apiKey = Deno.env.get("GOOGLE_API_KEY");
if (!apiKey) throw new Error("GOOGLE_API_KEY no encontrada.");

export const sendAIPrompt = async (prompt: string): Promise<string> => {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const headers = {
    "Content-Type": "application/json",
    "X-goog-api-key": apiKey,
  };

  const body = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: `Generate a query intention for: ${prompt}, need to follow this format ` }],
      },
    ],
  });

  const response = await fetch(url, {
    method: "POST",
    headers,
    body,
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Error en API Gemini: ${response.status} - ${text}`);
  }

  const data = await response.json();
  console.log(data.candidates[0].content.parts[0])
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
};
