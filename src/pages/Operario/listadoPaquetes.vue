<template>
  <div class="listado-paquetes">
    <!-- <h1>GESTIÓN DE PAQUETES</h1> -->
    <div class="search-and-actions">
      <input type="text" placeholder="Buscar" v-model="searchword" />
      <button @click="anadirPaquete">+ Registrar Envío</button>
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
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP
import config from "../../config";

//Definimos las variables globales
let urlBase = config.urlBase,// aquí guardamos la base de la URL
    urlListarEnvios = '/api/paquete/'; 

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
        { text: 'Código de envío', value: 'id' },
        { text: 'Estado', value: 'estadoEnvio' },
        { text: 'Origen', value: 'ciudadOrigen' },
        { text: 'Destino', value: 'ciudadDestino' },
        { text: 'Fecha y hora envío', value: 'fechaEnvio' }
      ],
      tableData: [],
      currentPage: 1,
      totalPages: 10
    };
  },
  computed: {
    filteredData() {
      if (this.searchword.trim() === '') {
        return this.tableData;
      }
      const searchwordLower = this.searchword.toLowerCase();
      return this.tableData.filter(item =>
        item.ciudadOrigen.toLowerCase().includes(searchwordLower) ||
        item.ciudadDestino.toLowerCase().includes(searchwordLower)
      );
    }
  },
  methods: {
    anadirPaquete() {
      this.$router.push('RegisterPackage');
      console.log('Añadir Nuevo Paquete');
    },
    handlePageChange(page) {
      this.currentPage = page;
      console.log('Página actual:', page);
    },
    fetchDataListaEnvios() {
      axios.get(urlBase + urlListarEnvios)
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
    }
  },
  mounted() {
    this.fetchDataListaEnvios();
  },
};

</script>
<style scoped>
.listado-paquetes {
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
