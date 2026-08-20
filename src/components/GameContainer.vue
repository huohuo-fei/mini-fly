<script setup lang="ts">
import { onMounted, ref } from 'vue';

import {
  MINI_GAME_OVER,
  MiniScreen,
  type IGameResult,
  GameStatus,
  GameModel,
} from '../sdk';

import { MiniUtils } from '../sdk/utils/MiniUtils';

let canvasElement: HTMLCanvasElement | null = null;
let miniGameInstance: MiniScreen | null = null;

const gameStatus = ref<GameStatus>(GameStatus.START);
const gameResult = ref<IGameResult>({
  score: 0,
  time: 0,
  des: '',
});
const gameModel = ref<GameModel>(GameModel.FORMAL);

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
    gameModel.value = miniGameInstance.gameConfig.gameModel;
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
  gameStatus.value = GameStatus.PAUSE;

  if (miniGameInstance && miniGameInstance.activeGam) {
    const params = miniGameInstance.getGameInfo();
    updateGameInfo(params);
  }
}

// 游戏开始
function startGame() {
  miniGameInstance?.startAni();
  gameStatus.value = GameStatus.DOING;
}

// 游戏重置
function reset() {
  miniGameInstance?.resetGame();
  startGame();
}

// 首页
function goHome() {
  miniGameInstance?.setActiveGam(null);
  gameStatus.value = GameStatus.START;

}

function switchModel() {
  if(!miniGameInstance)return
  // miniGameInstance?.switchModel();
  if (gameModel.value === GameModel.FORMAL) {
    gameModel.value = GameModel.PASTIME;
    miniGameInstance.gameConfig.gameModel = GameModel.PASTIME;
  } else {
    gameModel.value = GameModel.FORMAL;
    miniGameInstance.gameConfig.gameModel = GameModel.FORMAL;

  }
}

// 注册监听事件
function registerEvent() {
  if (miniGameInstance) {
    miniGameInstance.on(MINI_GAME_OVER, gameoverCallback);
  }
}

// 游戏结束的回调
function gameoverCallback(params: IGameResult) {
  if (miniGameInstance?.gameConfig.gameModel === GameModel.FORMAL) {
    updateGameInfo(params);
    gameStatus.value = GameStatus.END;
    // 需要在下一个渲染帧之前取消动画帧,所以使用到 定时器
    setTimeout(() => {
      miniGameInstance?.pauseAni();
    });
  }
}

function updateGameInfo(params: IGameResult) {
  gameResult.value.score = params.score;
  gameResult.value.time = params.time;
  gameResult.value.des = params.des;
}
</script>

<template>
  <div class="canvas-container">
    <canvas id="mini-game-canvas"></canvas>
  </div>
  <div class="opt-box">
    <button v-if="gameStatus === GameStatus.PAUSE" @click="startGame">
      继续
    </button>
    <button v-if="gameStatus === GameStatus.DOING" @click="pauseGame">
      暂停
    </button>
  </div>

  <!-- 游戏开始面板 -->
  <template v-if="gameStatus === GameStatus.START">
    <div class="show-res">
      <p class="title">游戏设置</p>
      <div class="des">
        <p class="item">声音：{{ gameResult.score }}</p>
        <p class="item">
          模式：<button @click="switchModel">
            {{ gameModel === GameModel.FORMAL ? '正常' : '娱乐' }}
          </button>
        </p>
      </div>
      <div class="opt">
        <!-- <button>重置</button> -->
        <button @click="startGame">开始游戏</button>
      </div>
    </div>
  </template>

  <!-- 游戏暂停面板 -->
  <template v-if="gameStatus === GameStatus.PAUSE">
    <div class="show-res">
      <p class="title">游戏暂停</p>
      <div class="des">
        <p class="item">得分：{{ gameResult.score }}</p>
        <p class="item">用时：{{ MiniUtils.formatTimeStr(gameResult.time) }}</p>
      </div>
      <div class="opt">
        <button @click="startGame">继续</button>
        <button @click="goHome">再来一局</button>
      </div>
    </div>
  </template>

  <!-- 游戏结束面板 -->
  <template v-if="gameStatus === GameStatus.END">
    <div class="show-res">
      <p class="title">游戏结束</p>
      <div class="des">
        <p class="item">得分：{{ gameResult.score }}</p>
        <p class="item">用时：{{ MiniUtils.formatTimeStr(gameResult.time) }}</p>
      </div>
      <div class="opt">
        <button @click="reset">再来一局</button>
        <button @click="goHome">返回首页</button>
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
  touch-action: none;
}
#mini-game-canvas {
  width: min(100%, 500px);
  height: 100%;
  background-color: #16324f;
  // touch-action: none;
}

.opt-box {
  position: absolute;
  right: 0;
  width: 100px;
  background-color: antiquewhite;
  padding: 0 4px;
}

.opt-box button {
  width: 100%;
  margin: 4px 0;
}

.show-res {
  background-color: #0a1e36;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    inset 0 8px 12px rgba(255, 255, 255, 0.02);

  border-radius: 40px;
  position: absolute;
  width: 260px;
  left: 50%;
  top: 100px;
  transform: translateX(-50%);
  padding: 28px 20px 22px;

  .title {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 4px;
    color: #f0f9ff;
    text-shadow: 0 4px 12px rgba(0, 30, 60, 0.7),
      0 0 0 1px rgba(255, 255, 255, 0.05);
    margin-bottom: 18px;
    text-transform: uppercase;
    background: linear-gradient(180deg, #ffffff 0%, #a0c8ff 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    letter-spacing: 6px;
    font-weight: 800;
  }

  .des {
    background: #06101c;
    border-radius: 28px;
    padding: 20px 16px;
    margin-bottom: 24px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.04);
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    gap: 14px;

    .item {
      font-size: 16px;
      color: rgba(210, 230, 255, 0.9);

      &:first-child {
        border-bottom: 1px dashed rgba(255, 255, 255, 0.06);
        padding-bottom: 16px;
      }
    }
  }

  .opt {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    button {
      font-size: 18px;
      flex: 1;
      padding: 14px 0;
      border: none;
      border-radius: 60px;
      font-weight: 600;
      background: rgba(20, 40, 70, 0.5);
      color: #d6eaff;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 4px;
    }
  }
}
</style>
