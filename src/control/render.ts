import triangleVertWGSL from '../shader/triangle.vert.wgsl';
import { CanvasClass } from "../render/canvas_controller";
import  {Shaders} from "../shader/shaders";
import lines from '../shader/lines.wgsl';
export class RenderPassClass {

  canvas!:HTMLCanvasElement;
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;
  swapChainFormat!: GPUTextureFormat;
  swapChain!: GPUCanvasConfiguration;
  color!: string;
  pipeline!: GPURenderPipeline;
  constructor() {
    this.canvas = new CanvasClass('canvas').get_canvas();

    this.selectControl();
  }
  
  async Init(primitiveType: string = 'triangle-list') {
    this.adapter = <GPUAdapter> await navigator.gpu?.requestAdapter();
    this.device = <GPUDevice> await this.adapter?.requestDevice();
    this.context = <GPUCanvasContext>this.canvas?.getContext("webgpu");

    //texture 
    this.swapChainFormat = 'rgba8unorm';
    this.swapChain =  this.context.configure({
      device: this.device,
      format: this.swapChainFormat,
      alphaMode: 'premultiplied',
    })!

    let indexFormat = undefined;

    if(primitiveType === 'triangle-strip'){
      indexFormat = 'uint32';
    }

    const shader: any = triangleVertWGSL;
    this.pipeline = this.device.createRenderPipeline({
      layout: 'auto',
      vertex: {
        module: this.device.createShaderModule({
          code: shader,
        }),
        entryPoint: "vs_main",
      },
      fragment:{
        module: this.device.createShaderModule({
          code: shader,
        }),
        entryPoint: "fs_main",
        targets:[{
          format: this.swapChainFormat as GPUTextureFormat
        }]
      },
      primitive:{
        topology: primitiveType as GPUPrimitiveTopology,
        stripIndexFormat: indexFormat as GPUIndexFormat
      }
    })

    const commandEncoder:GPUCommandEncoder = this.device.createCommandEncoder();
    const textureView = this.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          clearValue: { r: 0.0, g: 0.5, b: 1.0, a: 1.0 },
          loadOp: "clear",
          storeOp: "store",
          view: textureView,
        },
      ],
    });

    renderPass.setPipeline(this.pipeline);
    renderPass.draw(9);
    renderPass.end();

    this.device.queue.submit([commandEncoder.finish()]);
  }

  selectControl (){
    document.getElementById('id-primitive')?.addEventListener('change', (event: Event ) => {
      let value = (<HTMLSelectElement>event.target).value;
      this.Init(value);
    })
  }
}

