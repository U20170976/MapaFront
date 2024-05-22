<template>
  <div class="listado-paquetes">
    <!-- <h1>GESTIÓN DE PAQUETES</h1> -->
    <div class="search-and-actions">
      <input type="text" placeholder="Buscar" v-model="searchword" />
      <button @click="anadirPaquete">+ Registrar Envío</button>
      <button @click="updateStatus">Actualizar Estados</button>
    </div>
    <base-table-envios
      :columns="tableColumns"
      :data="filteredData"
      :searchword="searchword"
      thead-classes="thead-custom-class"
      tbody-classes="tbody-custom-class"
    />
    <pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script>

import BaseTableEnvios from '@/components/BaseTableEnvios.vue';
import Pagination from '@/components/Pagination.vue';


export default {
  name: 'listadoPaquetes',
  components: {
    BaseTableEnvios,
    Pagination
  },
  data() {
    return {
      searchword: '',
      tableColumns: [
        { text: 'Código de envío', value: 'codigoEnvio' },
        { text: 'Estado', value: 'estado' },
        { text: 'Tiempo transcurrido', value: 'tiempoTranscurrido' },
        { text: 'Origen', value: 'origen' },
        { text: 'Destino', value: 'destino' },
        { text: 'Fecha y hora envío', value: 'fechaEnvio' },
        { text: 'Fecha y hora llegada', value: 'fechaLlegada' }
      ],
      tableData: [
        { codigoEnvio: 'FAS4445S', 
          estado: 'En camino', 
          tiempoTranscurrido: '20 horas', 
          origen: 'Lima, Perú', 
          destino: 'Washington, EEUU', 
          fechaEnvio: '27/03/2024 - 11:30:40', 
          fechaLlegada: '28/03/2024 - 11:30:40' 
        },
        {
          codigoEnvio: "FAS44ASE",
          estado: "En camino",
          tiempoTranscurrido: "20 horas",
          origen: "Lima,Perú",
          destino: "Washington, EEUU",
          fechaEnvio: "15/05/2024 - 08:04:10",
          fechaLlegada: "18/05/2024 - 13:05:10"
        }
        // más datos aquí...
      ],         
      filteredData: [],
      currentPage: 1,
      totalPages: 10
    };
  },
  methods: {
    anadirPaquete() {
      this.$router.push('RegisterPackage');
      console.log('Añadir Nuevo Paquete');
    },
    updateStatus() {
      // lógica para actualizar los estados
      console.log('Actualizar Estados');
    },
    handlePageChange(page) {
      this.currentPage = page;
      // implementar lógica de cambio de página
      console.log('Página actual:', page);
    }
  },
  mounted() {
    // inicializar los datos filtrados
    console.log('Página actual:', this.data);
    this.filteredData = this.tableData;
  }
};
</script>
<style scoped>
.gestion-envios {
  background-color: #2c2f48;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
}

h1 {
  text-align: center;
  font-size: 1.5em;
  margin-bottom: 20px;
}

.search-and-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-and-actions input {
  flex-grow: 1;
  margin-right: 20px;
  padding: 10px;
  border: none;
  border-radius: 4px;
  background-color: #3c3f58;
  color: #ffffff;
}

.search-and-actions button {
  background: linear-gradient(90deg, #6e42f4, #e05eb5);
  color: #ffffff;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  margin-left: 10px;
}

.search-and-actions button:hover {
  opacity: 0.8;
}

.thead-custom-class {
  background-color: #3c3f58;
}

.tbody-custom-class {
  background-color: #2c2f48;
}

</style>
