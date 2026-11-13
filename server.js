import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllCategories } from './src/models/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Serve files from the public folder (CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Template settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to log all incoming requests (development only)
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});

const projects = [
  { id: 1, title: 'Community Garden Cleanup', organization: 'GreenHarvest', description: 'Help clear and prepare shared garden beds.' },
  { id: 2, title: 'After-School Tutoring', organization: 'BrightFuture', description: 'Tutor local students in reading and math.' },
  { id: 3, title: 'Neighborhood Food Drive', organization: 'UnityServe', description: 'Collect and sort donations for local families.' }
];

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  const organizations = await getAllOrganizations();
  res.render('organizations', { title: 'Organizations', organizations });
});

app.get('/projects', (req, res) => {
  res.render('projects', { title: 'Projects', projects });
});

app.get('/categories', async (req, res) => {
  const categories = await getAllCategories();
  res.render('categories', { title: 'Categories', categories });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});