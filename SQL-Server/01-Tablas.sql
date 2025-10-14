-- =============================================
-- PROYECTO: Sistema de Gestión de Estudios Médicos Distribuido
-- SERVIDOR: Microsoft SQL Server - Integración Externa
-- AUTOR: Fabián Vargas
-- FECHA: Octubre 2025
-- =============================================

IF EXISTS (SELECT name FROM sys.databases WHERE name = 'SistemaIntegracionMedica')
BEGIN
    ALTER DATABASE SistemaIntegracionMedica SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SistemaIntegracionMedica;
END
GO

-- Crear la base de datos
CREATE DATABASE SistemaIntegracionMedica;
GO

-- Usar la base de datos
USE SistemaIntegracionMedica;
GO



-- =============================================
-- TABLA 1: instituciones
-- Catálogo de hospitales, aseguradoras y clínicas
-- =============================================
CREATE TABLE instituciones (
    id_institucion INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(200) NOT NULL,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('hospital', 'aseguradora', 'clinica_externa', 'laboratorio')),
    codigo_externo VARCHAR(50) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BIT DEFAULT 1,
    fecha_registro DATETIME DEFAULT GETDATE()
);
GO

-- =============================================
-- TABLA 2: paciente_integracion
-- =============================================
CREATE TABLE paciente_integracion (
    id_paciente INT PRIMARY KEY,
    id_aseguradora INT,
    codigo_externo VARCHAR(50) UNIQUE NOT NULL,
    estado_facturacion VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (estado_facturacion IN ('pendiente', 'en_proceso', 'pagado', 'rechazado', 'anulado')),
    fecha_ultima_actualizacion DATETIME DEFAULT GETDATE(),
    notas_integracion VARCHAR(500),
    CONSTRAINT FK_paciente_aseguradora FOREIGN KEY (id_aseguradora)
        REFERENCES instituciones(id_institucion)
);
GO

-- =============================================
-- TABLA 3: convenios_hospitalarios
-- Acuerdos comerciales con instituciones externas
-- =============================================
CREATE TABLE convenios_hospitalarios (
    id_convenio INT PRIMARY KEY IDENTITY(1,1),
    id_institucion INT NOT NULL,
    nombre_convenio VARCHAR(200) NOT NULL,
    tipo_convenio VARCHAR(50) NOT NULL CHECK (tipo_convenio IN ('descuento', 'pago_directo', 'convenio_especial')),
    descuento_porcentaje DECIMAL(5,2) CHECK (descuento_porcentaje >= 0 AND descuento_porcentaje <= 100),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BIT DEFAULT 1,
    condiciones_especiales TEXT,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_convenio_institucion FOREIGN KEY (id_institucion)
        REFERENCES instituciones(id_institucion),
    CONSTRAINT CHK_fechas_convenio CHECK (fecha_fin IS NULL OR fecha_fin >= fecha_inicio)
);
GO

-- =============================================
-- TABLA 4: facturas_externas
-- Registro de facturación hacia sistemas externos
-- =============================================
CREATE TABLE facturas_externas (
    id_factura INT PRIMARY KEY IDENTITY(1,1),
    id_paciente INT NOT NULL,
    id_institucion INT NOT NULL,
    id_estudio INT NOT NULL,
    numero_factura VARCHAR(50) UNIQUE NOT NULL,
    codigo_estudio_externo VARCHAR(50),
    monto DECIMAL(10,2) NOT NULL CHECK (monto >= 0),
    descuento DECIMAL(10,2) DEFAULT 0 CHECK (descuento >= 0),
    monto_final AS (monto - descuento) PERSISTED,
    fecha_factura DATE NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    fecha_vencimiento DATE,
    estado VARCHAR(20) NOT NULL DEFAULT 'emitida'
        CHECK (estado IN ('emitida', 'enviada', 'pagada', 'parcial', 'anulada', 'rechazada')),
    metodo_pago VARCHAR(50),
    referencia_pago VARCHAR(100),
    fecha_pago DATETIME,
    notas VARCHAR(500),
    fecha_creacion DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_factura_paciente FOREIGN KEY (id_paciente)
        REFERENCES paciente_integracion(id_paciente),
    CONSTRAINT FK_factura_institucion FOREIGN KEY (id_institucion)
        REFERENCES instituciones(id_institucion),
    CONSTRAINT CHK_descuento_monto CHECK (descuento <= monto)
);
GO
