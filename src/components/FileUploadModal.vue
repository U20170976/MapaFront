<template>
  <div v-if="isVisible" class="popup-overlay" @click="closeModal">
    <div class="popup" @click.stop>
      <h3>Subir Archivos</h3>
      <input type="file" @change="handleFileUpload" ref="fileInput" />
      <div class="drop-zone" @dragover.prevent @drop="handleDrop">
        Arrastra y suelta tus archivos aquí
      </div>
      <button @click="closeModal">Cerrar</button>
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
}

.popup {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.drop-zone {
  border: 2px dashed #ccc;
  padding: 20px;
  margin-top: 10px;
}
</style>
