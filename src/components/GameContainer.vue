<script setup lang="ts">
import { onMounted,ref } from 'vue';

import { MINI_GAME_OVER, MiniScreen, type IGameResult, GameStatus } from '../sdk';

import { MiniUtils } from '../sdk/utils/MiniUtils';

let canvasElement: HTMLCanvasElement | null = null;
let miniGameInstance: MiniScreen | null = null;

const gameStatus = ref<GameStatus>(GameStatus.START)
const gameResult = ref<IGameResult>({
  score: 0,
  time: 0,
  des:''
})

onMounted(() => {
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
      // miniGameInstance?.startAni();
      registerEvent();
      console.log(canvasElement);
      
      // 资源加载完毕
    });
  } else {
    canvasElement = null;
  }
});

// 游戏暂停
function pauseGame() {
  miniGameInstance?.pauseAni();
  gameStatus.value = GameStatus.PAUSE
}

// 游戏开始
function startGame() {
  miniGameInstance?.startAni();
  gameStatus.value = GameStatus.DOING
}

// 游戏重置
function reset() {
  miniGameInstance?.resetGame();
  startGame()
}

// 注册监听事件
function registerEvent() {
  if(miniGameInstance){
    miniGameInstance.on(MINI_GAME_OVER, gameoverCallback);
  }
}

// 游戏结束的回调
function gameoverCallback(params:IGameResult) {
  console.log(params,'params');
  gameStatus.value = GameStatus.END
  // 需要在下一个渲染帧之前取消动画帧,所以使用到 定时器
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

    <!-- 游戏开始面板 -->
    <template v-if="gameStatus === GameStatus.START">
    <div class="show-res" >
    <p class="title">游戏设置</p>
    <p class="item">声音：{{ gameResult.score }}</p>
    <p class="item">模式：{{ gameResult.time }}</p>
    <div class="opt">
      <button >重置</button>
      <button @click="startGame">开始游戏</button>
    </div>
  </div>
  </template>

  <!-- 游戏暂停面板 -->
  <template v-if="gameStatus === GameStatus.PAUSE">
    <div class="show-res" >
    <p class="title">游戏暂停</p>
    <p class="item">得分：{{ gameResult.score }}</p>
    <p class="item">用时：{{ gameResult.time }}</p>
    <div class="opt">
      <button @click="startGame">继续</button>
      <button @click="reset">首页</button>
    </div>
  </div>
  </template>

  <!-- 游戏结束面板 -->
  <template v-if="gameStatus === GameStatus.END">
    <div class="show-res" >
    <p class="title">游戏结束</p>
    <p class="item">得分：{{ gameResult.score }}</p>
    <p class="item">用时：{{ gameResult.time }}</p>
    <div class="opt">
      <button>再来一局</button>
      <button>返回首页</button>
    </div>
  </div>
  </template>

</template>

<style lang="less">
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
  background-color: #000;
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

.show-res{
  background-color: pink;
  position: absolute;
  width:200px;
  // height: 100px;
  left: 50%;
  top: 100px;
  // translate: ;
  transform: translateX(-50%);
  padding: 10px 8px;

  .title{
    font-size: 20px;
    font-weight: 700;
    color: #000;
  }

  .item{
    font-size: 16px;
    color: #000;
    margin-top: 5px;
  }

 .opt{
  display: flex;
  justify-content: center;
  margin-top: 10px;
  button {
    // background-color: aliceblue;
    margin: 0 10px;
  }
 }
}
</style>
