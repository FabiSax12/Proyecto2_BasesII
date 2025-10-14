USE SistemaIntegracionMedica;
GO

-- RESUMEN DE FACTURACIÓN POR INSTITUCIÓN
CREATE OR ALTER PROCEDURE sp_resumen_facturacion_institucion
    @id_institucion INT = NULL,
    @fecha_inicio DATE = NULL,
    @fecha_fin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    -- Si no se proporcionan fechas, usar último mes
    IF @fecha_inicio IS NULL
        SET @fecha_inicio = DATEADD(MONTH, -1, GETDATE());

    IF @fecha_fin IS NULL
        SET @fecha_fin = GETDATE();

    SELECT
        i.id_institucion,
        i.nombre AS institucion,
        i.tipo AS tipo_institucion,
        COUNT(f.id_factura) AS total_facturas,
        SUM(CASE WHEN f.estado = 'pagada' THEN 1 ELSE 0 END) AS facturas_pagadas,
        SUM(CASE WHEN f.estado = 'pendiente' OR f.estado = 'emitida' THEN 1 ELSE 0 END) AS facturas_pendientes,
        SUM(f.monto) AS monto_total,
        SUM(f.descuento) AS descuento_total,
        SUM(f.monto_final) AS monto_final_total,
        AVG(f.monto_final) AS promedio_por_factura
    FROM instituciones i
    LEFT JOIN facturas_externas f ON i.id_institucion = f.id_institucion
        AND f.fecha_factura BETWEEN @fecha_inicio AND @fecha_fin
    WHERE (@id_institucion IS NULL OR i.id_institucion = @id_institucion)
    GROUP BY i.id_institucion, i.nombre, i.tipo
    ORDER BY monto_final_total DESC;
END;
GO



-- CONSULTAR ESTADO DE FACTURACIÓN DE PACIENTE
CREATE OR ALTER PROCEDURE sp_consultar_estado_paciente
    @id_paciente INT
AS
BEGIN
    SET NOCOUNT ON;

    -- Información del paciente
    SELECT
        pi.id_paciente,
        pi.codigo_externo,
        pi.estado_facturacion,
        i.nombre AS aseguradora,
        i.codigo_externo AS codigo_aseguradora,
        pi.fecha_ultima_actualizacion,
        pi.notas_integracion
    FROM paciente_integracion pi
    LEFT JOIN instituciones i ON pi.id_aseguradora = i.id_institucion
    WHERE pi.id_paciente = @id_paciente;

    -- Facturas del paciente
    SELECT
        f.id_factura,
        f.numero_factura,
        i.nombre AS institucion_facturada,
        f.monto,
        f.descuento,
        f.monto_final,
        f.fecha_factura,
        f.fecha_vencimiento,
        f.estado,
        f.metodo_pago,
        f.referencia_pago,
        f.fecha_pago,
        DATEDIFF(DAY, GETDATE(), f.fecha_vencimiento) AS dias_para_vencer
    FROM facturas_externas f
    INNER JOIN instituciones i ON f.id_institucion = i.id_institucion
    WHERE f.id_paciente = @id_paciente
    ORDER BY f.fecha_factura DESC;
END;
GO



-- REPORTE DE CONVENIOS ACTIVOS
CREATE OR ALTER PROCEDURE sp_reporte_convenios_activos
    @tipo_institucion VARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        c.id_convenio,
        i.nombre AS institucion,
        i.tipo AS tipo_institucion,
        c.nombre_convenio,
        c.tipo_convenio,
        c.descuento_porcentaje,
        c.fecha_inicio,
        c.fecha_fin,
        CASE
            WHEN c.fecha_fin IS NULL THEN 'Indefinido'
            WHEN c.fecha_fin > GETDATE() THEN 'Vigente'
            ELSE 'Vencido'
        END AS estado_vigencia,
        DATEDIFF(DAY, GETDATE(), c.fecha_fin) AS dias_restantes,
        c.condiciones_especiales
    FROM convenios_hospitalarios c
    INNER JOIN instituciones i ON c.id_institucion = i.id_institucion
    WHERE c.activo = 1
        AND (@tipo_institucion IS NULL OR i.tipo = @tipo_institucion)
        AND (c.fecha_fin IS NULL OR c.fecha_fin >= GETDATE())
    ORDER BY i.tipo, i.nombre;
