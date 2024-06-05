<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-container">
        <h2>Se envió todo los detalles necesarios</h2>
        <p>El código único servirá para hacer el seguimiento del envío de los paquetes registrados.</p>
        <div class="modal-actions">
          <button @click="cancel" class="cancel-button">Cancel</button>
          <button @click="confirm" class="confirm-button">Continuar</button>
        </div>
      </div>
    </div>
</template>


  
<script>
  export default {
    name: 'PopupConfirmation',
    props: {
      showModal: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      confirm() {
        this.$emit('confirm');
        this.$emit('close');
        this.$router.push({ name: 'Gestión de Envíos' }); // Redirigir a otra página
      },
      cancel() {
        this.$emit('close');
      }
    }
  }
</script>
  
<style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-container {
    background: #2A2A40;
    color: #ffffff;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .modal-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  
  button {
    background-color: #e94560;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #d83454;
  }
</style>
  