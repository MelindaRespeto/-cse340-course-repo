import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllOrganizations } from './src/models/organizations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// Middleware to log all incoming requests
app.use((req, res, next) => {
  if (NODE_ENV === 'development') {
    console.log(`${req.method} ${req.url}`);
  }
  // Middleware to make NODE_ENV available to all templates
  app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
  });
  next(); // Pass control to the next middleware or route
});
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

app.use((req, res, next) => {
  res.locals.NODE_ENV = NODE_ENV;
  next();
});
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

app.get('/organizations', async (req, res) => {
  const organizations = await getAllOrganizations();
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