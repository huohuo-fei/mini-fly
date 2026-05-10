<script setup lang="ts">
import { onMounted} from 'vue'

import {MiniScreen} from '../sdk'


let canvasElement: HTMLCanvasElement | null = null
let miniGameInstance: MiniScreen | null = null

onMounted(() =>{
  console.log('这里初始化游戏场景');
  const canvas = document.getElementById('mini-game-canvas') as HTMLCanvasElement

  if(canvas){
    canvasElement = canvas
    miniGameInstance = new MiniScreen(canvas)
    console.log(miniGameInstance,'miniGameInstance');
    
  }
  

})

</script>

<template>
<div class="canvas-container">
  <canvas id="mini-game-canvas"></canvas>
</div>
</template>
