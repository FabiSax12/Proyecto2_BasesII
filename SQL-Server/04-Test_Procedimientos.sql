USE SistemaIntegracionMedica;
GO

-- =============================================
-- PRUEBA 1: Resumen de facturación por institución
-- =============================================
PRINT '--- PRUEBA 1: sp_resumen_facturacion_institucion ---';
PRINT 'Obteniendo resumen de todas las instituciones...';
PRINT '';

EXEC sp_resumen_facturacion_institucion;

PRINT '';
PRINT 'Filtrando por institución específica (INS - ID 4)...';
PRINT '';

EXEC sp_resumen_facturacion_institucion
    @id_institucion = 4;

PRINT '';
GO

-- =============================================
-- PRUEBA 2: Consultar estado de paciente
-- =============================================
PRINT '--- PRUEBA 2: sp_consultar_estado_paciente ---';
PRINT 'Consultando información del paciente 1001...';
PRINT '';

EXEC sp_consultar_estado_paciente
    @id_paciente = 1001;

PRINT '';
GO

-- =============================================
-- PRUEBA 3: Reporte de convenios activos
-- =============================================
PRINT '--- PRUEBA 3: sp_reporte_convenios_activos ---';
PRINT 'Listando todos los convenios activos...';
PRINT '';

EXEC sp_reporte_convenios_activos;

PRINT '';
PRINT 'Filtrando solo aseguradoras...';
PRINT '';

EXEC sp_reporte_convenios_activos
    @tipo_institucion = 'aseguradora';

PRINT '';
GO

-- =============================================
-- PRUEBA 4: Resumen mensual para aseguradora
-- =============================================
PRINT '--- PRUEBA 4: sp_resumen_mensual_aseguradora ---';
PRINT 'Generando resumen mensual para INS (ID 4) - Octubre 2025...';
PRINT '';

EXEC sp_resumen_mensual_aseguradora
    @id_aseguradora = 4,
    @mes = 10,
    @anio = 2025;

PRINT '';
GO

-- =============================================
-- PRUEBA 5: Actualizar estado de paciente
-- =============================================
PRINT '--- PRUEBA 5: sp_actualizar_estado_paciente ---';
PRINT 'Actualizando estado del paciente 1001 a "en_proceso"...';
PRINT '';

EXEC sp_actualizar_estado_paciente
    @id_paciente = 1001,
    @nuevo_estado = 'en_proceso',
    @notas = 'Estado actualizado en prueba de procedimientos';

PRINT '';
GO

-- =============================================
-- PRUEBA 6: Registrar pago de factura
-- =============================================
PRINT '--- PRUEBA 6: sp_registrar_pago_factura ---';
PRINT 'Registrando pago de la factura 1 (FACT-2025-001)...';
PRINT '';

EXEC sp_registrar_pago_factura
    @id_factura = 1,
    @metodo_pago = 'Transferencia Bancaria',
    @referencia_pago = 'TEST-REF-001';

PRINT '';
GO

-- =============================================
-- PRUEBA 7: Facturas próximas a vencer
-- =============================================
PRINT '--- PRUEBA 7: sp_facturas_proximas_vencer ---';
PRINT 'Buscando facturas que vencen en los próximos 30 días...';
PRINT '';

EXEC sp_facturas_proximas_vencer
    @dias_anticipacion = 30;

PRINT '';
GO

-- =============================================
-- PRUEBA 8: Aplicar descuento por convenio
-- =============================================
PRINT '--- PRUEBA 8: sp_aplicar_descuento_convenio ---';
PRINT 'Aplicando descuento por convenio a la factura 4...';
PRINT '';

EXEC sp_aplicar_descuento_convenio
    @id_factura = 4;

PRINT '';
GO

-- =============================================
-- CONSULTAS ADICIONALES PARA VERIFICACIÓN
-- =============================================
PRINT '==============================================';
PRINT 'CONSULTAS DE VERIFICACIÓN';
PRINT '==============================================';
PRINT '';

-- Verificar estado después de las actualizaciones
PRINT '--- Estado actual de pacientes modificados ---';
SELECT
    id_paciente,
    codigo_externo,
    estado_facturacion,
    fecha_ultima_actualizacion
FROM paciente_integracion
WHERE id_paciente IN (1001)
ORDER BY id_paciente;
PRINT '';

-- Verificar facturas pagadas
PRINT '--- Facturas pagadas en las pruebas ---';
SELECT
    id_factura,
    numero_factura,
    estado,
    metodo_pago,
    referencia_pago,
    fecha_pago
FROM facturas_externas
WHERE id_factura IN (1, 4)
ORDER BY id_factura;
PRINT '';

-- =============================================
-- ESTADÍSTICAS FINALES
-- =============================================
PRINT '--- Estadísticas Generales ---';
PRINT '';

SELECT
    'Instituciones Activas' AS Concepto,
    COUNT(*) AS Total
FROM instituciones
WHERE activo = 1
UNION ALL
SELECT
    'Convenios Vigentes',
    COUNT(*)
FROM convenios_hospitalarios
WHERE activo = 1 AND (fecha_fin IS NULL OR fecha_fin >= GETDATE())
UNION ALL
SELECT
    'Facturas Pendientes',
    COUNT(*)
FROM facturas_externas
WHERE estado IN ('emitida', 'enviada')
UNION ALL
SELECT
    'Facturas Pagadas',
    COUNT(*)
FROM facturas_externas
WHERE estado = 'pagada';
GO

-- =============================================
-- RESUMEN DE MONTOS
-- =============================================
PRINT '';
PRINT '--- Resumen de Montos Totales ---';
SELECT
    FORMAT(SUM(monto), 'C', 'es-CR') AS total_facturado,
    FORMAT(SUM(descuento), 'C', 'es-CR') AS total_descuentos,
    FORMAT(SUM(monto_final), 'C', 'es-CR') AS total_neto,
    FORMAT(SUM(CASE WHEN estado = 'pagada' THEN monto_final ELSE 0 END), 'C', 'es-CR') AS total_cobrado,
    FORMAT(SUM(CASE WHEN estado IN ('emitida', 'enviada') THEN monto_final ELSE 0 END), 'C', 'es-CR') AS total_por_cobrar
FROM facturas_externas;
GO

PRINT '';
PRINT '==============================================';
PRINT '✓✓✓ PRUEBAS COMPLETADAS EXITOSAMENTE ✓✓✓';
PRINT '==============================================';
GO