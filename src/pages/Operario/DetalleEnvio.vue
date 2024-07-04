<template>
  <div class="detalle-envio">
    <h2>Detalles del Envío {{ envio.idEnvio }}</h2>
    <div class="detalle-contenido">
      <div class="envio-info">
        <h3>Datos del Envío</h3>
        <p><strong>Código de Envío:</strong> {{ envio.idEnvio }}</p>
        <p><strong>Ciudad Origen:</strong> {{ envio.ciudadOrigen }}</p>
        <p><strong>Ciudad Destino:</strong> {{ envio.ciudadDestino }}</p>
        <p><strong>Fecha de Envío:</strong> {{ envio.fechaEnvio }}</p>
        <p><strong>Hora de Envío:</strong> {{ envio.horaEnvio }}</p>
        <p><strong>Cantidad de Paquetes:</strong> {{ envio.cantidadPaquetes }}</p>
        <p><strong>Estado del Envío:</strong> {{ envio.estadoEnvio }}</p>
      </div>
      <div class="vuelos-info">
        <h3>Vuelos</h3>
        <div v-for="(vuelo, index) in paginatedVuelos" :key="vuelo.id" class="vuelo-card">
          <p><strong>Ciudad Origen:</strong> {{ getPaisByCodigo(vuelo.ciudadOrigen) }}</p>
          <p><strong>Ciudad Destino:</strong> {{ getPaisByCodigo(vuelo.ciudadDestino) }}</p>
          <p><strong>Hora de Salida:</strong> {{ vuelo.horaSalida }}</p>
          <p><strong>Hora de Llegada:</strong> {{ vuelo.horaLlegada }}</p>
          <p><strong>Capacidad de Carga Máxima:</strong> {{ vuelo.capacidadCargaMaxima }}</p>
          <p><strong>Capacidad de Carga Usada:</strong> {{ vuelo.capacidadCargaUsado }}</p>
          <p><strong>Fecha de Salida:</strong> {{ vuelo.fechaSalida }}</p>
          <p><strong>Fecha de Llegada:</strong> {{ vuelo.fechaLlegada }}</p>
          <p><strong>Tiempo Estimado de Vuelo:</strong> {{ vuelo.tiempoEstimadoVuelo }}</p>
        </div>
        <Pagination 
          :currentPage="currentPage" 
          :totalPages="totalPages" 
          @page-changed="handlePageChange"
        />
      </div>
    </div>
    <router-link to="/operario/listadoPaquetes" class="volver-boton">Volver a la lista</router-link>
  </div>
</template>

<script>
import axios from 'axios';
import Pagination from '@/components/Pagination.vue';
import config from '../../config';

let urlBase = config.urlBase,// aquí guardamos la base de la URL
    urlListarAeropuertos = '/api/aeropuertos';

export default {
  name: 'DetalleEnvio',
  components: {
    Pagination
  },
  data() {
    return {
      envio: JSON.parse(this.$route.query.envio),
      currentPage: 1,
      itemsPerPage: 1, // Cambia esto según el número de vuelos que deseas mostrar por página
      paisOrigen: '',
      paisDestino: '',
      lpaisesDestino: []
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.envio.ruta.vuelos.length / this.itemsPerPage);
    },
    paginatedVuelos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.envio.ruta.vuelos.slice(start, end);
    }
  },
  methods: {
    handlePageChange(page) {
      this.currentPage = page;
    },
    async fetchPaisesDestino() {
      try {
        const response = await axios.get(urlBase + urlListarAeropuertos);
        this.lpaisesDestino = response.data.sort((a, b) => {
          
          // Si a.pais y b.pais son cadenas de texto, se pueden comparar directamente
          if (a.pais < b.pais) return -1;
          if (a.pais >= b.pais) return 1;
          return 0;
        });
      } catch (error) {
        console.log("Error al cargar los países");
        this.error = 'Error al cargar los datos';
        this.errorMessage = 'Error al cargar los países';  // Establece el mensaje de error
        console.error(error);
      }
    },
    getPaisByCodigo(codigo) {
      const aeropuerto = this.lpaisesDestino.find(paisMundo => paisMundo.codigoOACI === codigo);
      return aeropuerto ? aeropuerto.nombreCiudad + ' - ' + aeropuerto.pais : 'Desconocido';
    }
  },
  async mounted() {
    await this.fetchPaisesDestino();
  }
};
</script>

<style scoped>
.detalle-envio {
  padding: 20px;
  background-color: #2c2f48;
  border: 1px solid #ccc;
  border-radius: 10px;
  color: #ffffff;
  max-width: 2000px; /* Ajusta este valor para hacerlo más ancho */

  margin: auto;
}

.detalle-contenido {
  display: flex;
  flex-direction: column;
}

.envio-info, .vuelos-info {
  background-color: #162447;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
}

h2, h3 {
  color: #ffffff;
}

.vuelo-card {
  background-color: #0c1d47;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.volver-boton {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: linear-gradient(to right, #6e42f4, #e05eb5);
  color: #ffffff;
  text-decoration: none;
  border-radius: 5px;
  text-align: center;
}

.volver-boton:hover {
  background: linear-gradient(to right, #e05eb5, #6e42f4);
  color: #ffffff;
}
</style>
