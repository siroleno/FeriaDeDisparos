# AGENTS.md

## Project Overview

Juego "Feria de Disparos" desarrollado con **Phaser 4** y **Vite**. El jugador debe completar 10 rondas disparando siluetas enemigas, evitando aliados y al dueño del puesto.

## Tech Stack

- **Runtime:** Phaser 4.0.0
- **Bundler:** Vite 6.x
- **Module format:** ES Modules (`"type": "module"`)
- **Language:** JavaScript (sin TypeScript)

## Project Structure

```
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
```

## Commands

```bash
npm run dev       # Servidor de desarrollo (Vite + log)
npm run build     # Build de producción (Vite + minificación)
```

No hay tests configurados ni linter. No ejecutar `npm test` ni `npm run lint`.

## Code Conventions

### Style
- JavaScript vanilla, sin TypeScript ni JSX
- Clases ES6 con `export class` para escenas y lógica
- Funciones exportadas con `export function` o `export default`
- Constantes en `Config.js` con `export const` (SCREAMING_SNAKE_CASE)
- Strings en español (títulos, mensajes de UI, motivos de derrota)
- Formato Allman para bloques de código: llave de apertura en nueva línea

### Scene Pattern
Cada escena sigue el patrón:
```js
import { Scene } from 'phaser';

export class MyScene extends Scene {
    constructor() {
        super('MyScene');
    }
    preload() { }
    create() { }
    update(time) { }
}
```

### Scene Flow
Boot → Preloader → MainMenu → Game → GameOver → MainMenu

### File Organization
- Una escena por archivo en `src/game/scenes/`
- Configuración centralizada en `src/game/Config.js`
- Separación entre lógica de negocio (`Logic.js`) y representación (`scenes/Game.js`)
- Assets estáticos en `public/assets/`

## Game Rules (para referencia al modificar)

- 10 rondas, 60 segundos por ronda
- Puntaje para avanzar: 100 + 50 × (ronda - 1)
- Enemigos grandes/mpequeños: 10/20/30 puntos
- Aliados grandes/mpequeños: -30/-20/-10 puntos
- Dueño (ronda 3+): aparece 2s, oculto 3s; dispararlo = game over
- Spawn rate aumenta por ronda (base 1000ms, -40ms por ronda, min 250ms)
- Aliados aparecen con probabilidad creciente por ronda (5% + 2%/ronda, max 35%)

## Important Notes

- No agregar dependencias nuevas sin confirmar
- Los assets van en `public/assets/`, se referencian como `assets/nombre.png`
- El juego usa `Scale.FIT` y `Scale.CENTER_BOTH` — la resolución base es 1024×768
- High scores se guardan en `localStorage` con key `feria-disparos-highscore`
