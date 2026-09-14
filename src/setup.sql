-- ========================================
-- DROP TABLES IF THEY ALREADY EXIST
-- ========================================

DROP TABLE IF EXISTS project_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS service_project;
DROP TABLE IF EXISTS organizations;


-- ========================================
-- ORGANIZATION TABLE
-- ========================================

CREATE TABLE organizations (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- INSERT ORGANIZATIONS
-- ========================================

INSERT INTO organizations (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ========================================
-- SERVICE PROJECT TABLE
-- ========================================

CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    organization_id INTEGER NOT NULL
        REFERENCES organizations(organization_id),
    description TEXT NOT NULL,
    location TEXT,
    date TIMESTAMP
);


-- ========================================
-- INSERT SERVICE PROJECTS
-- ========================================

INSERT INTO service_project (
    title,
    organization_id,
    description,
    location,
    date
)
VALUES
(
    'Community Center Renovation',
    1,
    'Renovate a local community center to provide a safer and more welcoming space for neighborhood activities.',
    'Downtown Community Center',
    '2026-09-20 08:00:00'
),
(
    'Neighborhood Playground Build',
    1,
    'Build a new playground with safe and sustainable materials for children in the local community.',
    'Riverside Park',
    '2026-10-03 07:30:00'
),
(
    'Affordable Home Repair Day',
    1,
    'Assist low-income families with essential home repairs, painting, and accessibility improvements.',
    'Westside Neighborhood',
    '2026-10-17 08:00:00'
),
(
    'School Roof Restoration',
    1,
    'Repair and restore the roof of a local public school to improve safety and prevent water damage.',
    'Lincoln Elementary School',
    '2026-11-07 07:00:00'
),
(
    'Community Ramp Installation',
    1,
    'Install accessibility ramps for community buildings to improve access for people with disabilities.',
    'Northside Community District',
    '2026-11-21 08:30:00'
),
(
    'Community Garden Planting',
    2,
    'Prepare garden beds and plant seasonal vegetables for a neighborhood community garden.',
    'Greenwood Community Garden',
    '2026-09-26 07:00:00'
),
(
    'Urban Farming Workshop',
    2,
    'Teach residents the basics of urban farming, composting, and sustainable food production.',
    'GreenHarvest Learning Center',
    '2026-10-10 09:00:00'
),
(
    'School Vegetable Garden',
    2,
    'Create a vegetable garden where students can learn about agriculture, nutrition, and sustainability.',
    'Jefferson Middle School',
    '2026-10-24 08:00:00'
),
(
    'Community Composting Day',
    2,
    'Build composting stations and educate residents about reducing household organic waste.',
    'Oakwood Neighborhood',
    '2026-11-14 08:30:00'
),
(
    'Winter Harvest Preparation',
    2,
    'Prepare community gardens for the winter growing season and distribute harvested produce.',
    'Eastside Urban Farm',
    '2026-12-05 07:30:00'
),
(
    'Food Bank Support Day',
    3,
    'Help organize, package, and distribute food donations to families in need.',
    'Central City Food Bank',
    '2026-09-19 09:00:00'
),
(
    'Park Cleanup Initiative',
    3,
    'Clean public spaces, collect litter, and help maintain walking trails throughout the park.',
    'Liberty Park',
    '2026-10-04 08:00:00'
),
(
    'Senior Community Assistance',
    3,
    'Support elderly residents with household tasks, grocery organization, and community activities.',
    'Sunrise Senior Center',
    '2026-10-18 10:00:00'
),
(
    'Charity Donation Sorting',
    3,
    'Sort clothing, household goods, and other donated items before distribution to local families.',
    'UnityServe Distribution Center',
    '2026-11-08 09:00:00'
),
(
    'Holiday Community Drive',
    3,
    'Collect and organize food, toys, and essential supplies for families during the holiday season.',
    'UnityServe Community Hall',
    '2026-12-12 08:00:00'
);


-- ========================================
-- CATEGORIES TABLE
-- ========================================

CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL UNIQUE
);


-- ========================================
-- INSERT CATEGORIES
-- ========================================

INSERT INTO categories (name)
VALUES
('Community Development'),
('Environment & Sustainability'),
('Community Support'),
('Community Service & Volunteering');


-- ========================================
-- PROJECT-CATEGORIES JUNCTION TABLE
-- ========================================

CREATE TABLE project_categories (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE CASCADE
);


-- ========================================
-- ASSIGN PROJECTS TO CATEGORIES
-- ========================================

INSERT INTO project_categories (project_id, category_id)
VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),

(6, 2),
(7, 2),
(8, 2),
(9, 2),
(10, 2),

(11, 3),
(13, 3),
(15, 3),

(12, 4),
(14, 4);


-- ========================================
-- VERIFY COMPLETE PROJECT INFORMATION
-- ========================================

SELECT
    sp.project_id,
    sp.title,
    o.name AS organization_name,
    c.name AS category_name,
    sp.description,
    sp.location,
    sp.date
FROM service_project AS sp
JOIN organizations AS o
    ON sp.organization_id = o.organization_id
JOIN project_categories AS pc
    ON sp.project_id = pc.project_id
JOIN categories AS c
    ON pc.category_id = c.category_id
ORDER BY sp.project_id, c.category_id;