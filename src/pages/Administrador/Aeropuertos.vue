<template>
  <div class="listado-aeropuertos">
    <div class="search-and-actions">
      <input type="text" placeholder="Buscar" v-model="searchword" />
      <!--<button @click="addAeropuerto">+ Agregar Aeropuerto</button>-->
      <!--<button @click="updateStatus">Actualizar Estados</button>-->
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
import axios from 'axios';

export default {
  name: 'Aeropuertos',
  components: {
    BaseTableEnvios,
    Pagination
  },
  data() {
    return {
      searchword: '',
      tableColumns: [
        { text: 'ID', value: 'id' },
        { text: 'Código OACI', value: 'codigoOACI' },
        { text: 'Nombre Ciudad', value: 'nombreCiudad' },
        { text: 'País', value: 'pais' },
        { text: 'Código IATA', value: 'codigoIATA' },
        { text: 'Huso Horario', value: 'husoHorario' },
        { text: 'Cap. Almacenamiento Máximo', value: 'capacidadAlmacenamientoMaximo' },
        { text: 'Cap. Almacenamiento Usado', value: 'capacidadDeAlmacenamientoUsado' },
        { text: 'Latitud', value: 'latitud' },
        { text: 'Longitud', value: 'longitud' }
      ],
      tableData: [],
      filteredData: [],
      currentPage: 1,
      totalPages: 10
    };
  },
  methods: {
    addAeropuerto() {
      this.$router.push('AddAeropuerto');
      console.log('Agregar Nuevo Aeropuerto');
    },
    updateStatus() {
      // lógica para actualizar los estados
      console.log('Actualizar Estados');
    },
    handlePageChange(page) {
      this.currentPage = page;
      // implementar lógica de cambio de página
      console.log('Página actual:', page);
    },
    fetchDataListaAeropuertos() {
      // Realiza la solicitud HTTP para obtener los datos de la API
      axios.get('http://localhost/api/aeropuertos/getall')
        .then(response => {
          // Asigna los datos de la respuesta a tableData
          this.tableData = response.data;
          // Actualiza los datos filtrados
          this.filteredData = response.data;
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
    }
  },
  computed: {
    filteredData() {
      return this.tableData.filter(aeropuerto => {
        return aeropuerto.nombreCiudad.toLowerCase().includes(this.searchword.toLowerCase()) ||
               aeropuerto.codigoOACI.toLowerCase().includes(this.searchword.toLowerCase()) ||
               aeropuerto.pais.toLowerCase().includes(this.searchword.toLowerCase());
      });
    }
  },
  mounted() {
    this.fetchDataListaAeropuertos();
  }
};
</script>

<style scoped>
.listado-aeropuertos {
  background-color: #2c2f48;
  color: #ffffff;
  padding: 20px;
  border-radius: 8px;
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
