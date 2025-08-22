<template>
  <router-view></router-view>
</template>

<script setup>
import { onMounted} from "vue";

import { ThemeModeComposable } from "@/utils/ThemeModeComposable.ts";
const { setThemeBasedOnSystemPreference } = ThemeModeComposable();

onMounted(async () => {
  setThemeBasedOnSystemPreference();
})
</script>
