import dotenv from "dotenv";
import { JWTPayload, jwtVerify, SignJWT } from "jose";

dotenv.config();


export const sendAIPrompt = async (prompt: string): Promise<string> => {
  const apiKey = Deno.env.get("GOOGLE_API_KEY");
  if (!apiKey) throw new Error("GOOGLE_API_KEY no encontrada.");
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

export const jwtsecret = Deno.env.get("JWT_SECRET")
export const adminauth = Deno.env.get("ADMIN_TOKEN")

const secret = new TextEncoder().encode(jwtsecret);

export async function createJWT(payload: JWTPayload): Promise<string> {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return jwt;
}

export async function verifyJWT(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error:any) {
    return null;
  }
}

export const checkAuth = async (userid:string,token:string):Promise<boolean>=> {
   if (!userid || !token) {
            return false
        } 
        if(token){
            const userlegit =await verifyJWT(token)
            if (userlegit != null){
                return true;
            }
        }
        return false;
}