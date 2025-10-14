-- =============================================
-- DATOS DE PRUEBA - Sistema de Integración Médica
-- =============================================

USE SistemaIntegracionMedica;
GO

-- =============================================
-- INSERTAR INSTITUCIONES
-- =============================================

INSERT INTO instituciones (nombre, tipo, codigo_externo, telefono, email) VALUES
('Hospital San Juan de Dios', 'hospital', 'HSJD-001', '2547-8000', 'info@hsjd.sa.cr'),
('Hospital México', 'hospital', 'HM-002', '2232-6122', 'contacto@hmexico.sa.cr'),
('Clínica Bíblica', 'hospital', 'CB-003', '2522-1000', 'info@clinicabiblica.com'),
('INS Seguros', 'aseguradora', 'INS-001', '2287-6000', 'servicios@ins.go.cr'),
('Sagicor Seguros', 'aseguradora', 'SAG-001', '2522-5000', 'clientes@sagicor.com'),
('CCSS', 'aseguradora', 'CCSS-001', '2539-0821', 'servicios@ccss.sa.cr'),
('Laboratorio Echandi', 'laboratorio', 'LECH-001', '2258-0000', 'info@echandi.com'),
('Hospital CIMA', 'hospital', 'CIMA-001', '2208-1000', 'info@hospitalcima.com'),
('Assa Compañía de Seguros', 'aseguradora', 'ASSA-001', '2288-8888', 'atencion@assa.cr'),
('Hospital Clínica Católica', 'hospital', 'HCC-001', '2246-3000', 'info@clinicacatolica.com');
GO



-- =============================================
-- INSERTAR PACIENTES INTEGRACIÓN
-- Simulando PostgreSQL
-- =============================================

INSERT INTO paciente_integracion (id_paciente, id_aseguradora, codigo_externo, estado_facturacion, notas_integracion) VALUES
(1001, 4, 'PAC-INS-1001', 'pendiente', 'Paciente nuevo, verificar cobertura'),
(1002, 5, 'PAC-SAG-1002', 'pagado', 'Pago completado'),
(1003, 6, 'PAC-CCSS-1003', 'pendiente', 'Esperando autorización CCSS'),
(1004, 4, 'PAC-INS-1004', 'en_proceso', 'Factura en revisión'),
(1005, 9, 'PAC-ASSA-1005', 'pagado', 'Pago directo, sin inconvenientes'),
(1006, 5, 'PAC-SAG-1006', 'rechazado', 'Rechazado por falta de cobertura'),
(1007, 6, 'PAC-CCSS-1007', 'pagado', 'Autorizado y pagado'),
(1008, 4, 'PAC-INS-1008', 'pendiente', 'Pendiente de envío de documentos'),
(1009, 9, 'PAC-ASSA-1009', 'en_proceso', 'En proceso de aprobación'),
(1010, 5, 'PAC-SAG-1010', 'pagado', 'Convenio especial aplicado'),
(1011, 6, 'PAC-CCSS-1011', 'anulado', 'Factura anulada por solicitud del paciente'),
(1012, 4, 'PAC-INS-1012', 'pendiente', 'Esperando información adicional'),
(2001, 4, 'PAC-INS-2001', 'pagado', 'Cliente frecuente'),
(2002, 5, 'PAC-SAG-2002', 'pendiente', 'Primera consulta'),
(2003, 6, 'PAC-CCSS-2003', 'pagado', 'Convenio vigente');
GO

-- =============================================
-- INSERTAR CONVENIOS HOSPITALARIOS
-- =============================================

INSERT INTO convenios_hospitalarios (id_institucion, nombre_convenio, tipo_convenio, descuento_porcentaje, fecha_inicio, fecha_fin, activo, condiciones_especiales) VALUES
(4, 'Convenio INS - Estudios Básicos', 'descuento', 15.00, '2024-01-01', '2025-12-31', 1, 'Aplica para laboratorios y rayos X'),
(5, 'Convenio Sagicor - Premium', 'pago_directo', 20.00, '2024-06-01', '2026-05-31', 1, 'Pago directo, sin deducible'),
(6, 'Convenio CCSS - Red de Servicios', 'convenio_especial', 0.00, '2023-01-01', NULL, 1, 'Sin descuento, pago por tarifario CCSS'),
(9, 'Convenio ASSA - Corporativo', 'descuento', 25.00, '2024-03-01', '2025-03-01', 1, 'Aplica para empresas afiliadas'),
(4, 'Convenio INS - Estudios Avanzados', 'descuento', 10.00, '2024-01-01', '2025-12-31', 1, 'Resonancias y tomografías'),
(1, 'Hospital San Juan - Pacientes Referidos', 'descuento', 5.00, '2024-08-01', '2025-08-01', 1, 'Pacientes referidos del hospital'),
(3, 'Clínica Bíblica - Corporativo', 'pago_directo', 15.00, '2023-01-01', NULL, 1, 'Empresas con más de 50 empleados'),
(7, 'Laboratorio Echandi - Alianza', 'descuento', 12.00, '2024-01-01', '2024-12-31', 0, 'Convenio vencido'),
(8, 'Hospital CIMA - VIP', 'convenio_especial', 30.00, '2024-01-01', '2025-12-31', 1, 'Atención preferencial 24/7'),
(10, 'Clínica Católica - General', 'descuento', 8.00, '2024-01-01', '2025-12-31', 1, 'Todos los servicios incluidos');
GO

