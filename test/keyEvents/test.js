var expect = chai.expect;

before(function(done) {
    _r.launch({
        scene : function() {
            // This creates a basic Babylon Scene object (non-mesh)
            var scene = new BABYLON.Scene(engine);

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



describe('one, on, trigger, off', function() {
    it('on keydown', function() {

        var count = 0;
        var handler = function(e) {
            count++;
            if(e.sourceEvent.code === "NumpadAdd") {
                _r.off("OnKeyDownTrigger", handler);
            }
        };
       _r.on("OnKeyDownTrigger", handler);
       _r.canvas.focus();
       _r.canvas.dispatchEvent(new KeyboardEvent('keydown', {code:"NumpadAdd"}));
       _r.canvas.dispatchEvent(new KeyboardEvent('keydown', {code:"NumpadAdd"}));
       console.log(count);
        expect(count == 1).to.be.true;
    });
    it('one keydown', function() {
        var count = 0;
        var handler = function(e) {
            count++;
        };
        _r.one("OnKeyDownTrigger", handler);
        _r.canvas.focus();
        _r.canvas.dispatchEvent(new KeyboardEvent('keydown', {code:"NumpadAdd"}));
        _r.canvas.dispatchEvent(new KeyboardEvent('keydown', {code:"NumpadAdd"}));
        expect(count == 1).to.be.true;
    });

})
