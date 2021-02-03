const express = require('express');//Llamado de express
const router = express.Router();//Se llamo a la funcion de router de express

const conexion = require('../database')//Se mando a llamar a la conexion de base de datos

//Ruta de Bienvenida de la APi
router.get('/', async (req, res) => {
    res.send('Bienvenido a la API del proyecto tortillas de harina')
})

//Ruta de llamado de Ventas
router.get('/Ventas', async (req, res) => {
    conexion.query('SELECT IdVenta, Fecha, c.Nombres, c.Apellidos, c.Direccion, c.Nit SubTotal, Total, Pago, Cambio FROM ventas AS v INNER JOIN clientes AS c ON v.Cliente = c.IdCliente', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Ventas por id
router.get('/Ventas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('SELECT IdVenta, Fecha, c.Nombres, c.Apellidos, c.Direccion, c.Nit SubTotal, Total, Pago, Cambio FROM ventas AS v INNER JOIN clientes AS c ON v.Cliente = c.IdCliente WHERE IdVenta = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de Creacion de Ventas
router.post('/Ventas', async (req, res) => {
    const { Cliente, SubTotal, Total, Pago, Cambio} = req.body;
    const SetenciaSQL = 'INSERT INTO Ventas (`IdVenta`, `Fecha`, `Cliente`, `SubTotal`, `Total`, `Pago`, `Cambio`) VALUES (NULL, CURRENT_TIMESTAMP(), ?, ?, ?, ?, ?)';
    conexion.query(SetenciaSQL,[Cliente, SubTotal, Total, Pago, Cambio], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Venta Registrada'});
        }else{
            console.log(err)
        }
    });
});

module.exports = router;
