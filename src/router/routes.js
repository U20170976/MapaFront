import Vue from 'vue';
import Router from 'vue-router';

import DashboardLayout from "@/layout/dashboard/DashboardLayout.vue";
// GeneralViews
import NotFound from "@/pages/NotFoundPage.vue";

// Admin pages
import Dashboard from "@/pages/Dashboard.vue";


import Profile from "@/pages/Profile.vue";
import Notifications from"@/pages/Notifications.vue";
import Icons from "@/pages/Icons.vue";
import Maps from "@/pages/Maps.vue";
import Typography from "@/pages/Typography.vue";
import TableList from "@/pages/TableList.vue";
import listadoPaquetes from "@/pages/Operario/listadoPaquetes.vue";
import Package from "@/pages/Package.vue";
import RutasAdmin from "@/pages/Administrador/AdminForm.vue";
import SedesAdmin from "@/pages/Administrador/AdminForm.vue";
import ModificarSede from "@/pages/Administrador/ModificarSede.vue";
import ModificarRuta from "@/pages/Administrador/ModificarRuta.vue";
import UsuariosAdmin from "@/pages/Administrador/AdminForm.vue";
import PaquetesClient from "@/pages/Cliente/ClientPaquete.vue";
import TrackingClient from "@/pages/Cliente/ClientTracking.vue";
import CreateUser from "@/pages/Profile/CreateProfile.vue";

import ListarHistSimulacion from "@/pages/ListarHistorialSimulacion.vue";



import SignupOperator from '@/pages/SignupOperator.vue';
import Signup from '@/pages/Signup.vue';
import Login from '@/pages/Login.vue';

import Index from "@/pages/Index.vue";
import MainNavbar from '@/layout/MainNavbar.vue';
import MainFooter from '@/layout/MainFooter.vue';


//const Dashboard = () => import(/* webpackChunkName: "dashboard" */"@/pages/Dashboard.vue");
//const Profile = () => import(/* webpackChunkName: "common" */ "@/pages/Profile.vue");
//const Notifications = () => import(/* webpackChunkName: "common" */"@/pages/Notifications.vue");
//const Icons = () => import(/* webpackChunkName: "common" */ "@/pages/Icons.vue");
//const Maps = () => import(/* webpackChunkName: "common" */ "@/pages/Maps.vue");
//const Typography = () => import(/* webpackChunkName: "common" */ "@/pages/Typography.vue");
//const TableList = () => import(/* webpackChunkName: "common" */ "@/pages/TableList.vue");
//
//const listadoPaquetes = () => import(/* webpackChunkName: "common" */ "@/pages/Operario/listadoPaquetes.vue");
//const Package = () => import(/* webpackChunkName: "common" */ "@/pages/Package.vue");
//
//const RutasAdmin = () => import(/* webpackChunkName: "common" */ "@/pages/Administrador/AdminForm.vue")
//const SedesAdmin = () => import(/* webpackChunkName: "common" */ "@/pages/Administrador/AdminForm.vue")
//
//const PaquetesClient = () => import(/* webpackChunkName: "common" */ "@/pages/Cliente/ClientPaquete.vue")
//const TrackingClient = () => import(/* webpackChunkName: "common" */ "@/pages/Cliente/ClientTracking.vue")

Vue.use(Router);

export default ([

  {
    path:"/",
    redirect:"/index",
    name:"/index",
    components: { default: Index, header: MainNavbar, footer: MainFooter },
    props: {
      header: { colorOnScroll: 400 },
      footer: { backgroundColor: 'black' }
    }
  },
  {
    path: "/index",
    name: "index",
    components: { default: Index, header: MainNavbar, footer: MainFooter },
    props: {
      header: { colorOnScroll: 400 },
      footer: { backgroundColor: 'black' }
    }
  },
      

  {
    path: '/login',
    name: 'login',
    components: { default: Login, header: MainNavbar },
    props: {
      header: { colorOnScroll: 400 }
    }
  },

  {
    path: '/signup',
    name: 'signup',
    components: {default: Signup, header: MainNavbar },
    props: {
      header: { colorOnScroll: 400 }
    }
  },

  {
    path: '/signupoperator',
    name: 'signupoperator',
    components: {default: SignupOperator, header: MainNavbar },
    props: {
      header: { colorOnScroll: 400 }
    }
  },
  {
    path: "*",
    name: "Error",
    components: NotFound
  },
  {
    path:"",
    component: DashboardLayout,
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard
      },
      {
        path: "profile",
        name: "Perfil",
        component: Profile
      },
      {
        path: "notifications",
        name: "notifications",
        component: Notifications
      },
      {
        path: "icons",
        name: "icons",
        component: Icons
      },
      {
        path: "maps",
        name: "Simulación",
        component: Maps
      },
      {
        path: "typography",
        name: "typography",
        component: {Typography,DashboardLayout}
      },
      {
        path: "table-list",
        name: "table-list",
        component: TableList
      },
      {
        path: "operario/RegisterPackage",
        name: "Registrar Paquetes",
        component: Package
      },
      {
        path: "operario/listadoPaquetes",
        name: "Gestión de Paquetes",
        component: listadoPaquetes,
        props: {id: "listadoPaquetes"}
      },
      {
        path: "admin/rutas",
        name: "Gestión de Rutas",
        component: RutasAdmin,
        props: {id: "rutas"}
      },
      {
        path: "admin/sedes",
        name: "Gestión de Sedes",
        component: SedesAdmin,
        props: {id: "sedes"}
      },      
      {
        path: "admin/informacionSede/:idSede",
        name: "Modificar sede",
        component: ModificarSede,
        props: {id: "modificarSede"}
      },      
      {
        path: "admin/informacionRuta/:idRuta",
        name: "Modificar ruta",
        component: ModificarRuta,
        props: {id: "modificarRuta"}
      },
      {
        path:"admin/usuarios",
        name: "Gestión de usuarios admin",
        component: UsuariosAdmin,
        props: {id: "usuarios"}
      },
      {
        path:"gerente/usuarios",
        name: "Gestión de usuarios gerente",
        component: UsuariosAdmin,
        props: {id: "usuarios-gerente"}
      },
      {
        path: "cliente/paquetes",
        name: "Paquetes",
        component: PaquetesClient,
        props: {id: "paquetes"}
      },
      {
        path: "cliente/tracking",
        name: "Tracking",
        component: TrackingClient,
        props: {id: "tracking"}
      },
      {
        path: "admin/crearUsuario",
        name: "Creación de usuarios",
        component: CreateUser,
        props: {id: "crearUsuario"}
      },
      {
        path: "admin/modificarUsuario/:idUsuario",
        name: "Modificación de usuarios",
        component: CreateUser,
        props: {id: "modificarUsuario"}
      },
      {
        path: "gerente/listarSimulacion",
        name: "Listar historial simulacion",
        component: ListarHistSimulacion,
        props: {id: "listarHistSimulacion"}
      }
    ]
  }
]);

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 * The specified component must be inside the Views folder
 * @param  {string} name  the filename (basename) of the view to load.
function view(name) {
   var res= require('../components/Dashboard/Views/' + name + '.vue');
   return res;
};**/

//export default routes;

/*
import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/dashboard',
      component: DashboardLayout,
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          components: { default: Starter }
        }
      ]
    }
  ]
});
*/