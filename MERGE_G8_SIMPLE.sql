-- ============================================
-- SIMPLE MERGE: G8A and G8B into G8
-- Only handles tables that exist
-- ============================================

BEGIN;

-- Backup
CREATE TABLE IF NOT EXISTS classes_schema."G8A_backup" AS SELECT * FROM classes_schema."G8A";
CREATE TABLE IF NOT EXISTS classes_schema."G8B_backup" AS SELECT * FROM classes_schema."G8B";

SELECT 'G8A Students:' as info, COUNT(*) as count FROM classes_schema."G8A";
SELECT 'G8B Students:' as info, COUNT(*) as count FROM classes_schema."G8B";

-- Copy students from G8B to G8A
INSERT INTO classes_schema."G8A" (
    school_id, student_name, age, gender, class, class_id,
    image_student, guardian_name, guardian_phone, guardian_username, is_active
)
SELECT 
    school_id, student_name, age, gender, 'G8A', class_id,
    image_student, guardian_name, guardian_phone, guardian_username, is_active
FROM classes_schema."G8B";

SELECT 'After merge:' as info, COUNT(*) as count FROM classes_schema."G8A";

-- Merge subject tables (only if they exist)
DO $$
BEGIN
    -- Amharic
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_amh_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_amh_schema.g8a_term_1 SELECT * FROM subject_amh_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_amh_schema.g8a_term_2 SELECT * FROM subject_amh_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- English
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_eng_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_eng_schema.g8a_term_1 SELECT * FROM subject_eng_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_eng_schema.g8a_term_2 SELECT * FROM subject_eng_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- Math
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_math_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_math_schema.g8a_term_1 SELECT * FROM subject_math_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_math_schema.g8a_term_2 SELECT * FROM subject_math_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- Biology
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_bio_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_bio_schema.g8a_term_1 SELECT * FROM subject_bio_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_bio_schema.g8a_term_2 SELECT * FROM subject_bio_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- Chemistry
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_chem_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_chem_schema.g8a_term_1 SELECT * FROM subject_chem_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_chem_schema.g8a_term_2 SELECT * FROM subject_chem_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- Physics
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_phy_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_phy_schema.g8a_term_1 SELECT * FROM subject_phy_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_phy_schema.g8a_term_2 SELECT * FROM subject_phy_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    -- Other subjects (Geography, History, Civics, etc.)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_geo_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_geo_schema.g8a_term_1 SELECT * FROM subject_geo_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_geo_schema.g8a_term_2 SELECT * FROM subject_geo_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_his_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_his_schema.g8a_term_1 SELECT * FROM subject_his_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_his_schema.g8a_term_2 SELECT * FROM subject_his_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_civ_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_civ_schema.g8a_term_1 SELECT * FROM subject_civ_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_civ_schema.g8a_term_2 SELECT * FROM subject_civ_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_eco_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_eco_schema.g8a_term_1 SELECT * FROM subject_eco_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_eco_schema.g8a_term_2 SELECT * FROM subject_eco_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_ict_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_ict_schema.g8a_term_1 SELECT * FROM subject_ict_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_ict_schema.g8a_term_2 SELECT * FROM subject_ict_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_sport_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_sport_schema.g8a_term_1 SELECT * FROM subject_sport_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_sport_schema.g8a_term_2 SELECT * FROM subject_sport_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_arabi_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_arabi_schema.g8a_term_1 SELECT * FROM subject_arabi_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_arabi_schema.g8a_term_2 SELECT * FROM subject_arabi_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_qur_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_qur_schema.g8a_term_1 SELECT * FROM subject_qur_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_qur_schema.g8a_term_2 SELECT * FROM subject_qur_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_taf_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_taf_schema.g8a_term_1 SELECT * FROM subject_taf_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_taf_schema.g8a_term_2 SELECT * FROM subject_taf_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_tar_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_tar_schema.g8a_term_1 SELECT * FROM subject_tar_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_tar_schema.g8a_term_2 SELECT * FROM subject_tar_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_safuu_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_safuu_schema.g8a_term_1 SELECT * FROM subject_safuu_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_safuu_schema.g8a_term_2 SELECT * FROM subject_safuu_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_saaynaannoo_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_saaynaannoo_schema.g8a_term_1 SELECT * FROM subject_saaynaannoo_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_saaynaannoo_schema.g8a_term_2 SELECT * FROM subject_saaynaannoo_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_agri_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_agri_schema.g8a_term_1 SELECT * FROM subject_agri_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_agri_schema.g8a_term_2 SELECT * FROM subject_agri_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_ao_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_ao_schema.g8a_term_1 SELECT * FROM subject_ao_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_ao_schema.g8a_term_2 SELECT * FROM subject_ao_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_g_s_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_g_s_schema.g8a_term_1 SELECT * FROM subject_g_s_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_g_s_schema.g8a_term_2 SELECT * FROM subject_g_s_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'subject_soc_schema' AND table_name = 'g8b_term_1') THEN
        INSERT INTO subject_soc_schema.g8a_term_1 SELECT * FROM subject_soc_schema.g8b_term_1 ON CONFLICT DO NOTHING;
        INSERT INTO subject_soc_schema.g8a_term_2 SELECT * FROM subject_soc_schema.g8b_term_2 ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Delete G8B references (only from tables that exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'school_schema_points' AND table_name = 'class_teachers') THEN
        DELETE FROM school_schema_points.class_teachers WHERE assigned_class = 'G8B';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule_schema' AND table_name = 'teachers') THEN
        UPDATE schedule_schema.teachers SET assigned_classes = array_remove(assigned_classes, 'G8B') WHERE 'G8B' = ANY(assigned_classes);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        UPDATE posts SET class = 'G8A' WHERE class = 'G8B';
    END IF;
