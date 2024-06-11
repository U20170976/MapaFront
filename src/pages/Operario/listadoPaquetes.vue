<template>
  <div class="listado-paquetes">
    <!-- <h1>GESTIÓN DE PAQUETES</h1> -->
    <div class="search-and-actions">
      <input type="text" placeholder="Buscar" v-model="searchword" />
      <button @click="anadirPaquete">+ Registrar Envío</button>
      <!-- Botón para abrir el popup -->
      <button @click="openModal" class="upload-button">
        <i class="fa fa-upload"></i>
      </button>
      <FileUploadModal v-if="isModalOpen" :isVisible="isModalOpen" @close="closeModal" 
                  :handleSuccessMessage="handleSuccessMessage" :handleErrorMessage="handleErrorMessage" />
      
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
    <!-- Ajustar la posición de los mensajes de éxito y error -->
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
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP
import config from "../../config";
import FileUploadModal from '@/components/FileUploadModal.vue';

//Definimos las variables globales
let urlBase = config.urlBase,// aquí guardamos la base de la URL
    urlListarEnvios = '/api/paquete/'; 

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
        { text: 'Código de envío', value: 'id' },
        { text: 'Estado', value: 'estadoEnvio' },
        { text: 'Origen', value: 'ciudadOrigen' },
        { text: 'Destino', value: 'ciudadDestino' },
        { text: 'Fecha y hora envío', value: 'fechaEnvio' }
      ],
      tableData: [],
      currentPage: 1,
      totalPages: 10,
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
    // Método para manejar el mensaje de éxito
    handleSuccessMessage(message) {
      this.successMessage = message;
      setTimeout(() => {
        this.successMessage = null; // Ocultar el mensaje después de unos segundos
      }, 3000);
    },
    // Método para manejar el mensaje de error
    handleErrorMessage(message) {
      this.errorMessage = message;
      setTimeout(() => {
        this.errorMessage = null; // Ocultar el mensaje después de unos segundos
      }, 3000);
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
    async uploadFile() {
      const formData = new FormData();
      formData.append('file', this.file);

      try {
        const response = await fetch('http://example.com/upload', {
          method: 'POST',
          body: formData
        });
        console.log('Archivo subido exitosamente');
      } catch (error) {
        console.error('Error al subir el archivo', error);
      }
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
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(40, 167, 69, 0.9); /* Cambiar el color de fondo para el mensaje de éxito */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message {
  background-color: rgba(220, 53, 69, 0.9); /* Cambiar el color de fondo para el mensaje de error */
}

.success-message i,
.error-message i {
  margin-right: 10px;
}

/* Otros estilos... */
/* Ajustar los estilos para los mensajes de éxito y error */
.right-message {
  position: fixed;
  top: 10px;
  right: 900px; /* Ajustar la posición a la derecha */
  max-width: 300px; /* Limitar el ancho para evitar que los mensajes ocupen toda la pantalla */
  background-color: rgba(40, 167, 69, 0.9); /* Cambiar el color de fondo para el mensaje de éxito */
  color: white;
  padding: 10px 80px;
  border-radius: 5px;
  display: flex;
  align-items: right;
  justify-content: space-between; /* Alinear el ícono y el texto */
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message.right-message {
  background-color: rgba(220, 53, 69, 0.9); /* Cambiar el color de fondo para el mensaje de error */
}

</style>
