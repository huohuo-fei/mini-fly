<script setup lang="ts">
import { onMounted } from 'vue';

import { MiniScreen } from '../sdk';

import { MiniUtils } from '../sdk/utils/MiniUtils';

let canvasElement: HTMLCanvasElement | null = null;
let miniGameInstance: MiniScreen | null = null;

onMounted(() => {
  console.log('这里初始化游戏场景');

  // 批量增加图片资源
  const planeImageModules = import.meta.glob('@/assets/game/plane/*.svg', { eager: true });
  const imageList = Object.values(planeImageModules).map((module:any) => module.default);
  
  const canvas = document.getElementById(
    'mini-game-canvas'
  ) as HTMLCanvasElement;
  if (canvas) {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    canvasElement = canvas;
    miniGameInstance = new MiniScreen(canvas);
    MiniUtils.loadImageListProg(imageList,() => {
    }).then(() =>{
    miniGameInstance?.initAni()
  })
  } else {
    canvasElement = null;
  }
  console.log(canvasElement);
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
