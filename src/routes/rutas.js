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
        if(!err){
            res.json(rows[0]);
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
        }else{
            console.log(err)
        }
    });
});

module.exports = router;