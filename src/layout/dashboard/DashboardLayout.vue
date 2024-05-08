<template>
  <div class="wrapper">
    <side-bar>
      <template slot="links">
        <sidebar-link v-if="toggle.dashboard" to="/dashboard" :name="$t('sidebar.dashboard')" icon="tim-icons icon-chart-pie-36"/>
        <sidebar-link v-if="toggle.icono" to="/icons" :name="$t('sidebar.icons')" icon="tim-icons icon-atom"/>
        <sidebar-link v-if="toggle.simulacion" to="/maps" :name="$t('sidebar.maps')" icon="tim-icons icon-world"/>
        <!--sidebar-link to="/notifications" :name="$t('sidebar.notifications')" icon="tim-icons icon-bell-55"/-->
        <sidebar-link v-if="toggle.perfil" to="/profile" :name="$t('sidebar.userProfile')" icon="tim-icons icon-single-02"/>
        <!--sidebar-link to="/table-list" :name="$t('sidebar.tableList')" icon="tim-icons icon-puzzle-10"/-->
        <!--sidebar-link to="/typography" :name="$t('sidebar.typography')" icon="tim-icons icon-align-center"/-->
        <!--sidebar-link to="/dashboard?enableRTL=true" :name="$t('sidebar.rtlSupport')" icon="tim-icons icon-world"/-->
        <sidebar-link v-if="toggle.gestionRutas" to="/admin/rutas" :name="$t('sidebar.rutas')" icon="tim-icons icon-bus-front-12"/>
        <sidebar-link v-if="toggle.gestionSedes" to="/admin/sedes" :name="$t('sidebar.sedes')" icon="tim-icons icon-globe-2"/>
        <sidebar-link v-if="toggle.gestionPaquetes" to="/operario/listadoPaquetes" :name="$t('sidebar.managePackage')" icon="tim-icons icon-app"/>
        <sidebar-link v-if="toggle.listaPaquetes" to="/cliente/paquetes" :name="$t('sidebar.listarpaquetes')" icon="tim-icons icon-single-copy-04"/>
        <sidebar-link v-if="toggle.tracking" to="/cliente/tracking" :name="$t('sidebar.tracking')" icon="tim-icons icon-square-pin"/>
        <sidebar-link v-if="toggle.gestionUsuarios" to="/admin/usuarios" :name="$t('sidebar.usuarios')" icon="tim-icons icon-badge"/>      
        <sidebar-link v-if="toggle.gestionUsuariosGerente" to="/gerente/usuarios" :name="$t('sidebar.usuarios-gerente')" icon="tim-icons icon-badge"/>
        <sidebar-link v-if="toggle.listaHistorialSimulacion" to="/gerente/listarSimulacion" :name="$t('sidebar.listarHistSimulacion')" icon="tim-icons icon-badge"/>
      </template>
    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <content-footer></content-footer>
    </div>
  </div>
</template>
<style lang="scss">
.sidebar-link {
  color: #1310b4; /* Cambia a cualquier color que desees */
}
</style>
<script>
  import TopNavbar from "./TopNavbar.vue";
  import ContentFooter from "./ContentFooter.vue";
  import DashboardContent from "./Content.vue";
  import MobileMenu from "./MobileMenu";
  import Authentication from '@/store/authentication.js';

  const TIPO_OPERARIO = 'OPERARIO'; //1
  const TIPO_NATURAL = 'CLIENTE_NATURAL'; //2
  const TIPO_JURIDICO = 'CLIENTE_JURIDICO'; //3
  const TIPO_GERENTE = 'GERENTE'; //6
  const TIPO_ADMIN = 'ADMIN'; //5
  const TIPO_SA = 'SUPER_ADMIN'; //4


  export default {
    
    data(){
      return{
        toggle:{
          icono :false,
          dashboard :false,
          simulacion :false,
          perfil :false,
          gestionRutas :false,
          gestionSedes :false,
          gestionUsuarios :false,
          gestionPaquetes :false,
          listaPaquetes :false,
          tracking: false,
          gestionUsuariosGerente: false,
          listaHistorialSimulacion: false
        }
      }
    },
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      }
    },
       
    mounted(){
      let vue = this;

          vue.toggle.dashboard = true;
          vue.toggle.simulacion = true;
          vue.toggle.perfil = true;
          vue.toggle.gestionRutas = true;
          vue.toggle.gestionSedes = true;
          vue.toggle.gestionUsuarios = true;
          vue.toggle.gestionPaquetes = true;
          vue.toggle.listaPaquetes = true;
          vue.toggle.tracking = true;
          vue.toggle.gestionUsuariosGerente = true;

    }
    /*
    mounted(){
      let vue = this;
      switch(Authentication.getProfile().tipoUsuario){
        case TIPO_NATURAL:
          vue.toggle.perfil = true;
          vue.toggle.tracking= true;
          vue.toggle.listaPaquetes= true;
          break;
        case TIPO_JURIDICO:
          vue.toggle.perfil = true;
          vue.toggle.tracking= true;
          vue.toggle.listaPaquetes= true;
          break;
        case TIPO_OPERARIO:
          vue.toggle.perfil = true;
          vue.toggle.gestionPaquetes = true;
          vue.toggle.listaPaquetes= false;
          vue.toggle.tracking= true;
          break;        
        case TIPO_GERENTE:
          vue.toggle.dashboard = true;
          vue.toggle.simulacion = true;
          vue.toggle.perfil = true;
          vue.toggle.gestionUsuariosGerente = true;
          vue.toggle.gestionPaquetes = true;
          vue.toggle.listaHistorialSimulacion = true;
          break;
        case TIPO_ADMIN:
          vue.toggle.createuser=true;
          vue.toggle.modificarSede=true;
          vue.toggle.perfil = true;
          vue.toggle.gestionRutas = true;
          vue.toggle.gestionSedes = true;
          vue.toggle.gestionUsuarios = true;
          break;
        case TIPO_SA:
          vue.toggle.dashboard = true;
          vue.toggle.simulacion = true;
          vue.toggle.perfil = true;
          vue.toggle.gestionRutas = true;
          vue.toggle.gestionSedes = true;
          vue.toggle.gestionUsuarios = true;
          vue.toggle.gestionPaquetes = true;
          vue.toggle.listaPaquetes = true;
          vue.toggle.tracking = true;
          vue.toggle.gestionUsuariosGerente = true;
          break;
      }
    }*/
  };
</script>
