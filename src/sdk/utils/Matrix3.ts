// ==================== Vector2 类（Float32Array 版本） ====================
export class Vector2 {
  private data: Float32Array;

  constructor(x: number = 0, y: number = 0) {
      this.data = new Float32Array([x, y]);
  }

  get x(): number { return this.data[0]; }
  set x(v: number) { this.data[0] = v; }
  
  get y(): number { return this.data[1]; }
  set y(v: number) { this.data[1] = v; }

  // 获取原始数据（用于传递给 WebGL）
  get array(): Float32Array { return this.data; }

  clone(): Vector2 {
      return new Vector2(this.x, this.y);
  }

  set(x: number, y: number): this {
      this.data[0] = x;
      this.data[1] = y;
      return this;
  }

  copy(v: Vector2): this {
      this.data[0] = v.x;
      this.data[1] = v.y;
      return this;
  }

  add(v: Vector2): this {
      this.data[0] += v.x;
      this.data[1] += v.y;
      return this;
  }

  sub(v: Vector2): this {
      this.data[0] -= v.x;
      this.data[1] -= v.y;
      return this;
  }

  multiplyScalar(scalar: number): this {
      this.data[0] *= scalar;
      this.data[1] *= scalar;
      return this;
  }

  dot(v: Vector2): number {
      return this.data[0] * v.x + this.data[1] * v.y;
  }

  length(): number {
      return Math.hypot(this.data[0], this.data[1]);
  }

  normalize(): this {
      const len = this.length();
      if (len !== 0) {
          this.data[0] /= len;
          this.data[1] /= len;
      }
      return this;
  }

  // 应用 Matrix3 变换（优化版，直接访问 Float32Array）
  applyMatrix3(m: Matrix3): this {
      const x = this.data[0], y = this.data[1];
      const e = m.elements;
      
      this.data[0] = e[0] * x + e[3] * y + e[6];
      this.data[1] = e[1] * x + e[4] * y + e[7];
      
      return this;
  }
}


// ==================== Matrix3 类（Float32Array 版本） ====================
export class Matrix3 {
  elements: Float32Array;

  constructor() {
      // 单位矩阵（列主序）
      this.elements = new Float32Array([
          1, 0, 0,
          0, 1, 0,
          0, 0, 1
      ]);
  }

  // 直接从 Float32Array 创建（用于复用缓冲区）
  static fromArray(array: Float32Array): Matrix3 {
      const m = new Matrix3();
      m.elements.set(array);
      return m;
  }

  clone(): Matrix3 {
      const m = new Matrix3();
      m.elements.set(this.elements);
      return m;
  }

  copy(m: Matrix3): this {
      this.elements.set(m.elements);
      return this;
  }

  identity(): this {
      this.elements.set([
          1, 0, 0,
          0, 1, 0,
          0, 0, 1
      ]);
      return this;
  }

  // 矩阵乘法（优化版，减少临时变量）
  multiply(m: Matrix3): this {
      const a = this.elements;
      const b = m.elements;

      const a00 = a[0], a01 = a[3], a02 = a[6];
      const a10 = a[1], a11 = a[4], a12 = a[7];
      const a20 = a[2], a21 = a[5], a22 = a[8];

      const b00 = b[0], b01 = b[3], b02 = b[6];
      const b10 = b[1], b11 = b[4], b12 = b[7];
      const b20 = b[2], b21 = b[5], b22 = b[8];

      a[0] = a00 * b00 + a01 * b10 + a02 * b20;
      a[1] = a10 * b00 + a11 * b10 + a12 * b20;
      a[2] = a20 * b00 + a21 * b10 + a22 * b20;

      a[3] = a00 * b01 + a01 * b11 + a02 * b21;
      a[4] = a10 * b01 + a11 * b11 + a12 * b21;
      a[5] = a20 * b01 + a21 * b11 + a22 * b21;

      a[6] = a00 * b02 + a01 * b12 + a02 * b22;
      a[7] = a10 * b02 + a11 * b12 + a12 * b22;
      a[8] = a20 * b02 + a21 * b12 + a22 * b22;

      return this;
  }

