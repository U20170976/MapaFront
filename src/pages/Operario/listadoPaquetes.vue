<template>
  <div class="listado-paquetes">
    <div class="search-and-actions">
      <input type="text" placeholder="Buscar" v-model="searchword" />
      <button @click="anadirPaquete">+ Registrar Envío</button>
      <button @click="openModal" class="upload-button">
        <i class="fa fa-upload"></i>
      </button>
      <FileUploadModal v-if="isModalOpen" :isVisible="isModalOpen" @close="closeModal" 
                       :handleSuccessMessage="handleSuccessMessage" :handleErrorMessage="handleErrorMessage" />
    </div>
    <base-table-envios
      :columns="tableColumns"
      :data="paginatedData"
      :searchword="searchword"
      thead-classes="thead-custom-class"
      tbody-classes="tbody-custom-class"
      @view-details="viewDetails"
    />
    <pagination
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="handlePageChange"
    />
    <div v-if="successMessage" class="success-message right-message">
      <i class="fas fa-check-circle"></i> {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message right-message">
      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import BaseTableEnvios from '@/components/BaseTableEnvios.vue';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';
import config from "../../config";
import FileUploadModal from '@/components/FileUploadModal.vue';

const urlBase = config.urlBase;
const urlListarEnvios = '/api/paquete/';

export default {
  name: 'listadoPaquetes',
  components: {
    BaseTableEnvios,
    Pagination,
    FileUploadModal,
  },
  data() {
    return {
      searchword: '',
      tableColumns: [
        { text: 'Código de envío', value: 'idEnvio' },
        { text: 'Estado', value: 'estadoEnvio' },
        { text: 'Origen', value: 'ciudadOrigen' },
        { text: 'Destino', value: 'ciudadDestino' },
        { text: 'Fecha y hora envío', value: 'fechaEnvio' },
        { text: 'Detalles', value: 'details', sortable: false }
      ],
      tableData: [],
      currentPage: 1,
      itemsPerPage: 10,
      isModalOpen: false,
      successMessage: null,
      errorMessage: null,
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
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.itemsPerPage);
    }
  },
  methods: {
    anadirPaquete() {
      this.$router.push('RegisterPackage');
    },
    handlePageChange(page) {
      this.currentPage = page;
    },
    handleSuccessMessage(message) {
      this.successMessage = message;
      this.loadTableData();
      setTimeout(() => {
        this.successMessage = null;
      }, 10000);
    },
    handleErrorMessage(message) {
      this.errorMessage = message;
      this.loadTableData();
      setTimeout(() => {
        this.errorMessage = null;
      }, 10000);
    },
    loadTableData() {
      this.$http.get(urlBase + urlListarEnvios)
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          console.error('Error al obtener los datos: ', error);
        });
    },
    fetchDataListaEnvios() {
      axios.get(urlBase + urlListarEnvios)
        .then(response => {
          this.tableData = response.data;
        })
        .catch(error => {
          console.error('Error al obtener los datos:', error);
        });
    },
    openModal() {
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    viewDetails(id) {
      const envio = this.tableData.find(item => item.id === id);
      this.$router.push({ 
        name: 'Detalle del Envío',
        params: { id },
        query: { envio: JSON.stringify(envio) }
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

.upload-button {
  background: linear-gradient(to right, #a100f2, #ff6589);
  border: none;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
}

.upload-button img {
  width: 32px;
  height: 32px;
}

.success-message,
.error-message {
  position: fixed;
  top: 20px;
  right: 20px;
  max-width: 300px;
  background-color: rgba(40, 167, 69, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 9000;
}

.error-message {
  background-color: rgba(220, 53, 69, 0.9);
}
</style>
