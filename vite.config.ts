import { UserConfig } from "vite";
import glsl from "vite-plugin-glsl";
export default <UserConfig>{
  plugins: [glsl()],
};