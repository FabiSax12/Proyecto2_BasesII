-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS postgres_fdw;
CREATE EXTENSION IF NOT EXISTS tds_fdw;  -- debe instalarse desde Google para que funcione

-- Crear roles para FDW
CREATE ROLE usuario_fdw_sql WITH LOGIN PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE gestion_estudios TO usuario_fdw_sql;
GRANT USAGE ON SCHEMA clinica TO usuario_fdw_sql;
