<template>
  <card>
    <h5 slot="header" class="title">Configuración de perfil</h5>

    
    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="DNI o RUC"
                  v-model="data_usuario.numeroDocumento"
                  placeholder="DNI o RUC">
        </base-input>
      </div>
    </div>
    
    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="Nombres y Apellidos"
                  v-model="data_usuario.nombreRazonSocial"                  
                  placeholder="Nombres y apellidos">
        </base-input>
      </div>
      <!--div class="col-md-6 pl-md-1">
        <base-input label="Apellidos"
                  v-model="data_usuario.apellidos"
                  placeholder="Apellidos">
        </base-input>
      </div-->
    </div>

    <div class="row">
      <div class="col-md-5 pr-md-1" v-bind:class="[isEmailValid()]">
        <base-input label="Email address"
                  v-model="data_usuario.correo"
                  type="email"
                  placeholder="mike@email.com">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="DNI Representante legal"
                  v-model="data_usuario.representanteLegalNombre"
                  placeholder="DNI Representante legal"
                  v-if="tipo_juridico">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="Nombre representante legal"
                  v-model="data_usuario.nombreContacto"
                  placeholder="Nombre representante legal"
                  v-if="tipo_juridico">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="DNI Contacto"
                  v-model="data_usuario.dniContacto"
                  placeholder="DNI Contacto"
                  v-if="tipo_juridico">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 pr-md-1">
        <base-input label="Nombre contacto"
                  v-model="data_usuario.nombreContacto"
                  placeholder="Nombre contacto"
                  v-if="tipo_juridico">
        </base-input>
      </div>
    </div>

    <div class="row">
      <div class="col-md-8">
        <base-input label="Dirección"
                  v-model="data_usuario.direccion"
                  placeholder="Dirección">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input type="date"
                  label="Fecha de nacimiento"
                  format= "yyyy-MM-dd"
                  v-model="data_usuario.fechaNacimiento">
        </base-input>
      </div>
      <div class="col-md-4 px-md-1">
        <base-input label="Teléfono"
                  v-model="data_usuario.telefono"
                  placeholder="Teléfono">
        </base-input>
      </div>
      
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input style="color:white"
            label="Nombre de usuario"
            v-model="data_usuario.username"
            placeholder="Nombre de usuario"
            disabled>
        </base-input>
      </div>
    </div>
    <!--div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input type="password"
            v-model="data_usuario.password"
            label="Contraseña"
            placeholder="Contraseña">
        </base-input>
      </div>
    </div>
    <div class="row">
      <div class="col-md-4 pr-md-1">
        <base-input type="password"
            v-model="data_usuario.confirmar_password"
            label="Confirmar contraseña"
            placeholder="Confirmar contraseña">
        </base-input>
      </div>
    </div-->
    <b-button v-b-modal.modal-save slot="footer" type="primary" fill>Guardar</b-button>
    <b-modal id="modal-save"
        @ok="guardarDatos">
        ¿Deseas actualizar tus datos?
    </b-modal>
  </card>
