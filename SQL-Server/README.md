# 📘 Documentación - SQL Server (Integración Externa)

## 🎯 Objetivo del Servidor

El servidor **Microsoft SQL Server** actúa como **punto de integración** con sistemas externos (hospitales, aseguradoras, sistemas públicos) en el Sistema de Gestión de Estudios Médicos Distribuido.

---

## 🏗️ Arquitectura y Segmentación Vertical

### Concepto de Segmentación Vertical

La **segmentación vertical** consiste en almacenar **solo las columnas relevantes** para la integración externa, omitiendo información sensible o innecesaria.

**Ejemplo:**
- ✅ **Se almacena:** ID del paciente, código externo, estado de facturación
- ❌ **NO se almacena:** Dirección, teléfono, historial médico completo

### Ventajas
1. **Privacidad:** Minimiza exposición de datos sensibles
2. **Performance:** Tablas más ligeras y rápidas
3. **Seguridad:** Reduce superficie de ataque
4. **Interoperabilidad:** Solo comparte lo necesario con sistemas externos

---

## 📊 Modelo de Datos

### Diagrama ER Simplificado

```
┌─────────────────────┐
│   instituciones     │
│  (Catálogo)         │
├─────────────────────┤
│ PK id_institucion   │
│    nombre           │
│    tipo             │
│    codigo_externo   │
│    activo           │
└─────────────────────┘
         │
         │ 1:N
         ├──────────────────────┐
         │                      │
         ▼                      ▼
┌──────────────────────┐  ┌─────────────────────────┐
│ convenios_           │  │ paciente_integracion    │
│ hospitalarios        │  │ (SEGMENTACIÓN VERTICAL) │
├──────────────────────┤  ├─────────────────────────┤
│ PK id_convenio       │  │ PK id_paciente          │
│ FK id_institucion    │  │ FK id_aseguradora       │
│    nombre_convenio   │  │    codigo_externo       │
│    descuento_%       │  │    estado_facturacion   │
│    fecha_inicio      │  │    fecha_actualizacion  │
│    fecha_fin         │  └─────────────────────────┘
│    activo            │              │
└──────────────────────┘              │ 1:N
                                      ▼
                            ┌──────────────────────┐
                            │ facturas_externas    │
                            │ (SEGMENTACIÓN        │
                            │  VERTICAL)           │
                            ├──────────────────────┤
                            │ PK id_factura        │
                            │ FK id_paciente       │
                            │ FK id_institucion    │
                            │    id_estudio        │
                            │    numero_factura    │
                            │    monto             │
                            │    descuento         │
                            │    monto_final (calc)│
                            │    fecha_factura     │
                            │    estado            │
                            │    metodo_pago       │
                            └──────────────────────┘
```

---

## 📋 Descripción de Tablas

### 1. **instituciones**
**Propósito:** Catálogo de entidades externas (hospitales, aseguradoras, laboratorios)

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id_institucion | INT PK | Identificador único |
| nombre | VARCHAR(200) | Nombre de la institución |
| tipo | VARCHAR(50) | hospital, aseguradora, clinica_externa, laboratorio |
| codigo_externo | VARCHAR(50) UNIQUE | Código usado por sistemas externos |
| telefono | VARCHAR(20) | Teléfono de contacto |
| email | VARCHAR(100) | Email de contacto |
| activo | BIT | Estado (1=activo, 0=inactivo) |

**Ejemplo:**
```sql
('Hospital San Juan de Dios', 'hospital', 'HSJD-001', '2547-8000', 'info@hsjd.sa.cr', 1)
```

---

### 2. **paciente_integracion** ⚡ (SEGMENTACIÓN VERTICAL)
**Propósito:** Información mínima del paciente para compartir con sistemas externos

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id_paciente | INT PK | ID del paciente (viene de PostgreSQL) |
| id_aseguradora | INT FK | Referencia a instituciones |
| codigo_externo | VARCHAR(50) | Código único para sistemas externos |
| estado_facturacion | VARCHAR(20) | pendiente, en_proceso, pagado, rechazado, anulado |
| fecha_ultima_actualizacion | DATETIME | Timestamp de última modificación |
| notas_integracion | VARCHAR(500) | Observaciones |

**🔒 Datos NO incluidos por segmentación vertical:**
- Nombre completo del paciente
- Cédula
- Dirección
- Teléfono personal
- Historial médico
- Datos sensibles

