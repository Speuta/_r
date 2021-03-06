import { registerPlugin } from "../patchPlugin.js";

registerPlugin({
  test(element, source, property) : boolean {
    return ["diffuseFresnelParameters", "opacityFresnelParameters", "emissiveFresnelParameters", "refractionFresnelParameters", "reflectionFresnelParameters"].indexOf(property) !== -1
      && !element.target[property];
  },
  resolve(element, source, property) {
    return new BABYLON.FresnelParameters();
  }
});