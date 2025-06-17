# API Servicio Técnico

Sistema de gestión para servicios técnicos de dispositivos, incluyendo manejo de clientes, órdenes de servicio, técnicos y más.

## Requisitos

- Node.js v18 o superior
- PostgreSQL 12 o superior
- npm o yarn

## Configuración

1. Clonar el repositorio
```bash
git clone <repository-url>
cd servidorServicioTecnico
```

2. Instalar dependencias
```bash
npm install
```

3. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus configuraciones
```

4. Ejecutar migraciones
```bash
npm run migrate
```

5. Iniciar el servidor
```bash
npm run dev  # Desarrollo
npm start    # Producción
```

## Estructura del Proyecto

```
servidorServicioTecnico/
├── src/
│   ├── config/          # Configuraciones (DB, logger, swagger)
│   ├── controllers/     # Controladores de la API
│   ├── middlewares/     # Middlewares personalizados
│   ├── models/          # Modelos Sequelize
│   ├── routes/          # Rutas de la API
│   └── utils/           # Utilidades y helpers
├── logs/                # Archivos de log
└── tests/               # Tests
```

## Documentación API

La documentación de la API está disponible en:
- Desarrollo: http://localhost:4100/api-docs
- Producción: https://tu-dominio.com/api-docs

## Manejo de Errores

El sistema utiliza una estructura estandarizada para el manejo de errores:

```javascript
// Ejemplo de manejo de errores en controladores
try {
  // Código
} catch (error) {
  next(new ValidationError('Mensaje de error'));
}
```

### Tipos de Errores Disponibles

- `ValidationError` (400)
- `AuthenticationError` (401)
- `AuthorizationError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `DatabaseError` (500)

## Respuestas Estandarizadas

### Respuesta Exitosa
```json
{
  "status": "success",
  "message": "Operación exitosa",
  "data": {},
  "metadata": {}
}
```

### Respuesta Paginada
```json
{
  "status": "success",
  "data": [],
  "metadata": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "pages": 5
    }
  }
}
```

## Scripts Disponibles

- `npm run dev`: Inicia el servidor en modo desarrollo
- `npm start`: Inicia el servidor en modo producción
- `npm run migrate`: Ejecuta las migraciones pendientes
- `npm run migrate:undo`: Revierte la última migración
- `npm test`: Ejecuta los tests

## Logging

Los logs se almacenan en la carpeta `logs/`:
- `error.log`: Errores y excepciones
- `combined.log`: Todos los logs

Configuración de logs:
- Rotación automática (5MB máximo por archivo)
- Máximo 5 archivos por tipo
- Formato JSON con timestamps
- Stack traces para errores

## Contribuir

1. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
2. Commit de tus cambios (`git commit -m 'Add amazing feature'`)
3. Push a la rama (`git push origin feature/amazing-feature`)
4. Crear un Pull Request

## Contacto

Soporte - soporte@printec.com
