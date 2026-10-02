<template>
  <div class="dashboard-layout">
    <!-- Barra Lateral (Sidebar) -->
    <!-- Barra Lateral (Sidebar) -->
    <aside class="sidebar" :class="{ 'sidebar-abierta': menuAbierto }">
      <div class="sidebar-header">
        <span class="logo"><img src="../assets/unpaz.png" alt="Logo Universidad" /></span>
      </div>
      <nav class="sidebar-nav">
        <ul>
          <li :class="{ active: vistaActual === 'inicio' }" @click="vistaActual = 'inicio'">Inicio</li>
          <li :class="{ active: vistaActual === 'horarios' }" @click="vistaActual = 'horarios'">Horarios</li>
          <li :class="{ active: vistaActual === 'materias' }" @click="vistaActual = 'materias'">Materias</li>
          <li :class="{ active: vistaActual === 'aulas' }" @click="vistaActual = 'aulas'">Aulas</li>
          <li :class="{ active: vistaActual === 'ver-avisos' }" @click="vistaActual = 'ver-avisos'">Ver Avisos</li>
          <li :class="{ active: vistaActual === 'crear-aviso' }" @click="vistaActual = 'crear-aviso'">Crear Aviso</li>
        </ul>
      </nav>
      <div class="sidebar-footer">
        <button @click="logout" class="btn-logout">Cerrar Sesión</button>
      </div>
    </aside>
    <!-- Contenido Principal -->
    <main class="dashboard-content">
      <header class="content-header">
        <h1>Gestión de avisos</h1>
        <div class="user-info">admin@universidad.edu.ar</div>
      </header>
      
      <div class="content-body">
        
        <!-- PANTALLAS EN CONSTRUCCIÓN (Placeholders) -->
        <!-- PANEL DE INICIO (Estadísticas) -->
        <div v-if="vistaActual === 'inicio'" class="card-placeholder fade-in">
          <h3>Resumen del Sistema</h3>
          <p>Métricas principales de la plataforma.</p>
          
          <div class="stats-grid">
            <div class="stat-card">
              <span class="stat-title">Avisos Activos: </span>
              <span class="stat-value">{{ totalAvisos }}</span>
            </div>
            <!-- Podés agregar más tarjetas acá en el futuro para aulas, materias, etc. -->
          </div>
        </div>


        <div v-else-if="vistaActual === 'horarios'" class="card-placeholder fade-in">
          <h3>Gestión de Horarios</h3>
          <p>Módulo para asignar materias a las aulas.</p>
        </div>

        <div v-else-if="vistaActual === 'materias'" class="card-placeholder fade-in">
          <h3>Gestión de Materias</h3>
          <p>Módulo para materias y carreras.</p>
        </div>

        <div v-else-if="vistaActual === 'aulas'" class="card-placeholder fade-in">
          <h3>Gestión de Aulas</h3>
          <p>Módulo para administrar las aulas por piso.</p>
        </div>

        <!-- MOCKUP: VER AVISOS -->
        <div v-else-if="vistaActual === 'ver-avisos'" class="card-placeholder fade-in">
          <h3>Lista de avisos</h3>
          <p>Avisos que se están mostrando actualmente</p>

          <div v-if="isLoading" class="table-loading">Cargando avisos...</div>

          <div v-else>
            <table class="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Título</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="aviso in listaAvisos" :key="aviso.id_aviso">
                  <td>{{ aviso.id_aviso }}</td>
                  <td>{{ aviso.titulo }}</td>
                  <td>{{ new Date(aviso.fecha_publicacion).toLocaleDateString('es-AR') }}</td>
                  <td>
                    <span class="badge" :class="aviso.estado === 'ACTIVO' ? 'active' : aviso.estado === 'BORRADOR' ? 'draft' : 'inactive'">
                      {{ aviso.estado }}
                    </span>
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-sm edit" @click="iniciarEdicion(aviso)">Editar</button>
                      <button class="btn-sm delete" @click="eliminarAviso(aviso.id_aviso)">Borrar</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <div v-if="avisoEditandoId !== null" class="edit-panel">
              <h4>Editar aviso</h4>
              <form @submit.prevent="guardarEdicionAviso" class="form-crear">
                <div class="input-group">
                  <label for="titulo-editar">Título del Aviso</label>
                  <input id="titulo-editar" v-model="formularioEdicion.titulo" type="text" placeholder="Ej: Cambio de aula para ...." required>
                </div>

                <div class="input-group">
                  <label for="contenido-editar">Contenido / Detalles</label>
                  <textarea id="contenido-editar" v-model="formularioEdicion.contenido" rows="4" placeholder="Cuerpo del mensaje..." required></textarea>
                </div>

                <div class="form-actions">
                  <button type="submit" class="btn-primary">Guardar cambios</button>
                  <button type="button" class="btn-secondary" @click="cancelarEdicion">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- MOCKUP: CREAR AVISO -->
        <div v-else-if="vistaActual === 'crear-aviso'" class="card-placeholder fade-in">
          <h3>Crear Nuevo Mensaje</h3>
          <p>Escriba un nuevo aviso para publicarlo en las pantallas de la uni</p>
          
          <form @submit.prevent="crearAviso" class="form-crear">
            
            <div class="input-group">
              <label for="titulo">Título del Aviso</label>
              <input type="text" id="titulo" v-model="formularioAviso.titulo" placeholder="Ej: Cambio de aula para ...." required>
            </div>

            <div class="input-group">
              <label for="edificio">Edificio al que pertenece</label>
              <select id="edificio" v-model="formularioAviso.id_edificio" class="dark-select">
                <option value="">-- Todos los edificios --</option>
                <option :value="1">Sede Alem (Central)</option>
                <option :value="2">Sede Pueyrredón (CEM)</option>
                <option :value="3">Sede Arregui (Medicina)</option>
              </select>
            </div>
            <div class="input-group">
              <label for="contenido">Contenido / Detalles</label>
              <textarea id="contenido" rows="4" v-model="formularioAviso.contenido" placeholder="Cuerpo del mensaje (máx 100 caracteres)..." maxlength="100" required></textarea>
              <small style="text-align: right; color: #666; font-weight: bold;">
                {{ formularioAviso.contenido.length }} / 100
              </small>
            </div>
            <div style="display: flex; gap: 1rem; margin-bottom: 1rem;">
              <div class="input-group" style="flex: 1;">
                <label for="fecha_desde">Mostrar desde:</label>
                <input type="datetime-local" id="fecha_desde" v-model="formularioAviso.fechaDesde" required>
              </div>

              <div class="input-group" style="flex: 1;">
                <label for="fecha_hasta">Ocultar el:</label>
                <input type="datetime-local" id="fecha_hasta" v-model="formularioAviso.fechaHasta" required>
              </div>
            </div>
            <button type="submit" class="btn-primary">Publicar Mensaje</button>
          </form>
          <div class="preview-container">

          <h4>Vista Previa del aviso</h4>
          <div class="totem-mockup">
            <!-- Si el input está vacío se muestra esto por defecto -->
            <h2>{{ formularioAviso.titulo || 'Titulo' }}</h2>
            <p>{{ formularioAviso.contenido || 'Sin contenido' }}</p>
          </div>
        </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api, { clearAuthSession } from '../services/app.js'

