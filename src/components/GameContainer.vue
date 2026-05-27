<script setup lang="ts">
import { onMounted } from 'vue';

import { MiniScreen } from '../sdk';

let canvasElement: HTMLCanvasElement | null = null;
let miniGameInstance: MiniScreen | null = null;

onMounted(() => {
  console.log('这里初始化游戏场景');
  const canvas = document.getElementById(
    'mini-game-canvas'
  ) as HTMLCanvasElement;

  if (canvas) {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    canvasElement = canvas;
    miniGameInstance = new MiniScreen(canvas);
    console.log(miniGameInstance, 'miniGameInstance');
  } else {
    canvasElement = null
  }
});
</script>

<template>
  <div class="canvas-container">
    <canvas id="mini-game-canvas"></canvas>
  </div>
</template>

<style>
.canvas-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
}
#mini-game-canvas {
  width: min(100%, 500px);
  height: 100%;
  background-color: gray;
  touch-action: none;
}
</style>
