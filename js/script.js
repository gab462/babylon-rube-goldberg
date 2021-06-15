const canvas = document.getElementById("renderCanvas");

const engine = new BABYLON.Engine(canvas);
engine.enableOfflineSupport = false;

const scene = new BABYLON.Scene(engine);
scene.collisionsEnabled = true;
scene.enablePhysics();

const camera = new BABYLON.ArcRotateCamera("camera", 0, 0, 10, new BABYLON.Vector3(30, 0, 30));
camera.setPosition(new BABYLON.Vector3(0, 0, 0));
camera.attachControl(canvas, true);

const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0));

var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter:2}, scene);

var over = false;

var skybox = BABYLON.MeshBuilder.CreateBox("skybox", {size:500.0}, scene);
var skyboxMaterial = new BABYLON.StandardMaterial("skybox", scene);
skyboxMaterial.backFaceCulling = false;
skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("res/skybox4", scene);
skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
skybox.material = skyboxMaterial;

killBox = BABYLON.MeshBuilder.CreateBox("killBox", {width:400, depth:400, height:0.5}, scene);
killBox.position = new BABYLON.Vector3(0,-100,0);
killBox.visibility = 0;

function retry(marble) {
    console.log("died");
    marble.dispose();
    tryagain();
}

function tryagain () {
    Promise.all([
        BABYLON.SceneLoader.AppendAsync("https://models.babylonjs.com/Marble/marble/marble.gltf")
    ]).then(function c() {
        var marbleStartPos = new BABYLON.Vector3(0,50,0);
        // var marbleStartPos = new BABYLON.Vector3(5,0,15);
        marble = scene.getMeshByName("marble");
        marble.setParent(null);
        marble.position = marbleStartPos;
        marble.physicsImpostor = new BABYLON.PhysicsImpostor(marble, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 5, friction:0.1, restitution:0 }, scene);
        
        marble.actionManager = new BABYLON.ActionManager(scene);
        //register a new action with the marble's actionManager..this will execute code whenever the marble intersects the "killBox"
        marble.actionManager.registerAction(
            new BABYLON.ExecuteCodeAction(
                {
                    trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger,
                    parameter:killBox
                }, 
                () => {
                    console.log("died");
                    retry(marble);
                }
            )
        );
    });
}

tryagain();

mat = new BABYLON.StandardMaterial("mat");
mat.diffuseTexture = new BABYLON.Texture("/res/texture.jpg");

rampamat = new BABYLON.StandardMaterial("rampamat");
rampamat.diffuseTexture = new BABYLON.Texture("/res/metal.jpg");

funilmat = new BABYLON.StandardMaterial("funilmat");
funilmat.diffuseTexture = new BABYLON.Texture("/res/vortex.jpg");

groundmaterial = new BABYLON.StandardMaterial("groundmaterial");
groundmaterial.diffuseTexture = new BABYLON.Texture("/res/grass.jpg");

dominomat = new BABYLON.StandardMaterial("dominomat");
dominomat.diffuseTexture = new BABYLON.Texture("/res/domino.png");

box = BABYLON.MeshBuilder.CreateBox("caixa", {height: 10, width: 10, depth: 10}, scene);
box.rotation.z = Math.PI / 3;
box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
box.material = mat;

boxdavi = BABYLON.MeshBuilder.CreateBox("davi", {height: 10, width: 10, depth: 10}, scene);
boxdavi.physicsImpostor = new BABYLON.PhysicsImpostor(boxdavi, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0 }, scene);
boxdavi.material = mat;

boxroda = BABYLON.MeshBuilder.CreateBox("roda", {height: 5, width: 5, depth: 10}, scene);
boxroda.position.x = 18;
boxroda.physicsImpostor = new BABYLON.PhysicsImpostor(boxroda, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);
boxroda.material = mat;

boxPivot = new BABYLON.TransformNode("boxrodaParent");
boxPivot.position.x = 18;
boxroda.setParent(boxPivot);
BABYLON.Animation.CreateAndStartAnimation("", boxPivot, "rotation.z", 15, 15, BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(360), 1);

rampa = BABYLON.MeshBuilder.CreateBox("rampa", {height: 1, width: 8, depth: 10}, scene);
rampa.position.y = -10;
rampa.position.x = 5;
rampa.rotation.x = Math.PI/5;
rampa.physicsImpostor = new BABYLON.PhysicsImpostor(rampa, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);
rampa.material = rampamat;

portinhola = BABYLON.MeshBuilder.CreateBox("portinolha", {height: 1, width: 8, depth: 5}, scene);
portinhola.position.y = -12;
portinhola.position.z = 3;
portinhola.position.x = 5;
portinhola.physicsImpostor = new BABYLON.PhysicsImpostor(portinhola, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);
portinhola.material = mat;

