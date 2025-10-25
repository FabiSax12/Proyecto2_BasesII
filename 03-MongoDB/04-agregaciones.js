use estudios_medicos_analytics;


// CONSULTA 1: Top 10 Médicos Más Productivos por Región
const consulta1 = db.resultados_estudios.aggregate([
    {
        $group: {
            _id: {
                medico_id: "$medico.id_medico",
                medico_nombre: "$medico.nombre_completo",
                especialidad: "$medico.especialidad",
                region: "$clinica.region"
            },
            total_estudios: { $sum: 1 },
            estudios_urgentes: {
                $sum: { $cond: ["$resultados.urgente", 1, 0] }
            },
            ingresos_totales: { $sum: "$costos.costo_total" },
            tiempo_promedio_entrega: {
                $avg: {
                    $divide: [
                        { $subtract: ["$fecha_resultados", "$fecha_realizacion"] },
                        3600000
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            medico_id: "$_id.medico_id",
            medico_nombre: "$_id.medico_nombre",
            especialidad: "$_id.especialidad",
            region: "$_id.region",
            total_estudios: 1,
            estudios_urgentes: 1,
            ingresos_totales: 1,
            tiempo_promedio_entrega_horas: { $round: ["$tiempo_promedio_entrega", 2] },
            ingreso_promedio_estudio: {
                $round: [{ $divide: ["$ingresos_totales", "$total_estudios"] }, 0]
            }
        }
    },
    {
        $sort: { total_estudios: -1, ingresos_totales: -1 }
    },
    {
        $limit: 10
    }
]);

print("Top 10 Médicos Más Productivos:");
consulta1.forEach(doc => printjson(doc));



// CONSULTA 2: Tendencia de Estudios por Tipo (Últimos Meses)
const consulta2 = db.resultados_estudios.aggregate([
    {
        $addFields: {
            año: { $year: "$fecha_realizacion" },
            mes: { $month: "$fecha_realizacion" }
        }
    },
    {
        $group: {
            _id: {
                año: "$año",
                mes: "$mes",
                tipo_estudio: "$tipo_estudio"
            },
            cantidad: { $sum: 1 },
            ingresos: { $sum: "$costos.costo_total" },
            urgentes: {
                $sum: { $cond: ["$resultados.urgente", 1, 0] }
            }
        }
    },
    {
        $project: {
            _id: 0,
            periodo: {
                $concat: [
                    { $toString: "$_id.año" },
                    "-",
                    {
                        $cond: [
                            { $lt: ["$_id.mes", 10] },
                            { $concat: ["0", { $toString: "$_id.mes" }] },
                            { $toString: "$_id.mes" }
                        ]
                    }
                ]
            },
            tipo_estudio: "$_id.tipo_estudio",
            cantidad: 1,
            ingresos: 1,
            urgentes: 1,
            porcentaje_urgentes: {
                $round: [
                    { $multiply: [{ $divide: ["$urgentes", "$cantidad"] }, 100] },
                    2
                ]
            }
        }
    },
    {
        $sort: { periodo: 1, cantidad: -1 }
    }
]);

print("Tendencia de Estudios por Tipo:");
consulta2.forEach(doc => printjson(doc));



// CONSULTA 3: Análisis de Rentabilidad por Clínica
const consulta3 = db.resultados_estudios.aggregate([
    {
        $group: {
            _id: {
                clinica_id: "$clinica.id_clinica",
                clinica_nombre: "$clinica.nombre",
                region: "$clinica.region"
            },
            total_estudios: { $sum: 1 },
            ingresos_totales: { $sum: "$costos.costo_total" },
            costo_base_total: { $sum: "$costos.costo_base" },
            costo_adicional_total: { $sum: "$costos.costo_adicional" },
            estudios_urgentes: {
                $sum: { $cond: ["$resultados.urgente", 1, 0] }
            },
            tiempo_promedio_duracion: { $avg: "$metadatos.duracion_minutos" },
            tipos_estudio: { $addToSet: "$tipo_estudio" }
        }
    },
    {
        $project: {
            _id: 0,
            clinica_id: "$_id.clinica_id",
            clinica_nombre: "$_id.clinica_nombre",
            region: "$_id.region",
            total_estudios: 1,
            ingresos_totales: 1,
            ingreso_promedio: {
                $round: [{ $divide: ["$ingresos_totales", "$total_estudios"] }, 0]
            },
            margen_bruto: {
                $round: [{ $subtract: ["$ingresos_totales", "$costo_base_total"] }, 0]
            },
            porcentaje_urgentes: {
                $round: [
                    { $multiply: [{ $divide: ["$estudios_urgentes", "$total_estudios"] }, 100] },
                    2
                ]
            },
            tiempo_promedio_duracion_min: { $round: ["$tiempo_promedio_duracion", 1] },
            diversidad_servicios: { $size: "$tipos_estudio" }
        }
    },
    {
        $sort: { ingresos_totales: -1 }
    }
]);

print("Análisis de Rentabilidad por Clínica:");
consulta3.forEach(doc => printjson(doc));



// CONSULTA 4: Indicadores de Calidad por Especialidad Médica
const consulta4 = db.resultados_estudios.aggregate([
    {
        $group: {
            _id: "$medico.especialidad",
            total_estudios: { $sum: 1 },
            medicos_unicos: { $addToSet: "$medico.id_medico" },
            tiempo_promedio_entrega_horas: {
                $avg: {
                    $divide: [
                        { $subtract: ["$fecha_resultados", "$fecha_realizacion"] },
                        3600000
                    ]
                }
            },
            casos_urgentes: {
                $sum: { $cond: ["$resultados.urgente", 1, 0] }
            },
            ingresos_totales: { $sum: "$costos.costo_total" },
            tipos_estudio: { $addToSet: "$tipo_estudio" }
        }
    },
    {
        $project: {
            _id: 0,
            especialidad: "$_id",
            total_estudios: 1,
            cantidad_medicos: { $size: "$medicos_unicos" },
            estudios_por_medico: {
                $round: [
                    { $divide: ["$total_estudios", { $size: "$medicos_unicos" }] },
                    2
                ]
            },
            tiempo_promedio_entrega_horas: { $round: ["$tiempo_promedio_entrega_horas", 2] },
            tasa_urgencia: {
                $round: [
                    { $multiply: [{ $divide: ["$casos_urgentes", "$total_estudios"] }, 100] },
                    2
                ]
            },
            ingreso_promedio_estudio: {
                $round: [{ $divide: ["$ingresos_totales", "$total_estudios"] }, 0]
            },
            tipos_estudio_atendidos: "$tipos_estudio"
        }
    },
    {
        $sort: { total_estudios: -1 }
    }
]);

print("Indicadores de Calidad por Especialidad:");
consulta4.forEach(doc => printjson(doc));



// CONSULTA 5: Distribución de Carga de Trabajo por Médico y Mes
const consulta5 = db.resultados_estudios.aggregate([
    {
        $addFields: {
            año: { $year: "$fecha_realizacion" },
            mes: { $month: "$fecha_realizacion" },
            dia_semana: { $dayOfWeek: "$fecha_realizacion" }
        }
    },
    {
        $group: {
            _id: {
                medico_id: "$medico.id_medico",
                medico_nombre: "$medico.nombre_completo",
                especialidad: "$medico.especialidad",
                año: "$año",
                mes: "$mes"
            },
            total_estudios: { $sum: 1 },
            ingresos_generados: { $sum: "$costos.costo_total" },
            tiempo_total_minutos: { $sum: "$metadatos.duracion_minutos" },
            estudios_lunes_viernes: {
                $sum: {
                    $cond: [
                        { $and: [{ $gte: ["$dia_semana", 2] }, { $lte: ["$dia_semana", 6] }] },
                        1,
                        0
                    ]
                }
            },
            estudios_fin_semana: {
                $sum: {
                    $cond: [
                        { $or: [{ $eq: ["$dia_semana", 1] }, { $eq: ["$dia_semana", 7] }] },
                        1,
                        0
                    ]
                }
            }
        }
    },
    {
        $project: {
            _id: 0,
            medico_id: "$_id.medico_id",
            medico_nombre: "$_id.medico_nombre",
            especialidad: "$_id.especialidad",
            periodo: {
                $concat: [
                    { $toString: "$_id.año" },
                    "-",
                    {
                        $cond: [
                            { $lt: ["$_id.mes", 10] },
                            { $concat: ["0", { $toString: "$_id.mes" }] },
                            { $toString: "$_id.mes" }
                        ]
                    }
                ]
            },
            total_estudios: 1,
            ingresos_generados: 1,
            tiempo_total_horas: { $round: [{ $divide: ["$tiempo_total_minutos", 60] }, 2] },
            estudios_lunes_viernes: 1,
            estudios_fin_semana: 1,
            porcentaje_fin_semana: {
                $round: [
                    { $multiply: [{ $divide: ["$estudios_fin_semana", "$total_estudios"] }, 100] },
                    2
                ]
            }
        }
    },
    {
        $sort: { periodo: -1, total_estudios: -1 }
    }
]);

print("Distribución de Carga de Trabajo:");
consulta5.forEach(doc => printjson(doc));


// CONSULTA 6: Comparativa de Tiempos de Entrega entre Clínicas

const consulta6 = db.resultados_estudios.aggregate([
    {
        $addFields: {
            tiempo_entrega_horas: {
                $divide: [
                    { $subtract: ["$fecha_resultados", "$fecha_realizacion"] },
                    3600000
                ]
            }
        }
    },
    {
        $group: {
            _id: {
                clinica_nombre: "$clinica.nombre",
                region: "$clinica.region",
                tipo_estudio: "$tipo_estudio"
            },
            cantidad_estudios: { $sum: 1 },
            tiempo_promedio_horas: { $avg: "$tiempo_entrega_horas" },
            tiempo_minimo_horas: { $min: "$tiempo_entrega_horas" },
            tiempo_maximo_horas: { $max: "$tiempo_entrega_horas" },
            desviacion_estandar: { $stdDevPop: "$tiempo_entrega_horas" }
        }
    },
    {
        $project: {
            _id: 0,
            clinica: "$_id.clinica_nombre",
            region: "$_id.region",
            tipo_estudio: "$_id.tipo_estudio",
            cantidad_estudios: 1,
            tiempo_promedio_horas: { $round: ["$tiempo_promedio_horas", 2] },
            tiempo_minimo_horas: { $round: ["$tiempo_minimo_horas", 2] },
            tiempo_maximo_horas: { $round: ["$tiempo_maximo_horas", 2] },
            desviacion_estandar: { $round: ["$desviacion_estandar", 2] },
            eficiencia: {
                $switch: {
                    branches: [
                        { case: { $lte: ["$tiempo_promedio_horas", 2] }, then: "Excelente" },
                        { case: { $lte: ["$tiempo_promedio_horas", 4] }, then: "Buena" },
                        { case: { $lte: ["$tiempo_promedio_horas", 8] }, then: "Regular" }
                    ],
                    default: "Mejorable"
                }
            }
        }
    },
    {
        $sort: { region: 1, tiempo_promedio_horas: 1 }
    }
]);

print("Comparativa de Tiempos de Entrega:");
consulta6.forEach(doc => printjson(doc));



// CONSULTA 7: Análisis de Estudios Urgentes vs Programados
const consulta7 = db.resultados_estudios.aggregate([
    {
        $facet: {
            urgentes: [
                { $match: { "resultados.urgente": true } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        tipos: { $addToSet: "$tipo_estudio" },
                        clinicas: { $addToSet: "$clinica.nombre" },
                        tiempo_promedio_horas: {
                            $avg: {
                                $divide: [
                                    { $subtract: ["$fecha_resultados", "$fecha_realizacion"] },
                                    3600000
                                ]
                            }
                        },
                        costo_promedio: { $avg: "$costos.costo_total" }
                    }
                }
            ],
            programados: [
                { $match: { "resultados.urgente": false } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 },
                        tipos: { $addToSet: "$tipo_estudio" },
                        clinicas: { $addToSet: "$clinica.nombre" },
                        tiempo_promedio_horas: {
                            $avg: {
                                $divide: [
                                    { $subtract: ["$fecha_resultados", "$fecha_realizacion"] },
                                    3600000
                                ]
                            }
                        },
                        costo_promedio: { $avg: "$costos.costo_total" }
                    }
                }
            ],
            total_general: [
                {
                    $group: {
                        _id: null,
                        total: { $sum: 1 }
                    }
                }
            ]
        }
    },
    {
        $project: {
            urgentes: { $arrayElemAt: ["$urgentes", 0] },
            programados: { $arrayElemAt: ["$programados", 0] },
            total_general: { $arrayElemAt: ["$total_general.total", 0] }
        }
    },
    {
        $project: {
            total_general: 1,
            urgentes: {
                total: "$urgentes.total",
                porcentaje: {
                    $round: [
                        { $multiply: [{ $divide: ["$urgentes.total", "$total_general"] }, 100] },
                        2
                    ]
                },
                tipos_estudio: "$urgentes.tipos",
                clinicas_involucradas: "$urgentes.clinicas",
                tiempo_promedio_horas: { $round: ["$urgentes.tiempo_promedio_horas", 2] },
                costo_promedio: { $round: ["$urgentes.costo_promedio", 0] }
            },
            programados: {
                total: "$programados.total",
                porcentaje: {
                    $round: [
                        { $multiply: [{ $divide: ["$programados.total", "$total_general"] }, 100] },
                        2
                    ]
                },
                tipos_estudio: "$programados.tipos",
                clinicas_involucradas: "$programados.clinicas",
                tiempo_promedio_horas: { $round: ["$programados.tiempo_promedio_horas", 2] },
                costo_promedio: { $round: ["$programados.costo_promedio", 0] }
            },
            diferencia_tiempo_entrega: {
                $round: [
                    {
                        $subtract: [
                            "$urgentes.tiempo_promedio_horas",
                            "$programados.tiempo_promedio_horas"
                        ]
                    },
                    2
                ]
            },
            diferencia_costo: {
                $round: [
                    {
                        $subtract: [
                            "$urgentes.costo_promedio",
                            "$programados.costo_promedio"
                        ]
                    },
                    0
                ]
            }
        }
    }
]);

