import { body, validationResult } from 'express-validator';
import { getAllProjects, getProjectById, createProject, updateProject } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';

// Validation rules for the project form
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Project title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Project title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Project description is required')
        .isLength({ max: 500 })
        .withMessage('Project description cannot exceed 500 characters'),
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Project location is required')
        .isLength({ max: 200 })
        .withMessage('Project location cannot exceed 200 characters'),
    body('projectDate')
        .notEmpty()
        .withMessage('Project date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('organizationId')
        .isInt({ min: 1 })
        .withMessage('Please select an organization')
];

// Format a date as YYYY-MM-DD for the date input
const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const showProjectsPage = async (req, res) => {
    const projects = await getAllProjects();
    res.render('projects', { title: 'Projects', projects });
};

const showProjectDetailsPage = async (req, res) => {
    const project = await getProjectById(req.params.id);
    if (!project) {
        return res.status(404).send('Project not found');
    }
    const categories = await getCategoriesByProjectId(req.params.id);
    res.render('project', { title: project.title, project, categories });
};

const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('new-project', { title: 'Add New Service Project', organizations });
};

const processNewProjectForm = async (req, res) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-project');
    }

    const { title, description, location, projectDate, organizationId } = req.body;
    const projectId = await createProject(title, description, location, projectDate, organizationId);

    req.flash('success', 'Project added successfully!');
    res.redirect(`/project/${projectId}`);
};

const showEditProjectForm = async (req, res) => {
    const project = await getProjectById(req.params.id);

    if (!project) {
        return res.status(404).send('Project not found');
    }

    const organizations = await getAllOrganizations();
    const projectDate = formatDateForInput(project.project_date);

    res.render('edit-project', {
        title: 'Edit Service Project',
        project,
        projectDate,
        organizations
    });
};

const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-project/${projectId}`);
    }

    const { title, description, location, projectDate, organizationId } = req.body;
    await updateProject(projectId, title, description, location, projectDate, organizationId);

    req.flash('success', 'Project updated successfully!');
    res.redirect(`/project/${projectId}`);
};

export {
    projectValidation,
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm
};