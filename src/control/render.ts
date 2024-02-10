import triangleVertWGSL from '../shader/triangle.vert.wgsl';
import { CanvasClass } from "../render/canvas_controller";
import  {Shaders} from "../shader/shaders";
import Square from '../shader/square.wgsl';
import lines from '../shader/lines.wgsl';
import { HelperClass } from "../helper";
export class RenderPassClass {

  canvas!:HTMLCanvasElement;
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;
  swapChainFormat!: GPUTextureFormat;
  swapChain!: GPUCanvasConfiguration;
  color!: string;
  pipeline!: GPURenderPipeline;
  helper!: HelperClass;

  constructor() {
    this.canvas = new CanvasClass('canvas').get_canvas();
    this.helper = new HelperClass();
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

  async CreateSquare(){
    const  gpu = await this.helper.InitGPU();
    const device = gpu.device;
    
    const vertexData = new Float32Array([
      //position    //color
     -0.5, -0.5,    1, 0, 0,  // vertex a
      0.5, -0.5,    0, 1, 0,  // vertex b
     -0.5,  0.5,    1, 1, 0,  // vertex d
     -0.5,  0.5,    1, 1, 0,  // vertex d
      0.5, -0.5,    0, 1, 0,  // vertex b
      0.5,  0.5,    0, 0, 1   // vertex c
    ]);
    const vertexBuffer = this.helper.CreateGPUBuffer(device, vertexData);

    const shader = Square;
    const pipeline = device.createRenderPipeline({
      vertex: {
        module: device.createShaderModule({
          code: shader,
        }),
        entryPoint: "vs_main",
        buffers: [
          {
            arrayStride: 4*(2+3),
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: "float32x2",
              },
              {
                shaderLocation: 1,
                offset: 4*2,
                format: "float32x3",
              }
            ]
          }
        ],
      },
      fragment: {
        module: device.createShaderModule({
          code: shader,
        }),
        entryPoint: "fs_main",
        targets: [
          {
            format: gpu.format,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
      },
      layout: 'auto'
    });

    const commandEncoder = device.createCommandEncoder();
    const textureView = gpu.context.getCurrentTexture().createView();
    const renderPass = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
          clearValue: { r: 0.0, g: 0.5, b: 1.0, a: 1.0 },
          storeOp: "store",
          loadOp: "clear",
        },
      ],
    });

    renderPass.setPipeline(pipeline);
    renderPass.setVertexBuffer(0, vertexBuffer);
    renderPass.draw(6);
    renderPass.end();
    device.queue.submit([commandEncoder.finish()]);
  }

}