print("Análisis Urgentes vs Programados:");
consulta7.forEach(doc => printjson(doc));



// CONSULTA 8: Ranking de Rendimiento por Región
const consulta8 = db.indicadores_mensuales.aggregate([
    {
        $match: {
            "periodo.año": 2025
        }
    },
    {
        $group: {
            _id: "$clinica.region",
            total_estudios: { $sum: "$estadisticas.total_estudios" },
            ingresos_totales: { $sum: "$financiero.ingresos_totales" },
            pacientes_unicos: { $sum: "$estadisticas.pacientes_unicos" },
            medicos_activos: { $sum: "$estadisticas.medicos_activos" },
            satisfaccion_promedio: { $avg: "$calidad.satisfaccion_promedio" },
            tasa_error_promedio: { $avg: "$calidad.tasa_error" },
            clinicas: { $addToSet: "$clinica.nombre" }
        }
    },
    {
        $project: {
            _id: 0,
            region: "$_id",
            total_estudios: 1,
            ingresos_totales: 1,
            pacientes_unicos: 1,
            medicos_activos: 1,
            cantidad_clinicas: { $size: "$clinicas" },
            ingreso_promedio_estudio: {
                $round: [{ $divide: ["$ingresos_totales", "$total_estudios"] }, 0]
            },
            estudios_por_clinica: {
                $round: [{ $divide: ["$total_estudios", { $size: "$clinicas" }] }, 2]
            },
            satisfaccion_promedio: { $round: ["$satisfaccion_promedio", 2] },
            tasa_error_promedio: { $round: ["$tasa_error_promedio", 3] },
            score_rendimiento: {
                $round: [
                    {
                        $add: [
                            { $multiply: ["$satisfaccion_promedio", 20] },
                            { $multiply: [{ $divide: ["$total_estudios", 10] }, 10] },
                            { $multiply: [{ $subtract: [1, "$tasa_error_promedio"] }, 100] }
                        ]
                    },
                    2
                ]
            }
        }
    },
    {
        $sort: { score_rendimiento: -1 }
    }
]);

print("Ranking de Rendimiento por Región:");
consulta8.forEach(doc => printjson(doc));
