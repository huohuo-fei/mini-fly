import { PlaneUnit } from "../planeUnit";
import { TestBody } from "./testBody";

export class TestUnit extends PlaneUnit{

  constructor(){
    super();

    this.planeBody = new TestBody(20)
  }

}