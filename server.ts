import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client lazily or safely
  const getAiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Password Security Analysis Endpoint
  app.post("/api/analyze-password", async (req, res) => {
    try {
      const { password, contextualHints } = req.body;

      if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "Password string is required" });
      }

      const ai = getAiClient();
      if (!ai) {
        return res.status(200).json({
          available: false,
          message: "GEMINI_API_KEY not configured. Showing client-side security metrics.",
        });
      }

      const prompt = `Analyze the following user-entered password for security vulnerabilities, predictability, pattern recognition, dictionary words, and cryptographic weaknesses.
Password to evaluate: "${password}"
${contextualHints ? `Contextual information provided by user: "${contextualHints}"` : ""}

Evaluate the password and provide a JSON response conforming strictly to the requested schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          systemInstruction:
            "You are a Senior Cryptographer and Cybersecurity Auditor evaluating password strength. Be objective, precise, and highly insightful. Provide actionable password advice without storing or logging sensitive data.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: "Short 1-2 sentence executive security summary.",
              },
              grade: {
                type: Type.STRING,
                description: "Letter grade: A+, A, B, C, D, or F.",
              },
              vulnerabilities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of specific vulnerabilities found (e.g. keyboard path, l33tspeak substitution, dictionary word).",
              },
              smartAlternatives: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "3 highly secure, diverse alternative passwords or passphrase suggestions.",
              },
              educationalInsight: {
                type: Type.STRING,
                description: "A quick cryptography or security lesson explaining why this password falls into this category.",
              },
            },
            required: ["summary", "grade", "vulnerabilities", "smartAlternatives", "educationalInsight"],
          },
        },
      });

      const text = response.text;
      if (!text) {
        throw new Error("No text returned from Gemini API");
      }

      const parsed = JSON.parse(text);
      res.json({ available: true, ...parsed });
    } catch (error: any) {
      console.error("Gemini API error:", error);
      res.status(500).json({
        error: "Failed to generate AI security analysis",
        details: error?.message || "Unknown error",
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
