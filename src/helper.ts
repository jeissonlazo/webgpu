import { CanvasClass } from './render/canvas_controller';

export class HelperClass {
    canvas!:HTMLCanvasElement;
    adapter!: GPUAdapter;
    device!: GPUDevice;
    context!: GPUCanvasContext;
    format!: GPUTextureFormat;

    constructor() {
        this.canvas = new CanvasClass('canvas').get_canvas();
    }

    public CheckWebGPU():string {
        let result = 'Great, your current browser supports WebGPU!';
        if (!navigator.gpu) {
            result = `Your current browser does not support WebGPU! Make sure you are on a system 
            with WebGPU enabled. Currently, WebGPU is supported in  
            <a href="https://www.google.com/chrome/canary/">Chrome canary</a>
            with the flag "enable-unsafe-webgpu" enabled. See the 
            <a href="https://github.com/gpuweb/gpuweb/wiki/Implementation-Status"> 
            Implementation Status</a> page for more details.   
            You can also use your regular Chrome to try a pre-release version of WebGPU via
            <a href="https://developer.chrome.com/origintrials/#/view_trial/118219490218475521">Origin Trial</a>.                
            `;
        } 
    
        if(this.canvas){
            const div = document.getElementsByClassName('item2')[0] as HTMLDivElement;
            if(div){
                this.canvas.width  = div.offsetWidth;
                this.canvas.height = div.offsetHeight;
    
                const windowResize = () => {
                    this.canvas.width  = div.offsetWidth;
                    this.canvas.height = div.offsetHeight;
                };
                window.addEventListener('resize', windowResize);
            }
        }
    
        return result;
    }

    public CreateGPUBuffer(device:GPUDevice,data: Float32Array,usageFlag:GPUBufferUsageFlags = GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST):GPUBuffer {
        const buffer = device.createBuffer({
            size: data.byteLength,
            usage: usageFlag,
            mappedAtCreation: true
        });
        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    }

    public async InitGPU() {
        const checkgpu = this.CheckWebGPU();
        if(checkgpu.includes('Your current browser does not support WebGPU!')){
            throw('Your current browser does not support WebGPU!');
        }

        this.adapter = <GPUAdapter> await navigator.gpu?.requestAdapter();
        this.device = <GPUDevice> await this.adapter?.requestDevice();
        this.context = <GPUCanvasContext>this.canvas?.getContext("webgpu");
        this.format = navigator.gpu.getPreferredCanvasFormat();
        const devicePixelRatio = window.devicePixelRatio || 1;

        this.context.configure({
            device: this.device,
            format: this.format,
            alphaMode:'opaque'
        });

        return { device: this.device, canvas: this.canvas, format: this.format, context: this.context };

    }

}
