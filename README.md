# DAW API - Sistema de Autenticación

## Descripción

API REST desarrollada con Node.js y Express que implementa un sistema completo de autenticación de usuarios con JWT (JSON Web Tokens). La aplicación proporciona funcionalidades para registro, inicio de sesión, cierre de sesión y acceso a recursos protegidos.

## Integrantes del Proyecto

- **Bryan Anderson Crespín Ramos**
- **Luis Enrique Cruz Ramírez**
- **Adriana Eunice Flores Hernández**
- **Daniel Alexander Girón Cornejo**
- **Emmanuel Zenon Lobo Chavarría**
- **Jose Ricardo Mendez Zelaya**

## Características

- ✅ Registro de usuarios con validación
- ✅ Autenticación mediante JWT
- ✅ Cifrado de contraseñas con bcrypt
- ✅ Gestión de sesiones activas
- ✅ Endpoints protegidos
- ✅ Pruebas automatizadas con Jest
- ✅ Base de datos en memoria (para desarrollo/testing)

## Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **JWT** - Autenticación basada en tokens
- **bcryptjs** - Cifrado de contraseñas
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs
- **Nodemon** - Desarrollo con recarga automática

## Estructura del Proyecto

```
investigacion-aplicada-2/
├── src/
│   ├── app.js          # Configuración principal de la aplicación
│   └── server.js       # Servidor HTTP
├── tests/
│   ├── register.test.js    # Pruebas de registro
│   ├── login.test.js       # Pruebas de login
│   ├── logout.test.js      # Pruebas de logout
│   └── protected.test.js   # Pruebas de endpoints protegidos
├── package.json        # Dependencias y scripts
└── README.md          # Documentación
```

## Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Adri0205/investigacion-aplicada-2.git
   cd investigacion-aplicada-2
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (opcional):**
   ```bash
   # Crear archivo .env en la raíz del proyecto
   PORT=3000
   JWT_SECRET=tu_clave_secreta_aqui
   ```

## Uso

### Iniciar el servidor en modo desarrollo

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

### Ejecutar pruebas

```bash
npm test
```

## Endpoints de la API

### 1. Registro de Usuario

**POST** `/api/register`

Registra un nuevo usuario en el sistema.

**Body:**
```json
{
  "username": "nuevo_usuario",
  "password": "password_seguro",
  "email": "correo@ejemplo.com"
}
```

**Respuestas:**
- `201` - Usuario creado exitosamente
- `400` - Faltan campos obligatorios
- `409` - Usuario o email ya existe
- `500` - Error del servidor

**Ejemplo de respuesta exitosa:**
```json
{
  "message": "Usuario creado",
  "user": {
    "id": "1693834567890",
    "username": "nuevo_usuario",
    "email": "correo@ejemplo.com"
  }
}
```

### 2. Inicio de Sesión

**POST** `/api/login`

Autentica un usuario y devuelve un token JWT.

**Body:**
```json
{
  "username": "nuevo_usuario",
  "password": "password_seguro"
}
```

**Respuestas:**
- `200` - Login exitoso
- `400` - Faltan campos requeridos
- `401` - Credenciales inválidas

**Ejemplo de respuesta exitosa:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Cierre de Sesión

**POST** `/api/logout`

Cierra la sesión del usuario invalidando el token.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuestas:**
- `200` - Sesión cerrada correctamente
- `401` - Falta token
- `403` - Token inválido o expirado

### 4. Endpoint Protegido

**GET** `/api/protegido`

Endpoint de ejemplo que requiere autenticación.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuestas:**
- `200` - Acceso autorizado
- `401` - Falta token
- `403` - Token inválido o expirado

**Ejemplo de respuesta exitosa:**
```json
{
  "message": "Accediste a un endpoint protegido ✅"
}
```

## Ejemplos de Uso

### Flujo completo de autenticación

1. **Registrar usuario:**
   ```bash
   curl -X POST http://localhost:3000/api/register \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "testpass123",
       "email": "test@example.com"
     }'
   ```

2. **Iniciar sesión:**
   ```bash
   curl -X POST http://localhost:3000/api/login \
     -H "Content-Type: application/json" \
     -d '{
       "username": "testuser",
       "password": "testpass123"
     }'
   ```

3. **Acceder a recurso protegido:**
   ```bash
   curl -X GET http://localhost:3000/api/protegido \
     -H "Authorization: Bearer <tu_token_aqui>"
   ```

4. **Cerrar sesión:**
   ```bash
   curl -X POST http://localhost:3000/api/logout \
     -H "Authorization: Bearer <tu_token_aqui>"
   ```

## Seguridad

- **Contraseñas cifradas**: Todas las contraseñas se almacenan usando bcrypt con salt
- **Tokens JWT**: Autenticación basada en tokens con expiración de 1 hora
- **Gestión de sesiones**: Los tokens se invalidan al hacer logout
- **Validación de entrada**: Verificación de campos obligatorios y formatos

## Testing

El proyecto incluye pruebas automatizadas que cubren:

- ✅ Registro de usuarios (exitoso, campos faltantes, duplicados)
- ✅ Inicio de sesión (credenciales válidas e inválidas)
- ✅ Cierre de sesión
- ✅ Acceso a endpoints protegidos

Para ejecutar las pruebas:

```bash
npm test
```

Las pruebas utilizan una configuración especial con:
- Variable de entorno `JWT_SECRET=testsecret`
- Modo `NODE_ENV=test`
- Ejecución secuencial (`--runInBand`)

## Notas de Desarrollo

- **Base de datos**: Actualmente utiliza almacenamiento en memoria para desarrollo y testing
- **Configuración**: El proyecto usa variables de entorno para configuración sensible
- **Desarrollo**: Utiliza nodemon para recarga automática durante el desarrollo

## Scripts Disponibles

- `npm run dev` - Inicia el servidor en modo desarrollo con nodemon
- `npm test` - Ejecuta las pruebas automatizadas

## Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `PORT` | Puerto del servidor | `3000` |
| `JWT_SECRET` | Clave secreta para JWT | `devsecret` |
| `NODE_ENV` | Entorno de ejecución | - |

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia ISC.

## Autor

Desarrollado como parte del proyecto de investigación aplicada.
