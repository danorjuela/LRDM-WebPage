<template>
  <div class="dots-container" :class="{ 'dark-mode': isDarkMode }" @mousemove="updateMousePosition" @click="createWave">
    <!-- Contenedor de puntos -->
    <svg class="dots-svg" :width="containerWidth" :height="containerHeight">
      <rect
        v-for="(dot, index) in dots"
        :key="index"
        :x="dot.x - dot.radius"
        :y="dot.y - dot.radius"
        :width="dot.radius * 2"
        :height="dot.radius * 2"
        :fill="dot.color"
        :opacity="dot.opacity"
        class="dot"
      />
    </svg>

    <!-- Contenido de ejemplo -->
    <div class="content-overlay d-flex flex-column justify-content-center align-items-center h-100">
      <div class="text-center glass p-3">
        <h1 :class="isDarkMode ? 'text-white' : 'text-dark'">
          La Revolución del Mundo
        </h1>
        <p :class="isDarkMode ? 'text-light' : 'text-muted'" class="lead">
          Un proyecto multimedia de <a href="https://www.danorjuela.com">Danorjuela</a>
        </p>
         <p :class="isDarkMode ? 'text-light' : 'text-muted'" class="lead">
          Proximamente
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'

export default {
  name: 'DotsBackground',
  props: {
    dotSpacing: {
      type: Number,
      default: 40
    }
  },
  setup(props) {
    // Estados reactivos
    const isDarkMode = ref(false)
    const mouseX = ref(0)
    const mouseY = ref(0)
    const containerWidth = ref(window.innerWidth)
    const containerHeight = ref(window.innerHeight)
    const dots = ref([])
    const waves = ref([])
    const autoWaveInterval = ref(null)
    
    // Configuración de los puntos
    const baseRadius = 2
    const maxRadius = 8
    const effectRadius = 100
    
    // Configuración de las ondas
    const waveSpeed = 200 // píxeles por segundo
    const waveMaxRadius = 400
    const waveDuration = 2000 // milisegundos (aumentado para más suavidad)
    const waveStrength = 10 // intensidad del efecto (reducido para más sutileza)
    
    // Configuración de ondas automáticas
    const autoWaveIntervalTime = 4000 // cada 4 segundos para mejor efecto visual
    const waveColors = ['#00ff88', '#ffdd00', '#0099ff', '#ff6644', '#bb44ff', '#44ff99'] // paleta expandida y más vibrante
    
    // Color de los puntos basado en el modo
    const dotColor = computed(() => {
      return isDarkMode.value ? '#ffffff' : '#6c757d'
    })
    
    // Función para alternar modo oscuro
    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value
    }
    
    // Función para actualizar posición del mouse
    const updateMousePosition = (event) => {
      mouseX.value = event.clientX
      mouseY.value = event.clientY
      updateDots()
    }
    
    // Función para crear una onda expansiva
    const createWave = (event, isAuto = false, autoColor = null) => {
      let clickX, clickY
      
      if (isAuto) {
        // Posición aleatoria para ondas automáticas
        clickX = Math.random() * containerWidth.value
        clickY = Math.random() * containerHeight.value
      } else {
        clickX = event.clientX
        clickY = event.clientY
      }
      
      const wave = {
        id: Date.now() + Math.random(),
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: waveMaxRadius,
        startTime: Date.now(),
        duration: waveDuration,
        active: true,
        color: autoColor || null, // Color para ondas automáticas
        isAuto: isAuto
      }
      
      waves.value.push(wave)
      
      // Eliminar la onda después de que termine
      setTimeout(() => {
        const index = waves.value.findIndex(w => w.id === wave.id)
        if (index > -1) {
          waves.value.splice(index, 1)
        }
      }, waveDuration + 200)
    }
    
    // Función para actualizar las ondas
    const updateWaves = () => {
      const currentTime = Date.now()
      
      waves.value.forEach(wave => {
        if (wave.active) {
          const elapsed = currentTime - wave.startTime
          const progress = Math.min(elapsed / wave.duration, 1)
          
          // Usar una función de easing para suavizar la animación
          const easeOut = 1 - Math.pow(1 - progress, 3)
          wave.radius = easeOut * wave.maxRadius
          
          if (progress >= 1) {
            wave.active = false
          }
        }
      })
    }
    
    // Función para crear la cuadrícula de puntos con distribución más orgánica
    const createDots = () => {
      const newDots = []
      
      // Offset aleatorio para crear un inicio menos cuadrado
      const randomOffsetX = Math.random() * props.dotSpacing * 0.5
      const randomOffsetY = Math.random() * props.dotSpacing * 0.5
      
      // Empezar desde un offset negativo para crear bordes más suaves
      const startX = -props.dotSpacing + randomOffsetX
      const startY = -props.dotSpacing + randomOffsetY
      
      for (let x = startX; x < containerWidth.value + props.dotSpacing; x += props.dotSpacing) {
        for (let y = startY; y < containerHeight.value + props.dotSpacing; y += props.dotSpacing) {
          // Añadir una ligera variación aleatoria a la posición de cada punto
          const jitterX = (Math.random() - 0.5) * props.dotSpacing * 0.15
          const jitterY = (Math.random() - 0.5) * props.dotSpacing * 0.15
          
          const finalX = x + jitterX
          const finalY = y + jitterY
          
          // Solo añadir puntos que estén dentro o cerca del área visible
          if (finalX >= -props.dotSpacing && finalX <= containerWidth.value + props.dotSpacing &&
              finalY >= -props.dotSpacing && finalY <= containerHeight.value + props.dotSpacing) {
            newDots.push({
              x: finalX,
              y: finalY,
              baseX: finalX,
              baseY: finalY,
              radius: baseRadius,
              opacity: isDarkMode.value ? 0.6 : 0.4,
              waveOffset: 0,
              color: dotColor.value, // Color base del punto
              waveColors: [] // Array para almacenar colores de ondas activas
            })
          }
        }
      }
      
      dots.value = newDots
    }
    
    // Función para actualizar el tamaño de los puntos basado en mouse y ondas
    const updateDots = () => {
      updateWaves()
      
      dots.value.forEach(dot => {
        let finalRadius = baseRadius
        let finalOpacity = isDarkMode.value ? 0.6 : 0.4
        let activeWaveColors = []
        
        // Limpiar colores de ondas anteriores
        dot.waveColors = []
        
        // Efecto del mouse
        const mouseDistance = Math.sqrt(
          Math.pow(mouseX.value - dot.baseX, 2) + 
          Math.pow(mouseY.value - dot.baseY, 2)
        )
        
        if (mouseDistance < effectRadius) {
          const mouseScaleFactor = 1 - (mouseDistance / effectRadius)
          finalRadius = Math.max(finalRadius, baseRadius + (maxRadius - baseRadius) * mouseScaleFactor)
          finalOpacity = Math.max(finalOpacity, (isDarkMode.value ? 0.6 : 0.4) + 0.4 * mouseScaleFactor)
        }
        
        // Efecto de las ondas
        waves.value.forEach(wave => {
          if (wave.active) {
            const waveDistance = Math.sqrt(
              Math.pow(wave.x - dot.baseX, 2) + 
              Math.pow(wave.y - dot.baseY, 2)
            )
            
            // Calcular la intensidad basada en la distancia a la onda
            const waveBorder = Math.abs(waveDistance - wave.radius)
            const waveThickness = 60 // aumentado para mejor mezcla de colores
            
            // Calcular el progreso de la onda para el fade out
            const elapsed = Date.now() - wave.startTime
            const progress = Math.min(elapsed / wave.duration, 1)
            const fadeOut = 1 - Math.pow(progress, 1.5) // fade out más gradual
            
            if (waveBorder < waveThickness && fadeOut > 0) {
              const distanceIntensity = 1 - (waveBorder / waveThickness)
              const waveIntensity = distanceIntensity * fadeOut
              const waveEffect = waveIntensity * waveStrength
              
              finalRadius = Math.max(finalRadius, baseRadius + waveEffect)
              finalOpacity = Math.max(finalOpacity, (isDarkMode.value ? 0.6 : 0.4) + 0.8 * waveIntensity)
              
              // Aplicar color de onda automática si existe
              if (wave.isAuto && wave.color && waveIntensity > 0.1) { // umbral más bajo
                activeWaveColors.push({
                  color: wave.color,
                  intensity: waveIntensity
                })
              }
            }
          }
        })
        
        // Aplicar mezcla de colores
        if (activeWaveColors.length > 0) {
          dot.color = blendMultipleColors(dotColor.value, activeWaveColors)
        } else {
          // Transición suave de vuelta al color base
          dot.color = dotColor.value
        }
        
        dot.radius = finalRadius
        dot.opacity = finalOpacity
        dot.waveColors = activeWaveColors
        
        // Actualizar posición visual
        dot.x = dot.baseX + dot.waveOffset
        dot.y = dot.baseY + dot.waveOffset
      })
    }
    
    // Función para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      containerWidth.value = window.innerWidth
      containerHeight.value = window.innerHeight
      createDots()
    }
    
    // Función para mezclar colores usando interpolación
    const blendColors = (color1, color2, ratio) => {
      // Convertir colores hex a RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }
      
      // Convertir RGB a hex
      const rgbToHex = (r, g, b) => {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
      }
      
      const rgb1 = hexToRgb(color1)
      const rgb2 = hexToRgb(color2)
      
      if (!rgb1 || !rgb2) return color1
      
      const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio)
      const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio)
      const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio)
      
      return rgbToHex(r, g, b)
    }
    
    // Función para mezclar múltiples colores
    const blendMultipleColors = (baseColor, waveColors) => {
      if (waveColors.length === 0) return baseColor
      
      let result = baseColor
      let totalIntensity = 0
      
      // Calcular la intensidad total
      waveColors.forEach(wc => {
        totalIntensity += wc.intensity
      })
      
      // Limitar la intensidad total para evitar saturación excesiva
      totalIntensity = Math.min(totalIntensity, 1.0)
      
      // Mezclar colores según su intensidad relativa
      waveColors.forEach(wc => {
        const normalizedIntensity = (wc.intensity / totalIntensity) * totalIntensity
        result = blendColors(result, wc.color, normalizedIntensity * 0.8) // 0.8 para mantener algo del color base
      })
      
      return result
    }
    const startAutoWaves = () => {
      autoWaveInterval.value = setInterval(() => {
        const randomColor = waveColors[Math.floor(Math.random() * waveColors.length)]
        createWave(null, true, randomColor)
      }, autoWaveIntervalTime)
    }
    
    // Función para detener ondas automáticas
    const stopAutoWaves = () => {
      if (autoWaveInterval.value) {
        clearInterval(autoWaveInterval.value)
        autoWaveInterval.value = null
      }
    }
    
    // Loop de animación
    const animate = () => {
      updateDots()
      requestAnimationFrame(animate)
    }
    
    // Ciclo de vida del componente
    onMounted(() => {
      createDots()
      animate()
      startAutoWaves()
      window.addEventListener('resize', handleResize)
    })
    
    onUnmounted(() => {
      stopAutoWaves()
      window.removeEventListener('resize', handleResize)
    })
    
    return {
      isDarkMode,
      mouseX,
      mouseY,
      containerWidth,
      containerHeight,
      dots,
      dotColor,
      toggleDarkMode,
      updateMousePosition,
      createWave
    }
  }
}
</script>

<style scoped>
.dots-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  transition: background-color 0.3s ease;
  background-color: #ffffff;
  cursor: pointer;
}

.dots-container.dark-mode {
  background-color: #212529;
}

.dots-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.dot {
  transition: all 0.12s ease-out;
}

.content-overlay {
  position: relative;
  z-index: 2;
  pointer-events: none;
}

.content-overlay > div {
  pointer-events: auto;
}

/* Animación suave para el botón */
.btn {
  transition: all 0.3s ease;
  border-radius: 20px;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content-overlay h1 {
    font-size: 1.75rem;
  }
  
  .content-overlay .lead {
    font-size: 1rem;
  }
}
</style>