END;
GO



-- GENERAR RESUMEN MENSUAL PARA ASEGURADORAS
CREATE OR ALTER PROCEDURE sp_resumen_mensual_aseguradora
    @id_aseguradora INT,
    @mes INT,
    @anio INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @fecha_inicio DATE = DATEFROMPARTS(@anio, @mes, 1);
    DECLARE @fecha_fin DATE = EOMONTH(@fecha_inicio);

    -- Resumen general
    SELECT
        i.nombre AS aseguradora,
        @mes AS mes,
        @anio AS anio,
        COUNT(DISTINCT pi.id_paciente) AS total_pacientes_activos,
        COUNT(f.id_factura) AS total_facturas,
        SUM(CASE WHEN f.estado = 'pagada' THEN 1 ELSE 0 END) AS facturas_pagadas,
        SUM(CASE WHEN f.estado IN ('emitida', 'enviada') THEN 1 ELSE 0 END) AS facturas_pendientes,
        SUM(f.monto) AS monto_total_facturado,
        SUM(CASE WHEN f.estado = 'pagada' THEN f.monto_final ELSE 0 END) AS monto_pagado,
        SUM(CASE WHEN f.estado IN ('emitida', 'enviada') THEN f.monto_final ELSE 0 END) AS monto_pendiente
    FROM instituciones i
    INNER JOIN paciente_integracion pi ON i.id_institucion = pi.id_aseguradora
    LEFT JOIN facturas_externas f ON pi.id_paciente = f.id_paciente
        AND f.fecha_factura BETWEEN @fecha_inicio AND @fecha_fin
    WHERE i.id_institucion = @id_aseguradora
    GROUP BY i.nombre;

    -- Detalle por estado de factura
    SELECT
        f.estado,
        COUNT(*) AS cantidad,
        SUM(f.monto_final) AS monto_total
    FROM facturas_externas f
    INNER JOIN paciente_integracion pi ON f.id_paciente = pi.id_paciente
    WHERE pi.id_aseguradora = @id_aseguradora
        AND f.fecha_factura BETWEEN @fecha_inicio AND @fecha_fin
    GROUP BY f.estado
    ORDER BY monto_total DESC;
END;
GO



-- ACTUALIZAR ESTADO DE FACTURACIÓN DE PACIENTE
CREATE OR ALTER PROCEDURE sp_actualizar_estado_paciente
    @id_paciente INT,
    @nuevo_estado VARCHAR(20),
    @notas VARCHAR(500) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Validar que el estado sea válido
        IF @nuevo_estado NOT IN ('pendiente', 'en_proceso', 'pagado', 'rechazado', 'anulado')
        BEGIN
            RAISERROR('Estado no válido. Use: pendiente, en_proceso, pagado, rechazado, anulado', 16, 1);
            RETURN;
        END

        -- Actualizar el estado
        UPDATE paciente_integracion
        SET
            estado_facturacion = @nuevo_estado,
            fecha_ultima_actualizacion = GETDATE(),
            notas_integracion = ISNULL(@notas, notas_integracion)
        WHERE id_paciente = @id_paciente;

        IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('Paciente no encontrado', 16, 1);
            RETURN;
        END

        COMMIT TRANSACTION;

        PRINT 'Estado actualizado exitosamente';

        -- Retornar el estado actualizado
        SELECT
            id_paciente,
            codigo_externo,
            estado_facturacion,
            fecha_ultima_actualizacion,
            notas_integracion
        FROM paciente_integracion
        WHERE id_paciente = @id_paciente;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO



