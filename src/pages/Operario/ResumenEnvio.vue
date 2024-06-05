<template>
  <div class="container">
    <h2 slot="header" class="title">Resumen de Envío - {{ envio.paquete.idEnvio }}</h2>
    
    <div class="summary-section">
      <div class="section">
        <h2>Datos del Envío</h2>
        <p><span class="highlighted-code">Código de Envío:</span> <span class="highlighted-code"> {{ envio.paquete.idEnvio }}</span></p>
        <p><strong>Ciudad, País - Origen:</strong> {{ envio.paquete.ciudadOrigen }}</p>
        <p><strong>Ciudad, País - Destino:</strong> {{ envio.paquete.ciudadDestino }}</p>
        <p><strong>Fecha de Envío:</strong> {{ formattedFechaEnvio }} </p>
        <p><strong>Hora de Envío:</strong> {{ envio.paquete.horaEnvio }}</p>
        <p><strong>Cantidad de Paquetes:</strong> {{ envio.paquete.cantidadPaquetes }} unidades</p>
        <p><strong>Estado del Envío:</strong> {{ envio.paquete.estadoEnvio }}</p>
        <!--<p><strong>Descripción:</strong> Documentos importantes</p>-->
      </div>
      <div class="section">
        <h2>Datos del Contacto que Envía</h2>
        <p><strong>DNI/RUC:</strong> {{ envio.clienteManda.documentoIdentidad }}</p>
        <p><strong>Nombres y Apellidos:</strong> {{ envio.clienteManda.nombres }}</p>
        <p><strong>Correo Electrónico:</strong> {{ envio.clienteManda.correo }}</p>
        <p><strong>Número de Teléfono:</strong> {{ envio.clienteManda.telefono }}</p>
      </div>
      <div class="section">
        <h2>Datos del Contacto que Recibe</h2>
        <p><strong>DNI/RUC:</strong> {{ envio.clienteRecibe.documentoIdentidad }}</p>
        <p><strong>Nombres y Apellidos:</strong> {{ envio.clienteRecibe.nombres }}</p>
        <p><strong>Correo Electrónico:</strong> {{ envio.clienteRecibe.correo }}</p>
        <p><strong>Número de Teléfono:</strong> {{ envio.clienteRecibe.telefono }}</p>
      </div>
    </div>
    
    <div class="button-container">
      <div class="right-aligned">
        <base-button slot="footer" type="primary" fill @click="handleSubmit">Enviar al Contacto</base-button>
      </div>
    </div>

    <!-- Agrega el modal aquí -->
    <PopupConfirmation :showModal="showModal" @close="showModal = false" />
  </div>
</template>

<script>
import PopupConfirmation from "@/components/PopupConfirmation.vue"; // Asegúrate de tener la ruta correcta

export default {
  name: 'ResumenEnvio',
  props: ['envio'], // Declaración de la prop `envio`
  components: {
    PopupConfirmation
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    formattedFechaEnvio: function() {
      // Descomponer la fecha en año, mes y día
      const [year, month, day] = this.envio.paquete.fechaEnvio.split('-');
      // Devolver la fecha en formato dd-mm-aaaa
      return `${day}-${month}-${year}`;
    }
  },
  methods: {
    handleSubmit() {
      // Lógica para registrar el envío
      console.log('Envío registrado');
      this.handleOpenModal();
    },
    handleOpenModal() {
      console.log('abrir modal');
      this.showModal = true;
      console.log('despues de abrir modal');
    },
    handleCancel() {
      // Lógica para regresar
      console.log('Regresar');
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #2A2A40;
  color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 2000px;
  margin: 0 auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.summary-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  background-color: #162447;
  padding: 20px;
  border-radius: 10px;
}

.section h2 {
  margin-top: 0;
}

.highlighted-code {
  font-size: 1.2em;
  font-weight: bolder;
  color: #ffffff; /* Mantener el color blanco */
}

.button-container {
  margin-top: 20px;
  width: 100%; /* Asegura que el contenedor ocupe todo el ancho */
  display: flex;
  justify-content: flex-end; /* Alinea el contenido del contenedor a la derecha */
}

.right-aligned {
  display: flex;
  justify-content: flex-end; /* Asegura que el botón dentro de este div también esté a la derecha */
  width: 100%;
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
