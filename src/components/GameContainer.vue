<script setup lang="ts">
import { onMounted } from 'vue';

import { MINI_GAME_OVER, MiniScreen } from '../sdk';

import { MiniUtils } from '../sdk/utils/MiniUtils';

let canvasElement: HTMLCanvasElement | null = null;
let miniGameInstance: MiniScreen | null = null;

onMounted(() => {
  console.log('这里初始化游戏场景');

  // 批量增加图片资源
  const planeImageModules = import.meta.glob('@/assets/game/plane/*.svg', {
    eager: true,
  });
  const imageList = Object.values(planeImageModules).map(
    (module: any) => module.default
  );

  const canvas = document.getElementById(
    'mini-game-canvas'
  ) as HTMLCanvasElement;
  if (canvas) {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    canvasElement = canvas;
    miniGameInstance = new MiniScreen(canvas);
    MiniUtils.loadImageListProg(imageList, () => {}).then(() => {
      miniGameInstance?.startAni();
      registerEvent();
    });
  } else {
    canvasElement = null;
  }
  console.log(canvasElement);
});

// 游戏暂停
function pauseGame() {
  miniGameInstance?.pauseAni();
}

// 游戏开始
function startGame() {
  miniGameInstance?.startAni();
}

// 注册监听事件
function registerEvent() {
  // miniGameInstance?.actionTransferif
  if (miniGameInstance?.activeGam && miniGameInstance?.activeGam.on) {
    miniGameInstance.activeGam?.on(MINI_GAME_OVER, gameoverCallback);
  }
}

// 游戏结束的回调
function gameoverCallback() {
  // 需要在下一个渲染帧之前取消动画帧
  setTimeout(() => {
    miniGameInstance?.pauseAni();
  });
}
</script>

<template>
  <div class="canvas-container">
    <canvas id="mini-game-canvas"></canvas>
  </div>
  <div class="opt-box">
    <button @click="startGame">开始</button>
    <button @click="pauseGame">暂停</button>
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

.opt-box {
  position: absolute;
  right: 0;
  width: 100px;
  background-color: antiquewhite;
  padding: 0 4px;
  padding-bottom: 4px;
}

.opt-box button {
  width: 100%;
  margin-top: 4px;
}
</style>
