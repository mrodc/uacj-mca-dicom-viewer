
var trainPath;
var modelPath;

function buildTree(dataModel) {
    //alert("DM: "  + dataModel);
    var myStore = new dojo.store.Memory({
    //var myStore = new dijit.tree.ForestStoreModel({
        // data: [
        //     { 
        //         id: 'model', 
        //         name: 'Model', 
        //         tree: 'model', 
        //         type: 'mlnet' 
        //     },
        //     {
        //         id: 'resnet250', 
        //         name: 'ResnetV250', 
        //         tree: 'model', 
        //         path: '/ResnetV250.pb', 
        //         parent: 'model'
        //     },
        //     {
        //         id: 'inception', 
        //         name: 'InceptionV3', 
        //         tree: 'model', 
        //         path: '/InceptionV3.pb', 
        //         parent: 'model'
        //     }
        //     ,
        //     {
        //         id: 'mobile', 
        //         name: 'MobilenetV2', 
        //         tree: 'model', 
        //         path: '/MobilenetV2.pb', 
        //         parent: 'model'
        //     },
        //     {
        //         id: 'resnet2101', 
        //         name: 'ResnetV2101', 
        //         tree: 'model', 
        //         path: '/ResnetV2101.pb', 
        //         parent: 'model'
        //     }

        // ],
        data:dataModel,
        getChildren: function (object) {
            return this.query({ parent: object.id });
        }
    });

    var myModel = new dijit.tree.ObjectStoreModel({
        store: myStore,
        query: { id: 'root' }
    });

    // Create the Tree.   Note that all widget creation should be inside a dojo.ready().

    var tree = new dijit.Tree({
        id: 'modelTree',
        onClick: treeNodeClicked,
        model: myModel
    });

    return tree;
}
function buildDataSet(dataset) {
    //alert('DS: ' + dataset);
    var myStore = new dojo.store.Memory({
        // data: [
        //     { 
        //         id: 'root', 
        //         name: 'DataSet', 
        //         type: 'directory', 
        //         tree: 'dataset' 
        //     },
        //     {
        //         id: 'ds_1', 
        //         name: 'Archive', 
        //         tree: 'dataset', 
        //         path: '/ML_dataset/archive/Data/train', 
        //         parent: 'root'
        //     },
        //     {
        //         id: 'ds_2', 
        //         name: 'CT Scan Images for Lung Cancer', 
        //         tree: 'dataset', 
        //         path: '/ML_dataset/CT Scan Images for Lung Cancer/LungcancerDataSet/Data/train',
        //         parent: 'root'
        //     },
        //     {
        //         id: 'ds_3', 
        //         name: 'Lung cancer dataset IQ-OTH_NCCD', 
        //         tree: 'dataset', 
        //         path: '/ML_dataset/Lung cancer dataset IQ-OTH_NCCD/DataSet/Data/train', 
        //         parent: 'root'
        //     }

        // ],
        data: dataset,
        getChildren: function (object) {
            return this.query({ parent: object.id });
        }
    });

    var myModel = new dijit.tree.ObjectStoreModel({

        store: myStore,
        query: { id: 'root' }
    });

    // Create the Tree.   Note that all widget creation should be inside a dojo.ready().

    var ds = new dijit.Tree({
        id: 'dataSetTree',
        childrenAttrs: 'children',
        onClick: treeNodeClicked,
        model: myModel
    });
    selectDataSet(dataset);
    return ds;
}
function treeNodeClicked(e) {

    //alert("Tree Source: " + e.tree);

    if (e.tree == 'dataset')
        trainPath = e.name;
    if (e.tree == 'model')
        modelPath = e.name;

}
function createToolBar_() {
    var toolbar = new dijit.Toolbar({});

    var labels = ["Entrenar", "Predecir", "Metricos"];
    var iconclass = ["dijitIconConfigure", "dijitIconEditProperty", "graphIcon"];
    dojo.forEach(labels, function (label, index) {
        //alert("Create Button");
        var button = new dijit.form.Button({
            // note: should always specify a label, for accessibility reasons.
            // Just set showLabel=false if you don't want it to be displayed normally
            label: label,
            //id: 'bar_' + label,
            showLabel: false,
            onClick: buttonClicked,
            iconClass: iconclass[index]
        });
        //alert("Add Button");
        toolbar.addChild(button);
    });
    return toolbar;
}