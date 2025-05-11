const dotenv = require('dotenv');
dotenv.config();
console.log("🛠️ Starting Junius server...");

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const juniusRouter = require('./backend/routes/juniusRouter.js');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(bodyParser.json());

app.post('/test', (req, res) => {
  console.log("🔥 /test route hit");
  console.log("🧾 Request body:", req.body);
  res.json({ message: "Test route working!", body: req.body });
});

app.use('/api', juniusRouter);

app.get('/', (req, res) => {
  res.send('Junius AI backend is live 🚀');
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Junius server is running on http://localhost:${PORT}`);
});