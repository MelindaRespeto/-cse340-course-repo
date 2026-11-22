import { body, validationResult } from 'express-validator';
import { getAllCategories, getCategoryById, createCategory, updateCategory } from '../models/categories.js';
import { getProjectsByCategoryId } from '../models/projects.js';

// Validation rules for the category form
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    res.render('categories', { title: 'Categories', categories });
};

const showCategoryDetailsPage = async (req, res) => {
    const category = await getCategoryById(req.params.id);
    if (!category) {
        return res.status(404).send('Category not found');
    }
    const projects = await getProjectsByCategoryId(req.params.id);
    res.render('category', { title: category.name, category, projects });
};

const showNewCategoryForm = async (req, res) => {
    res.render('new-category', { title: 'Add New Category' });
};

const processNewCategoryForm = async (req, res, next) => {
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }

    const { name } = req.body;

    try {
        const categoryId = await createCategory(name);

        req.flash('success', 'Category added successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        // 23505 is PostgreSQL's code for "unique constraint violated"
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists');
            return res.redirect('/new-category');
        }

        next(error);
    }
};

const showEditCategoryForm = async (req, res) => {
    const category = await getCategoryById(req.params.id);

    if (!category) {
        return res.status(404).send('Category not found');
    }

    res.render('edit-category', { title: 'Edit Category', category });
};

const processEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;

    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect(`/edit-category/${categoryId}`);
    }

    const { name } = req.body;

    try {
        await updateCategory(categoryId, name);

        req.flash('success', 'Category updated successfully!');
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        if (error.code === '23505') {
            req.flash('error', 'A category with that name already exists');
            return res.redirect(`/edit-category/${categoryId}`);
        }

        next(error);
    }
};

export {
    categoryValidation,
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm
};