const router = useRouter()
const totalAvisos = ref(0)
const vistaActual = ref('ver-avisos')
const listaAvisos = ref([])
const formularioAviso = ref({ titulo: '', contenido: '' })
const formularioEdicion = ref({ titulo: '', contenido: '' })
const avisoEditandoId = ref(null)
const isLoading = ref(false)

const obtenerAvisos = async () => {
  isLoading.value = true

  try {
    const { data } = await api.get('/avisos')
    const avisos = Array.isArray(data) ? data : []
    listaAvisos.value = avisos
    totalAvisos.value = avisos.length
  } catch (error) {
    console.error('Error al cargar avisos:', error)
    alert('No se pudieron cargar los avisos. Intentá nuevamente.')
  } finally {
    isLoading.value = false
  }
}

const crearAviso = async () => {
  if (!formularioAviso.value.titulo.trim() || !formularioAviso.value.contenido.trim()) {
    alert('Completá título y contenido antes de publicar.')
    return
  }

  try {
    const fechaPub = formularioAviso.value.fechaDesde.replace('T', ' ') + ':00';
    const fechaVenc = formularioAviso.value.fechaHasta.replace('T', ' ') + ':00';

    const arregloEdificios = formularioAviso.value.id_edificio 
      ? [Number(formularioAviso.value.id_edificio)] 
      : [];

    const nuevoAviso = {
      titulo: formularioAviso.value.titulo.trim(),
      descripcion: formularioAviso.value.contenido.trim(),
      fecha_publicacion: fechaPub,
      fecha_vencimiento: fechaVenc,
      id_categoria: 1,
      edificios: arregloEdificios,
      carreras: []
    }
    await api.post('/avisos', nuevoAviso)

    alert('¡Aviso publicado correctamente!')
    formularioAviso.value = { titulo: '', contenido: '', id_edificio: '', fechaDesde: '', fechaHasta: '' }
    
    await obtenerAvisos()
    vistaActual.value = 'ver-avisos'
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.response?.data?.message || 'No se pudo publicar el aviso.'
    alert(mensaje)
  }
}

