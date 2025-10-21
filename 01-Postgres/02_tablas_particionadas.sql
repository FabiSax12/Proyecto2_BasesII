CREATE TABLE clinica.pacientes_san_jose PARTITION OF clinica.pacientes
    FOR VALUES IN ('San José');

CREATE TABLE clinica.pacientes_alajuela PARTITION OF clinica.pacientes
    FOR VALUES IN ('Alajuela');

CREATE TABLE clinica.pacientes_cartago PARTITION OF clinica.pacientes
    FOR VALUES IN ('Cartago');

CREATE TABLE clinica.pacientes_heredia PARTITION OF clinica.pacientes
    FOR VALUES IN ('Heredia');

CREATE TABLE clinica.pacientes_guanacaste PARTITION OF clinica.pacientes
    FOR VALUES IN ('Guanacaste');

CREATE TABLE clinica.pacientes_puntarenas PARTITION OF clinica.pacientes
    FOR VALUES IN ('Puntarenas');

CREATE TABLE clinica.pacientes_limon PARTITION OF clinica.pacientes
    FOR VALUES IN ('Limón');
