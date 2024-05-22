<template>
  <div class="container">
    <h2 slot="header" class="title">Resumen de Envío - FAS44A5S</h2>
    
    <div class="summary-section">
      <div class="section">
        <h2>Datos del Envío</h2>
        <!-- <p><strong>Código de envío:</strong> FAS44A5S</p>-->
        <p><span class="highlighted-code"> Código de Envío:</span> <span class="highlighted-code"> FAS44A5S</span></p>
        <p><strong>Ciudad, País - Origen:</strong> Lima - Perú</p>
        <p><strong>Ciudad, País - Destino:</strong> Madrid - España</p>
        <p><strong>Cantidad de Paquetes:</strong> 10</p>
        <p><strong>Descripción:</strong> Documentos importantes</p>
      </div>
      <div class="section">
        <h2>Datos del Contacto que Envía</h2>
        <p><strong>DNI/RUC:</strong> 12345678</p>
        <p><strong>Nombres y Apellidos:</strong> Juan Pérez</p>
        <p><strong>Correo Electrónico:</strong> juan.perez@example.com</p>
        <p><strong>Número de Teléfono:</strong> 123456789</p>
      </div>
      <div class="section">
        <h2>Datos del Contacto que Recibe</h2>
        <p><strong>DNI/RUC:</strong> 87654321</p>
        <p><strong>Nombres y Apellidos:</strong> María González</p>
        <p><strong>Correo Electrónico:</strong> maria.gonzalez@example.com</p>
        <p><strong>Número de Teléfono:</strong> 987654321</p>
      </div>
    </div>
    
    <div class="button-container">
      <div class="right-aligned">
        <base-button slot="footer" type="primary" fill @click="handleSubmit">Enviar al Contacto</base-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResumenEnvio',
  methods: {
    handleSubmit() {
      // Lógica para registrar el envío
      console.log('Envío registrado');
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
  background-color:  #2A2A40;
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
  font-size: 1.2 em;
  font-weight: bolder;
  color: #ffffff; /* Mantener el color blanco */
}
/*
.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
*/

/*Posiciona el botón a la derecha el button-container y el right-aligned*/
.button-container {
  margin-top: 20px;
  width: 100%; /* Asegura que el contenedor ocupe todo el ancho */
}
.right-aligned {
  display: flex;
  justify-content: flex-end;
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
