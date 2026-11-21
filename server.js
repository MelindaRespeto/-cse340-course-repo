
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import router from './src/routes/index.js';

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

// Read form data into req.body
app.use(express.urlencoded({ extended: true }));

// ===== 2b: Sessions and flash messages (goes here) =====
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Make flash messages available to all templates
app.use((req, res, next) => {
  res.locals.messages = {
    error: req.flash('error'),
    success: req.flash('success')
  };
  next();
});
// ===== end of 2b =====

// All routes live in the router
app.use('/', router);

app.listen(PORT, (error) => {
  if (error) {
    console.error('Could not start the server:', error.message);
    return;
  }
  console.log(`Server is running at http://localhost:${PORT}`);
});