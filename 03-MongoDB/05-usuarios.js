use admin;


db = db.getSiblingDB('estudios_medicos_analytics');

try {
    db.createUser({
        user: "admin_analytics",
        pwd: "1234",
        roles: [
            {
                role: "dbOwner",
                db: "estudios_medicos_analytics"
            }
        ]
    });
    print("✓ Usuario 'admin_analytics' creado exitosamente");
} catch (e) {
    if (e.code === 51003) {
        print("⚠ Usuario 'admin_analytics' ya existe");
    } else {
        print("✗ Error creando usuario: " + e.message);
    }
}



try {
    db.createUser({
        user: "usr_fdw_pg_mongo",
        pwd: "1234",
        roles: [
            {
                role: "read",
                db: "estudios_medicos_analytics"
            },
            {
                role: "readWrite",
                db: "estudios_medicos_analytics"
            }
        ]
    });
    print("✓ Usuario 'usr_fdw_pg_mongo' creado exitosamente");
} catch (e) {
    if (e.code === 51003) {
        print("⚠ Usuario 'usr_fdw_pg_mongo' ya existe");
    } else {
        print("✗ Error creando usuario: " + e.message);
    }
}



try {
    db.createUser({
        user: "usr_api_web",
        pwd: "1234",
        roles: [
            {
                role: "read",
                db: "estudios_medicos_analytics"
            }
        ]
    });
    print("✓ Usuario 'usr_api_web' creado exitosamente");
} catch (e) {
    if (e.code === 51003) {
        print("⚠ Usuario 'usr_api_web' ya existe");
    } else {
        print("✗ Error creando usuario: " + e.message);
    }
}



try {
    db.createUser({
        user: "usr_api_mobile",
        pwd: "1234",
        roles: [
            {
                role: "read",
                db: "estudios_medicos_analytics"
            }
        ]
    });
    print("✓ Usuario 'usr_api_mobile' creado exitosamente");
} catch (e) {
    if (e.code === 51003) {
        print("⚠ Usuario 'usr_api_mobile' ya existe");
    } else {
        print("✗ Error creando usuario: " + e.message);
    }
}

print("\n--- Verificando usuarios creados ---");
db.getUsers().forEach(function(user) {
    print("\nUsuario: " + user.user);
    print("Roles:");
    user.roles.forEach(function(role) {
        print("  - " + role.role + " en base de datos: " + role.db);
    });
});