END $$;

-- Rename G8A to G8
ALTER TABLE classes_schema."G8A" RENAME TO "G8";
UPDATE classes_schema."G8" SET class = 'G8';

-- Rename subject tables
DO $$
DECLARE
    schema_name TEXT;
    schemas TEXT[] := ARRAY['subject_amh_schema', 'subject_eng_schema', 'subject_math_schema', 
                            'subject_bio_schema', 'subject_chem_schema', 'subject_phy_schema',
                            'subject_geo_schema', 'subject_his_schema', 'subject_civ_schema',
                            'subject_eco_schema', 'subject_ict_schema', 'subject_sport_schema',
                            'subject_arabi_schema', 'subject_qur_schema', 'subject_taf_schema',
                            'subject_tar_schema', 'subject_safuu_schema', 'subject_saaynaannoo_schema',
                            'subject_agri_schema', 'subject_ao_schema', 'subject_g_s_schema', 'subject_soc_schema'];
BEGIN
    FOREACH schema_name IN ARRAY schemas
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = schema_name AND table_name = 'g8a_term_1') THEN
            EXECUTE format('ALTER TABLE %I.g8a_term_1 RENAME TO g8_term_1', schema_name);
            EXECUTE format('ALTER TABLE %I.g8a_term_2 RENAME TO g8_term_2', schema_name);
        END IF;
    END LOOP;
END $$;

-- Update references from G8A to G8
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'school_schema_points' AND table_name = 'class_teachers') THEN
        UPDATE school_schema_points.class_teachers SET assigned_class = 'G8' WHERE assigned_class = 'G8A';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'schedule_schema' AND table_name = 'teachers') THEN
        UPDATE schedule_schema.teachers SET assigned_classes = array_replace(assigned_classes, 'G8A', 'G8') WHERE 'G8A' = ANY(assigned_classes);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
        UPDATE posts SET class = 'G8' WHERE class = 'G8A';
    END IF;
END $$;

-- Drop G8B tables
DROP TABLE IF EXISTS classes_schema."G8B";

DO $$
DECLARE
    schema_name TEXT;
    schemas TEXT[] := ARRAY['subject_amh_schema', 'subject_eng_schema', 'subject_math_schema', 
                            'subject_bio_schema', 'subject_chem_schema', 'subject_phy_schema',
                            'subject_geo_schema', 'subject_his_schema', 'subject_civ_schema',
                            'subject_eco_schema', 'subject_ict_schema', 'subject_sport_schema',
                            'subject_arabi_schema', 'subject_qur_schema', 'subject_taf_schema',
                            'subject_tar_schema', 'subject_safuu_schema', 'subject_saaynaannoo_schema',
                            'subject_agri_schema', 'subject_ao_schema', 'subject_g_s_schema', 'subject_soc_schema'];
BEGIN
    FOREACH schema_name IN ARRAY schemas
    LOOP
        EXECUTE format('DROP TABLE IF EXISTS %I.g8b_term_1', schema_name);
        EXECUTE format('DROP TABLE IF EXISTS %I.g8b_term_2', schema_name);
    END LOOP;
END $$;

SELECT 'Final G8 Students:' as info, COUNT(*) as count FROM classes_schema."G8";

COMMIT;

SELECT '✅ MERGE COMPLETE! G8A and G8B have been merged into G8' as status;
