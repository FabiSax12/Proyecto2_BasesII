-- Índices para mejorar consultas frecuentes
CREATE INDEX idx_pacientes_cedula ON clinica.pacientes(cedula);
CREATE INDEX idx_citas_fecha ON clinica.citas(fecha);
CREATE INDEX idx_citas_paciente ON clinica.citas(id_paciente, region);
CREATE INDEX idx_estudios_tipo ON clinica.estudios(tipo_estudio);
CREATE INDEX idx_estudios_estado ON clinica.estudios(estado);
CREATE INDEX idx_medicos_especialidad ON clinica.medicos(especialidad);