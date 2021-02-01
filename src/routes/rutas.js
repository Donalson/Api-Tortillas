const express = require('express');
const router = express.Router();

const conexion = require('../database')

router.get('/', (req, res) => {
    conexion.query('SELECT * FROM clientes', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

module.exports = router;