var expect = chai.expect;

before(function(done) {
    this.timeout(10000);
    _r.launch({
        scene : function() {
            // This creates a basic Babylon Scene object (non-mesh)
            // var scene = new BABYLON.Scene(engine);

            // This creates and positions a free camera (non-mesh)
            var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

            // This targets the camera to scene origin
            camera.setTarget(BABYLON.Vector3.Zero());

            // This attaches the camera to the canvas
            camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

            // Default intensity is 1. Let's dim the light a small amount
            light.intensity = 0.7;

            // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
            var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);

            // Move the sphere upward 1/2 its height
            sphere.position.y = 1;

            // Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
            var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

            return scene;
        }
    });
    _r.ready(done);
});

describe('Download without add to the scene', function() {
    it('import Scene', function(done) {
        _r.import({
            scene : "https://models.babylonjs.com/CornellBox/cornellBox.babylon",
            patch : [
                {
                    "suzanne.000" : {
                        material : {
                            diffuseColor : "yellow"
                        }
                    }
                }
            ],
            addAllToScene : false,
            ready : function(assetContainer) {
                expect(_r.scene.getMeshByName('suzanne.000') == null).to.be.true;
                _r.select(assetContainer).addToScene();
                expect(_r.scene.getMeshByName('suzanne.000') !== null).to.be.true;
                expect(_r.select("suzanne.000")[0].material.diffuseColor.r === 1).to.be.true;
                expect(_r.select("suzanne.000")[0].material.diffuseColor.g === 1).to.be.true;
                expect(_r.select("suzanne.000")[0].material.diffuseColor.b === 0).to.be.true;
                done();
            }
        });
    });
    it('import Cubemap', function(done) {
        _r.import("", {
            loadingScreen : false,
            extension : 'png'
        }).then(function(cubemap) {
            done();
        });
    });
    it('import PNG cubemap', function(done) {

    });
    it('import texture', function(done) {
        _r.import({
            url : "",
            ready : function(texture) {
                done();
            }
        })
    })
});