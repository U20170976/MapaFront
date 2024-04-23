<template>

  <div class="clear-filter" filter-color="purple">    

    <div class="page-header page-header-register">
    </div>
    <!--div
      class="page-header-image">
    </div-->

    <h1 class="text-white text-center">Registro de empresa</h1>

    <div class="content">
      <div class="container">
        <div class="col-md-5 ml-auto mr-auto">
          <card type="login" plain>

            <!--div slot="header" class="logo-container">
              <img v-lazy="'img/now-logo.png'" alt="" />
            </div-->

            <h6 class="text-white text-left">Correo (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons ui-1_email-85"
              placeholder="Correo electrónico"
              v-model="nuevoUsuario.correo">
            </fg-input>

            <h6 class="text-white text-left">Usuario (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons users_circle-08"
              placeholder="Usuario"
              v-model="nuevoUsuario.username">
            </fg-input>

            <h6 class="text-white text-left">Contraseña (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons ui-1_lock-circle-open"
              placeholder="Contraseña"
              type="password"
              v-model="nuevoUsuario.password">
            </fg-input>

            <h6 class="text-white text-left">Razón social (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons users_single-02"
              placeholder="Razón social"
              v-model="nuevoUsuario.nombreRazonSocial">
            </fg-input>

            <h6 class="text-white text-left">Número de RUC (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons business_badge"
              placeholder="Número de RUC"
              v-model="nuevoUsuario.numeroDocumento">
            </fg-input>

            <h6 class="text-white text-left">DNI Representante legal (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons business_badge"
              placeholder="Número de RUC"
              v-model="nuevoUsuario.dniRepresentante">
            </fg-input>

            <h6 class="text-white text-left">Nombre Representante legal (*)</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons business_badge"
              placeholder="Nombre Representante legal"
              v-model="nuevoUsuario.nombreRepresentante">
            </fg-input>

            <h6 class="text-white text-left">DNI Contacto</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons business_badge"
              placeholder="DNI Contacto"
              v-model="nuevoUsuario.dniContacto">
            </fg-input>

            <h6 class="text-white text-left">Nombre Contacto</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons business_badge"
              placeholder="Nombre Contacto"
              v-model="nuevoUsuario.nombreContacto">
            </fg-input>

            <h6 class="text-white text-left">País (*)</h6>
            <select style="color:white" class="input-group-prepend form-control" v-model="sede" @change="obtenerCiudad(sede)">
              <option style="color:black" v-for="sede in sedes" :key="sede.id" :value="sede">
                  {{sede.pais.nombre}}
              </option>
            </select>

            <h6 class="text-white text-left">Ciudad</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons location_world"
              placeholder="Ciudad"
              v-model="nuevoUsuario.ciudad"
              disabled>
            </fg-input>
            
            <h6 class="text-white text-left">Dirección</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons location_world"
              placeholder="Dirección"
              v-model="nuevoUsuario.direccion">
            </fg-input>

            <h6 class="text-white text-left">Teléfono</h6>
            <fg-input
              class="no-border"
              addon-left-icon="now-ui-icons tech_mobile"
              placeholder="Teléfono"
              v-model="nuevoUsuario.telefono">
            </fg-input>

            <h6 class="text-white text-left">Fecha de nacimiento representante legal (*)</h6>
            <fg-input>
              <el-date-picker
                @change="dateChangebirthday"
                type="date"
                popper-class="date-picker date-picker-primary"
                placeholder="DD/MM/YYYY"
                format= 'dd/MM/yyyy'
                v-model="datePicker">
              </el-date-picker>
            </fg-input>


            <template slot="raw-content">
              <div id="modals" class="card-footer text-center">
                <n-button                  
                  class="btn btn-login-register btn-round btn-lg btn-block"
                  @click.native="[modals.classic = true, registrarCliente()]">
                  Registrarse                  
                </n-button>
              </div>

              <modal-index v-if="activado" :show.sync="modals.classic" headerClasses="justify-content-center">
                <h5 slot="header" class="title title-up">Registro de nuevo usuario</h5>
                <p> 
                  {{mensaje}}
                </p>
                <template slot="footer">
                  <n-button type="danger" @click.native="[modals.classic = false, activado = false]">
                    Cerrar
                  </n-button>
                </template>
              </modal-index>

              <div class="pull-left">
                <h6>
                  <a
                    href="#/signup"
                    style="color:White;"
                    class="link footer-link">Registro de persona natural
                  </a>
                </h6>
              </div>
            
            </template>
          </card>
        </div>
        
      </div>
    </div>
    
  </div>
</template>
<script>


import { Alert, CardIndex, Button, FormGroupInput, ModalIndex } from '@/components';
import MainFooter from '@/layout/MainFooter';
import { Popover, Tooltip, DatePicker } from 'element-ui';
import axios from 'axios';


export default {
  name: 'signup-page',
  bodyClass: 'signup-page',
  data(){
    return{
      modals: {
        classic: false,
        mini: false
      },
      activado: false,
      mensaje: '',
      datePicker: null,
      nuevoUsuario:{
        correo:'',
        username:'',
        password:'',
        nombreRazonSocial:'',
        numeroDocumento:'',
        telefono: '',
        tipoDocumento:'ruc',
        direccion:'',
        fechaNacimiento:'',
        tipoUsuario: 3,
        dniRepresentante: '',
        nombreRepresentante: '',
        dniContacto: '',
        nombreContacto: '',
        pais: '',
        ciudad: '',
        idSede: null
      },
      sedes:[],
      sede:{}
    }    
  },
  components: {
    Alert,
    ModalIndex,
    CardIndex,
    MainFooter,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput,
    [Popover.name]: Popover,
    [Tooltip.name]: Tooltip,
    [DatePicker.name]: DatePicker,
  },
  mounted(){

    let vue = this;

    axios.get(this.$store.state.appUri+'/sedes/listarSedes')
    .then(function(response){
      vue.sedes = response.data;
    })
  },
  methods:{
    dateChangebirthday(event){
      let vue = this;
      let date = new Date(vue.datePicker);
      vue.nuevoUsuario.fechaNacimiento = date.getFullYear().toString() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + date.getDate()).slice(-2) ;
      console.log(vue.nuevoUsuario.fechaNacimiento);
    },
    registrarCliente:function(){
      let vue = this;
      //console.log(vue.nuevoUsuario);
            
      if(vue.esCamposCompletos()){
        vue.mensaje = 'Usuario registrado con éxito.';
        vue.activado = true;        

        
        axios.post(this.$store.state.appUri+'/usuarios/insertar', vue.nuevoUsuario)
        .then(response=>{})
        .catch(function (error) {
          console.log(error);
        })
         

        vue.nuevoUsuario.correo = '';
        vue.nuevoUsuario.username = '';
        vue.nuevoUsuario.password = '';
        vue.nuevoUsuario.nombreRazonSocial = '';
        vue.nuevoUsuario.numeroDocumento ='';
        vue.nuevoUsuario.telefono = '';
        vue.nuevoUsuario.direccion = '';
        vue.nuevoUsuario.fechaNacimiento = ''; 


      }else{
        vue.mensaje = 'Error al crear usuario. Revise que todos los campos estén completos.';
        vue.activado = true;
      }
    },
    esCamposCompletos(){
      let vue = this;
      if (vue.nuevoUsuario.correo != '' && vue.nuevoUsuario.username != '' &&
          vue.nuevoUsuario.password != '' && vue.nuevoUsuario.nombreRazonSocial != '' &&
          vue.nuevoUsuario.numeroDocumento != '' && vue.nuevoUsuario.telefono != '' &&
          vue.nuevoUsuario.direccion != '' && vue.nuevoUsuario.fechaNacimiento != '')
        return true;
      return false;
    },
    obtenerCiudad(sede){
        let vue = this;
        vue.nuevoUsuario.ciudad = sede.pais.ciudad;
        vue.nuevoUsuario.idSede = sede.id;
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/now-ui-kit.scss";
</style>
