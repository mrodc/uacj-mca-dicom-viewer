var renderer = null;
var renderWindow = null;
var reader = null;
var mapper = null;
var actor = null;
var texture;
var fullScreenRenderer = null;
var planeSource;

function initImageLoader() {
    try {
        reader = vtkPLYReader.newInstance();
    }
    catch (e) {
        alert("Exeption: " + e.what);
    }
    // mapper = vtkMapper.newInstance({ scalarVisibility: false });
    // actor = vtkActor.newInstance();

    //var cntr = document.getElementById('dicomImage');

    // fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
    //     container: cntr,
    //     background: [0., 0., 0.]
    // });

    //update();
}
function vtkSet1() {
    var cntr = document.getElementById('dicomImage');
    //alert(cntr);
    fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
        container: cntr,
        background: [0., 0., 0.9]
    });


    planeSource = vtk.Filters.Sources.vtkPlaneSource.newInstance();

    actor = vtk.Rendering.Core.vtkActor.newInstance();
    mapper = vtk.Rendering.Core.vtkMapper.newInstance();
    var cone = vtk.Filters.Sources.vtkConeSource.newInstance();

    texture = vtk.Rendering.Core.vtkTexture.newInstance();

    renderer = fullScreenRenderer.getRenderer();
    // create orientation widget
    const axes = vtk.Rendering.Core.vtkAxesActor.newInstance();
    const orientationWidget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
        actor: axes,
        interactor: fullScreenRenderer.getRenderWindow().getInteractor(),
    });
    orientationWidget.setEnabled(true);
    orientationWidget.setViewportCorner(
        vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
    );
    orientationWidget.setViewportSize(0.15);
    orientationWidget.setMinPixelSize(100);
    orientationWidget.setMaxPixelSize(300);

    //fullScreenRenderer.addController(controlPanel);
    actor.setMapper(mapper);
   // mapper.setInputConnection(planeSource.getOutputPort());
   //alert("sssss");
    mapper.setInputConnection(planeSource.getOutputPort());

    //alert("oooo");


    renderWindow = fullScreenRenderer.getRenderWindow();

    alert("HELLO");
    image = new Image();
    image.src = "https://roblouie.com/wp-content/uploads/2020/04/60788338_304920937106527_8424495022080625603_n.jpg";
    //image.addEventListener('load', renderwindow.render);
    image.onload = renderImage;
    renderer.addActor(actor);

    // texture = vtk.Rendering.Core.vtkTexture.newInstance();
    // alert("HELLO4");
    // texture.setInterpolate(true);
    // texture.setImage(image);
    // actor.addTexture(texture);
    // renderer.addActor(actor);
    // renderer.resetCamera();

    
    //renderWindow.render();
}
var image;
function renderImage() {
    
    alert("HELLO4");
    texture.setInterpolate(true);
    texture.setImage(image);
    alert("HELLO5");
    //actor.addTexture(texture);
   //alert("HELLO6");
    //renderer.addActor(actor);
    //renderer.resetCamera();
    alert("HELLO7");
    renderWindow.render;
    alert("HELLO8");
}
function vtkSet() {
    var cntr = document.getElementById('dicomImage');
    alert(cntr);
    fullScreenRenderer = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
        container: cntr,
        background: [0., 0., 0.]
    });
    var actor = vtk.Rendering.Core.vtkActor.newInstance();
    var mapper = vtk.Rendering.Core.vtkMapper.newInstance();
    var cone = vtk.Filters.Sources.vtkConeSource.newInstance();


    // create orientation widget
    const axes = vtk.Rendering.Core.vtkAxesActor.newInstance();
    const orientationWidget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
        actor: axes,
        interactor: fullScreenRenderer.getRenderWindow().getInteractor(),
    });
    orientationWidget.setEnabled(true);
    orientationWidget.setViewportCorner(
        vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
    );
    orientationWidget.setViewportSize(0.15);
    orientationWidget.setMinPixelSize(100);
    orientationWidget.setMaxPixelSize(300);

    //fullScreenRenderer.addController(controlPanel);
    actor.setMapper(mapper);
    mapper.setInputConnection(cone.getOutputPort());

    var renderer = fullScreenRenderer.getRenderer();
    renderer.addActor(actor);
    renderer.resetCamera();

    var renderWindow = fullScreenRenderer.getRenderWindow();
    renderWindow.render();
}


function refresh() {
    if (renderer && renderWindow) {
        const resetCamera = renderer.resetCamera;
        const render = renderWindow.render;
        resetCamera();
        render();
    }
}

function update() {
    //const fullScreenRenderer = vtkFullScreenRenderWindow.newInstance();
    renderer = fullScreenRenderer.getRenderer();
    renderWindow = fullScreenRenderer.getRenderWindow();

    renderer.addActor(actor);

    actor.getMapper().setScalarVisibility(true);
    const clr = { r: 200 / 255.0, g: 200 / 255.0, b: 200 / 255.0 };
    actor.getProperty().setColor(clr.r, clr.g, clr.b);

    refresh();
}

function handleImgFile(file) {
    const fileReader = new FileReader();

    alert("File reading: " + file.name);
    fileReader.onload = () => {
        alert("OnLoad");
        const image = new Image();
        image.src = fileReader.result;
        alert("beforeTexture");
        const texture = vtkTexture.newInstance();
        texture.setInterpolate(true);
        texture.setImage(image);
        actor.addTexture(texture);
        refresh();
        alert("EndOnLoad");
    };
    fileReader.readAsDataURL(file);
}