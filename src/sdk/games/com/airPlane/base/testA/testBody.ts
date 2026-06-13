import { PlaneBody } from "../planeBody";

export class TestBody extends PlaneBody{
  w:number = 0
  constructor(w:number){
    super()
    this.w = w
  }
}