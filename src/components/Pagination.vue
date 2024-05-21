<template>
  <div class="pagination">
    <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>
    <button v-for="page in totalPages" :key="page" @click="goToPage(page)" :class="{ active: page === currentPage }">
      {{ page }}
    </button>
    <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>
  </div>
</template>

<script>
export default{
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      default: 1
    },
    totalPages: {
      type: Number,
      default: 1
    }
  },
  methods: {
    goToPage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$emit('page-changed', page);
      }
    }
  }
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

button {
  background-color: #3c3f58;
  color: #ffffff;
  border: none;
  padding: 10px;
  margin: 0 5px;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button.active {
  background: linear-gradient(90deg, #6e42f4, #e05eb5);
  font-weight: bold;
}
</style>
