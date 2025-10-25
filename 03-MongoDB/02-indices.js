use estudios_medicos_analytics;

db.resultados_estudios.createIndex({ "id_estudio": 1 }, { unique: true, name: "idx_id_estudio" });
db.resultados_estudios.createIndex({ "tipo_estudio": 1 }, { name: "idx_tipo_estudio" });
db.resultados_estudios.createIndex({ "fecha_realizacion": -1 }, { name: "idx_fecha_realizacion" });
db.resultados_estudios.createIndex({ "paciente.id_paciente": 1 }, { name: "idx_paciente_id" });
db.resultados_estudios.createIndex({ "medico.id_medico": 1 }, { name: "idx_medico_id" });
db.resultados_estudios.createIndex({ "clinica.region": 1 }, { name: "idx_clinica_region" });
db.resultados_estudios.createIndex({ "estado": 1 }, { name: "idx_estado" });
db.resultados_estudios.createIndex({
    "fecha_realizacion": -1,
    "clinica.region": 1
}, { name: "idx_fecha_region" });
db.resultados_estudios.createIndex({
    "tipo_estudio": 1,
    "estado": 1
}, { name: "idx_tipo_estado" });



db.indicadores_mensuales.createIndex({
    "periodo.año": 1,
    "periodo.mes": 1
}, { name: "idx_periodo" });
db.indicadores_mensuales.createIndex({ "clinica.id_clinica": 1 }, { name: "idx_clinica_id" });
db.indicadores_mensuales.createIndex({ "clinica.region": 1 }, { name: "idx_region" });
db.indicadores_mensuales.createIndex({
    "clinica.region": 1,
    "periodo.año": 1,
    "periodo.mes": 1
}, { name: "idx_region_periodo" });



db.reportes_medicos.createIndex({ "medico.id_medico": 1 }, { name: "idx_medico_id" });
db.reportes_medicos.createIndex({ "medico.especialidad": 1 }, { name: "idx_especialidad" });
db.reportes_medicos.createIndex({
    "periodo.fecha_inicio": 1,
    "periodo.fecha_fin": 1
}, { name: "idx_periodo_fechas" });
db.reportes_medicos.createIndex({ "periodo.tipo_periodo": 1 }, { name: "idx_tipo_periodo" });
db.reportes_medicos.createIndex({
    "medico.especialidad": 1,
    "periodo.tipo_periodo": 1
}, { name: "idx_especialidad_periodo" });

