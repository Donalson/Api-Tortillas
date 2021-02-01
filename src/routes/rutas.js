const express = require('express');//Llamado de express
const router = express.Router();//Se llamo a la funcion de router de express

const conexion = require('../database')//Se mando a llamar a la conexion de base de datos

//Ruta de Bienvenida de la APi
router.get('/', async (req, res) => {
    res.send('Bienvenido a la API del proyecto tortillas de harina')
})

//Ruta de llamado de Clientes
router.get('/Clientes', async (req, res) => {
    conexion.query('SELECT * FROM clientes WHERE Activo = 1', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Clientes por id
router.get('/Clientes/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('SELECT * FROM clientes WHERE IdCliente = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows[0]);
        }else{
            console.log(err);
        }
    });
});

//Ruta de Creacion de Clientes
router.post('/Clientes', async (req, res) => {
    const { Nombres, Apellidos, Direccion, Telefono, Nit, Adelanto, Debe, Observacion, Foto} = req.body;
    const SetenciaSQL = 'INSERT INTO `clientes` (`IdCliente`, `Nombres`, `Apellidos`, `Direccion`, `Telefono`, `Nit`, `Adelanto`, `Debe`, `Observacion`, `Foto`, `FC`, `FE`, `Activo`) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, current_timestamp(), NULL, 1)';
    conexion.query(SetenciaSQL,[Nombres, Apellidos, Direccion, Telefono, Nit, Adelanto, Debe, Observacion, Foto], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Cliente Registrado'});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Acutalizacion de Clientes
router.put('/Clientes/:id', async (req, res) =>{
    const { Nombres, Apellidos, Direccion, Telefono, Nit, Adelanto, Debe, Observacion, Foto, Activo} = req.body;
    const { id } = req.params;
    const SetenciaSQL = 'UPDATE `clientes` SET `Nombres` = ?, `Apellidos` = ?, `Direccion` = ?, `Telefono` = ?, `Nit` = ?, `Adelanto` = ?, `Debe` = ?, `Observacion` = ?, `Foto` = ?, `FE` = CURRENT_TIMESTAMP(), `Activo` = ? WHERE `IdCliente` = ?';
    conexion.query(SetenciaSQL, [Nombres, Apellidos, Direccion, Telefono, Nit, Adelanto, Debe, Observacion, Foto, Activo, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Cliente Acutalizado"});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Borrado de Clientes
router.delete('/Clientes/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('UPDATE `clientes` SET `Activo` = 0 WHERE `IdCliente` = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Cliente marcado como inactivo"});
        }else{
            console.log(err)
        }
    });
});

module.exports = router;