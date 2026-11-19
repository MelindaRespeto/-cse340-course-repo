import express from 'express';

import { showHomePage } from '../controllers/home.js';
import {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation
} from '../controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from '../controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from '../controllers/categories.js';

const router = express.Router();

router.get('/', showHomePage);

router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);

// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route to handle new organization form submission (validation runs first)
router.post('/new-organization', organizationValidation, processNewOrganizationForm);

router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);

router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);

export default router;