<template>
  <div class="table-container">
    <table>
      <thead :class="theadClasses">
        <tr>
          <th v-for="column in columns" :key="column.value">{{ column.text }}</th>
        </tr>
      </thead>
      <!--
      <tbody :class="tbodyClasses">
        <tr v-for="(row, index) in filteredData" :key="index">
          <td v-for="column in columns" :key="column.value">{{ row[column.value] }}</td>
        </tr>
        <tr v-if="filteredData.length === 0">
          <td :colspan="columns.length" class="no-data">No hay data disponible</td>
        </tr>
      </tbody>
      -->
      <tbody :class="tbodyClasses">
        <tr v-for="(row, index) in filteredData" :key="index">
          <td v-for="(column, columnIndex) in columns" :key="columnIndex">
            <!-- Verificamos si la columna es 'Fecha y hora envío' -->
            <template v-if="column.value === 'fechaEnvio'">
              {{ formatFechaYHora(row.fechaEnvio, row.horaEnvio) }}
            </template>
            <!-- Si no, mostramos el valor normal -->
            <template v-else>
              {{ row[column.value] }}
            </template>
          </td>
        </tr>
        <tr v-if="filteredData.length === 0">
          <td :colspan="columns.length" class="no-data">No hay datos disponibles</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default{
  name: 'BaseTableEnvios',
  props: {
    columns: {
      type: Array,
      default: () => [],
      description: "Columnas de la tabla"
    },
    data: {
      type: Array,
      default: () => [],
      description: "Datos de la tabla"
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
    searchword: {
      type: String,
      default: '',
      description: "Text to filter the table"
    }
  },
  computed: {
    filteredData() {
      console.log('componente Base Table:', this.data);
      if (!this.searchword) {
        return this.data;
      }
      return this.data.filter(row => {
        return Object.values(row).some(value =>
          String(value).toLowerCase().includes(this.searchword.toLowerCase())
        );
      });
    }
  },
  methods: {
    formatFechaYHora(fecha, hora) {
      // Descomponer la fecha en año, mes y día
      const [year, month, day] = fecha.split('-');
      // Devolver la fecha en formato dd-mm-aaaa
      fecha = `${day}-${month}-${year}`;
      // Concatenamos fecha y hora con un guion o como mejor prefieras
      return `${fecha} / ${hora}`;
    }
  }
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2c2f48;
  color: #ffffff;
}

thead {
  background-color: #3c3f58;
}

tbody {
  background-color: #2c2f48;
}

th, td {
  padding: 10px;
  border: 1px solid #4e5075;
}

.no-data {
  text-align: center;
  padding: 20px;
  color: #cccccc;
}
</style>
