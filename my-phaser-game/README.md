FERIA DE DISPAROS

Juego de disparos al estilo FPS con temática de juego de feria donde deberas disparar a las siluetas emergentes de
distintos personajes, se debera diferencir las  siluetas “enemigaa” de las  “aliadas”, dependiendo de a cuál se dispare, se dan diferentes recompensas o penalizaciones.

-Integrantes
Rocio Abril Leno
Margarita Monutti Previdere

-Tecnologias utilizadas
Node.js
JavaScript
Phaser
OpenCode 
Vite

-Agentes de OpenCode utilizados
BigPickle

-Instalacion

npm install

-Ejecutar

npm run dev

-Build

npm run build

-Gameplay 

Deberás disparar a los enemigos en un tiempo específico, evitando el disparar a tus aliados (verdes) y al dueño (rosa). Si se le dispara a los aliados se pierden puntos dependiendo de su proximidad, y al dispararle al dueño terminara el juego.

-Objetivo

El objetivo del jugador es disparar el número de enemigos necesarios antes de que se termine el tiempo, en las 10 rondas.

-Mecánicas principales

Disparar enemigos
Evitar aliados y dueño

-Controles
Mouse: Movimiento
Click izquierdo: Disparar

-Arquitectura
src/
main.js                  # Entry point: llama StartGame()
game/
main.js                # Config de Phaser, export StartGame()
Config.js              # Constantes del juego (scores, rondas, spawns)
Logic.js               # GameLogic: estado de puntuación y rondas
HighScore.js           # Persistencia en localStorage
scenes/
Boot.js              # Carga assets iniciales
Preloader.js         # Barra de progreso + carga de assets
MainMenu.js          # Pantalla principal con botón JUGAR
Game.js              # Escena principal de juego 
GameOver.js          # Pantalla de victoria/derrota
public/
assets/                  # bg.png, logo.png
favicon.png
  style.css
vite/
 config.dev.mjs           # Configuración de desarrollo
config.prod.mjs          # Configuración de producción
