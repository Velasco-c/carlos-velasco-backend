# Recruitment API — Clean Architecture + MySQL

API REST de reclutamiento con Node.js, Express, MySQL y Clean Architecture.

## Reglas de negocio

### Fuentes
`REFERRAL`, `INTERNAL`, `JOB_BOARD`, `OTHER`.

### Estados
- Postulación: `RECEIVED`, `IN_REVIEW`, `REJECTED`, `HIRED`.
- Vacante: `OPEN`, `CLOSED`.

### Duplicidad
1. `RECEIVED`, `IN_REVIEW` y `HIRED` bloquean una nueva postulación para la misma pareja candidato/vacante.
2. `REJECTED` activa un cooldown de 30 días desde `rejected_at`.
3. Después del cooldown, se permite una nueva postulación.
4. La base de datos protege contra carreras concurrentes mediante un índice/constraint equivalente: en MySQL se usa una columna generada para representar el estado bloqueante.

## Instalación

```bash
cp .env.example .env
npm install
mysql -u root -p < database/schema.sql
npm test
npm run dev
```

## Endpoints

- `POST /api/v1/candidates`
- `GET /api/v1/candidates/:id`
- `POST /api/v1/jobs`
- `GET /api/v1/jobs/:id`
- `PATCH /api/v1/jobs/:id/status`
- `POST /api/v1/applications`
- `GET /api/v1/applications`
- `GET /api/v1/applications/:id`
- `PATCH /api/v1/applications/:id/status`

## Cálculo de prioridad de referencia

- `< 50%` del requisito: `30 / LOW`
- `50% - <100%`: `60 / MEDIUM`
- `100% - <150%`: `80 / HIGH`
- `>=150%`: `100 / HIGH`
- requisito `0`: `100 / HIGH`

Estos umbrales quedan encapsulados en `src/domain/services/PriorityCalculator.js` para poder reemplazarlos por las reglas definitivas del negocio sin modificar el resto de la aplicación.
