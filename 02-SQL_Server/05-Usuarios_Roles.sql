
USE master;
GO

-- =============================================
-- USUARIO 1: usr_fdw_pg_mssql
-- Propósito: Conexión desde PostgreSQL mediante FDW
-- Permisos: SOLO LECTURA y ejecución de SPs específicos
-- =============================================

-- Eliminar si existe
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'usr_fdw_pg_mssql')
BEGIN
    DROP LOGIN usr_fdw_pg_mssql;
END
GO

-- Crear LOGIN
CREATE LOGIN usr_fdw_pg_mssql
WITH PASSWORD = 'FDW_PostgreSQL_2025!',
     DEFAULT_DATABASE = SistemaIntegracionMedica,
     CHECK_POLICY = OFF;
GO

-- Cambiar a la base de datos
USE SistemaIntegracionMedica;
GO

-- Eliminar usuario si existe
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'usr_fdw_pg_mssql')
BEGIN
    DROP USER usr_fdw_pg_mssql;
END
GO

-- Crear USER en la base de datos
CREATE USER usr_fdw_pg_mssql FOR LOGIN usr_fdw_pg_mssql;
GO


-- Asignar permisos de SOLO LECTURA en todas las tablas
GRANT SELECT ON instituciones TO usr_fdw_pg_mssql;
GRANT SELECT ON paciente_integracion TO usr_fdw_pg_mssql;
GRANT SELECT ON convenios_hospitalarios TO usr_fdw_pg_mssql;
GRANT SELECT ON facturas_externas TO usr_fdw_pg_mssql;
GO


-- Permitir ejecución de procedimientos específicos (solo consultas, no modificaciones)
GRANT EXECUTE ON sp_resumen_facturacion_institucion TO usr_fdw_pg_mssql;
GRANT EXECUTE ON sp_consultar_estado_paciente TO usr_fdw_pg_mssql;
GRANT EXECUTE ON sp_reporte_convenios_activos TO usr_fdw_pg_mssql;
GRANT EXECUTE ON sp_resumen_mensual_aseguradora TO usr_fdw_pg_mssql;
GRANT EXECUTE ON sp_facturas_proximas_vencer TO usr_fdw_pg_mssql;
GO




-- =============================================
-- USUARIO 2: usr_admin (Administrador completo)
-- Propósito: Mantenimiento y administración
-- Permisos: Control total
-- =============================================

USE master;
GO

-- Eliminar si existe
IF EXISTS (SELECT * FROM sys.server_principals WHERE name = 'usr_admin')
BEGIN
    DROP LOGIN usr_admin;
END
GO

-- Crear LOGIN
CREATE LOGIN usr_admin
WITH PASSWORD = 'Admin_SuperSecure_2025!',
     DEFAULT_DATABASE = SistemaIntegracionMedica,
     CHECK_POLICY = ON;
GO

USE SistemaIntegracionMedica;
GO

-- Eliminar usuario si existe
IF EXISTS (SELECT * FROM sys.database_principals WHERE name = 'usr_admin')
BEGIN
    DROP USER usr_admin;
END
GO

-- Crear USER
CREATE USER usr_admin FOR LOGIN usr_admin;
GO

-- Agregar al rol db_owner (control total)
ALTER ROLE db_owner ADD MEMBER usr_admin;
GO
