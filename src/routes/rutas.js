const express = require('express');//Llamado de express
const { prependOnceListener } = require('../database');
const router = express.Router();//Se llamo a la funcion de router de express

const conexion = require('../database')//Se mando a llamar a la conexion de base de datos

//Ruta de Bienvenida de la APi
router.get('/', async (req, res) => {
    res.send('Bienvenido a la API del proyecto tortillas de harina')
})

//Ruta de llamado de Detalle
router.get('/DetallesVentas/:factura', async (req, res) => {
    const { factura } = req.params;
    conexion.query('SELECT * FROM detalleventa WHERE Factura = ?', [factura], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Detalle por id
router.get('/DetallesVentas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('SELECT * FROM detalleventa WHERE IdDetalle = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }else{
            console.log(err);
        }
    });
});

//Ruta de Creacion de Detalles
router.post('/DetallesVentas', async (req, res) => {
    const { Factura, Descripcion, Cantidad, Precio, Total} = req.body;
    const SetenciaSQL = 'INSERT INTO `detalleventa` (`IdDetalle`, `Factura`, `Descripcion`, `Cantidad`, `Precio`, `Total`) VALUES (NULL, ?, ?, ?, ?, ?)';
    conexion.query(SetenciaSQL,[Factura, Descripcion, Cantidad, Precio, Total], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Detalle Registrado'});
        }else{
            console.log(err)
        }
    });
});

module.exports = router;