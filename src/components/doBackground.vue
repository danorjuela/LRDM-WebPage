<template>
  <div class="dots-container" :class="{ 'dark-mode': isDarkMode }" @mousemove="updateMousePosition">
    <!-- Contenedor de puntos -->
    <svg class="dots-svg" :width="containerWidth" :height="containerHeight">
      <rect
        v-for="(dot, index) in dots"
        :key="index"
        :x="dot.x - dot.radius"
        :y="dot.y - dot.radius"
        :width="dot.radius * 2"
        :height="dot.radius * 2"
        :fill="dotColor"
        :opacity="dot.opacity"
        class="dot"
      />
    </svg>

    <!-- Contenido de ejemplo -->
    <div class=" content-overlay d-flex flex-column justify-content-center align-items-center h-100">
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
    
    // Configuración de los puntos
    const baseRadius = 2
    const maxRadius = 8
    const effectRadius = 100
    
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
              opacity: isDarkMode.value ? 0.6 : 0.4
            })
          }
        }
      }
      
      dots.value = newDots
    }
    
    // Función para actualizar el tamaño de los puntos basado en la distancia al mouse
    const updateDots = () => {
      dots.value.forEach(dot => {
        const distance = Math.sqrt(
          Math.pow(mouseX.value - dot.baseX, 2) + 
          Math.pow(mouseY.value - dot.baseY, 2)
        )
        
        if (distance < effectRadius) {
          // Calcular el factor de escala basado en la distancia
          const scaleFactor = 1 - (distance / effectRadius)
          dot.radius = baseRadius + (maxRadius - baseRadius) * scaleFactor
          dot.opacity = (isDarkMode.value ? 0.6 : 0.4) + 0.4 * scaleFactor
        } else {
          dot.radius = baseRadius
          dot.opacity = isDarkMode.value ? 0.6 : 0.4
        }
      })
    }
    
    // Función para manejar el redimensionamiento de la ventana
    const handleResize = () => {
      containerWidth.value = window.innerWidth
      containerHeight.value = window.innerHeight
      createDots()
    }
    
    // Ciclo de vida del componente
    onMounted(() => {
      createDots()
      window.addEventListener('resize', handleResize)
    })
    
    onUnmounted(() => {
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
      updateMousePosition
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
  transition: all 0.1s ease-out;
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