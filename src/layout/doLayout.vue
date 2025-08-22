<template>
  <do-background/>
</template>

<script setup >
import doHeader from "@/layout/doHeader.vue" 
import doBackground from "@/components/doBackground.vue";
</script>

<style scoped>
@media (min-width: 992px) {
  .sticky-lg {
    position: sticky !important;
    top: 0 !important;
    height: 100vh !important;
    z-index: 1020 !important;
  }
}
@media (max-width: 991.98px) {
  .sticky-lg {
    position: static !important;
    height: auto !important;
  }
}
</style>