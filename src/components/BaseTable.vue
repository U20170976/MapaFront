<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
    <tr>
      <slot name="columns">
        <th v-if="select"></th>
        <th v-for="column in columns" :key="column">{{column}}</th>
        <th v-if="actions">{{acciones}}</th>
        <th v-if="combo">{{estados}}</th>
      </slot>
    </tr>
    </thead>
    <tbody :class="tbodyClasses">
    <tr v-for="(item, index) in filterData" :key="index">
      <slot :row="item">
        
        <td v-if="select"><base-checkbox v-model="item.select"></base-checkbox></td>
        <td v-for="(column, index) in columns"
            :key="index"
            >
          {{itemValue(item, column)}}
        </td>
        <td v-if="combo">
            <select class="input-group-prepend form-control" v-model="item.estado" @change="getSignalState(item,item.estado)">
              <option style="color:black"  >EN ALMACEN</option>
              <option style="color:black"  >EN VUELO</option>
              <option style="color:black"  >ENTREGADO</option>
          </select>
        </td>
        <td v-if="actions">
            <base-dropdown tag="div"
                          title-tag="a"
                          class="nav-item"
                          menu-classes="dropdown-navbar">
              <a slot="title" href="#" class="dropdown-toggle nav-link" data-toggle="dropdown" aria-expanded="true">
                <i class="tim-icons icon-settings-gear-63"></i>
                <p class="d-lg-none">
                  Acciones
                </p>
              </a>
              <div class="nav-link" v-if="setAcciones.detalle">
                <a class="nav-item dropdown-item" style="cursor: pointer" 
                          @click="getSignalDetail(item)"><i class="tim-icons icon-simple-add" style="font-size:1.3em"></i> Detalle</a>
              </div>
              <div class="nav-link" v-if="setAcciones.eliminar">
                <a class="nav-item dropdown-item" style="cursor: pointer" 
                          @click="getSignalRemove(item)"><i class="tim-icons icon-trash-simple" style="font-size:1.3em"></i> Eliminar</a>
              </div>
              <div class="nav-link" v-if="setAcciones.modificar">
                <a class="nav-item dropdown-item" style="cursor: pointer"
                          @click="getSignalModify(item)"><i class="tim-icons icon-pencil" style="font-size:1.3em"></i> Modificar</a>
              </div>
            </base-dropdown>
        </td>

      </slot>
    </tr>
    </tbody>
    
    <!-- <b-modal id="modal-delete">
        ¿Desea borrar elemento?
    </b-modal> -->

  </table>  
</template>
<script>

  export default {
    name: 'base-table',
    props: {
      columns: {
        type: Array,
        default: () => [],
        description: "Table columns"
      },
      data: {
        type: Array,
        default: () => [],
        description: "Table data"
      },
      type: {
        type: String, // striped | hover
        default: "",
        description: "Whether table is striped or hover type"
      },
      theadClasses: {
        type: String,
        default: '',
        description: "<thead> css classes"
      },
      tbodyClasses: {
        type: String,
        default: '',
        description: "<tbody> css classes"
      },
      searchWord:{
        type: String,
        default: '',
        description: "Word to filter table"
      },
      actions:{
        type: Boolean,
        default: false,
        description: "Columna de acciones"
      },
      select:{
        type: Boolean,
        default: false,
        description: "Columna de checkbox"
      },
      combo:{
        type: Boolean,
        default: false,
        description: "ComboBox"
      },
      setAcciones:{
        type: Object, //1: Detalle, 2:Eliminar, 3: Modificar, 4: (EN_ALMACEN), 5: (EN_VUELO), 6: (ENTREGADO)
        default: () => {},
        description: "Opción detail encendido o no"
      },
      toogleFilterKey:{
        type: String,
        default: '',
        description: "Information filtered by toggle switch"
      }
    },
    computed: {
      filterData() {
        var data = this.data;
        var filterKey = this.searchWord;
        if(filterKey){
          data = data.filter(function(row){
            return (JSON.stringify(row)).includes(filterKey);
          });
        }
        filterKey = this.toogleFilterKey;
        if(filterKey){
          data = data.filter(function(row){
            return !(JSON.stringify(row)).includes(filterKey);
          });
        }
        return data;
      },
      tableClass() {
        return this.type && `table-${this.type}`;
      },
      acciones(){
        return "Acciones";
      },
      estados(){
        return "Estados";
      }

    },
    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },
      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
      getSignalRemove(item){
        this.$bvModal.msgBoxConfirm('Por favor, confirme para continuar.',{
          title: 'Eliminar',
          size: 'sm',
          okTitle: 'Sí',
          cancelTitle: 'No',
          hideHeaderClose: false,
          centered: false
        }).then(confirm => {
          if(confirm){
            this.$emit("signalRemove",item);
          }
        });
      },
      getSignalModify(item){
        this.$emit("signalModify",item);
      },
      getSignalDetail(item){
        this.$emit("signalDetail",item);
      },
      getSignalState(item,state){
        this.$emit("signalState",item,state.replace(' ','_'));
      },
      dialog () {
        this.$dialog.confirm('Are you sure you want to continue?')
        .then(function () {
          console.log('Clicked on proceed')
        })
        .catch(function () {
          console.log('Clicked on cancel')
        })
      }
    }
  };
</script>
<style>
</style>
