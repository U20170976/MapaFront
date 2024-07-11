<template>
  <card>
    <h2 slot="header" class="title">Registrar Envío</h2>
    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
    <div class="card mt-4">
      <div class="card-header">
        <h4 class="card-title">Datos del Envío</h4>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Origen</label>
              <select class="form-control" v-model="paquete.ciudadOrigen" required @change="updateDestinos">
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisOrigen in lpaisesDestino" :key="paisOrigen.id" :value="`${paisOrigen.codigoOACI}`">
                  {{ paisOrigen.nombreCiudad }} - {{ paisOrigen.pais }}
                </option>
              </select>
              <div v-if="!paquete.ciudadOrigen && formSubmitted" class="invalid-feedback">
                Por favor, seleccione una ciudad y país de origen.
              </div>
            </div>
            <div class="form-group">
              <label>Cantidad de Paquetes</label>
              <input type="text" class="form-control" placeholder="Cantidad de Paquetes" v-model="paquete.cantidadPaquetes" required>
              <div v-if="!paquete.cantidadPaquetes && formSubmitted" class="invalid-feedback">
                Por favor, ingrese la cantidad de paquetes.
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <label>Ciudad, País - Destino</label>
              <select class="form-control" v-model="paquete.ciudadDestino" required>
                <option value="" disabled selected hidden>Seleccione una ciudad y país</option>
                <option v-for="paisDestino in filteredPaisesDestino" :key="paisDestino.id" :value="`${paisDestino.codigoOACI}`">
                  {{ paisDestino.nombreCiudad }} - {{ paisDestino.pais }}
                </option>
              </select>
              <div v-if="!paquete.ciudadDestino && formSubmitted" class="invalid-feedback">
                Por favor, seleccione una ciudad y país de destino.
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6 date-time-group">
                <label>Fecha de Envío</label>
                <input type="date" class="form-control" v-model="paquete.fechaEnvio" required>
                <div v-if="!paquete.fechaEnvio && formSubmitted" class="invalid-feedback">
                  Por favor, seleccione una fecha de envío.
                </div>
              </div>
              <div class="form-group col-md-6 date-time-group">
                <label>Hora de Envío</label>
                <input type="time" class="form-control" v-model="paquete.horaEnvio" required>
                <div v-if="!paquete.horaEnvio && formSubmitted" class="invalid-feedback">
                  Por favor, seleccione una hora de envío.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Envía</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>DNI / RUC</label>
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteManda.documentoIdentidad" required>
              <div v-if="!clienteManda.documentoIdentidad && formSubmitted" class="invalid-feedback">
                Por favor, ingrese el DNI o RUC.
              </div>
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteManda.nombres" required>
              <div v-if="!clienteManda.nombres && formSubmitted" class="invalid-feedback">
                Por favor, ingrese los nombres y apellidos.
              </div>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" placeholder="email@email.com" v-model="clienteManda.correo" required>
              <div v-if="!clienteManda.correo && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteManda.telefono" required>
              <div v-if="!clienteManda.telefono && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un número de teléfono.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h4 class="card-title">Datos del Contacto que Recibe</h4>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>DNI / RUC</label>
              <input type="text" class="form-control" placeholder="DNI o RUC" v-model="clienteRecibe.documentoIdentidad" required>
              <div v-if="!clienteRecibe.documentoIdentidad && formSubmitted" class="invalid-feedback">
                Por favor, ingrese el DNI o RUC.
              </div>
            </div>
            <div class="form-group">
              <label>Nombres y Apellidos</label>
              <input type="text" class="form-control" placeholder="Nombres y Apellidos" v-model="clienteRecibe.nombres" required>
              <div v-if="!clienteRecibe.nombres && formSubmitted" class="invalid-feedback">
                Por favor, ingrese los nombres y apellidos.
              </div>
            </div>
            <div class="form-group">
              <label>Correo Electrónico</label>
              <input type="email" class="form-control" placeholder="Correo Electrónico" v-model="clienteRecibe.correo" required>
              <div v-if="!clienteRecibe.correo && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un correo electrónico válido.
              </div>
            </div>
            <div class="form-group">
              <label>Número de Teléfono</label>
              <input type="text" class="form-control" placeholder="Número de Teléfono" v-model="clienteRecibe.telefono" required>
              <div v-if="!clienteRecibe.telefono && formSubmitted" class="invalid-feedback">
                Por favor, ingrese un número de teléfono.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="button-container">
      <base-button slot="footer" fill @click="regresarAlListar">Regresar</base-button>
      <base-button slot="footer" type="primary" fill @click="registrarEnvio">Registrar Envío</base-button>
    </div>
  </card>
</template>


<script>
import axios from 'axios';
import config from "../../config";
import listadoPaquetes from "../Operario/listadoPaquetes";
import ResumenEnvio from "../Operario/ResumenEnvio"; // Ajusta la ruta según la ubicación del componente