**Ejemplo:**
```sql
(1001, 4, 'PAC-INS-1001', 'pendiente', '2025-10-13 10:00:00', 'Verificar cobertura')
```

---

### 3. **convenios_hospitalarios**
**Propósito:** Acuerdos comerciales con instituciones

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id_convenio | INT PK | Identificador único |
| id_institucion | INT FK | Institución con la que se tiene el convenio |
| nombre_convenio | VARCHAR(200) | Nombre descriptivo |
| tipo_convenio | VARCHAR(50) | descuento, pago_directo, convenio_especial |
| descuento_porcentaje | DECIMAL(5,2) | Porcentaje de descuento (0-100) |
| fecha_inicio | DATE | Inicio de vigencia |
| fecha_fin | DATE | Fin de vigencia (NULL = indefinido) |
| activo | BIT | Estado del convenio |
| condiciones_especiales | TEXT | Términos y condiciones |

**Ejemplo:**
```sql
(4, 'Convenio INS - Estudios Básicos', 'descuento', 15.00, '2024-01-01', '2025-12-31', 1, 
 'Aplica para laboratorios y rayos X')
```

---

### 4. **facturas_externas** ⚡ (SEGMENTACIÓN VERTICAL)
**Propósito:** Registro de facturación hacia sistemas externos

| Columna | Tipo | Descripción |
|---------|------|-------------|
| id_factura | INT PK | Identificador único |
| id_paciente | INT FK | Referencia a paciente_integracion |
| id_institucion | INT FK | Institución a la que se factura |
| id_estudio | INT | ID del estudio (viene de PostgreSQL) |
| numero_factura | VARCHAR(50) | Número único de factura |
| codigo_estudio_externo | VARCHAR(50) | Código del estudio en sistema externo |
| monto | DECIMAL(10,2) | Monto original |
| descuento | DECIMAL(10,2) | Descuento aplicado |
| monto_final | DECIMAL (calculado) | monto - descuento |
| fecha_factura | DATE | Fecha de emisión |
| fecha_vencimiento | DATE | Fecha límite de pago |
| estado | VARCHAR(20) | emitida, enviada, pagada, parcial, anulada, rechazada |
| metodo_pago | VARCHAR(50) | Forma de pago (cuando aplica) |
| referencia_pago | VARCHAR(100) | Referencia de transacción |
| fecha_pago | DATETIME | Timestamp del pago |

**🔒 Datos NO incluidos por segmentación vertical:**
- Detalles clínicos del estudio
- Resultados médicos
- Diagnósticos
- Información personal del paciente

**Ejemplo:**
```sql
(1001, 4, 5001, 'FACT-2025-001', 'EST-LAB-001', 45000.00, 6750.00, 
 '2025-10-01', '2025-10-31', 'emitida', NULL, NULL, NULL)
```

---

## 🔧 Procedimientos Almacenados

### 1. **sp_resumen_facturacion_institucion**
**Propósito:** Genera resumen financiero por institución

**Parámetros:**
- `@id_institucion` (INT, opcional): Filtrar por institución específica
- `@fecha_inicio` (DATE, opcional): Fecha inicial (default: último mes)
- `@fecha_fin` (DATE, opcional): Fecha final (default: hoy)

**Uso:**
```sql
-- Todas las instituciones
EXEC sp_resumen_facturacion_institucion;

-- Solo INS en octubre 2025
EXEC sp_resumen_facturacion_institucion 
    @id_institucion = 4,
    @fecha_inicio = '2025-10-01',
    @fecha_fin = '2025-10-31';
```

**Retorna:**
- Total de facturas
- Facturas pagadas vs pendientes
- Montos totales
- Promedios por factura

---

### 2. **sp_consultar_estado_paciente**
**Propósito:** Consulta información completa de un paciente

**Parámetros:**
- `@id_paciente` (INT): ID del paciente

**Uso:**
```sql
EXEC sp_consultar_estado_paciente @id_paciente = 1001;
```

**Retorna:**
- Información del paciente
- Aseguradora asociada
- Lista de todas sus facturas
- Días para vencer cada factura

---

### 3. **sp_reporte_convenios_activos**
**Propósito:** Lista convenios vigentes

**Parámetros:**
- `@tipo_institucion` (VARCHAR, opcional): hospital, aseguradora, etc.

**Uso:**
```sql
-- Todos los convenios
EXEC sp_reporte_convenios_activos;

-- Solo aseguradoras
EXEC sp_reporte_convenios_activos @tipo_institucion = 'aseguradora';
```

