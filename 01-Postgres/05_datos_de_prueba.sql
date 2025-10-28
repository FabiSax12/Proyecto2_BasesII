-- Médicos
INSERT INTO clinica.medicos(nombre, especialidad) VALUES
('Dr. Juan Pérez', 'Cardiología'),
('Dra. María González', 'Radiología'),
('Dr. Pedro Ramírez', 'Medicina General');

-- Pacientes de diferentes regiones
INSERT INTO clinica.pacientes(nombre, cedula, region, fecha_nacimiento, telefono) VALUES
('Luis Hernández', '301330133', 'Cartago', '1990-08-22', '8899-7766'),
('María Solís', '401440144', 'Heredia', '1985-11-30', '8866-5544'),
('José Vargas', '501550155', 'Guanacaste', '1978-03-15', '8855-4433'),
('Ana Mora', '101110111', 'San José', '1995-05-10', '8888-9999'),
('Carlos Soto', '201220122', 'Alajuela', '1987-02-14', '8877-6655');

-- Citas
INSERT INTO clinica.citas(id_paciente, region, id_medico, fecha, tipo_estudio) VALUES
(4, 'San José', 1, '2025-11-20 09:00:00', 'Electrocardiograma'),
(5, 'Alajuela', 3, '2025-11-21 10:30:00', 'Consulta General');

-- Estudios
INSERT INTO clinica.estudios(id_cita, tipo_estudio, resultado, estado) VALUES
(1, 'Electrocardiograma', 'Resultados normales', 'Completado'),
(2, 'Laboratorio Clínico', NULL, 'Pendiente');
