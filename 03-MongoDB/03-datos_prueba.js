use estudios_medicos_analytics;


// Limpiando colecciones existentes
db.resultados_estudios.deleteMany({});
db.indicadores_mensuales.deleteMany({});
db.reportes_medicos.deleteMany({});



const estudios = [
    {
        id_estudio: 1001,
        tipo_estudio: "Laboratorio",
        fecha_realizacion: new Date("2025-01-15T08:30:00Z"),
        fecha_resultados: new Date("2025-01-15T14:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 501,
            nombre_completo: "María González Pérez",
            edad: 45,
            genero: "F"
        },
        medico: {
            id_medico: 101,
            nombre_completo: "Dr. Carlos Ramírez",
            especialidad: "Medicina Interna",
            codigo_medico: "MED-101"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "Glucosa", valor: 95, unidad: "mg/dL", rango_normal: "70-100" },
                { parametro: "Colesterol", valor: 180, unidad: "mg/dL", rango_normal: "<200" },
                { parametro: "Triglicéridos", valor: 140, unidad: "mg/dL", rango_normal: "<150" }
            ],
            diagnostico: "Valores normales",
            observaciones: "Paciente en condiciones saludables",
            urgente: false
        },
        costos: {
            costo_base: 35000,
            costo_adicional: 5000,
            costo_total: 40000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 15,
            equipo_utilizado: "Analizador Beckman AU680",
            tecnico_responsable: "Lic. Ana Mora"
        }
    },
    {
        id_estudio: 1002,
        tipo_estudio: "Rayos X",
        fecha_realizacion: new Date("2025-01-16T09:00:00Z"),
        fecha_resultados: new Date("2025-01-16T11:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 502,
            nombre_completo: "José Rodríguez Castro",
            edad: 58,
            genero: "M"
        },
        medico: {
            id_medico: 102,
            nombre_completo: "Dra. Laura Jiménez",
            especialidad: "Radiología",
            codigo_medico: "MED-102"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "Tórax PA", valor: "Normal", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Sin hallazgos patológicos",
            observaciones: "Campos pulmonares limpios, silueta cardíaca normal",
            urgente: false
        },
        costos: {
            costo_base: 25000,
            costo_adicional: 0,
            costo_total: 25000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 10,
            equipo_utilizado: "Siemens Ysio",
            tecnico_responsable: "Téc. Roberto Solís"
        }
    },
    {
        id_estudio: 1003,
        tipo_estudio: "Ultrasonido",
        fecha_realizacion: new Date("2025-01-18T10:15:00Z"),
        fecha_resultados: new Date("2025-01-18T11:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 503,
            nombre_completo: "Ana María Vargas",
            edad: 32,
            genero: "F"
        },
        medico: {
            id_medico: 103,
            nombre_completo: "Dr. Fernando Mora",
            especialidad: "Ginecología",
            codigo_medico: "MED-103"
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela",
            ciudad: "Alajuela"
        },
        resultados: {
            valores: [
                { parametro: "Útero", valor: "Normal", unidad: "N/A", rango_normal: "N/A" },
                { parametro: "Ovarios", valor: "Sin alteraciones", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Ultrasonido pélvico normal",
            observaciones: "Estructuras anatómicas sin alteraciones",
            urgente: false
        },
        costos: {
            costo_base: 45000,
            costo_adicional: 0,
            costo_total: 45000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 20,
            equipo_utilizado: "GE Voluson E8",
            tecnico_responsable: "Dr. Fernando Mora"
        }
    },
    {
        id_estudio: 1004,
        tipo_estudio: "Tomografia",
        fecha_realizacion: new Date("2025-01-20T14:00:00Z"),
        fecha_resultados: new Date("2025-01-20T16:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 504,
            nombre_completo: "Pedro Alvarado Sánchez",
            edad: 62,
            genero: "M"
        },
        medico: {
            id_medico: 102,
            nombre_completo: "Dra. Laura Jiménez",
            especialidad: "Radiología",
            codigo_medico: "MED-102"
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago",
            ciudad: "Cartago"
        },
        resultados: {
            valores: [
                { parametro: "TAC Cerebral", valor: "Anormal", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Lesión isquémica antigua en región temporal izquierda",
            observaciones: "Requiere seguimiento neurológico",
            urgente: true
        },
        costos: {
            costo_base: 180000,
            costo_adicional: 20000,
            costo_total: 200000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 45,
            equipo_utilizado: "Philips Brilliance 64",
            tecnico_responsable: "Téc. Gabriela Rojas"
        }
    },
    {
        id_estudio: 1005,
        tipo_estudio: "Resonancia",
        fecha_realizacion: new Date("2025-01-22T08:00:00Z"),
        fecha_resultados: new Date("2025-01-22T12:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 505,
            nombre_completo: "Carmen Herrera López",
            edad: 41,
            genero: "F"
        },
        medico: {
            id_medico: 104,
            nombre_completo: "Dr. Rodrigo Salazar",
            especialidad: "Ortopedia",
            codigo_medico: "MED-104"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "Rodilla Izquierda", valor: "Lesión meniscal", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Desgarro menisco medial",
            observaciones: "Se recomienda evaluación quirúrgica",
            urgente: false
        },
        costos: {
            costo_base: 250000,
            costo_adicional: 30000,
            costo_total: 280000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 60,
            equipo_utilizado: "Siemens Magnetom Aera 1.5T",
            tecnico_responsable: "Téc. Luis Mora"
        }
    },
    {
        id_estudio: 1006,
        tipo_estudio: "Electrocardiograma",
        fecha_realizacion: new Date("2025-01-23T09:30:00Z"),
        fecha_resultados: new Date("2025-01-23T10:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 506,
            nombre_completo: "Roberto Méndez Arias",
            edad: 55,
            genero: "M"
        },
        medico: {
            id_medico: 105,
            nombre_completo: "Dr. Alberto Quesada",
            especialidad: "Cardiología",
            codigo_medico: "MED-105"
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela",
            ciudad: "Alajuela"
        },
        resultados: {
            valores: [
                { parametro: "Ritmo", valor: "Sinusal", unidad: "N/A", rango_normal: "60-100 lpm" },
                { parametro: "FC", valor: 72, unidad: "lpm", rango_normal: "60-100" }
            ],
            diagnostico: "ECG normal",
            observaciones: "Ritmo sinusal, sin alteraciones",
            urgente: false
        },
        costos: {
            costo_base: 15000,
            costo_adicional: 0,
            costo_total: 15000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 15,
            equipo_utilizado: "GE MAC 2000",
            tecnico_responsable: "Enf. Patricia Vega"
        }
    },
    {
        id_estudio: 1007,
        tipo_estudio: "Laboratorio",
        fecha_realizacion: new Date("2025-01-25T07:45:00Z"),
        fecha_resultados: new Date("2025-01-25T13:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 507,
            nombre_completo: "Silvia Rojas Montero",
            edad: 38,
            genero: "F"
        },
        medico: {
            id_medico: 101,
            nombre_completo: "Dr. Carlos Ramírez",
            especialidad: "Medicina Interna",
            codigo_medico: "MED-101"
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago",
            ciudad: "Cartago"
        },
        resultados: {
            valores: [
                { parametro: "Hemoglobina", valor: 13.5, unidad: "g/dL", rango_normal: "12-16" },
                { parametro: "Leucocitos", valor: 7200, unidad: "/mm³", rango_normal: "4000-11000" },
                { parametro: "Plaquetas", valor: 250000, unidad: "/mm³", rango_normal: "150000-400000" }
            ],
            diagnostico: "Hemograma completo normal",
            observaciones: "Valores dentro de parámetros normales",
            urgente: false
        },
        costos: {
            costo_base: 28000,
            costo_adicional: 0,
            costo_total: 28000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 20,
            equipo_utilizado: "Sysmex XN-1000",
            tecnico_responsable: "Lic. María Solís"
        }
    },
    {
        id_estudio: 1008,
        tipo_estudio: "Ultrasonido",
        fecha_realizacion: new Date("2025-01-26T11:00:00Z"),
        fecha_resultados: new Date("2025-01-26T12:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 508,
            nombre_completo: "Manuel Vargas Cruz",
            edad: 48,
            genero: "M"
        },
        medico: {
            id_medico: 106,
            nombre_completo: "Dra. Patricia Solano",
            especialidad: "Gastroenterología",
            codigo_medico: "MED-106"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "Hígado", valor: "Esteatosis leve", unidad: "N/A", rango_normal: "N/A" },
                { parametro: "Vesícula", valor: "Sin cálculos", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Esteatosis hepática grado I",
            observaciones: "Se recomienda control de peso y dieta",
            urgente: false
        },
        costos: {
            costo_base: 42000,
            costo_adicional: 8000,
            costo_total: 50000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 25,
            equipo_utilizado: "Philips EPIQ 5",
            tecnico_responsable: "Dra. Patricia Solano"
        }
    },
    {
        id_estudio: 1009,
        tipo_estudio: "Endoscopia",
        fecha_realizacion: new Date("2025-01-28T13:00:00Z"),
        fecha_resultados: new Date("2025-01-28T15:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 509,
            nombre_completo: "Elena Portuguez Díaz",
            edad: 51,
            genero: "F"
        },
        medico: {
            id_medico: 106,
            nombre_completo: "Dra. Patricia Solano",
            especialidad: "Gastroenterología",
            codigo_medico: "MED-106"
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela",
            ciudad: "Alajuela"
        },
        resultados: {
            valores: [
                { parametro: "Esófago", valor: "Normal", unidad: "N/A", rango_normal: "N/A" },
                { parametro: "Estómago", valor: "Gastritis leve", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Gastritis antral leve",
            observaciones: "Se toma biopsia para H. pylori",
            urgente: false
        },
        costos: {
            costo_base: 120000,
            costo_adicional: 25000,
            costo_total: 145000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 30,
            equipo_utilizado: "Olympus EVIS EXERA III",
            tecnico_responsable: "Dra. Patricia Solano"
        }
    },
    {
        id_estudio: 1010,
        tipo_estudio: "Rayos X",
        fecha_realizacion: new Date("2025-01-29T08:15:00Z"),
        fecha_resultados: new Date("2025-01-29T10:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 510,
            nombre_completo: "Diego Mata Fernández",
            edad: 29,
            genero: "M"
        },
        medico: {
            id_medico: 104,
            nombre_completo: "Dr. Rodrigo Salazar",
            especialidad: "Ortopedia",
            codigo_medico: "MED-104"
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago",
            ciudad: "Cartago"
        },
        resultados: {
            valores: [
                { parametro: "Tobillo Derecho", valor: "Fractura", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Fractura maleolar lateral",
            observaciones: "Requiere inmovilización y seguimiento",
            urgente: true
        },
        costos: {
            costo_base: 22000,
            costo_adicional: 0,
            costo_total: 22000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 15,
            equipo_utilizado: "Canon CXDI-810C",
            tecnico_responsable: "Téc. Jorge Blanco"
        }
    },
    {
        id_estudio: 1011,
        tipo_estudio: "Laboratorio",
        fecha_realizacion: new Date("2025-02-01T08:00:00Z"),
        fecha_resultados: new Date("2025-02-01T14:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 511,
            nombre_completo: "Lucía Campos Ramírez",
            edad: 67,
            genero: "F"
        },
        medico: {
            id_medico: 105,
            nombre_completo: "Dr. Alberto Quesada",
            especialidad: "Cardiología",
            codigo_medico: "MED-105"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "Colesterol Total", valor: 240, unidad: "mg/dL", rango_normal: "<200" },
                { parametro: "LDL", valor: 160, unidad: "mg/dL", rango_normal: "<100" },
                { parametro: "HDL", valor: 45, unidad: "mg/dL", rango_normal: ">40" },
                { parametro: "Triglicéridos", valor: 185, unidad: "mg/dL", rango_normal: "<150" }
            ],
            diagnostico: "Dislipidemia mixta",
            observaciones: "Requiere manejo farmacológico y modificación de estilo de vida",
            urgente: false
        },
        costos: {
            costo_base: 38000,
            costo_adicional: 7000,
            costo_total: 45000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 18,
            equipo_utilizado: "Roche Cobas c311",
            tecnico_responsable: "Lic. Fernando Rojas"
        }
    },
    {
        id_estudio: 1012,
        tipo_estudio: "Tomografia",
        fecha_realizacion: new Date("2025-02-03T10:30:00Z"),
        fecha_resultados: new Date("2025-02-03T14:00:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 512,
            nombre_completo: "Andrés Villalobos Salas",
            edad: 44,
            genero: "M"
        },
        medico: {
            id_medico: 102,
            nombre_completo: "Dra. Laura Jiménez",
            especialidad: "Radiología",
            codigo_medico: "MED-102"
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela",
            ciudad: "Alajuela"
        },
        resultados: {
            valores: [
                { parametro: "TAC Abdomen", valor: "Normal", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Sin hallazgos patológicos",
            observaciones: "Órganos abdominales sin alteraciones",
            urgente: false
        },
        costos: {
            costo_base: 175000,
            costo_adicional: 15000,
            costo_total: 190000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 40,
            equipo_utilizado: "GE LightSpeed VCT",
            tecnico_responsable: "Téc. María Castro"
        }
    },
    {
        id_estudio: 1013,
        tipo_estudio: "Electrocardiograma",
        fecha_realizacion: new Date("2025-02-05T09:00:00Z"),
        fecha_resultados: new Date("2025-02-05T09:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 513,
            nombre_completo: "Gabriela Núñez Vega",
            edad: 60,
            genero: "F"
        },
        medico: {
            id_medico: 105,
            nombre_completo: "Dr. Alberto Quesada",
            especialidad: "Cardiología",
            codigo_medico: "MED-105"
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago",
            ciudad: "Cartago"
        },
        resultados: {
            valores: [
                { parametro: "Ritmo", valor: "Fibrilación Auricular", unidad: "N/A", rango_normal: "Sinusal" },
                { parametro: "FC", valor: 110, unidad: "lpm", rango_normal: "60-100" }
            ],
            diagnostico: "Fibrilación auricular con respuesta ventricular rápida",
            observaciones: "Requiere anticoagulación y control de frecuencia",
            urgente: true
        },
        costos: {
            costo_base: 15000,
            costo_adicional: 0,
            costo_total: 15000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 15,
            equipo_utilizado: "Philips PageWriter TC70",
            tecnico_responsable: "Enf. Carlos Mejías"
        }
    },
    {
        id_estudio: 1014,
        tipo_estudio: "Resonancia",
        fecha_realizacion: new Date("2025-02-07T13:00:00Z"),
        fecha_resultados: new Date("2025-02-07T16:30:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 514,
            nombre_completo: "Fernando Chaves Mora",
            edad: 52,
            genero: "M"
        },
        medico: {
            id_medico: 107,
            nombre_completo: "Dr. Miguel Ángel Brenes",
            especialidad: "Neurología",
            codigo_medico: "MED-107"
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José",
            ciudad: "San José"
        },
        resultados: {
            valores: [
                { parametro: "RM Cerebral", valor: "Microangiopatía", unidad: "N/A", rango_normal: "N/A" }
            ],
            diagnostico: "Cambios microangiopáticos relacionados con edad",
            observaciones: "Control de factores de riesgo cardiovascular",
            urgente: false
        },
        costos: {
            costo_base: 260000,
            costo_adicional: 40000,
            costo_total: 300000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 55,
            equipo_utilizado: "Philips Ingenia 3.0T",
            tecnico_responsable: "Téc. Andrea Solís"
        }
    },
    {
        id_estudio: 1015,
        tipo_estudio: "Ultrasonido",
        fecha_realizacion: new Date("2025-02-09T10:00:00Z"),
        fecha_resultados: new Date("2025-02-09T11:15:00Z"),
        estado: "Completado",
        paciente: {
            id_paciente: 515,
            nombre_completo: "Sofía Mora Jiménez",
            edad: 28,
            genero: "F"
        },
        medico: {
            id_medico: 103,
            nombre_completo: "Dr. Fernando Mora",
            especialidad: "Ginecología",
            codigo_medico: "MED-103"
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela",
            ciudad: "Alajuela"
        },
        resultados: {
            valores: [
                { parametro: "Feto", valor: "Viable", unidad: "N/A", rango_normal: "N/A" },
                { parametro: "Edad Gestacional", valor: 12, unidad: "semanas", rango_normal: "N/A" }
            ],
            diagnostico: "Embarazo intrauterino único de 12 semanas",
            observaciones: "Feto con actividad cardíaca presente",
            urgente: false
        },
        costos: {
            costo_base: 50000,
            costo_adicional: 0,
            costo_total: 50000,
            moneda: "CRC"
        },
        metadatos: {
            duracion_minutos: 30,
            equipo_utilizado: "Samsung WS80A",
            tecnico_responsable: "Dr. Fernando Mora"
        }
    }
];

db.resultados_estudios.insertMany(estudios);




const indicadores = [
    {
        periodo: {
            año: 2025,
            mes: 1,
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z")
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José"
        },
        estadisticas: {
            total_estudios: 6,
            estudios_por_tipo: {
                "Laboratorio": 2,
                "Rayos X": 1,
                "Resonancia": 1,
                "Ultrasonido": 1,
                "Tomografia": 0,
                "Electrocardiograma": 0
            },
            estudios_urgentes: 0,
            pacientes_unicos: 6,
            medicos_activos: 4
        },
        productividad: {
            promedio_estudios_dia: 0.19,
            tiempo_promedio_resultados_horas: 3.5,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 630000,
            ingreso_promedio_estudio: 105000,
            top_estudios_ingreso: [
                { tipo: "Resonancia", ingresos: 280000 },
                { tipo: "Ultrasonido", ingresos: 50000 },
                { tipo: "Laboratorio", ingresos: 85000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 4.7,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    },
    {
        periodo: {
            año: 2025,
            mes: 1,
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z")
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela"
        },
        estadisticas: {
            total_estudios: 3,
            estudios_por_tipo: {
                "Ultrasonido": 1,
                "Electrocardiograma": 1,
                "Endoscopia": 1,
                "Laboratorio": 0,
                "Rayos X": 0
            },
            estudios_urgentes: 0,
            pacientes_unicos: 3,
            medicos_activos: 3
        },
        productividad: {
            promedio_estudios_dia: 0.10,
            tiempo_promedio_resultados_horas: 1.8,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 210000,
            ingreso_promedio_estudio: 70000,
            top_estudios_ingreso: [
                { tipo: "Endoscopia", ingresos: 145000 },
                { tipo: "Ultrasonido", ingresos: 45000 },
                { tipo: "Electrocardiograma", ingresos: 15000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 4.5,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    },
    {
        periodo: {
            año: 2025,
            mes: 1,
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z")
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago"
        },
        estadisticas: {
            total_estudios: 3,
            estudios_por_tipo: {
                "Tomografia": 1,
                "Laboratorio": 1,
                "Rayos X": 1,
                "Ultrasonido": 0
            },
            estudios_urgentes: 2,
            pacientes_unicos: 3,
            medicos_activos: 3
        },
        productividad: {
            promedio_estudios_dia: 0.10,
            tiempo_promedio_resultados_horas: 2.5,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 250000,
            ingreso_promedio_estudio: 83333,
            top_estudios_ingreso: [
                { tipo: "Tomografia", ingresos: 200000 },
                { tipo: "Laboratorio", ingresos: 28000 },
                { tipo: "Rayos X", ingresos: 22000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 4.8,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    },
    {
        periodo: {
            año: 2025,
            mes: 2,
            fecha_inicio: new Date("2025-02-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z")
        },
        clinica: {
            id_clinica: 1,
            nombre: "Clínica San José Centro",
            region: "San José"
        },
        estadisticas: {
            total_estudios: 2,
            estudios_por_tipo: {
                "Laboratorio": 1,
                "Resonancia": 1,
                "Rayos X": 0
            },
            estudios_urgentes: 0,
            pacientes_unicos: 2,
            medicos_activos: 2
        },
        productividad: {
            promedio_estudios_dia: 0.07,
            tiempo_promedio_resultados_horas: 4.0,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 345000,
            ingreso_promedio_estudio: 172500,
            top_estudios_ingreso: [
                { tipo: "Resonancia", ingresos: 300000 },
                { tipo: "Laboratorio", ingresos: 45000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 4.9,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    },
    {
        periodo: {
            año: 2025,
            mes: 2,
            fecha_inicio: new Date("2025-02-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z")
        },
        clinica: {
            id_clinica: 2,
            nombre: "Clínica Alajuela Norte",
            region: "Alajuela"
        },
        estadisticas: {
            total_estudios: 2,
            estudios_por_tipo: {
                "Tomografia": 1,
                "Ultrasonido": 1,
                "Laboratorio": 0
            },
            estudios_urgentes: 0,
            pacientes_unicos: 2,
            medicos_activos: 2
        },
        productividad: {
            promedio_estudios_dia: 0.07,
            tiempo_promedio_resultados_horas: 3.0,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 240000,
            ingreso_promedio_estudio: 120000,
            top_estudios_ingreso: [
                { tipo: "Tomografia", ingresos: 190000 },
                { tipo: "Ultrasonido", ingresos: 50000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 4.6,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    },
    {
        periodo: {
            año: 2025,
            mes: 2,
            fecha_inicio: new Date("2025-02-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z")
        },
        clinica: {
            id_clinica: 3,
            nombre: "Clínica Cartago Central",
            region: "Cartago"
        },
        estadisticas: {
            total_estudios: 1,
            estudios_por_tipo: {
                "Electrocardiograma": 1,
                "Laboratorio": 0
            },
            estudios_urgentes: 1,
            pacientes_unicos: 1,
            medicos_activos: 1
        },
        productividad: {
            promedio_estudios_dia: 0.04,
            tiempo_promedio_resultados_horas: 0.5,
            tasa_completitud: 100.0
        },
        financiero: {
            ingresos_totales: 15000,
            ingreso_promedio_estudio: 15000,
            top_estudios_ingreso: [
                { tipo: "Electrocardiograma", ingresos: 15000 }
            ]
        },
        calidad: {
            satisfaccion_promedio: 5.0,
            estudios_repetidos: 0,
            tasa_error: 0.0
        }
    }
];

db.indicadores_mensuales.insertMany(indicadores);



const reportes = [
    {
        medico: {
            id_medico: 101,
            nombre_completo: "Dr. Carlos Ramírez",
            especialidad: "Medicina Interna",
            años_experiencia: 15
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z"),
            tipo_periodo: "Mensual"
        },
        metricas: {
            total_estudios_realizados: 2,
            estudios_por_tipo: {
                "Laboratorio": 2
            },
            pacientes_atendidos: 2,
            promedio_estudios_dia: 0.06
        },
        desempeño: {
            tiempo_promedio_entrega: 5.5,
            estudios_completados_a_tiempo: 2,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 0
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Laboratorio Clínico", cantidad: 2 }
            ],
            complejidad_promedio: "Media",
            tasa_referencia: 0.0
        },
        financiero: {
            ingresos_generados: 68000,
            costo_promedio_estudio: 34000
        },
        rankings: {
            ranking_clinica: 3,
            ranking_regional: 8,
            ranking_nacional: 45
        }
    },
    {
        medico: {
            id_medico: 102,
            nombre_completo: "Dra. Laura Jiménez",
            especialidad: "Radiología",
            años_experiencia: 12
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z"),
            tipo_periodo: "Mensual"
        },
        metricas: {
            total_estudios_realizados: 2,
            estudios_por_tipo: {
                "Rayos X": 1,
                "Tomografia": 1
            },
            pacientes_atendidos: 2,
            promedio_estudios_dia: 0.06
        },
        desempeño: {
            tiempo_promedio_entrega: 2.5,
            estudios_completados_a_tiempo: 2,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 1
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Imagenología Avanzada", cantidad: 2 }
            ],
            complejidad_promedio: "Alta",
            tasa_referencia: 0.0
        },
        financiero: {
            ingresos_generados: 225000,
            costo_promedio_estudio: 112500
        },
        rankings: {
            ranking_clinica: 1,
            ranking_regional: 2,
            ranking_nacional: 15
        }
    },
    {
        medico: {
            id_medico: 103,
            nombre_completo: "Dr. Fernando Mora",
            especialidad: "Ginecología",
            años_experiencia: 18
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z"),
            tipo_periodo: "Bimestral"
        },
        metricas: {
            total_estudios_realizados: 2,
            estudios_por_tipo: {
                "Ultrasonido": 2
            },
            pacientes_atendidos: 2,
            promedio_estudios_dia: 0.03
        },
        desempeño: {
            tiempo_promedio_entrega: 1.0,
            estudios_completados_a_tiempo: 2,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 0
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Ultrasonido Ginecológico", cantidad: 1 },
                { tipo: "Ultrasonido Obstétrico", cantidad: 1 }
            ],
            complejidad_promedio: "Media",
            tasa_referencia: 0.0
        },
        financiero: {
            ingresos_generados: 95000,
            costo_promedio_estudio: 47500
        },
        rankings: {
            ranking_clinica: 2,
            ranking_regional: 5,
            ranking_nacional: 28
        }
    },
    {
        medico: {
            id_medico: 104,
            nombre_completo: "Dr. Rodrigo Salazar",
            especialidad: "Ortopedia",
            años_experiencia: 10
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z"),
            tipo_periodo: "Mensual"
        },
        metricas: {
            total_estudios_realizados: 2,
            estudios_por_tipo: {
                "Resonancia": 1,
                "Rayos X": 1
            },
            pacientes_atendidos: 2,
            promedio_estudios_dia: 0.06
        },
        desempeño: {
            tiempo_promedio_entrega: 3.0,
            estudios_completados_a_tiempo: 2,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 1
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Imagenología Musculoesquelética", cantidad: 2 }
            ],
            complejidad_promedio: "Alta",
            tasa_referencia: 0.15
        },
        financiero: {
            ingresos_generados: 302000,
            costo_promedio_estudio: 151000
        },
        rankings: {
            ranking_clinica: 1,
            ranking_regional: 1,
            ranking_nacional: 8
        }
    },
    {
        medico: {
            id_medico: 105,
            nombre_completo: "Dr. Alberto Quesada",
            especialidad: "Cardiología",
            años_experiencia: 20
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z"),
            tipo_periodo: "Bimestral"
        },
        metricas: {
            total_estudios_realizados: 3,
            estudios_por_tipo: {
                "Electrocardiograma": 2,
                "Laboratorio": 1
            },
            pacientes_atendidos: 3,
            promedio_estudios_dia: 0.05
        },
        desempeño: {
            tiempo_promedio_entrega: 2.0,
            estudios_completados_a_tiempo: 3,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 1
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Electrocardiografía", cantidad: 2 },
                { tipo: "Perfil Lipídico", cantidad: 1 }
            ],
            complejidad_promedio: "Media",
            tasa_referencia: 0.10
        },
        financiero: {
            ingresos_generados: 75000,
            costo_promedio_estudio: 25000
        },
        rankings: {
            ranking_clinica: 4,
            ranking_regional: 6,
            ranking_nacional: 32
        }
    },
    {
        medico: {
            id_medico: 106,
            nombre_completo: "Dra. Patricia Solano",
            especialidad: "Gastroenterología",
            años_experiencia: 14
        },
        periodo: {
            fecha_inicio: new Date("2025-01-01T00:00:00Z"),
            fecha_fin: new Date("2025-01-31T23:59:59Z"),
            tipo_periodo: "Mensual"
        },
        metricas: {
            total_estudios_realizados: 2,
            estudios_por_tipo: {
                "Ultrasonido": 1,
                "Endoscopia": 1
            },
            pacientes_atendidos: 2,
            promedio_estudios_dia: 0.06
        },
        desempeño: {
            tiempo_promedio_entrega: 2.0,
            estudios_completados_a_tiempo: 2,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 0
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Ultrasonido Abdominal", cantidad: 1 },
                { tipo: "Endoscopia Digestiva", cantidad: 1 }
            ],
            complejidad_promedio: "Alta",
            tasa_referencia: 0.05
        },
        financiero: {
            ingresos_generados: 195000,
            costo_promedio_estudio: 97500
        },
        rankings: {
            ranking_clinica: 2,
            ranking_regional: 3,
            ranking_nacional: 18
        }
    },
    {
        medico: {
            id_medico: 107,
            nombre_completo: "Dr. Miguel Ángel Brenes",
            especialidad: "Neurología",
            años_experiencia: 16
        },
        periodo: {
            fecha_inicio: new Date("2025-02-01T00:00:00Z"),
            fecha_fin: new Date("2025-02-28T23:59:59Z"),
            tipo_periodo: "Mensual"
        },
        metricas: {
            total_estudios_realizados: 1,
            estudios_por_tipo: {
                "Resonancia": 1
            },
            pacientes_atendidos: 1,
            promedio_estudios_dia: 0.04
        },
        desempeño: {
            tiempo_promedio_entrega: 3.5,
            estudios_completados_a_tiempo: 1,
            tasa_cumplimiento: 100.0,
            casos_urgentes_atendidos: 0
        },
        especialidad_detalle: {
            estudios_especializados: [
                { tipo: "Resonancia Cerebral", cantidad: 1 }
            ],
            complejidad_promedio: "Alta",
            tasa_referencia: 0.20
        },
        financiero: {
            ingresos_generados: 300000,
            costo_promedio_estudio: 300000
        },
        rankings: {
            ranking_clinica: 1,
            ranking_regional: 1,
            ranking_nacional: 5
        }
    }
];

db.reportes_medicos.insertMany(reportes);
