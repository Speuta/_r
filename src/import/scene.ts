import { global } from "../global.js";
import { is } from "../is.js";
import { extend } from "../util/extend.js";
import { loadingScreen } from "../util/loadingScreen.js";
import { patch } from "../patch.js";
export interface ImportSceneOptions {
  loadingScreen? : boolean;
  ready? : Function;
  progress? : Function;
  error? : Function;
  scene? : string;
  assets? : string;
  patch? : any;
  addAllToScene? : boolean;
}

let DEFAULTS = {
  loadingScreen : true,
  addAllToScene : true
};

function importAssetContainerAsync(settings : ImportSceneOptions) : Promise<BABYLON.AssetContainer> {
  let assets, fileName;
  if (settings.assets) {
    assets = settings.assets;
    fileName = settings.scene;
  }
  else {
    fileName = settings.scene.split('/').pop();
    assets = settings.scene.replace(fileName, '');
  }
 return new Promise((resolve, reject) => {
   BABYLON.SceneLoader.LoadAssetContainerAsync(assets, fileName, global.scene, function(e) {
     if (settings.progress) {
       settings.progress(e);
     }
   }).then(function(assetContainer) {
     if (settings.patch) {
       patch(settings.patch).done(() => {
         resolve(assetContainer);
       });
     }
     else {
       resolve(assetContainer);
     }
   }, function(reason : any) {
     if (settings.error) {
       settings.error(reason);
     }
     reject(reason);
   });
 });
}

// see http://api.jquery.com/jquery.ajax/
export function importScene(scene : String | ImportSceneOptions, settings? : ImportSceneOptions) : Promise<BABYLON.AssetContainer> {
  let options = <ImportSceneOptions> {};
  if (is.String(scene)) {
    options.scene = <string> scene;
    if (settings) {
      options = extend({}, DEFAULTS, settings);
    }
  }
  else {
    settings = <ImportSceneOptions> scene;
    options = extend({}, DEFAULTS, settings);
  }
  if (options.loadingScreen == true) {
    loadingScreen.show();
  }
  return new Promise((resolve, reject) => {
    importAssetContainerAsync(options).then(function(assetContainer) {
      if (settings.addAllToScene) {
        assetContainer.addAllToScene();
      }
      if (settings.loadingScreen == true) {
        loadingScreen.hide();
      }
      if (settings.ready) {
        try {
          settings.ready(assetContainer);
        }
        catch (e) {
          console.error("_r -> error in import scene : ready() thrown an exception", e);
          return reject(e);
        }
        resolve(assetContainer);
      }
    }, function(err) {
      reject(err);
    });
  });
}
