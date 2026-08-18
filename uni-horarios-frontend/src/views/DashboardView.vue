<template>
  <div class="dashboard-layout">
    <!-- Barra Lateral (Sidebar) -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <span class="logo">🎓</span>
        <h2>Admin</h2>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li class="active">🏠 Inicio</li>
          <li>📅 Horarios</li>
          <li>📚 Materias</li>
          <li>🏫 Aulas</li>
          <li>📢 Avisos</li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <main class="dashboard-content">
      <header class="content-header">
        <h1>Panel de Control</h1>
        <div class="user-info">admin@universidad.edu.ar</div>
      </header>
      
      <div class="content-body">
        <!-- Aquí adentro irán las tablas y formularios CRUD en el futuro -->
        <div class="card-placeholder">
          <h3>Gestión de Avisos</h3>
          <p>Seleccioná una opción del menú lateral para administrar el contenido del Tótem.</p>
          <button class="btn-primary">+ Nuevo Aviso</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const logout = () => {
  // Simulamos cerrar sesión y volvemos al login
  router.push('/login')
}
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f0f2f5;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: #0A192F;
  color: white;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.sidebar-header h2 { margin: 0; }
.logo { font-size: 1.5rem; }

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #ccc;
}

.sidebar-nav li:hover {
  background-color: rgba(255,255,255,0.05);
  color: white;
}

.sidebar-nav li.active {
  background-color: #00A8E8;
  color: white;
  border-left: 4px solid #FFD700;
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout {
  width: 100%;
  background: none;
  border: 1px solid #ccc;
  color: white;
  padding: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #ff4d4f;
  border-color: #ff4d4f;
}

/* Contenido Principal */
.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  background-color: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.content-header h1 {
  margin: 0;
  color: #0A192F;
  font-size: 1.5rem;
}

.user-info {
  color: #666;
  font-weight: 500;
}

.content-body {
  padding: 2rem;
}

.card-placeholder {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  border-top: 4px solid #00A8E8;
}

.btn-primary {
  background-color: #00A8E8;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 1rem;
}

.btn-primary:hover {
  background-color: #008fca;
}
</style>