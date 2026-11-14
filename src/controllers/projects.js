import { getAllProjects, getProjectById } from '../models/projects.js';
import { getCategoriesByProjectId } from '../models/categories.js';

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

export { showProjectsPage, showProjectDetailsPage };