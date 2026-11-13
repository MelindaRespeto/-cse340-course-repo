-- ========================================
-- Drop existing tables (so this file can be re-run)
-- ========================================
DROP TABLE IF EXISTS public.project_category;
DROP TABLE IF EXISTS public.project;
DROP TABLE IF EXISTS public.category;
DROP TABLE IF EXISTS public.organization;

-- ========================================
-- Create tables
-- ========================================
CREATE TABLE public.organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

CREATE TABLE public.project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL REFERENCES public.organization(organization_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    project_date DATE NOT NULL
);

CREATE TABLE public.category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE public.project_category (
    project_id INT NOT NULL REFERENCES public.project(project_id) ON DELETE CASCADE,
    category_id INT NOT NULL REFERENCES public.category(category_id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, category_id)
);

-- ========================================
-- Insert sample data: Organizations (3)
-- ========================================
INSERT INTO public.organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Insert sample data: Categories (4)
-- ========================================
INSERT INTO public.category (name)
VALUES
('Education'),
('Environment'),
('Hunger Relief'),
('Community Building');

-- ========================================
-- Insert sample data: Projects (5 per organization = 15)
-- ========================================
INSERT INTO public.project (organization_id, title, description, location, project_date)
VALUES
-- BrightFuture Builders (organization_id = 1) -> project_id 1-5
(1, 'Community Center Renovation', 'Repair and repaint the neighborhood community center.', 'Dasmariñas Community Center', '2026-12-05'),
(1, 'Playground Rebuild', 'Replace worn equipment and build a safe play area for children.', 'Barangay Park', '2026-12-12'),
(1, 'Home Repair for Seniors', 'Fix roofs and doors for elderly neighbors on fixed incomes.', 'Various homes', '2027-01-09'),
(1, 'After-School Tutoring', 'Tutor local students in reading and math.', 'Public Library', '2027-01-16'),
(1, 'Garden Shed Build', 'Build a tool shed for the community garden.', 'Community Garden', '2027-01-23'),

-- GreenHarvest Growers (organization_id = 2) -> project_id 6-10
(2, 'Community Garden Cleanup', 'Help clear and prepare shared garden beds.', 'Community Garden', '2026-12-06'),
(2, 'Urban Farming Workshop', 'Teach families how to grow vegetables in small spaces.', 'Barangay Hall', '2026-12-13'),
(2, 'Neighborhood Tree Planting', 'Plant native trees along local streets.', 'Main Street', '2027-01-10'),
(2, 'School Garden Program', 'Help students start and maintain a school vegetable garden.', 'Elementary School', '2027-01-17'),
(2, 'Fresh Produce Distribution', 'Sort and hand out fresh vegetables to local families.', 'Community Garden', '2027-01-24'),

-- UnityServe Volunteers (organization_id = 3) -> project_id 11-15
(3, 'Neighborhood Food Drive', 'Collect and sort donations for local families.', 'Barangay Hall', '2026-12-07'),
(3, 'Winter Coat Collection', 'Gather and distribute warm clothing for families in need.', 'Community Center', '2026-12-14'),
(3, 'Volunteer Orientation Day', 'Welcome and train new volunteers for service projects.', 'Public Library', '2027-01-11'),
(3, 'Senior Meal Delivery', 'Deliver hot meals to homebound seniors.', 'Various homes', '2027-01-18'),
(3, 'Park Cleanup Day', 'Pick up litter and tidy the neighborhood park.', 'Barangay Park', '2027-01-25');

-- ========================================
-- Assign projects to categories (every project has 1 or more)
-- Categories: 1 Education, 2 Environment, 3 Hunger Relief, 4 Community Building
-- ========================================
INSERT INTO public.project_category (project_id, category_id)
VALUES
(1, 4),
(2, 2), (2, 4),
(3, 4),
(4, 1),
(5, 2), (5, 4),
(6, 2), (6, 4),
(7, 1), (7, 2),
(8, 2),
(9, 1), (9, 2),
(10, 3),
(11, 3), (11, 4),
(12, 4),
(13, 1), (13, 4),
(14, 3), (14, 4),
(15, 2), (15, 4);