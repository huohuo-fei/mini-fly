import type { IMiniActParams, IMiniAction, IMiniScreen } from '../type';
import { MiniBus } from '../bus';
import type { MiniActionType } from '../utils/common';

export class MiniAction extends MiniBus implements IMiniAction {
  canvas: HTMLCanvasElement;
  pointerDownFn = this.pointerDown.bind(this);
  pointerUpFn = this.pointerUp.bind(this);
  pointerMoveFn = this.pointerMove.bind(this);
  screen: IMiniScreen;
  constructor(canvas: HTMLCanvasElement, screen: IMiniScreen) {
    super();
    this.canvas = canvas;
    this.screen = screen;
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

    this.screen.actionTransfer(params);
  }

  pointerUp(event: PointerEvent) {
    const params: IMiniActParams = {
      x: event.offsetX,
      y: event.offsetY,
      id: event.pointerId,
      actionType: event.type as MiniActionType,
    };

    this.screen.actionTransfer(params);
  }

  pointerMove(event: PointerEvent) {
    const params: IMiniActParams = {
      x: event.offsetX,
      y: event.offsetY,
      id: event.pointerId,
      actionType: event.type as MiniActionType,
    };

    

    this.screen.actionTransfer(params);
  }
}
