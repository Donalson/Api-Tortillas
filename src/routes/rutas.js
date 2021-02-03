const express = require('express');//Llamado de express
const router = express.Router();//Se llamo a la funcion de router de express

const conexion = require('../database')//Se mando a llamar a la conexion de base de datos

//Ruta de Bienvenida de la APi
router.get('/', async (req, res) => {
    res.send('Bienvenido a la API del proyecto tortillas de harina')
})

//Ruta de llamado de Tortillas
router.get('/Tortillas', async (req, res) => {
    conexion.query('SELECT * FROM tortillas WHERE Activa = 1', (err, rows, fields) => {
//Ruta de llamado de Pedidos
router.get('/Pedidos', async (req, res) => {
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, p.Tortilla, t.Descripcion, p.Cantidad FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla WHERE p.Fecha = CURRENT_DATE', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Tortillas por id
router.get('/Tortillas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('SELECT * FROM tortillas WHERE IdTortilla = ?', [id], (err, rows, fields) => {
//Ruta de llamado de Fecha especifica
router.get('/Pedidos/:fecha', async (req, res) => {
    const { fecha } = req.params;
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, p.Tortilla, t.Descripcion, p.Cantidad FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla WHERE p.Fecha = ?', [fecha], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de Creacion de Tortilla
router.post('/Tortillas', async (req, res) => {
    const { Descripcion, Precio, Foto} = req.body;
    const SetenciaSQL = 'INSERT INTO `tortillas` (`IdTortilla`, `Descripcion`, `Precio`, `Foto`, `FC`, `FE`, `Activa`) VALUES (NULL, ?, ?, ?, current_timestamp(), NULL, 1)';
    conexion.query(SetenciaSQL,[Descripcion, Precio, Foto], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Tortilla Registrada'});
//Ruta de Creacion de Pedidos
router.post('/Pedidos', async (req, res) => {
    const { Fecha, Cliente, Tortilla, Cantidad} = req.body;
    const SetenciaSQL = 'INSERT INTO `pedidos` (`IdPedido`, `Fecha`, `Cliente`, `Tortilla`, `Cantidad`) VALUES (NULL, ?, ?, ?, ?)';
    conexion.query(SetenciaSQL,[Fecha, Cliente, Tortilla, Cantidad], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Pedido Registrado'});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Acutalizacion de Tortillas
router.put('/Tortillas/:id', async (req, res) =>{
    const { Descripcion, Precio, Foto, Activo} = req.body;
    const { id } = req.params;
    const SetenciaSQL = 'UPDATE `tortillas` SET `Descripcion` = ?, `Precio` = ?, `Foto` = ?, `FE` = CURRENT_TIMESTAMP(), `Activa` = ? WHERE `IdTortilla` = ?';
    conexion.query(SetenciaSQL, [Descripcion, Precio, Foto, Activo, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Tortilla Acutalizada"});
//Ruta de Acutalizacion de Pedido
router.put('/Pedidos/:id', async (req, res) =>{
    const { Fecha, Cliente, Tortilla, Cantidad} = req.body;
    const { id } = req.params;
    const SetenciaSQL = 'UPDATE `pedidos` SET `Fecha` = ?, `Cliente` = ?, `Tortilla` = ?, `Cantidad` = ? WHERE `IdPedido` = ?';
    conexion.query(SetenciaSQL, [Fecha, Cliente, Tortilla, Cantidad, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Pedido Acutalizado"});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Borrado de Tortillas
router.delete('/Tortillas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('UPDATE `tortillas` SET `Activa` = 0 WHERE `IdTortilla` = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Tortilla marcado como inactiva"});
//Ruta de Borrado de Pedidos
router.delete('/Pedidos/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('DELETE FROM `pedidos` WHERE `IdPedido` = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Pedido Borrado"});
        }else{
            console.log(err)
        }
    });
});

module.exports = router;