-- REGISTRAR PAGO DE FACTURA
CREATE OR ALTER PROCEDURE sp_registrar_pago_factura
    @id_factura INT,
    @metodo_pago VARCHAR(50),
    @referencia_pago VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar que la factura existe y no está pagada
        DECLARE @estado_actual VARCHAR(20);
        SELECT @estado_actual = estado FROM facturas_externas WHERE id_factura = @id_factura;

        IF @estado_actual IS NULL
        BEGIN
            RAISERROR('Factura no encontrada', 16, 1);
            RETURN;
        END

        IF @estado_actual = 'pagada'
        BEGIN
            RAISERROR('La factura ya está pagada', 16, 1);
            RETURN;
        END

        IF @estado_actual = 'anulada'
        BEGIN
            RAISERROR('La factura está anulada', 16, 1);
            RETURN;
        END

        -- Registrar el pago
        UPDATE facturas_externas
        SET
            estado = 'pagada',
            metodo_pago = @metodo_pago,
            referencia_pago = @referencia_pago,
            fecha_pago = GETDATE()
        WHERE id_factura = @id_factura;

        COMMIT TRANSACTION;

        PRINT 'Pago registrado exitosamente';

        -- Retornar información de la factura
        SELECT
            f.id_factura,
            f.numero_factura,
            f.monto_final,
            f.estado,
            f.metodo_pago,
            f.referencia_pago,
            f.fecha_pago,
            p.codigo_externo AS codigo_paciente,
            i.nombre AS institucion
        FROM facturas_externas f
        INNER JOIN paciente_integracion p ON f.id_paciente = p.id_paciente
        INNER JOIN instituciones i ON f.id_institucion = i.id_institucion
        WHERE f.id_factura = @id_factura;

    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO



-- FACTURAS PRÓXIMAS A VENCER
CREATE OR ALTER PROCEDURE sp_facturas_proximas_vencer
    @dias_anticipacion INT = 7
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        f.id_factura,
        f.numero_factura,
        i.nombre AS institucion,
        p.codigo_externo AS codigo_paciente,
        f.monto_final,
        f.fecha_factura,
        f.fecha_vencimiento,
        DATEDIFF(DAY, GETDATE(), f.fecha_vencimiento) AS dias_para_vencer,
        f.estado
    FROM facturas_externas f
    INNER JOIN instituciones i ON f.id_institucion = i.id_institucion
    INNER JOIN paciente_integracion p ON f.id_paciente = p.id_paciente
    WHERE f.estado IN ('emitida', 'enviada')
        AND f.fecha_vencimiento IS NOT NULL
        AND f.fecha_vencimiento BETWEEN GETDATE() AND DATEADD(DAY, @dias_anticipacion, GETDATE())
    ORDER BY f.fecha_vencimiento ASC;
END;
GO



-- APLICAR DESCUENTO POR CONVENIO
CREATE OR ALTER PROCEDURE sp_aplicar_descuento_convenio
    @id_factura INT
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY
        DECLARE @id_institucion INT;
        DECLARE @monto DECIMAL(10,2);
        DECLARE @descuento_convenio DECIMAL(5,2);
        DECLARE @descuento_monto DECIMAL(10,2);

        -- Obtener datos de la factura
        SELECT
            @id_institucion = id_institucion,
            @monto = monto
        FROM facturas_externas
        WHERE id_factura = @id_factura;

        -- Buscar convenio activo
        SELECT TOP 1
            @descuento_convenio = descuento_porcentaje
        FROM convenios_hospitalarios
        WHERE id_institucion = @id_institucion
            AND activo = 1
            AND (fecha_fin IS NULL OR fecha_fin >= GETDATE())
        ORDER BY descuento_porcentaje DESC;

        IF @descuento_convenio IS NULL
        BEGIN
            PRINT 'No hay convenios activos para esta institución';
            RETURN;
        END

        -- Calcular descuento
        SET @descuento_monto = @monto * (@descuento_convenio / 100);

        -- Aplicar descuento
        UPDATE facturas_externas
        SET descuento = @descuento_monto
        WHERE id_factura = @id_factura;

        PRINT 'Descuento aplicado: ' + CAST(@descuento_convenio AS VARCHAR) + '%';

        SELECT
            id_factura,
            numero_factura,
            monto,
            descuento,
            monto_final
        FROM facturas_externas
        WHERE id_factura = @id_factura;

    END TRY
    BEGIN CATCH
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrorMessage, 16, 1);
    END CATCH
END;
GO
