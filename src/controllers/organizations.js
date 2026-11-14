import { getAllOrganizations, getOrganizationById } from '../models/organizations.js';
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

export { showOrganizationsPage, showOrganizationDetailsPage };