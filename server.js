import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Organizations' });
});

app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects' });
});

app.get('/categories', (req, res) => {
  res.render('categories', { title: 'Categories' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});