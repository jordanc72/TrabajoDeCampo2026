<template>
  <!-- Todo lo que esté fuera del router-view se repite en todas las pantallas (ej. un footer o navbar global) -->
  <main>
    <router-view></router-view> <!-- Aquí se inyectan las Vistas -->
  </main>
</template>

<script setup>
// Por ahora no necesitamos lógica acá
</script>