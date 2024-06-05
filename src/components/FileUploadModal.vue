<template>
  <div v-if="isVisible" class="popup-overlay" @click="closeModal">
    <div class="popup" @click.stop>
      <h3>Subir Archivos</h3>
      <input type="file" @change="handleFileUpload" ref="fileInput" />
      <div class="drop-zone" @dragover.prevent @drop="handleDrop">
        Arrastra y suelta tus archivos aquí
      </div>
      <button @click="closeModal" class="close-button">Cerrar</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    handleFileUpload(event) {
      const files = event.target.files;
      this.uploadFiles(files);
    },
    handleDrop(event) {
      const files = event.dataTransfer.files;
      this.uploadFiles(files);
    },
    uploadFiles(files) {
      console.log("Archivos subidos:", files);
      // Aquí puedes añadir la lógica para manejar los archivos subidos
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
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.popup h3 {
  color: #ffffff;
  margin-bottom: 20px;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: #aaa;
}

input[type="file"] {
  display: block;
  margin: 20px auto;
  color: #ffffff;
}

.close-button {
  background: #ff6589;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  cursor: pointer;
  color: white;
  margin-top: 20px;
}

.close-button:hover {
  background: #e05475;
}
</style>