const iniciarEdicion = (aviso) => {
  avisoEditandoId.value = aviso.id_aviso
  formularioEdicion.value = {
    titulo: aviso.titulo || '',
    contenido: aviso.descripcion || aviso.contenido || ''
  }
}

const cancelarEdicion = () => {
  avisoEditandoId.value = null
  formularioEdicion.value = { titulo: '', contenido: '' }
}

const guardarEdicionAviso = async () => {
  if (!avisoEditandoId.value) return

  if (!formularioEdicion.value.titulo.trim() || !formularioEdicion.value.contenido.trim()) {
    alert('Completá título y contenido antes de guardar los cambios.')
    return
  }

  try {
    const fechaActual = new Date().toISOString().slice(0, 19).replace('T', ' ')
    const fechaVencimiento = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ')

    const avisoActualizado = {
      titulo: formularioEdicion.value.titulo.trim(),
      descripcion: formularioEdicion.value.contenido.trim(),
      fecha_publicacion: fechaActual,
      fecha_vencimiento: fechaVencimiento,
      id_categoria: 1,
      edificios: [],
      carreras: []
    }

    await api.put(`/avisos/${avisoEditandoId.value}`, avisoActualizado)

    alert('Aviso actualizado correctamente.')
    cancelarEdicion()
    await obtenerAvisos()
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.response?.data?.message || 'No se pudo editar el aviso.'
    alert(mensaje)
  }
}

const eliminarAviso = async (id) => {
  const confirmado = confirm('¿Estás seguro de eliminar este aviso definitivamente?')
  if (!confirmado) return

  try {
    await api.delete(`/avisos/${id}`)
    alert('Aviso eliminado correctamente.')
    await obtenerAvisos()
  } catch (error) {
    const mensaje = error.response?.data?.mensaje || error.response?.data?.message || 'Error al intentar eliminar el aviso.'
    alert(mensaje)
  }
}

const logout = () => {
  clearAuthSession()
  router.push('/login')
}

onMounted(() => {
  obtenerAvisos()
})
</script>

<style scoped>
/* --- ESTRUCTURA PRINCIPAL --- */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f0f2f5;
}

.sidebar {
  width: 260px;
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
.logo { font-size: 1.8rem; }

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
  transition: all 0.2s;
  color: #ccc;
  font-weight: 500;
}

.sidebar-nav li:hover {
  background-color: rgba(255,255,255,0.05);
  color: white;
}

/* Estilo para la opción seleccionada */
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
  font-size: 1.4rem;
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

/* --- TABLAS (VER MSJ) --- */
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
}

.data-table th, .data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

.data-table th {
  background-color: #f9f9f9;
  color: #0A192F;
  font-weight: bold;
}

.table-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: bold;
}
.badge.active {
  background-color: #d4edda;
  color: #155724;
}

.badge.inactive {
  background-color: #f8d7da;
  color: #721c24;
}
.badge.BORRADOR {
  background-color: #e2e3e5;
  color: #383d41;
}

.btn-sm.edit {
  background-color: #2563eb;
  color: white;
  border: 1px solid #2563eb;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm.edit:hover {
  background-color: #1d4ed8;
}

.btn-sm.delete {
  background-color: transparent;
  color: #d93025;
  border: 1px solid #d93025;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm.delete:hover {
  background-color: #d93025;
  color: white;
}
.logo {
  display: flex;
  justify-content: center; /* Centra la imagen horizontalmente */
  margin-bottom: 1rem;
}

.logo img {
  width: 100%;       /* Ocupa el ancho máximo permitido por su contenedor*/
  max-width: 250px;  /* nunca pasará de los 250px para no quedar gigante */
  height: auto;      /* Mantiene la proporción original sin deformarse */
  object-fit: contain; /* Asegura que la imagen encaje perfectamente */
}

.preview-container {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px dashed #ccc;
}
.totem-mockup {
  background-color: #00A8E8;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  min-height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}


/* --- FORMULARIO (CREAR MSJ) --- */
/*.form-crear {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  max-width: 600px;
}
*/
.edit-panel {
  margin-top: 1.5rem;
  padding: 1.25rem;
  border: 1px solid #dbeafe;
  border-radius: 12px;
  background: #f8fbff;
}

.edit-panel h4 {
  margin: 0 0 1rem;
  color: #0f172a;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-secondary {
  border: 1px solid #cbd5e1;
  background: white;
  color: #0f172a;
  padding: 0.8rem 1.2rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #f8fafc;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-weight: bold;
  color: #0A192F;
}

.input-group input, .input-group textarea {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  font-family: inherit;
}

.input-group input:focus, .input-group textarea:focus {
  border-color: #00A8E8;
  box-shadow: 0 0 5px rgba(0, 168, 232, 0.3);
}

.btn-primary {
  background-color: #00A8E8;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  align-self: flex-start;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #008fca;
}

</style>
