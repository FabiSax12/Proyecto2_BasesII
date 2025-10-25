## USUARIOS

1. ADMINISTRADOR DE BASE DE DATOS
   - Usuario: admin_analytics
   - Password: 1234
   - Rol: dbOwner (lectura/escritura completa)
   - Uso: Administración y mantenimiento
   
2. CONEXIÓN FDW (INTERNO DEL CLÚSTER)
   - Usuario: usr_fdw_pg_mongo
   - Password: 1234
   - Rol: readWrite (lectura y escritura)
   - Uso: Conexión desde PostgreSQL mediante mongo_fdw\n

3. APLICACIÓN WEB (EXTERNO)
   - Usuario: usr_api_web
   - Password: 1234
   - Rol: read (solo lectura)
   - Uso: Consultas desde la aplicación web\n

4. APLICACIÓN MÓVIL (EXTERNO)
   - Usuario: usr_api_mobile
   - Password: 1234
   - Rol: read (solo lectura)
   - Uso: Consultas desde la aplicación móvil\n