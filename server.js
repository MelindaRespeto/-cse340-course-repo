import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllOrganizations, getOrganizationById } from './src/models/organizations.js';
import { getAllCategories, getCategoryById, getCategoriesByProjectId } from './src/models/categories.js';
import { getAllProjects, getProjectById, getProjectsByCategoryId, getProjectsByOrganizationId } from './src/models/projects.js';

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

app.get('/', (req, res) => {
  res.render('home', { title: 'Home' });
});

app.get('/organizations', async (req, res) => {
  const organizations = await getAllOrganizations();
  res.render('organizations', { title: 'Organizations', organizations });
});

app.get('/organization/:id', async (req, res) => {
  const organization = await getOrganizationById(req.params.id);
  if (!organization) {
    return res.status(404).send('Organization not found');
  }
  const projects = await getProjectsByOrganizationId(req.params.id);
  res.render('organization', { title: organization.name, organization, projects });
});

app.get('/projects', async (req, res) => {
  const projects = await getAllProjects();
  res.render('projects', { title: 'Projects', projects });
});

app.get('/project/:id', async (req, res) => {
  const project = await getProjectById(req.params.id);
  if (!project) {
    return res.status(404).send('Project not found');
  }
  const categories = await getCategoriesByProjectId(req.params.id);
  res.render('project', { title: project.title, project, categories });
});

app.get('/categories', async (req, res) => {
  const categories = await getAllCategories();
  res.render('categories', { title: 'Categories', categories });
});

app.get('/category/:id', async (req, res) => {
  const category = await getCategoryById(req.params.id);
  if (!category) {
    return res.status(404).send('Category not found');
  }
  const projects = await getProjectsByCategoryId(req.params.id);
  res.render('category', { title: category.name, category, projects });
});

app.listen(PORT, (error) => {
  if (error) {
    console.error('Could not start the server:', error.message);
    return;
  }
  console.log(`Server is running at http://localhost:${PORT}`);
});