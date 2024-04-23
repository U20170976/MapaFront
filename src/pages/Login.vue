<template>
  <div class="page-header clear-filter" filter-color="purple">
    <div
      class="page-header-image"      
    ></div>

    
    <div class="content">
      <div class="container">
        <div class="col-md-5 ml-auto mr-auto">
          <card type="login" plain>

            <!--div slot="header" class="logo-container">
              <img v-lazy="'img/now-logo.png'" alt="" />
            </div-->
            <h1 class="text-white text-center">Inicio de sesión</h1>
            <fg-input
              class="no-border input-lg"
              addon-left-icon="now-ui-icons users_circle-08"
              placeholder="Usuario"
              v-model="datos.username">
            </fg-input>

            <fg-input
              class="no-border input-lg"
              addon-left-icon="now-ui-icons text_caps-small"
              placeholder="Contraseña"
              type="password"
              v-model="datos.password">
            </fg-input>

            <template slot="raw-content">
              <div id="modals" class="card-footer text-center">
                <n-button                 
                  class="btn btn-login-register btn-round btn-lg btn-block"
                  @click.native="[modals.classic = true, iniciarSesion()]"
                  >Iniciar sesión</n-button>
              </div>

              <modal-index v-if="activado" :show.sync="modals.classic" headerClasses="justify-content-center">
                <h5 slot="header" class="title title-up">Usuario no encontrado</h5>
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
                    style="color:White;"
                    href = "#/signup"
                    class="link footer-link">
                    Crear cuenta
                  </a>
                </h6>
              </div>
              <div class="pull-right">
                <h6>
                  <a
                    class="nav-item link footer-link">
                    ¿Olvidaste la contraseña?
                  </a>
                </h6>
              </div>

              <!--div class="card-footer text-center" style="margin-top: 30px !important">
                <div class="g-signin2" data-onsuccess="onSignIn"></div>
              </div-->

            </template>
          </card>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { CardIndex, Button, FormGroupInput, ModalIndex } from '@/components';
import MainFooter from '@/layout/MainFooter';
import { Popover, Tooltip, DatePicker } from 'element-ui';
import axios from 'axios';

import Authentication from '@/store/authentication.js';


export default {

  name: 'login-page',
  bodyClass: 'login-page',
  components: {
    Authentication,
    CardIndex,
    ModalIndex,
    MainFooter,
    [Button.name]: Button,
    [FormGroupInput.name]: FormGroupInput,
    [Popover.name]: Popover,
    [Tooltip.name]: Tooltip,
    [DatePicker.name]: DatePicker
  },
  data(){
    return{
      modals: {
        classic: false,
        mini: false
      },
      activado: false,
      mensaje: '',
      datos:{
        username:"",
        password:""
      },
      userData:{
          id: 0,
          nombreRazonSocial:'',
          correo:'',
          direccion:'',
          fechaNacimiento:'',
          tipoDocumento:'',
          telefono:'',
          username:'',
          idioma:'',
          numeroDocumento:'',
          tipoUsuario:'',
          dniContacto: '',
          nombreContacto: '',
          representanteLegalDni: '',
          representanteLegalNombre: '',
          idSede: -1
      }
    }      
  },
  methods:{
    iniciarSesion:function(){
      
      let vue = this;
      axios.post(this.$store.state.appUri+'/sesion/login', vue.datos)
      .then(function(response){

          if(response.data.mensaje_respuesta == "Usuario logueado"){ // Back debe verificar codigo de respuesta si no existe - != 200
            //console.log(response.data);
            vue.userData.idSede = response.data.idSede;
            vue.userData.id = response.data.usuario.id;
            vue.userData.correo = response.data.usuario.correo;
            vue.userData.username = response.data.usuario.username;
            vue.userData.telefono = response.data.usuario.telefono;
            vue.userData.direccion = response.data.usuario.direccion;
            //console.log(response.data.usuario.fechaNacimiento.substring(0,4)+"-"+response.data.usuario.fechaNacimiento.substring(5,7)+"-"+response.data.usuario.fechaNacimiento.substring(8,10));
            vue.userData.fechaNacimiento = response.data.usuario.fechaNacimiento.substring(0,4)+
                                        "-"+response.data.usuario.fechaNacimiento.substring(5,7)+
                                        "-"+response.data.usuario.fechaNacimiento.substring(8,10);
            vue.userData.nombreRazonSocial = response.data.usuario.nombreRazonSocial;
            vue.userData.tipoDocumento = response.data.usuario.tipoDocumento;
            vue.userData.idioma = response.data.usuario.idioma;
            vue.userData.numeroDocumento = response.data.usuario.numeroDocumento;
            vue.userData.tipoUsuario = response.data.usuario.tipoUsuario;
            vue.userData.dniContacto = response.data.usuario.dniContacto;
            vue.userData.nombreContacto = response.data.usuario.nombreContacto;
            vue.userData.representanteLegalDni = response.data.usuario.representanteLegalDni;
            vue.userData.representanteLegalNombre = response.data.usuario.representanteLegalNombre;
            Authentication.logout();
            Authentication.login(vue.userData);
            vue.$router.push('/profile');
          }else{
            //console.log("USUARIO NO ENCONTRADO");
            vue.mensaje = 'Usuario no encontrado. Verifique el nombre de usuario y contraseña.'
            vue.activado = true;
          }
      })
      .catch(function (error) {
        vue.mensaje = 'Usuario no encontrado. Verifique el nombre de usuario y contraseña.'
        vue.activado = true;
        console.log(error);
      });
    }
  },
  mounted(){
    let vue = this;
    if(Authentication.isAuthenticated()){
      vue.$router.push('/profile');
    }
  }
};
</script>
<style lang="scss" scoped>
  @import "@/assets/scss/now-ui-kit.scss";
/*
h1, .h1 {
    font-size: 3.5em;
    line-height: 1.15;
    margin-bottom: 15px * 2;    
}
*/
</style>
