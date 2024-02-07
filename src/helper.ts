export const CheckWebGPU = () => {
    let result = true;
        if (!navigator.gpu) {
           result =false;
        } 
    return result;
}