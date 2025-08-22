import { ThemeModeMonitor} from '@/utils/ThemeModeMonitor.ts'
import { useVdaDashboardStore} from '@/stores/vdaDashboardStore.ts'
import { storeToRefs } from 'pinia';

export function ThemeModeComposable() {

  const vdaDashboardStore = useVdaDashboardStore() 
  const { vdaThemeMode } = storeToRefs(vdaDashboardStore); 

  const setThemeBasedOnSystemPreference = () => {
    if (vdaThemeMode.value === 'auto'){
      let osMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-bs-theme', osMode?'dark':'ligth');
      ThemeModeMonitor.MountMonitor();
    }else{
      document.documentElement.setAttribute('data-bs-theme', vdaThemeMode.value);
      ThemeModeMonitor.RemoveMonitor();
    }
  }

  return {
    setThemeBasedOnSystemPreference,
    vdaThemeMode
  }

}