# Guía para Generar el Informe Técnico de NovaEdu

Este archivo contiene un **prompt optimizado** y diseñado a medida para tu proyecto **NovaEdu (Sistema de Gestión Académica)**. Contiene todos los detalles de implementación reales del código fuente y las normativas ISO para que la IA que lo procese genere un informe técnico impecable, detallado y exhaustivo.

---

## Copia el siguiente prompt completo:

```text
Actúa como un Arquitecto de Software Senior y Consultor de Aseguramiento de Calidad de TI. Necesito que elabores un informe técnico detallado, estructurado y sumamente formal sobre el proyecto "NovaEdu", un Sistema de Gestión Académica y Financiera (ERP/SaaS). 

El informe debe estar escrito en español y seguir un formato académico/corporativo con markdown profesional. Debe detallar exhaustivamente la implementación en el código y el cumplimiento de las normas ISO.

Usa la siguiente información real recopilada del código fuente para estructurar y detallar cada sección del informe:

---
### FICHA TÉCNICA Y DETALLES DE IMPLEMENTACIÓN DEL PROYECTO REAL:

1. ARQUITECTURA Y ORQUESTACIÓN:
   - Arquitectura Cliente-Servidor: Frontend desacoplado (Single Page Application - SPA) y Backend REST API independiente.
   - Orquestador (dev.js): Script en Node.js que utiliza el módulo nativo 'child_process' mediante 'spawn' para ejecutar simultáneamente el servidor backend (puerto 3000 con node server/index.js) y el servidor frontend de Vite en paralelo. Implementa manejadores de señales (SIGINT, SIGTERM, exit) para asegurar el cierre correcto de ambos procesos sin dejar puertos colgados en memoria.
   - Tecnologías Frontend: React (v19) y Vite (v8). Control de rutas dinámicas mediante React Router DOM (v7). Animaciones de transición fluida con Framer Motion (usando AnimatePresence mode="wait"). Estilo responsivo moderno implementado con TailwindCSS. Iconografía a través de Lucide React y visualización de reportes gráficos financieros mediante Recharts.
   - Tecnologías Backend: Servidor REST API en Node.js con Express (v4), CORS habilitado, base de datos local SQLite (sqlite3) y gestión de carga de archivos multimedia mediante Multer.

2. PERSISTENCIA DE DATOS Y ESTRUCTURA DE BD (server/db.js):
   - Conexión e Inicialización Autónoma: La base de datos es local y autohospedada en "novaedu.db" usando SQLite3. Al arrancar el servidor, verifica dinámicamente si la tabla "users" existe en "sqlite_master". Si no, corre automáticamente la función "seedDatabase()" para levantar las tablas y poblar los datos de prueba, lo que proporciona alta portabilidad al no depender de servidores de bases de datos externos.
   - Tablas Creadas e Inicializadas:
     * users: Almacena id, username, password (cifrado con sal única), name, role ('admin', 'teacher', 'student'), y campus.
     * login_failures: Almacena username, count (intentos fallidos) y locked_until (marca de tiempo de bloqueo).
     * audit_logs: Registra id, user_id, action, details, y timestamp para traza de auditoría.
     * compliance_settings: Almacena configuraciones dinámicas de conformidad (key, value) como 'mfa_enabled', 'password_strength', 'session_timeout', 'db_encryption' y 'failed_attempts_limit'.
     * modules: Controla el acceso dinámico a módulos y menús según el rol del usuario ('admin', 'teacher', 'student' o 'all').
     * Otras tablas operativas: schedule (horarios de clase), grades (calificaciones), invoices (pagos y facturas), attendance (asistencia diaria), subjects (materias asignadas), assignments (tareas), exams (exámenes), submissions (entregas de tareas), comments (comentarios y retroalimentación), forums, classroom_posts, tutorings, library_resources, library_reservations, messages (mensajería interna) y student_observations.

3. LÓGICA DEL BACKEND Y MIDDLEWARES (server/index.js):
   - Endpoint de Autenticación (/api/auth/login):
     * Control de reintentos: Primero comprueba en 'login_failures' si la cuenta está bloqueada temporalmente. Si 'locked_until' es mayor a la hora actual, rechaza el login indicando el tiempo de espera restante.
     * Si las credenciales fallan, incrementa el contador de fallos. Al superar el límite parametrizado en 'failed_attempts_limit' de 'compliance_settings' (por defecto 5), actualiza la tabla de fallos bloqueando la cuenta por 15 minutos e inserta una entrada de tipo 'LOCKOUT' en los logs de auditoría.
     * Si las credenciales son correctas, limpia los fallos acumulados, registra un log de auditoría 'LOGIN' y genera un token JWT firmado.
   - Middleware de Autenticación (server/middleware/auth.js):
     * Intercepta todas las llamadas HTTP seguras mediante el middleware 'authenticateToken'. Extrae el token tipo Bearer de las cabeceras de autorización ('authorization'), valida su autenticidad mediante 'jwt.verify' utilizando la clave secreta y añade el payload con los datos del usuario al objeto de la solicitud (req.user) para posterior validación de permisos (RBAC).

4. ESTRUCTURA Y MÓDULOS DEL FRONTEND (src/App.jsx y src/pages/):
   - Proveedor de Autenticación (src/context/AuthContext.jsx): Gestiona el estado de sesión de React globalmente. Almacena y recupera el token y el perfil del usuario en localStorage. La función 'login' implementa un AbortController para abortar la petición con un timeout de 10 segundos en caso de desconexión del servidor backend.
   - Rutas Protegidas y Navegación: Componente 'ProtectedRoute' que envuelve el acceso a páginas seguras.
   - Módulos por Rol de Usuario:
     * Estudiantes y Comunes: Dashboard del Estudiante, AcademicRecord (Historial Académico y notas del alumno), FinancialStatus (Estado financiero, saldo e historial de invoices/facturas), VirtualClassroom (Aulas Virtuales y comunicación directa), TeacherEvaluation (Evaluación del profesorado por parte del alumno), StudentSchedule (Horario semanal detallado), StudentLibrary (Recursos y reservación de libros físicos/digitales), StudentTutoring (Solicitud y agendamiento de tutorías académicas), y MessagingCenter (Bandeja de entrada y salida de mensajería interna).
     * Docentes: TeacherDashboard (Resumen de clases), TeacherSubjects (Materias a cargo), TeacherAssignments (Publicación de tareas y revisión de entregas), TeacherExams (Diseño y corrección de exámenes), TeacherForums (Foros de discusión académica), TeacherReports (Reportes del aula y rendimiento), TeacherGradebook (Registro de notas y promedio de evaluaciones), TeacherAttendance (Registro diario y porcentual de asistencias), y TeacherClassroom (LMS para publicación de avisos y recursos).
     * Administradores: AdminDashboard (Métricas agregadas financieras y de matrículas con Recharts, gráficos de ingresos mensuales por sedes), FinancialReports (Estados financieros de caja), Gestión de Usuarios (Creación y eliminación de cuentas administrativas, de alumnos y profesores con asignación de sedes) y el Control de Conformidad ISO.

---
### NORMAS ISO DE CUMPLIMIENTO OBLIGATORIO EN EL INFORME:

1. ISO/IEC 27001 (Sistema de Gestión de Seguridad de la Información):
   - Control de Acceso (A.9): Implementado mediante autenticación centralizada por JWT (JSON Web Tokens), cookies de sesión simuladas en localStorage y validación de firma en cabeceras HTTP. Protección del lado del cliente (ProtectedRoute) y del lado del servidor (middleware authenticateToken).
   - Criptografía (A.10): Contraseñas del sistema almacenadas de forma irreversible mediante hashing SHA-256 enriquecidas con una sal aleatoria única de 16 bytes por usuario generada con 'crypto.randomBytes()'. Validación robusta de hash.
   - Registro y Evidencias/Auditoría (A.12.4): Registro de trazabilidad permanente en la tabla 'audit_logs' que documenta fecha, hora, ID del usuario ejecutor, tipo de evento (LOGIN, LOCKOUT, CREATE_USER) y detalles adicionales.
   - Prevención del abuso/Fuerza Bruta (A.18.1.5): Mecanismo de lockout dinámico implementado en el endpoint de autenticación con bloqueo de cuenta temporal por 15 minutos en 'login_failures'.

2. ISO/IEC 25010 (Calidad del Producto de Software):
   - Adecuación Funcional: Lógica de negocio restringida que renderiza y autoriza módulos dinámicamente según el rol.
   - Seguridad: Resguardo de endpoints por token y mitigación de inyección de código/SQL mediante consultas parametrizadas sobre SQLite.
   - Mantenibilidad: Desacoplamiento completo del backend en Express con controladores dedicados por dominio (routes/student.js y routes/teacher.js) y frontend ordenado en páginas independientes, componentes reutilizables y contextos.
   - Usabilidad: Interfaz de usuario enriquecida responsiva con TailwindCSS, transiciones interactivas con Framer Motion e iconografía consistente con Lucide React.
   - Portabilidad: Uso de SQLite como base de datos autocontenida que facilita la portabilidad inmediata del software en entornos locales sin dependencias complejas.

3. ISO 9001 (Aseguramiento de Calidad del Proceso de Desarrollo):
   - Estandarización de Configuración: Uso de ESLint (eslint.config.js) para asegurar la uniformidad en las reglas de escritura y estilo de código JavaScript/React.
   - Consistencia Operacional: Configuración estricta del empaquetado del cliente en vite.config.js y jsconfig.json.
   - Pruebas y Prácticas de Validación: Existencia de scripts dedicados de testing de API (server/test_api.js) para control de errores y validación continua antes de la fase de integración o despliegue.

---
### ESTRUCTURA DEL INFORME A GENERAR:

Redacta un informe sumamente extenso, técnico y con el mayor nivel de detalle posible estructurado en los siguientes capítulos:

Capítulo 1: Resumen Ejecutivo e Introducción del Proyecto NovaEdu.
Capítulo 2: Arquitectura del Sistema y Orquestación Concurrente (Explicar dev.js y la infraestructura cliente-servidor desacoplada).
Capítulo 3: Diseño Técnico de la Base de Datos Relacional (SQLite) y su Modelo de Datos (Explicar la inicialización autónoma y detallar las tablas clave y su propósito).
Capítulo 4: Implementación de la Lógica de Negocio y Ruteo del Backend (Detallar los endpoints de express de student.js y teacher.js).
Capítulo 5: Implementación de la Interfaz de Usuario y Ruteo del Frontend (Detallar AuthContext, ProtectedRoute, el flujo de navegación de App.jsx y la experiencia de usuario con Framer Motion y TailwindCSS).
Capítulo 6: Auditoría y Cumplimiento del Estándar ISO/IEC 27001 (Detallar los algoritmos de hashing de db.js, la bitácora de auditoría en audit_logs y el algoritmo de bloqueo en login_failures).
Capítulo 7: Garantía de Calidad bajo el Estándar ISO/IEC 25010 y Estándares de Proceso ISO 9001 (Mantenibilidad, portabilidad, seguridad del software y estandarización del código con ESLint).
Capítulo 8: Conclusiones, Evaluación de Riesgos y Hoja de Ruta para NovaEdu v2.0.

Redacta de forma formal y académica, incorporando ejemplos de código real en base a los datos suministrados para cada funcionalidad y mecanismo técnico mencionado.
```
