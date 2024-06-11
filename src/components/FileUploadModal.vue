<template>
  <div v-if="isVisible" class="popup-overlay" @click="closeModal">
    <div
      class="popup"
      @click.stop
      @mousedown="startDrag"
      :style="modalStyle"
      ref="modal"
    >
      <button @click="closeModal" class="close-button">&times;</button>
      <h1>Subida de Archivo</h1>
      <div class="file-input-container">
        <input type="file" @change="handleFileUpload" ref="fileInput" id="file-input" />
        <label for="file-input" class="file-input-label">Seleccionar Archivo</label>
      </div>
      <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
        <div v-if="filePreview || fileName" class="file-preview">
          <img v-if="isImage" :src="filePreview" alt="Vista previa del archivo" />
          <p v-else class="file-name-full">{{ fileName }}</p>
        </div>
        <span v-else>Arrastra y suelta tu archivo aquí</span>
      </div>
      <button @click="uploadFiles" class="accept-button">Subir Archivo</button>
    </div>
    <!--
    <div v-if="successMessage" class="success-message">
      <i class="fas fa-check-circle"></i> {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="error-message">
      <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
    </div>
    -->
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config';


let urlBase = config.urlBase;// aquí guardamos la base de la URL

export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    handleSuccessMessage: {
      type: Function,
      required: true,
    },
    handleErrorMessage: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      file: null,
      fileName: null,
      filePreview: null,
      fileType: null,
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      modalStyle: {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        position: 'absolute',
      },
      
    };
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleFileUpload(event) {
      const selectedFile = event.target.files[0];
      if (this.validateFile(selectedFile)) {
        this.file = selectedFile;
        this.fileName = selectedFile.name;
        this.previewFile(selectedFile);
      } else {
        event.target.value = null; // Limpiar la selección si el archivo no es válido
        this.fileName = null;
        this.filePreview = null;
        this.fileType = null;
      }
    },
    handleDrop(event) {
      event.preventDefault(); // Prevenir que el navegador abra el archivo
      const droppedFile = event.dataTransfer.files[0];
      if (this.validateFile(droppedFile)) {
        this.file = droppedFile;
        this.fileName = droppedFile.name;
        this.previewFile(droppedFile);
      } else {
        this.fileName = null;
        this.filePreview = null;
        this.fileType = null;
      }
    },
    validateFile(file) {
      if (file) {
        if (file.size > 10000000) { // Ejemplo de validación: tamaño máximo 10MB
          alert("El archivo es demasiado grande.");
          return false;
        }
        // Otras validaciones pueden ir aquí (tipo de archivo, etc.)
        return true;
      }
      return false;
    },
    async uploadFiles() {
      if (!this.file) {
        alert("Por favor selecciona un archivo.");
        return;
      }

      const formData = new FormData();
      formData.append("file", this.file);
      console.log(urlBase + '/pedidos/upload/diario');

      try {
        

        const response = await axios.post(urlBase + '/api/paquete/pedidos/upload/diario', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        this.handleSuccessMessage(response.data.Mensaje || "Archivo subido exitosamente."); // Llama al método de éxito
        console.log('Archivo subido exitosamente:', response.data);
        this.errorMessage = null; // Limpiar mensaje de error si hay uno previo
        setTimeout(() => {
          this.successMessage = null; // Ocultar el mensaje después de unos segundos
        }, 3000);
        // Limpiar el mensaje de error si hay uno previo
        this.handleErrorMessage(null);
        // Cerrar el modal después de subir el archivo
        this.closeModal();
      } catch (error) {
        console.error(error);
        this.handleErrorMessage(error.response.data.Error || "Error al subir el archivo."); // Llama al método de error
        // Limpiar el mensaje de éxito si hay uno previo
        this.handleSuccessMessage(null);
      }
      this.closeModal();  // Cerrar el modal después de subir el archivo
    },
    previewFile(file) {
      if (file.type.startsWith('image')) {
        this.fileType = 'image';
        const reader = new FileReader();
        reader.onload = (e) => {
          this.filePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        this.fileType = 'other';
        this.filePreview = null; // No mostrar vista previa para archivos que no son imágenes
      }
    },
    startDrag(event) {
      const modal = this.$refs.modal;
      this.isDragging = true;
      this.dragStartX = event.clientX - modal.getBoundingClientRect().left;
      this.dragStartY = event.clientY - modal.getBoundingClientRect().top;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(event) {
      if (this.isDragging) {
        this.modalStyle.left = `${event.clientX - this.dragStartX}px`;
        this.modalStyle.top = `${event.clientY - this.dragStartY}px`;
        this.modalStyle.transform = 'none';
      }
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
  },
  computed: {
    isImage() {
      return this.fileType === 'image';
    },
  },
};
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup {
  background: #1e1e2f;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 600px; /* Aumenta el tamaño del modal */
  height: 400px; /* Aumenta el tamaño del modal */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: absolute; /* Cambia a posición absoluta */
  cursor: move; /* Cambia el cursor a mover */
}

.popup h1 {
  color: #ffffff;
  margin-bottom: 20px;
  user-select: none; /* Evita la selección de texto mientras se arrastra */
}

.file-input-container {
  margin: 20px 0;
}

input[type="file"] {
  display: none;
}

.file-input-label {
  background: #ff6589;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: inline-block;
}

.file-input-label:hover {
  background: #e05475;
}

.file-name-full {
  color: #ffffff;
  margin-top: 10px;
  word-wrap: break-word;
  text-align: center;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 80px; /* Aumenta el tamaño del área de drop */
  margin-top: 20px;
  border-radius: 8px;
  color: #aaa;
  height: 150px; /* Aumenta el tamaño del área de drop */
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.file-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.accept-button,
.close-button {
  background: #2dbd40;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  color: white;
  margin-top: 20px;
  position: relative; /* Asegura que los botones se mantengan en su lugar */
}

.accept-button:hover {
  background: #299e39;
}
/*
.accept-button:hover,
.close-button:hover {
  background: #0ad61e;
}*/

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  color: #ffffff;
  font-size: 60px; /* Aumenta el tamaño de la fuente */
  line-height: 32px;
  padding: 0;
  border: none;
  cursor: pointer;
}

.close-button:hover {
  color: #ebdbdb;
}

.success-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.success-message i {
  margin-right: 10px;
}

.error-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #dc3545; /* Color rojo para el mensaje de error */
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  font-size: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.error-message i {
  margin-right: 10px;
}

</style>
