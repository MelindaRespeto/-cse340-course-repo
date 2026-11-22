import db from '../../database/index.js'

const getAllProjects = async () => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        ORDER BY p.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

const getProjectById = async (projectId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows[0];
}

const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        JOIN public.project_category pc
            ON p.project_id = pc.project_id
        WHERE pc.category_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
}

const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.project_date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project p
        JOIN public.organization o
            ON p.organization_id = o.organization_id
        WHERE p.organization_id = $1
        ORDER BY p.project_date;
    `;

    const result = await db.query(query, [organizationId]);

    return result.rows;
}

const createProject = async (title, description, location, projectDate, organizationId) => {
    const query = `
        INSERT INTO public.project (title, description, location, project_date, organization_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING project_id;
    `;

    const result = await db.query(query, [title, description, location, projectDate, organizationId]);

    return result.rows[0].project_id;
}

const updateProject = async (projectId, title, description, location, projectDate, organizationId) => {
    const query = `
        UPDATE public.project
        SET title = $1, description = $2, location = $3, project_date = $4, organization_id = $5
        WHERE project_id = $6;
    `;

    await db.query(query, [title, description, location, projectDate, organizationId, projectId]);
}

export {
    getAllProjects,
    getProjectById,
    getProjectsByCategoryId,
    getProjectsByOrganizationId,
    createProject,
    updateProject
}