  // 平移（就地修改，零临时分配）
  translate(tx: number, ty: number): this {
      const e = this.elements;
      e[6] += e[0] * tx + e[3] * ty;
      e[7] += e[1] * tx + e[4] * ty;
      e[8] += e[2] * tx + e[5] * ty;
      return this;
  }

  setTranslation(tx: number, ty: number): this {
    const e = this.elements;
    e[6] += e[0] * tx + e[3] * ty;
    e[7] += e[1] * tx + e[4] * ty;
    e[8] += e[2] * tx + e[5] * ty;
    return this;
  }

  // 旋转
  rotate(angle: number): this {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      
      const e = this.elements;
      const a00 = e[0], a01 = e[3];
      const a10 = e[1], a11 = e[4];
      
      e[0] = a00 * cos + a01 * sin;
      e[1] = a10 * cos + a11 * sin;
      e[3] = a00 * -sin + a01 * cos;
      e[4] = a10 * -sin + a11 * cos;
      
      return this;
  }

  // 缩放
  scale(sx: number, sy: number): this {
      const e = this.elements;
      e[0] *= sx;
      e[1] *= sx;
      e[2] *= sx;
      e[3] *= sy;
      e[4] *= sy;
      e[5] *= sy;
      return this;
  }

  // 重置为平移矩阵（避免重复分配）
  makeTranslation(tx: number, ty: number): this {
      this.identity();
      this.elements[6] = tx;
      this.elements[7] = ty;
      return this;
  }

  // 重置为旋转矩阵
  makeRotation(angle: number): this {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      this.elements.set([
          cos, sin, 0,
          -sin, cos, 0,
          0, 0, 1
      ]);
      return this;
  }

  // 重置为缩放矩阵
  makeScale(sx: number, sy: number): this {
      this.identity();
      this.elements[0] = sx;
      this.elements[4] = sy;
      return this;
  }

  // 逆矩阵（就地计算，复用缓冲区）
  invert(): this {
      const e = this.elements;
      const a00 = e[0], a01 = e[3], a02 = e[6];
      const a10 = e[1], a11 = e[4], a12 = e[7];
      const a20 = e[2], a21 = e[5], a22 = e[8];

      const b01 = a22 * a11 - a12 * a21;
      const b11 = -a22 * a10 + a12 * a20;
      const b21 = a21 * a10 - a11 * a20;

      let det = a00 * b01 + a01 * b11 + a02 * b21;
      if (det === 0) return this;

      det = 1 / det;

      this.elements.set([
          b01 * det,
          b11 * det,
          b21 * det,
          (-a22 * a01 + a02 * a21) * det,
          (a22 * a00 - a02 * a20) * det,
          (-a21 * a00 + a01 * a20) * det,
          (a12 * a01 - a02 * a11) * det,
          (-a12 * a00 + a02 * a10) * det,
          (a11 * a00 - a01 * a10) * det
      ]);

      return this;
  }

  // 转换为 Canvas 参数（零拷贝，直接返回数组视图）
  toCanvasTransform(): [number, number, number, number, number, number] {
      const e = this.elements;
      return [e[0], e[1], e[3], e[4], e[6], e[7]];
  }

  // 获取原始 Float32Array（用于 WebGL）
  get array(): Float32Array {
      return this.elements;
  }
}


// ==================== 性能优化版辅助函数（复用对象池） ====================

// 对象池（减少 GC 压力）
const matrixPool: Matrix3[] = [];
const vectorPool: Vector2[] = [];

export function acquireMatrix(): Matrix3 {
  return matrixPool.pop() || new Matrix3();
}

export function releaseMatrix(m: Matrix3): void {
  matrixPool.push(m);
}

export function acquireVector(): Vector2 {
  return vectorPool.pop() || new Vector2();
}

export function releaseVector(v: Vector2): void {
  vectorPool.push(v);
}

// 批量变换（利用 Float32Array 连续内存特性）
export function transformPoints(points: Float32Array, m: Matrix3, out: Float32Array): void {
  // points 格式: [x1, y1, x2, y2, ...]
  const e = m.elements;
  const count = points.length / 2;
  
  for (let i = 0; i < count; i++) {
      const ix = i * 2;
      const x = points[ix];
      const y = points[ix + 1];
      
      out[ix] = e[0] * x + e[3] * y + e[6];
      out[ix + 1] = e[1] * x + e[4] * y + e[7];
  }
}