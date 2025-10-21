CREATE TABLE clinica.pacientes (
    id_paciente SERIAL,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) NOT NULL,
    region VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE,
    telefono VARCHAR(20),
    PRIMARY KEY (id_paciente, region),
    UNIQUE (cedula, region)
) PARTITION BY LIST (region);

CREATE TABLE clinica.medicos (
    id_medico SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    especialidad VARCHAR(50)
);

CREATE TABLE clinica.citas (
    id_cita SERIAL PRIMARY KEY,
    id_paciente INT NOT NULL,
    region VARCHAR(50) NOT NULL,
    id_medico INT REFERENCES clinica.medicos(id_medico),
    fecha TIMESTAMP NOT NULL,
    tipo_estudio VARCHAR(100),
    FOREIGN KEY (id_paciente, region) REFERENCES clinica.pacientes(id_paciente, region)
);
CREATE TABLE clinica.diagnosticos (
    id_diag SERIAL PRIMARY KEY,
    id_cita INT REFERENCES clinica.citas(id_cita),
    descripcion TEXT,
    fecha TIMESTAMP DEFAULT now()
);

CREATE TABLE clinica.ordenes_medicas (
    id_orden SERIAL PRIMARY KEY,
    id_cita INT REFERENCES clinica.citas(id_cita),
    detalles TEXT,
    estado VARCHAR(20)
);

CREATE TABLE clinica.estudios (
    id_estudio SERIAL PRIMARY KEY,
    id_cita INT REFERENCES clinica.citas(id_cita),
    tipo_estudio VARCHAR(100) NOT NULL, -- 'Laboratorio', 'Radiografía', 'Ultrasonido', etc.
    fecha_realizacion TIMESTAMP DEFAULT now(),
    resultado TEXT,
    estado VARCHAR(20) DEFAULT 'Pendiente', -- 'Pendiente', 'En Proceso', 'Completado'
    archivo_adjunto VARCHAR(255), -- ruta o referencia
    observaciones TEXT
);