portiPivot = new BABYLON.TransformNode("portinholaParent");
portiPivot.position.y = -12;
portiPivot.position.z = 3;
portiPivot.position.x = 4;
portinhola.setParent(portiPivot);
BABYLON.Animation.CreateAndStartAnimation("", portiPivot, "rotation.x", 30, 30, BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(360), 1);

funil1 = new BABYLON.MeshBuilder.CreateCylinder("funil1", { diameterTop: 20, diameterBottom: 0, height: 7 });
funil1.position.y = -20;

funil2 = new BABYLON.MeshBuilder.CreateCylinder("funil2", { diameterTop: 20, diameterBottom: 0, height: 7 });
funil2.position.y = -19;

buraco = new BABYLON.MeshBuilder.CreateCylinder("buraco", {diameterTop: 2, diameterBottom: 2, height: 7});
buraco.position.y = -20

funil1CSG = BABYLON.CSG.FromMesh(funil1);
funil2CSG = BABYLON.CSG.FromMesh(funil2);
buracoCSG = BABYLON.CSG.FromMesh(buraco);
funilCSG = funil1CSG.subtract(funil2CSG).subtract(buracoCSG);
funil = funilCSG.toMesh("funil", null, scene);
funil.position.x = 5;
funil.position.z = 15;
funil.material = funilmat;

scene.removeMesh(funil1);
scene.removeMesh(funil2);
scene.removeMesh(buraco);

funilPivot = new BABYLON.TransformNode("funilPivot");
funilPivot.position.x = 5;
funilPivot.position.y = -20;
funilPivot.position.z = 15;

funil.physicsImpostor = new BABYLON.PhysicsImpostor(funil, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0.1 }, scene);
funil.setParent(funilPivot);
BABYLON.Animation.CreateAndStartAnimation("", funilPivot, "rotation.y", 30, 30, BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(360), 1);

ground = BABYLON.MeshBuilder.CreateBox("ground", {height: 1, width: 45, depth: 45}, scene);
ground.position.y = -30;
ground.position.z = 15;
ground.position.x = 20;
ground.material = groundmaterial;

ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);

rampadomi = BABYLON.MeshBuilder.CreateBox("rampadomi", {height: 1, width: 8, depth: 8}, scene);
rampadomi.position.y = -25;
rampadomi.position.z = 16;
rampadomi.position.x = 6;
rampadomi.rotation.z = - Math.PI / 5;
rampadomi.material = rampamat;

rampadomi.physicsImpostor = new BABYLON.PhysicsImpostor(rampadomi, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);

dominos = []

for(let i=0; i<4; i++){
    dominos.push(BABYLON.MeshBuilder.CreateBox("domino" + i, {height: 8, width: 1, depth: 4}, scene));
    dominos[i].position.y = -20;
    dominos[i].position.x = i * 6 + 11;
    dominos[i].position.z = 16;
    dominos[i].physicsImpostor = new BABYLON.PhysicsImpostor(dominos[i], BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0.05, friction: 1 }, scene);
    dominos[i].material = dominomat;
}

martin = new BABYLON.StandardMaterial("martin");
martin.diffuseTexture = new BABYLON.Texture("/res/martin.jpg")

botao = BABYLON.MeshBuilder.CreateBox("botao", {height: 3, width: 4, depth: 4}, scene);
botao.position.y = -28;
botao.position.x = 36;
botao.position.z = 16;
botao.material = martin;

botao.physicsImpostor = new BABYLON.PhysicsImpostor(botao, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 1 }, scene);

scene.registerBeforeRender(() => {
    if (botao.intersectsMesh(dominos[3], false) && !over){
        overfunc();
        over = true;
    }
});

music = new BABYLON.Sound("clona_cartao", "res/Clona_Cartao.mp3", scene);

function overfunc() {
    killBox.dispose();
    BABYLON.ParticleHelper.CreateAsync("fire", scene).then((set) => {
        set.emitterNode = botao.position;
        set.systems.forEach(s => {
            s.disposeOnStop = true;
        });
        set.start();
    });
    music.play();
}

var gui = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("GUI");

scene.registerBeforeRender(() => {
    if(over){
        var endScreen = new BABYLON.GUI.TextBlock();
        endScreen.fontSize = 100;
        endScreen.text = "CARTAO CLONADO";
        endScreen.color = "white";
        console.log("CARTAO CLONADO - NUMERO 0159 8172 3980")

        advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        advancedTexture.addControl(endScreen);
    }
})

engine.runRenderLoop(() => {
    scene.render();
//     if (scene.getMeshByName("marble") != null){
//         camera.position = scene.getMeshByName("marble").position;
//     }
});

window.addEventListener("resize", () => {
        engine.resize();
});

