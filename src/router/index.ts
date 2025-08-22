import { createWebHistory, createRouter } from 'vue-router'
import doLayout from "@/layout/doLayout.vue";

import HomeView from "@/views/HomeView.vue";



const routes = [
  {
    path: '/',
    component: doLayout,
    redirect :"/home",
    children: [
      {path: '/home', component: HomeView , name : "home"},
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router