const express = require('express');
const cors = require ('cors');
const multer = require('multer');
const path = require('path');
const app = express();

//Configuracion
app.set('port', process.env.PORT || 3000);

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    destination: 'Uploads',
    cb(null, file.originalname)
  }
})

//Middlewares
app.use(express.json());
app.use(multer({
  storage,
  dest: 'Uploads',
  limits: {fileSize: 1000000},
  fileFilter: (req, file, cb) => {
    const extencionespermitidas = /jpeg|jpg|png/;
    const mimetype = extencionespermitidas.test(file.mimetype);
    const extencion = extencionespermitidas.test(path.extname(file.originalname));
    if(mimetype && extencion){
      return cb(null, true);
    }
    cb("Archivo No Soportado");
  }
}).single('Foto'));

//CORS ABIERTAS 
//app.use(cors());

//CORS RESTRINGIDAS
var permitidos = ['http://localhost:8080', 'http://192.168.1.4:8080'];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true);
    if(permitidos.indexOf(origin) === -1){
      var msg = 'Las politicas CORS para este sitio no permiten acceso para el origen especificado.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));

//Rutas
app.use(require('./routes/rutas'));

//Archivos Estaticos
app.use(express.static('Uploads'));

//Inicio de Servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});