import { getAllOrganizations, getOrganizationById, createOrganization } from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';

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
    const { name, description, contactEmail, logoFilename } = req.body;

    const organizationId = await createOrganization(name, description, contactEmail, logoFilename);

    res.redirect(`/organization/${organizationId}`);
};

export { showOrganizationsPage, showOrganizationDetailsPage, showNewOrganizationForm, processNewOrganizationForm };