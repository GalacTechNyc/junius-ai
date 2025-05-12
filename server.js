const express = require('express');
// local dev only
try { require('dotenv').config(); } catch {}

const cors = require('cors');
const bodyParser = require('body-parser');
const juniusRouter = require('./backend/routes/juniusRouter.js');

console.log("🛠️ Starting Junius server...");

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: true
}));
app.use(bodyParser.json());

app.post('/test', (req, res) => {
  console.log("🔥 /test route hit");
  console.log("🧾 Request body:", req.body);
  res.json({ message: "Test route working!", body: req.body });
});


app.use('/api', juniusRouter);

// Global error handler: logs the error and returns 500 JSON
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

app.get('/', (req, res) => {
  res.send('Junius AI backend is live 🚀');
});

/**
 * Export the Express app so Vercel (or other serverless platforms) can
 * handle requests without starting its own listener. When we’re running
 * locally (i.e., not on Vercel), spin up the traditional server.
 */
if (!process.env.VERCEL && !process.env.NOW_REGION) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Junius server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;