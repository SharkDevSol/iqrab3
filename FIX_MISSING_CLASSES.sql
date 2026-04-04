-- Fix Missing Classes in Bilal School System
-- Run this on your VPS to add the missing classes

-- Connect to the database first:
-- psql -U postgres -d school_management10

-- Create missing class tables
CREATE TABLE IF NOT EXISTS classes_schema."G7A" (
    id SERIAL PRIMARY KEY,
    school_id INTEGER,
    class_id INTEGER,
    image_student VARCHAR(255),
    student_name VARCHAR(255) NOT NULL,
    smachine_id VARCHAR(50) UNIQUE,
    age INTEGER NOT NULL,
    gender VARCHAR(50) NOT NULL,
    class VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_relation VARCHAR(50) NOT NULL,
    guardian_username VARCHAR(255),
    guardian_password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_free BOOLEAN DEFAULT FALSE,
    exemption_type VARCHAR(50),
    exemption_reason TEXT
);

CREATE TABLE IF NOT EXISTS classes_schema."G7B" (
    id SERIAL PRIMARY KEY,
    school_id INTEGER,
    class_id INTEGER,
    image_student VARCHAR(255),
    student_name VARCHAR(255) NOT NULL,
    smachine_id VARCHAR(50) UNIQUE,
    age INTEGER NOT NULL,
    gender VARCHAR(50) NOT NULL,
    class VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_relation VARCHAR(50) NOT NULL,
    guardian_username VARCHAR(255),
    guardian_password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_free BOOLEAN DEFAULT FALSE,
    exemption_type VARCHAR(50),
    exemption_reason TEXT
);

CREATE TABLE IF NOT EXISTS classes_schema."G8A" (
    id SERIAL PRIMARY KEY,
    school_id INTEGER,
    class_id INTEGER,
    image_student VARCHAR(255),
    student_name VARCHAR(255) NOT NULL,
    smachine_id VARCHAR(50) UNIQUE,
    age INTEGER NOT NULL,
    gender VARCHAR(50) NOT NULL,
    class VARCHAR(50) NOT NULL,
    username VARCHAR(255),
    password VARCHAR(255),
    guardian_name VARCHAR(255) NOT NULL,
    guardian_phone VARCHAR(20) NOT NULL,
    guardian_relation VARCHAR(50) NOT NULL,
    guardian_username VARCHAR(255),
    guardian_password VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    is_free BOOLEAN DEFAULT FALSE,
    exemption_type VARCHAR(50),
    exemption_reason TEXT
);

-- Update the classes metadata table
INSERT INTO school_schema_points.classes (id, class_count, class_names, custom_fields)
VALUES (1, 25, 
    ARRAY['G1A','G1B','G1C','G2A','G2B','G2C','G3A','G3B','G4A','G4B','G5A','G5B','G6A','G6B','G7A','G7B','G8A','G8B','G9A','G9B','G10A','G10B','G11N','G11S','G12N','G12S'],
    '[]'::jsonb
)
ON CONFLICT (id) DO UPDATE 
SET class_count = EXCLUDED.class_count, 
    class_names = EXCLUDED.class_names;

-- Verify the classes were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'classes_schema' 
ORDER BY table_name;
