export class CanvasClass {
  canvas!: HTMLCanvasElement;
  context!: GPUCanvasContext;
  devicePixelRatio!: number;

  constructor(canvas_id: string) {
    this.canvas = document.getElementById(canvas_id) as HTMLCanvasElement;
    this.context = this.canvas.getContext('webgpu') as GPUCanvasContext;
    this.devicePixelRatio = window.devicePixelRatio;
    this.canvas.width = this.canvas.clientWidth * this.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * this.devicePixelRatio;
  }

  public get_canvas(): HTMLCanvasElement {
    return this.canvas;
  }
}