-- =============================================
-- INSERTAR FACTURAS EXTERNAS
-- =============================================

INSERT INTO facturas_externas (id_paciente, id_institucion, id_estudio, numero_factura, codigo_estudio_externo, monto, descuento, fecha_factura, fecha_vencimiento, estado, metodo_pago, referencia_pago, fecha_pago) VALUES
(1001, 4, 5001, 'FACT-2025-001', 'EST-LAB-001', 45000.00, 6750.00, '2025-10-01', '2025-10-31', 'emitida', NULL, NULL, NULL),
(1002, 5, 5002, 'FACT-2025-002', 'EST-RX-001', 85000.00, 17000.00, '2025-10-02', '2025-11-02', 'pagada', 'Transferencia', 'REF-SAG-5002', '2025-10-10'),
(1003, 6, 5003, 'FACT-2025-003', 'EST-LAB-002', 35000.00, 0.00, '2025-10-03', '2025-11-03', 'enviada', NULL, NULL, NULL),
(1004, 4, 5004, 'FACT-2025-004', 'EST-US-001', 120000.00, 18000.00, '2025-10-04', '2025-11-04', 'enviada', NULL, NULL, NULL),
(1005, 9, 5005, 'FACT-2025-005', 'EST-RX-002', 95000.00, 23750.00, '2025-10-05', '2025-11-05', 'pagada', 'Tarjeta', 'REF-ASSA-5005', '2025-10-12'),
(1006, 5, 5006, 'FACT-2025-006', 'EST-LAB-003', 55000.00, 11000.00, '2025-10-06', '2025-11-06', 'rechazada', NULL, NULL, NULL),
(1007, 6, 5007, 'FACT-2025-007', 'EST-TC-001', 250000.00, 0.00, '2025-10-07', '2025-11-07', 'pagada', 'SINPE', 'REF-CCSS-5007', '2025-10-15'),
(1008, 4, 5008, 'FACT-2025-008', 'EST-LAB-004', 42000.00, 6300.00, '2025-10-08', '2025-11-08', 'emitida', NULL, NULL, NULL),
(1009, 9, 5009, 'FACT-2025-009', 'EST-RM-001', 350000.00, 87500.00, '2025-10-09', '2025-11-09', 'enviada', NULL, NULL, NULL),
(1010, 5, 5010, 'FACT-2025-010', 'EST-US-002', 115000.00, 23000.00, '2025-10-10', '2025-11-10', 'pagada', 'Transferencia', 'REF-SAG-5010', '2025-10-18'),
(1011, 6, 5011, 'FACT-2025-011', 'EST-LAB-005', 38000.00, 0.00, '2025-10-11', '2025-11-11', 'anulada', NULL, NULL, NULL),
(1012, 4, 5012, 'FACT-2025-012', 'EST-RX-003', 78000.00, 11700.00, '2025-10-12', '2025-11-12', 'emitida', NULL, NULL, NULL),
(2001, 4, 5013, 'FACT-2025-013', 'EST-LAB-006', 48000.00, 7200.00, '2025-09-15', '2025-10-15', 'pagada', 'Efectivo', 'REF-INS-5013', '2025-09-20'),
(2002, 5, 5014, 'FACT-2025-014', 'EST-US-003', 125000.00, 25000.00, '2025-09-20', '2025-10-20', 'enviada', NULL, NULL, NULL),
(2003, 6, 5015, 'FACT-2025-015', 'EST-LAB-007', 41000.00, 0.00, '2025-09-25', '2025-10-25', 'pagada', 'SINPE', 'REF-CCSS-5015', '2025-10-01');
GO

-- =============================================
-- RESUMEN DE DATOS INSERTADOS
-- =============================================


SELECT
    'Instituciones' AS Tabla,
    COUNT(*) AS Total,
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END) AS Activos
FROM instituciones
UNION ALL
SELECT
    'Pacientes Integración',
    COUNT(*),
    SUM(CASE WHEN estado_facturacion = 'pagado' THEN 1 ELSE 0 END)
FROM paciente_integracion
UNION ALL
SELECT
    'Convenios',
    COUNT(*),
    SUM(CASE WHEN activo = 1 THEN 1 ELSE 0 END)
FROM convenios_hospitalarios
UNION ALL
SELECT
    'Facturas',
    COUNT(*),
    SUM(CASE WHEN estado = 'pagada' THEN 1 ELSE 0 END)
FROM facturas_externas;
GO

-- Resumen financiero
PRINT '';
PRINT 'Resumen Financiero:';
SELECT
    estado,
    COUNT(*) AS cantidad_facturas,
    SUM(monto) AS monto_total,
    SUM(descuento) AS descuento_total,
    SUM(monto_final) AS monto_final_total
FROM facturas_externas
GROUP BY estado
ORDER BY estado;
GO

PRINT '==============================================';
GO