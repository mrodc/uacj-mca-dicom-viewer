
var os = require('os');
require('linqjs');

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
var fs = require('fs');
const formidable = require('formidable');


//var blob = require('buffer');

const { Buffer } = require('node:buffer');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

var srvPath = path.join(__dirname, "/public");

console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%');
console.log('SERVER PATH: ' + srvPath)

app.use(express.static(srvPath));

//*************  set vars   *******////////
const port = 8082;
//const port = 80;

app.post('/calculate', function (req, res) {
  console.log('IP Request! ' );
  var networkInterfaces = os.networkInterfaces();
  var nmss = Object.keys(networkInterfaces);
  
  var add = nmss.first(function (t) { return t == 'Wi-Fi' });

  var ipA = networkInterfaces[add].where(function (w) { return w['family'] === 'IPv4' }).first();
  var hostIpAddress = ipA.address;


  console.log('<<<<<<<>>>>>>>>>');

  console.log(hostIpAddress + '   ' + getDateTime());

  var ids = JSON.stringify({address: hostIpAddress, separator: path.sep});
  res.send(ids);
});


app.get("/", (req, res) => {
  res.render("index"); // index refers to index.ejs
});

app.post("/login", (req, res) => {
  const { userName, password } = req.body;

  if (userName === "admin" && password === "admin") {
    res.render("success", {
      username: userName,
    });
  } else {
    res.render("failure");
  }
});
/*
app.get("/", (req, res) => {
res.send("<h1>Welcome to EJS world!</h1>");
});
*/
app.listen(port, () => {
  console.log("server started on port " + port);
});

app.post("/request", (req, res) => {

  //{dir:fs.dirPath,  name:  fs.item.name}
  var dirR = req.body.dir;
  var folder = req.body.folder;
  var name =  req.body.name;

  console.log('dirR: ' + dirR + ' FOlder:' + folder + ' name: ' + name);
  var rootPath = path.join(srvPath, dirR, folder, name);

  console.log("^^^^^^^^^^^\nROOT DIR: " + rootPath);


  fs.readFile(rootPath, (err, data) => {
    if (err) res.status(500).send(err);
    res.contentType('application/dicom')
      .send(`data:application/dicom;base64,${new Buffer.from(data).toString('base64')}`);
  });



});


app.post("/storeFile", (req, res) => {
  const objectName = req.body.objectName;// objectData  =objectName
  var dataFile = req.body.objectData;
  const userHomeDir = os.homedir();


  var pth = userHomeDir + "/ML_Data/" + objectName;

  //const data = new Uint8Array(Buffer.from('Hello Node.js'));
  console.log("userHome:  " + pth);
  console.log("data:  " + dataFile);
  console.log("size:  " + dataFile.length);


  res.send('Done: ' + pth);
});

app.post('/inputFile', function (req, res) {

  //var newFiles = [];
  var oldFiles = [];

  const userHomeDir = os.homedir() ;
  var pth = userHomeDir + path.join('\\development','imgNET6', 'assets','ML_InputData');

  var options = {
    hashAlgorithm: 'md5'
  }


  var form = new formidable.IncomingForm(options);
  form.multiples = true;
  //form.uploadDir = path.join(userHomeDir, '/ML_Data');

  form.on('fileBegin', function (name, file) {
    file.filepath = path.join(pth , file.originalFilename);
    file.mlDir = pth;

    console.log('RX ' + file.filepath);

  });
  form.on('file', function (name, file) {
    var newdir = path.join(file.mlDir , file.hash);
    console.log('=======');
    if (fs.existsSync(newdir)) {
      console.log(`The file or directory at '${newdir}' exists.`);
      oldFiles.push(file.hash);
    } else {

      fs.mkdirSync(newdir);
      //newFiles.push(file.hash);
      oldFiles.push(file.hash);
      fs.rename(file.filepath, path.join( newdir, file.originalFilename), function () {

        console.log('NodeJS File Upload Success!');

      });

      var properties = { filename: file.originalFilename, uploaded: getDateTime(), 'mimetype': file.mimetype, 'hashAlgorithm': file.hashAlgorithm };
      const content = JSON.stringify(properties);

      fs.writeFile(path.join(newdir, 'properties.txt'), content, err => {
        if (err) {
          console.error(err);
        } else {
          // file written successfully
        }
      });

    }

  });

  form.on('end', function () {
    var r = JSON.stringify({ old: oldFiles });
    res.send(r);
  });

  form.on('error', function (err) {
    console.log('An error has occured: \n' + err);
  });

  form.parse(req);


});

function getDateTime() {

  var date_ob = new Date();

  var date = ("0" + date_ob.getDate()).slice(-2);

  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);


  var year = date_ob.getFullYear();

  var hours = date_ob.getHours();

  var minutes = date_ob.getMinutes();

  var seconds = date_ob.getSeconds();

  var dte = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
  //console.log('DATE and TIME: ' + dte);
  return dte;

}