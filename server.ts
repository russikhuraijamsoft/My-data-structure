import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const PORT = isProduction ? parseInt(process.env.PORT || '8080', 10) : 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let genAiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    genAiClient = new GoogleGenAI({ apiKey: geminiApiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// Read firebase applet config if present
let appletConfig: Record<string, string> = {};
try {
  const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    appletConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  }
} catch {
  // Config fallback
}

// Health Check Endpoint for Google Cloud Run Liveness & Readiness Probes
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'talkos-enterprise-erp',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    memoryUsage: process.memoryUsage(),
    nodeVersion: process.version,
    platform: 'Google Cloud Run',
    gcp: {
      projectId: process.env.GCP_PROJECT_ID || appletConfig.projectId || 'cricket-closet-imphal',
      region: process.env.GCP_REGION || 'asia-southeast1',
      firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || 'ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574',
      storageBucket: appletConfig.storageBucket || 'cricket-closet-imphal.firebasestorage.app',
      cloudRunPort: PORT,
      aiModel: 'gemini-2.5-flash',
      hasGeminiApiKey: Boolean(geminiApiKey)
    }
  });
});

// Google Cloud Architecture & Status Endpoint
app.get('/api/gcloud/status', (req, res) => {
  res.status(200).json({
    projectId: process.env.GCP_PROJECT_ID || appletConfig.projectId || 'cricket-closet-imphal',
    region: process.env.GCP_REGION || 'asia-southeast1',
    firestoreDatabaseId: process.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || 'ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574',
    serviceName: 'talkos-enterprise-erp',
    imageRepo: 'asia-southeast1-docker.pkg.dev/cricket-closet-imphal/talkos/talkos-app',
    cloudRunConfig: {
      minInstances: 0,
      maxInstances: 10,
      concurrency: 80,
      cpu: '1000m',
      memory: '512Mi',
      timeout: '300s',
      ingress: 'all',
      executionEnvironment: 'gen2'
    },
    activeServices: [
      { name: 'Cloud Run', status: 'ACTIVE', tier: 'Fully Managed Serverless' },
      { name: 'Cloud Firestore', status: 'ACTIVE', databaseId: appletConfig.firestoreDatabaseId || 'ai-studio-talkosarchitectu-438c4707-59bb-4b28-aa84-26b8ca15c574' },
      { name: 'Artifact Registry', status: 'READY', repository: 'talkos' },
      { name: 'Cloud Build', status: 'READY', spec: 'cloudbuild.yaml' },
      { name: 'Gemini 2.5 Flash GenAI', status: geminiApiKey ? 'CONNECTED' : 'FALLBACK_READY', model: 'gemini-2.5-flash' },
      { name: 'Cloud Logging & Monitoring', status: 'ACTIVE', logDriver: 'stdout/json' }
    ]
  });
});

// Server-side Gemini AI Chat Proxy Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, context } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  const systemInstruction = `You are the TalkOS Restaurant Operating System Intelligence Engine. 
You provide concise, executive operational insights for restaurant managers, head chefs, and accountants.
Never invent business figures. If context does not contain verified data, say that data is unavailable. Currency is Indian Rupee (₹ INR). Focus on practical answers regarding sales velocity, inventory reorder thresholds, kitchen throughput, recipe food cost margins, and table turns.`;

  if (genAiClient) {
    try {
      const response = await genAiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\nContext: ${JSON.stringify(context || {})}\nUser Query: ${prompt}` }] }
        ]
      });

      const replyText = response.text || 'Insight compiled successfully.';
      return res.json({ reply: replyText, model: 'gemini-2.5-flash' });
    } catch (err: any) {
      console.error('Error invoking Gemini model:', err);
      // Fall through to contextual fallback
    }
  }

  return res.status(503).json({
    error: 'AI assistance is unavailable. No live business figures have been generated. Please check the AI configuration or try again later.'
  });
});

// Setup Vite in development or static serving in production
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TalkOS Server] Running in ${isProduction ? 'production' : 'development'} mode on port ${PORT} (0.0.0.0)`);
    console.log(`[TalkOS Server] Cloud Run Health Check: http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