**Retorna:**
- Convenios vigentes
- Descuentos aplicables
- Días restantes de vigencia
- Condiciones especiales

---

### 4. **sp_resumen_mensual_aseguradora**
**Propósito:** Resumen mensual para una aseguradora

**Parámetros:**
- `@id_aseguradora` (INT): ID de la aseguradora
- `@mes` (INT): Mes (1-12)
- `@anio` (INT): Año

**Uso:**
```sql
EXEC sp_resumen_mensual_aseguradora 
    @id_aseguradora = 4,
    @mes = 10,
    @anio = 2025;
```

**Retorna:**
- Total de pacientes activos
- Facturas emitidas, pagadas y pendientes
- Montos totales

---

### 5. **sp_actualizar_estado_paciente**
**Propósito:** Actualiza el estado de facturación de un paciente

**Parámetros:**
- `@id_paciente` (INT): ID del paciente
- `@nuevo_estado` (VARCHAR): pendiente, en_proceso, pagado, rechazado, anulado
- `@notas` (VARCHAR, opcional): Notas adicionales

**Uso:**
```sql
EXEC sp_actualizar_estado_paciente 
    @id_paciente = 1001,
    @nuevo_estado = 'pagado',
    @notas = 'Pago confirmado por aseguradora';
```

---

### 6. **sp_registrar_pago_factura**
**Propósito:** Registra el pago de una factura

**Parámetros:**
- `@id_factura` (INT): ID de la factura
- `@metodo_pago` (VARCHAR): Forma de pago
- `@referencia_pago` (VARCHAR): Número de referencia

**Uso:**
```sql
EXEC sp_registrar_pago_factura 
    @id_factura = 1,
    @metodo_pago = 'Transferencia',
    @referencia_pago = 'REF-001';
```

---

### 7. **sp_facturas_proximas_vencer**
**Propósito:** Lista facturas próximas a vencer

**Parámetros:**
- `@dias_anticipacion` (INT): Días de anticipación (default: 7)

**Uso:**
```sql
EXEC sp_facturas_proximas_vencer @dias_anticipacion = 30;
```

---

### 8. **sp_aplicar_descuento_convenio**
**Propósito:** Aplica automáticamente el descuento según convenio vigente

**Parámetros:**
- `@id_factura` (INT): ID de la factura

**Uso:**
```sql
EXEC sp_aplicar_descuento_convenio @id_factura = 4;
```

---

## 🔐 Seguridad y Roles

### Roles Recomendados

#### 1. **usr_fdw_pg_mssql** (Para integración con PostgreSQL)
```sql
CREATE LOGIN usr_fdw_pg_mssql WITH PASSWORD = 'Pass_Secure_123!';
CREATE USER usr_fdw_pg_mssql FOR LOGIN usr_fdw_pg_mssql;

-- Permisos de solo lectura
GRANT SELECT ON instituciones TO usr_fdw_pg_mssql;
GRANT SELECT ON paciente_integracion TO usr_fdw_pg_mssql;
GRANT SELECT ON facturas_externas TO usr_fdw_pg_mssql;
GRANT SELECT ON convenios_hospitalarios TO usr_fdw_pg_mssql;

-- Ejecutar procedimientos específicos
GRANT EXECUTE ON sp_resumen_facturacion_institucion TO usr_fdw_pg_mssql;
GRANT EXECUTE ON sp_consultar_estado_paciente TO usr_fdw_pg_mssql;
```

#### 2. **usr_api_web** (Para aplicación web)
```sql
CREATE LOGIN usr_api_web WITH PASSWORD = 'WebAPI_2025!';
CREATE USER usr_api_web FOR LOGIN usr_api_web;

-- Lectura y ejecución de procedimientos
GRANT SELECT ON instituciones TO usr_api_web;
GRANT SELECT ON facturas_externas TO usr_api_web;
GRANT EXECUTE ON sp_consultar_estado_paciente TO usr_api_web;
GRANT EXECUTE ON sp_reporte_convenios_activos TO usr_api_web;
```

---

## 📁 Estructura de Archivos Entregables

```
PERSONA_2_SQL_SERVER/
│
├── 01_crear_base_datos.sql             # Creación de DB y tablas
├── 02_datos_de_prueba.sql              # Datos de ejemplo
├── 03_procedimientos_almacenados.sql   # 8 procedimientos
├── 04_pruebas_procedimientos.sql       # Script de pruebas
├── README.md                           # Este archivo
└── DIAGRAMA.png                        # Diagrama visual
```

