import type {
  IMiniActParams,
  IMiniAction,
  IMiniGameParams,
  IMiniScreen,
} from '../type';
import { Matrix3 } from '../utils/Matrix3';
import type { MiniActionType } from '../utils/common';

export class MiniAction implements IMiniAction {
  canvas: HTMLCanvasElement;
  pointerDownFn = this.pointerDown.bind(this);
  pointerUpFn = this.pointerUp.bind(this);
  pointerMoveFn = this.pointerMove.bind(this);
  screen: IMiniScreen;
  gameParams: IMiniGameParams;

  matrix: Matrix3 = new Matrix3();
  constructor(
    canvas: HTMLCanvasElement,
    screen: IMiniScreen,
    params: IMiniGameParams
  ) {
    this.canvas = canvas;
    this.screen = screen;
    this.gameParams = params;

    // 依据适配后的画布，计算坐标点的缩放矩阵
    const { width, height } = canvas.getBoundingClientRect();
    const scaleX = this.gameParams.canvasWidth / width;
    const scaleY = this.gameParams.canvasHeight / height;
    this.matrix.scale(scaleX, scaleY);
    this.addEventListener();
  }
  addEventListener() {
    this.canvas.addEventListener('pointerdown', this.pointerDownFn);
    this.canvas.addEventListener('pointerup', this.pointerUpFn);
    this.canvas.addEventListener('pointermove', this.pointerMoveFn);
  }

  removeEventListener() {
    this.canvas.removeEventListener('pointerdown', this.pointerDownFn);
    this.canvas.removeEventListener('pointerup', this.pointerUpFn);
    this.canvas.removeEventListener('pointermove', this.pointerMoveFn);
  }

  pointerDown(event: PointerEvent) {
    const params: IMiniActParams = {
      x: event.offsetX,
      y: event.offsetY,
      id: event.pointerId,
      actionType: event.type as MiniActionType,
    };

    this.screen.actionTransfer(this.transformPos(params));
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  pointerUp(event: PointerEvent) {
    const params: IMiniActParams = {
      x: event.offsetX,
      y: event.offsetY,
      id: event.pointerId,
      actionType: event.type as MiniActionType,
    };
    this.screen.actionTransfer(this.transformPos(params));
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  pointerMove(event: PointerEvent) {
    const params: IMiniActParams = {
      x: event.offsetX,
      y: event.offsetY,
      id: event.pointerId,
      actionType: event.type as MiniActionType,
    };
    this.screen.actionTransfer(this.transformPos(params));
    if (event.cancelable) {
      event.preventDefault();
    }
  }

  transformPos(params: IMiniActParams): IMiniActParams {
    const { x, y } = params;
    const sx = this.matrix.elements[0];
    const sy = this.matrix.elements[4];
    params.x = x * sx;
    params.y = y * sy;
    return params;
  }
}