</template>
<script>
  import axios from 'axios';
  import Authentication from '@/store/authentication.js';
  import NotificationTemplateModifiyUserSuccess from '../Notifications/NotificationTemplateModifiyUserSuccess';

  const TIPO_OPERARIO = 'OPERARIO'; //1
  const TIPO_NATURAL = 'CLIENTE_NATURAL'; //2
  const TIPO_JURIDICO = 'CLIENTE_JURIDICO'; //3
  const TIPO_GERENTE = 'GERENTE'; //6
  const TIPO_ADMIN = 'ADMIN'; //5
  const TIPO_SA = 'SUPER_ADMIN'; //4

  export default {
    props: {
      model: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    data() {
      return{
        data_usuario:{
          id: 0,
          numeroDocumento: '',
          nombreRazonSocial:'',
          correo:'',
          direccion:'',
          fechaNacimiento:'',
          tipoDocumento:'',
          telefono:'',
          username:'',
          idioma:'',
          tipoUsuario:null,
          //password:'',
          //confirmar_password:'',
          dniContacto:'',
          nombreContacto:'',
          representanteLegalDni:'',
          representanteLegalNombre:'',
          idSede: null
        },
        reg: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/,
        tipo_juridico: false,
        type: ["", "info", "success", "warning", "danger"],
        notifications: {
          topCenter: false
        }
      }
    },
    methods:{
      notifyVue(verticalAlign, horizontalAlign,color,componente) {
        //const color = 4;
        //console.log(color);
        this.$notify({
          component: componente,
          icon: "tim-icons icon-bell-55",
          horizontalAlign: horizontalAlign,
          verticalAlign: verticalAlign,
          type: this.type[color],
          timeout: 0
        });
      },
      guardarDatos(){        
        let vue = this;

        console.log(vue.data_usuario);
        axios.post(this.$store.state.appUri+'/usuarios/insertar/',  vue.data_usuario

        )
        .then(response => {
          Authentication.logout();
          switch(vue.data_usuario.tipoUsuario){
            case 2: vue.data_usuario.tipoUsuario = TIPO_NATURAL; break;
            case 1: vue.data_usuario.tipoUsuario = TIPO_OPERARIO; break;
            case 6: vue.data_usuario.tipoUsuario = TIPO_GERENTE; break;
            case 5: vue.data_usuario.tipoUsuario = TIPO_ADMIN; break;
            case 4: vue.data_usuario.tipoUsuario = TIPO_SA; break;
            case 3: vue.data_usuario.tipoUsuario = TIPO_JURIDICO; break;
          }
          Authentication.login(vue.data_usuario);
          vue.notifyVue('top', 'center',2,NotificationTemplateModifiyUserSuccess);
        })
        .catch(function (error) {          
          console.log(error);
        });

      },
      isEmailValid: function() {
          let vue = this;
          return (vue.data_usuario.correo == " ")? "" : (vue.reg.test(vue.data_usuario.correo)) ? 'has-success' : 'has-error';
      }
    },
    mounted(){

      let vue = this;
      vue.data_usuario.idSede = Authentication.getProfile().idSede;
      vue.data_usuario.id = Authentication.getProfile().id;
      vue.data_usuario.correo = Authentication.getProfile().correo;
      vue.data_usuario.username = Authentication.getProfile().username;
      vue.data_usuario.telefono = Authentication.getProfile().telefono;
      vue.data_usuario.direccion = Authentication.getProfile().direccion;
      vue.data_usuario.fechaNacimiento = Authentication.getProfile().fechaNacimiento.substring(0,4)+"-"+Authentication.getProfile().fechaNacimiento.substring(5,7)+"-"+Authentication.getProfile().fechaNacimiento.substring(8,10);
      vue.data_usuario.nombreRazonSocial = Authentication.getProfile().nombreRazonSocial;
      vue.data_usuario.numeroDocumento = Authentication.getProfile().numeroDocumento;
      vue.data_usuario.tipoDocumento = Authentication.getProfile().tipoDocumento;
      //vue.data_usuario.tipoUsuario = Authentication.getProfile().tipoUsuario;
      vue.data_usuario.idioma = Authentication.getProfile().idioma;
      vue.data_usuario.dniContacto = Authentication.getProfile().dniContacto;
      vue.data_usuario.nombreContacto = Authentication.getProfile().nombreContacto;
      vue.data_usuario.representanteLegalDni = Authentication.getProfile().representanteLegalDni;
      vue.data_usuario.representanteLegalNombre = Authentication.getProfile().representanteLegalNombre;
      console.log(vue.data_usuario);


      switch(Authentication.getProfile().tipoUsuario){
        case TIPO_NATURAL:
          vue.tipo_juridico = false;
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 2;
          break;
        case TIPO_OPERARIO:
          vue.tipo_juridico = false;
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 1;
          break;
        case TIPO_GERENTE:
          vue.tipo_juridico = false;
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 6;
          break;
        case TIPO_ADMIN:
          vue.tipo_juridico = false;
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 5;
          break;
        case TIPO_SA:
          vue.tipo_juridico = false;
          vue.data_usuario.tipoDocumento = 'dni';
          vue.data_usuario.tipoUsuario = 4;
          break;
        case TIPO_JURIDICO:
          vue.tipo_juridico = true;
          vue.data_usuario.tipoDocumento = 'ruc';
          vue.data_usuario.tipoUsuario = 3;
          break;   
      }


    }
  }
</script>
<style>
</style>
