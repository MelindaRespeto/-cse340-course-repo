import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationById, createOrganization, updateOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    res.render('organizations', { title: 'Organizations', organizations });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organization = await getOrganizationById(req.params.id);
    if (!organization) {
        return res.status(404).send('Organization not found');
    }
    const projects = await getProjectsByOrganizationId(req.params.id);
    res.render('organization', { title: organization.name, organization, projects });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';
    res.render('new-organization', { title });
};

const processNewOrganizationForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new organization form
        return res.redirect('/new-organization');
    }

    const { name, description, contactEmail } = req.body;
    const logoFilename = 'placeholder-logo.png'; // Use the placeholder logo for all new organizations

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);
    req.flash('success', 'Organization added successfully!');
    res.redirect(`/organization/${organizationId}`);
};

const showEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Get the existing organization data from the model
    const organization = await getOrganizationById(organizationId);

    // If no organization has this id, show a 404
    if (!organization) {
        return res.status(404).send('Organization not found');
    }

    res.render('edit-organization', {
        title: 'Edit Organization',
        organization
    });
};

const processEditOrganizationForm = async (req, res) => {
    const organizationId = req.params.id;

    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit form for this organization
        return res.redirect(`/edit-organization/${organizationId}`);
    }

    const { name, description, contactEmail } = req.body;

    await updateOrganization(organizationId, name, description, contactEmail);

    req.flash('success', 'Organization updated successfully!');
    res.redirect(`/organization/${organizationId}`);
};

export {
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm,
    showEditOrganizationForm,
    processEditOrganizationForm
};