import { defineStore } from 'pinia';

export const useVdaDashboardStore = defineStore('vdaDashboardStore', {
  state: () => {
    const lcBsTheme = localStorage.getItem('bsTheme') || 'auto';
    const lcLang = localStorage.getItem('lcLang') || ' ';
    return {
      vdaThemeMode : lcBsTheme,
      vdaLang : lcLang,
    }
  },
  actions: {
    ChangeViewMode(mode:string){
      this.vdaThemeMode = mode
      localStorage.setItem('bsTheme',mode) 
    },
    ChangeLang(lang:string){
      this.vdaLang = lang
      localStorage.setItem('lcLang',lang) 
    },
  }
});