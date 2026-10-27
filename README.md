# Notas Backend (NestJS)

Backend para la gestión de notas adhesivas desarrollado con **NestJS**, siguiendo los conceptos de arquitectura y diseño vistos en la cátedra de **Sistemas Distribuidos**.

## 🏛️ Arquitectura del Sistema

El proyecto sigue una estricta separación de responsabilidades en capas:

1. **Pipeline de Requests / Middlewares:**
   - `LoggerMiddleware`: intercepta todos los pedidos HTTP entrantes (`[METHOD] /url`) para trazabilidad de requests.
   - `ValidationPipe`: valida y transforma los payloads entrantes (`DTOs`) aplicando `whitelist: true`.
   - `CORS`: habilitado para permitir la comunicación fluida con el frontend (Next.js).

2. **Controlador (`NotasController`):**
   - Expone los endpoints REST bajo el prefijo `/api/notas`.
   - Únicamente recibe las peticiones HTTP (`@Body`, `@Param`, `@Query`), valida parámetros (`ParseUUIDPipe`) y delega la ejecución al servicio. No contiene lógica de negocio.
   - Documentado integralmente con decoradores de **Swagger/OpenAPI**.

3. **Servicio (`NotasService`):**
   - Contiene la **lógica de negocio** y las reglas de dominio.
   - Inyecta el repositorio mediante **Inyección de Dependencias (DI)**.
   - Lanza excepciones HTTP estándar de NestJS (`NotFoundException`) cuando un recurso no existe.

4. **Repositorio (`NotasRepository`):**
   - Actúa como intermediario entre la lógica de negocio y la capa de persistencia.
   - Utiliza la base de datos JSON (`JsonDb`) provista para el almacenamiento local y atómico de los datos.

---

## 🚀 Requisitos y Ejecución

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Ejecución en desarrollo
```bash
npm run start:dev
```
* **API:** `http://localhost:3001/api`
* **Swagger (Documentación interactiva):** `http://localhost:3001/docs`

### 3. Compilación para producción
```bash
npm run build
npm run start:prod
```

---

## 🧪 Pruebas (Testing)

### Tests Unitarios del Servicio
Se prueban las reglas de negocio del `NotasService` aislando el repositorio con mocks:
```bash
npm run test
```

### Tests End-to-End (E2E)
Pruebas integrales de los endpoints HTTP con la app completa:
```bash
npm run test:e2e
```

---

## 📋 Endpoints de la API (`/api/notas`)

| Método | Endpoint | Descripción | Body / Params | Código Exitoso |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/notas` | Listar todas las notas | - | `200 OK` |
| `GET` | `/api/notas/:id` | Obtener una nota por UUID | `:id` (UUID) | `200 OK` |
| `POST` | `/api/notas` | Crear una nueva nota | `CreateNotaDto` | `201 Created` |
| `PATCH` | `/api/notas/:id` | Modificar parcialmente una nota | `:id` + `UpdateNotaDto` | `200 OK` |
| `DELETE` | `/api/notas/:id` | Eliminar una nota | `:id` (UUID) | `200 OK` |
