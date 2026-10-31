import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = path.dirname(currentFilePath);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(currentDirPath, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(currentDirPath, 'src', 'views', 'home.html'));
});

app.get('/organizations', (req, res) => {
  res.sendFile(path.join(currentDirPath, 'src', 'views', 'organizations.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(currentDirPath, 'src', 'views', 'projects.html'));
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});