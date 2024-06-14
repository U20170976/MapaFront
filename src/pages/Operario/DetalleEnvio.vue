<template>
  <div class="detalle-envio">
    <h2>Detalles del Envío {{ id }}</h2>
    <div>
      <p><strong>Fecha de Envío:</strong> {{ envio.fechaEnvio }}</p>
      <p><strong>Hora de Envío:</strong> {{ envio.horaEnvio }}</p>
      <!-- Agrega más detalles según tus necesidades -->
    </div>
    <router-link to="/">Volver a la lista</router-link>
  </div>
</template>

<script>
export default {
  name: 'DetalleEnvio',
  data() {
    return {
      id: null,
      envio: {}
    };
  },
  created() {
    this.id = this.$route.params.id; // Obtener el id del parámetro de la URL
    this.obtenerDetallesEnvio(); // Llamar a método para obtener los detalles del envío
  },
  methods: {
    obtenerDetallesEnvio() {
      // Simular obtención de detalles del envío (sustituye con tu lógica real)
      this.envio = {
        id: this.id,
        fechaEnvio: '2024-06-14',
        horaEnvio: '15:30'
        // Agrega más propiedades según tus datos
      };
    }
  }
};
</script>

<style scoped>
/* Estilos específicos para el componente DetalleEnvio */
.detalle-envio {
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
