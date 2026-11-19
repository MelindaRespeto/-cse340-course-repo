import { body, validationResult } from 'express-validator';
import { getAllOrganizations, getOrganizationById, createOrganization } from '../models/organizations.js';
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
    res.render('new-organization', {
        title: 'Add New Organization',
        errors: [],
        formData: {}
    });
};

const processNewOrganizationForm = async (req, res) => {
    // Check the results of the validation rules
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Show the form again with the error messages and the user's input
        return res.status(400).render('new-organization', {
            title: 'Add New Organization',
            errors: errors.array(),
            formData: req.body
        });
    }

    const { name, description, contactEmail, logoFilename } = req.body;

    // The logo column can't be empty, so use the placeholder when no filename is given
    const logo = logoFilename && logoFilename.trim() ? logoFilename.trim() : 'placeholder-logo.png';

    const organizationId = await createOrganization(name, description, contactEmail, logo);

    res.redirect(`/organization/${organizationId}`);
};

export {
    organizationValidation,
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    processNewOrganizationForm
};