let urlBase = config.urlBase,
    urlRegistrarEnvio = '/api/paquete/register/envio/monitoreo',
    urlListarAeropuertos = '/api/aeropuertos',
    urlGetHuso = '/api/aeropuertos/getHuso/';

export default {
  components: {
    listadoPaquetes,
    ResumenEnvio
  },
  data() {
    return {
      formSubmitted: false,
      paquete: {
        ciudadOrigen: "",
        ciudadDestino: "",
        fechaEnvio: "",
        horaEnvio: "",
        cantidadPaquetes: '',
        estadoEnvio: "En Almacén",
      },
      clienteManda: {
        documentoIdentidad: "12345678",
        nombres: "Juan Perez",
        correo: "juan.perez@example.com",
        telefono: "123456789",
        tipo: "1"
      },
      clienteRecibe: {
        documentoIdentidad: "87654321",
        nombres: "Maria Garcia",
        correo: "maria.garcia@example.com",
        telefono: "987654321",
        tipo: "2"
      },
      lpaisesDestino: [],
      errorMessage: "",
      error: '',
      codigoSeleccionado: "",
    };
  },
  mounted() {
    this.fetchPaisesDestino();
  },
  computed: {
    filteredPaisesDestino() {
      return this.lpaisesDestino.filter(paisDestino => paisDestino.codigoOACI !== this.paquete.ciudadOrigen);
    }
  },
  methods: {
    async registrarEnvio() {
      this.formSubmitted = true;
      console.log('Datos del paquete antes de enviar:', this.paquete);
      const dateTime = await this.obtenerFechaHoraActual();
      if (this.validarCampos()) {
        try {
          this.paquete.fechaEnvio = dateTime.fechaEnvio;
          this.paquete.horaEnvio = dateTime.horaEnvio;
          const payload = {
            paquete: this.paquete,
            clienteManda: this.clienteManda,
            clienteRecibe: this.clienteRecibe
          };
          const response = await axios.post(urlBase + urlRegistrarEnvio, payload);
          if (response.data.id !== 0) {
            this.$router.push({ name: 'Resumen de Envío', params: { envio: response.data } });
          } else {
            this.errorMessage = 'No se pudo registrar el envío';
          }
        } catch (error) {
          this.errorMessage = 'No se pudo registrar el envío';
        }
      } else {
        this.errorMessage = 'Por favor, complete todos los campos obligatorios.';
      }
    },
    async fetchPaisesDestino() {
      try {
        const response = await axios.get(urlBase + urlListarAeropuertos);
        this.lpaisesDestino = response.data.sort((a, b) => (a.pais < b.pais ? -1 : 1));
      } catch (error) {
        this.error = 'Error al cargar los datos';
        this.errorMessage = 'Error al cargar los países';
      }
    },
    async obtenerHusoHorario(codigo) {
      try {
        const response = await axios.get(urlBase + `/api/aeropuertos/getHuso/${codigo}`);
        return response.data;
      } catch (error) {
        this.errorMessage = 'Error al obtener el huso horario';
        return null;
      }
    },
    async obtenerFechaHoraActual() {
      const dateTime = new Date(`${this.paquete.fechaEnvio}T${this.paquete.horaEnvio}`);
      const husoNumerico = await this.obtenerHusoHorario(this.paquete.ciudadOrigen);
      if (husoNumerico !== null) {
        dateTime.setHours(dateTime.getHours() + 5 + husoNumerico);
      }
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, '0');
      const day = String(dateTime.getDate()).padStart(2, '0');
      const hours = String(dateTime.getHours()).padStart(2, '0');
      const minutes = String(dateTime.getMinutes()).padStart(2, '0');
      return {
        fechaEnvio: `${year}${month}${day}`,
        horaEnvio: `${hours}:${minutes}`
      };
    },
    updateDestinos() {
      this.paquete.ciudadDestino = '';
    },
    validarCampos() {
      return (
        this.paquete.ciudadOrigen &&
        this.paquete.cantidadPaquetes &&
        this.paquete.ciudadDestino &&
        this.clienteManda.documentoIdentidad &&
        this.clienteManda.nombres &&
        this.clienteManda.correo &&
        this.clienteManda.telefono &&
        this.clienteRecibe.documentoIdentidad &&
        this.clienteRecibe.nombres &&
        this.clienteRecibe.correo &&
        this.clienteRecibe.telefono &&
        this.paquete.fechaEnvio &&
        this.paquete.horaEnvio
      );
    },
    regresarAlListar() {
      this.$router.push('listadoPaquetes');
    }
  }
};
</script>


<style>
.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 10px;
}
.form-control option {
  color: black;
}
.form-control {
  color: white;
}
.invalid-feedback {
  color: #dc3545;
  display: block;
  font-size: 0.875em;
  margin-top: 0.25em;
}

/* Ajustar el alto de los campos de fecha y hora */
.date-time-group .form-control {
  height: calc(1.5em + .75rem + 10px);
}

</style>
