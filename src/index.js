const express = require('express');
const cors = require ('cors');
const app = express();

//Configuracion
app.set('port', process.env.PORT || 3000);

//Middlewares
app.use(express.json());
//CORS ABIERTAS
//app.use(cors());
//CORS RESTRINGIDAS
var permitidos = ['http://localhost:8080', 'http://192.168.1.4:8080'];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
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

//Inicio de Servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'));
});