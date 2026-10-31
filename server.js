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

const organizations = [
  { id: 1, name: 'BrightFuture', image: '/images/brightfuture-logo.png' },
  { id: 2, name: 'GreenHarvest', image: '/images/greenharvest-logo.png' },
  { id: 3, name: 'UnityServe', image: '/images/unityserve-logo.png' }
];

const projects = [
  { id: 1, title: 'Community Garden Cleanup', organization: 'GreenHarvest', description: 'Help clear and prepare shared garden beds.' },
  { id: 2, title: 'After-School Tutoring', organization: 'BrightFuture', description: 'Tutor local students in reading and math.' },
  { id: 3, title: 'Neighborhood Food Drive', organization: 'UnityServe', description: 'Collect and sort donations for local families.' }
];

const categories = [
  { id: 1, name: 'Education' },
  { id: 2, name: 'Environment' },
  { id: 3, name: 'Hunger Relief' },
  { id: 4, name: 'Community Building' }
];

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', (req, res) => {
  res.render('organizations', { title: 'Organizations', organizations });
});

app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects', projects });
});

app.get('/categories', (req, res) => {
  res.render('categories', { title: 'Categories', categories });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});