use estudios_medicos_analytics;
db.dropDatabase();
use estudios_medicos_analytics;

// Colecciones
db.createCollection("resultados_estudios", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["id_estudio", "tipo_estudio", "fecha_realizacion", "paciente", "medico", "clinica"],
            properties: {
                id_estudio: {
                    bsonType: "int",
                    description: "ID único del estudio"
                },
                tipo_estudio: {
                    bsonType: "string",
                    enum: ["Laboratorio", "Rayos X", "Ultrasonido", "Tomografia", "Resonancia", "Electrocardiograma", "Endoscopia"],
                    description: "Tipo de estudio médico"
                },
                estado: {
                    bsonType: "string",
                    enum: ["Pendiente", "En Proceso", "Completado", "Cancelado"],
                    description: "Estado del estudio"
                }
            }
        }
    }
});

db.createCollection("indicadores_mensuales", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["periodo", "clinica", "estadisticas"],
            properties: {
                periodo: {
                    bsonType: "object",
                    required: ["año", "mes"]
                }
            }
        }
    }
});

db.createCollection("reportes_medicos", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["medico", "periodo", "metricas"],
            properties: {
                medico: {
                    bsonType: "object",
                    required: ["id_medico", "nombre_completo"]
                }
            }
        }
    }
});