# TaskFlow — Frontend

Interfaz web de usuario (SPA) para TaskFlow basada en un tablero Kanban interactivo. Permite a los usuarios registrarse, iniciar sesión, crear tareas, cambiar su estado entre columnas ("Pendiente", "En progreso", "Completada") y eliminarlas en tiempo real comunicándose con la API backend.

## Stack

- React 18 + Vite
- React Router (HashRouter para compatibilidad con GitHub Pages)
- Axios (con interceptor de autenticación Bearer)
- CSS modular con animaciones y diseño responsivo

## Cómo correrlo localmente

```bash
npm install
cp .env.example .env
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173/`.

## Build de producción

```bash
npm run build
```

`npm run build` genera `dist/` con los archivos estáticos ya optimizados. En este proyecto no se sube a mano: el workflow `.github/workflows/deploy-pages.yml` corre ese mismo comando en cada push a `main` y publica el resultado en GitHub Pages automáticamente.
