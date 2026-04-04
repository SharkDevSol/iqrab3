-- Create missing global_machine_ids table
CREATE SCHEMA IF NOT EXISTS school_schema_points;

DROP TABLE IF EXISTS school_schema_points.global_machine_ids;

CREATE TABLE school_schema_points.global_machine_ids (
  id SERIAL PRIMARY KEY,
  smachine_id VARCHAR(50) UNIQUE NOT NULL,
  student_name VARCHAR(255),
  class_name VARCHAR(50),
  school_id INTEGER,
  class_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_global_machine_ids_smachine_id 
ON school_schema_points.global_machine_ids(smachine_id);
