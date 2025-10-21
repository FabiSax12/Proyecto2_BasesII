-- Agregar constraints de validación
ALTER TABLE clinica.citas ADD CONSTRAINT check_fecha_futura
    CHECK (fecha >= CURRENT_DATE);

ALTER TABLE clinica.pacientes ADD CONSTRAINT check_telefono_formato
    CHECK (telefono ~ '^\d{4}-\d{4}$');

ALTER TABLE clinica.ordenes_medicas ADD CONSTRAINT check_estado_valido
    CHECK (estado IN ('Pendiente', 'En Proceso', 'Completada', 'Cancelada'));

ALTER TABLE clinica.estudios ADD CONSTRAINT check_estado_estudio
    CHECK (estado IN ('Pendiente', 'En Proceso', 'Completado', 'Cancelado'));