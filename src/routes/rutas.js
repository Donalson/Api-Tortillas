const express = require('express');//Llamado de express
const router = express.Router();//Se llamo a la funcion de router de express
const fs = require('fs').promises;//Importamos la funciona para eliminar la foto antigua

const conexion = require('../database')//Se mando a llamar a la conexion de base de datos
//OTRAS RUTAS ----------------------------------------------------------------------------------------------------------------------------------------------
//Ruta de Bienvenida de la APi
router.get('/', async (req, res) => {
    res.send('Bienvenido a la API del proyecto tortillas de harina')
})

//Ruta para subir fotos
router.post('/SubirFoto', (req, res) => {
    //console.log(req.file)
    res.json({mensaje: 'Imagen Subida'})
})

//Ruta para borrar fotos
router.post('/BorrarFoto', (req, res) => {
    const { FotoVieja } = req.body;

    fs.unlink('./Uploads/' + FotoVieja).then(() => {
        res.json({mensaje: 'Imagen Eliminada'})
    }).catch(err => {
        console.error('Algo Salio Mal Removiendo La Foto: ', err)
    })
})

//RUTAS DE LLAMADO GENERAL ----------------------------------------------------------------------------------------------------------------------------------------------
//Ruta de llamado de Clientes
router.get('/Clientes', async (req, res) => {
    conexion.query('SELECT * FROM clientes WHERE Activo = 1 ORDER BY Nombres', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

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

//Ruta de llamado de Pedidos
router.get('/Pedidos', async (req, res) => {
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, C.Apellidos, p.Tortilla, t.Descripcion, p.Cantidad FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla ORDER BY c.Nombres, C.Apellidos, p.Tortilla', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Ventas
router.get('/Ventas', async (req, res) => {
    conexion.query('SELECT IdVenta, Fecha, c.Nombres, c.Apellidos, c.Direccion, c.Nit, SubTotal, Total, Pago, Cambio, Cliente FROM ventas AS v INNER JOIN clientes AS c ON v.Cliente = c.IdCliente ORDER BY c.Nombres,c.Apellidos', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Pedidos sin Registrar en Ventas
router.get('/PedidosARegistrar', async (req, res) => {
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, C.Apellidos, p.Tortilla, t.Descripcion, p.Cantidad, t.Precio FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla WHERE RVenta = 0  ORDER BY p.Fecha DESC, c.Nombres, C.Apellidos, p.Tortilla', (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
})

//RUTAS DE LLAMADO POR ID ----------------------------------------------------------------------------------------------------------------------------------------------
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

//Ruta de llamado de Tortillas por id
router.get('/Tortillas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('SELECT * FROM tortillas WHERE IdTortilla = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Pedido por fecha especifica
router.get('/Pedidos/:fecha', async (req, res) => {
    const { fecha } = req.params;
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, C.Apellidos, p.Tortilla, t.Descripcion, p.Cantidad FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla WHERE p.Fecha = ?  ORDER BY c.Nombres, C.Apellidos, p.Tortilla', [fecha], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Ventas por Fecha
router.get('/Ventas/:fecha', async (req, res) => {
    const { fecha } = req.params;
    conexion.query('SELECT IdVenta, Fecha, c.Nombres, c.Apellidos, c.Direccion, c.Nit, SubTotal, Total, Pago, Cambio FROM ventas AS v INNER JOIN clientes AS c ON v.Cliente = c.IdCliente WHERE Fecha = ? ORDER BY c.Nombres, C.Apellidos', [fecha], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Ventas por Cliente
router.get('/VentasDe/:Cliente', async (req, res) => {
    const { Cliente } = req.params;
    conexion.query('SELECT IdVenta, Fecha, c.Nombres, c.Apellidos, c.Direccion, c.Nit, SubTotal, Total, Pago, Cambio FROM ventas AS v INNER JOIN clientes AS c ON v.Cliente = c.IdCliente WHERE v.Cliente = ? ORDER BY v.Fecha DESC', [Cliente], (err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

//Ruta de llamado de Detalle por Factura
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

//Ruta de llamado de Pedidos sin Registrar en Ventas
router.get('/PedidosARegistrar/:Fecha', async (req, res) => {
    const { Fecha } = req.params;
    conexion.query('SELECT p.IdPedido, p.Fecha, p.Cliente, C.Nombres, C.Apellidos, p.Tortilla, t.Descripcion, p.Cantidad, t.Precio FROM pedidos AS p INNER JOIN clientes AS c ON p.Cliente = c.IdCliente INNER JOIN tortillas as T ON p.Tortilla = t.IdTortilla WHERE RVenta = 0 AND p.Fecha = ?  ORDER BY c.Nombres, C.Apellidos, p.Tortilla', [Fecha] ,(err, rows, fields) => {
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
})

//RUTAS DE CREACION GENERAL ----------------------------------------------------------------------------------------------------------------------------------------------
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

//Ruta de Creacion de Tortilla
router.post('/Tortillas', async (req, res) => {
    const { Descripcion, Precio } = req.body;
    const SetenciaSQL = 'INSERT INTO `tortillas` (`IdTortilla`, `Descripcion`, `Precio`, `FC`, `FE`, `Activa`) VALUES (NULL, ?, ?, current_timestamp(), NULL, 1)';
    conexion.query(SetenciaSQL,[Descripcion, Precio, Foto], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Tortilla Registrada'});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Creacion de Pedidos
router.post('/Pedidos', async (req, res) => {
    const { Fecha, Cliente, Tortilla, Cantidad} = req.body;
    const SetenciaSQL = 'INSERT INTO `pedidos` (`IdPedido`, `Fecha`, `Cliente`, `Tortilla`, `Cantidad`, `RVenta`) VALUES (NULL, ?, ?, ?, ?, 0)';
    conexion.query(SetenciaSQL,[Fecha, Cliente, Tortilla, Cantidad], (err, rows, fields) => {
        if(!err){
            res.json({Status: 'Pedido Registrado'});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Creacion de Ventas
router.post('/Ventas', async (req, res) => {
    const { Fecha, Cliente, SubTotal, Total, Pago, Cambio} = req.body;
    const SetenciaSQL = 'INSERT INTO Ventas (`IdVenta`, `Fecha`, `Cliente`, `SubTotal`, `Total`, `Pago`, `Cambio`) VALUES (NULL, ?, ?, ?, ?, ?, ?)';
    conexion.query(SetenciaSQL,[Fecha, Cliente, SubTotal, Total, Pago, Cambio], (err, result) => {
        if(!err){
            const id = result.insertId
            res.json({Status: 'Venta Registrada',Venta: id});
        }else{
            console.log(err)
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

//RUTAS DE ACTUALIZACION GENERAL ----------------------------------------------------------------------------------------------------------------------------------------------
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

//Ruta de Acutalizacion de Tortillas
router.put('/Tortillas/:id', async (req, res) =>{
    const { Descripcion, Precio, Activo} = req.body;
    const { id } = req.params;
    const SetenciaSQL = 'UPDATE `tortillas` SET `Descripcion` = ?, `Precio` = ?, `FE` = CURRENT_TIMESTAMP(), `Activa` = ? WHERE `IdTortilla` = ?';
    conexion.query(SetenciaSQL, [Descripcion, Precio, Activo, id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Tortilla Acutalizada"});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Acutalizacion de Pedido
router.put('/Pedidos', async (req, res) =>{
    const { Cantidad, Fecha, Cliente, Tortilla } = req.body;
    const SetenciaSQL = 'UPDATE pedidos SET Cantidad = ? WHERE Fecha = ? AND Cliente = ? AND Tortilla = ?';
    conexion.query(SetenciaSQL, [Cantidad, Fecha, Cliente, Tortilla], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Pedido Acutalizado"});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Acutalizacion de RVenta de Pedidos
router.put('/PedidosRVenta', async (req, res) =>{
    const { Fecha, Cliente, } = req.body;
    const SetenciaSQL = 'UPDATE pedidos SET RVenta = 1 WHERE Fecha = ? AND Cliente = ?';
    conexion.query(SetenciaSQL, [Fecha, Cliente], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Pedido Acutalizado"});
        }else{
            console.log(err)
        }
    });
});

//RUTAS DE ELIMINACION ----------------------------------------------------------------------------------------------------------------------------------------------
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

//Ruta de Borrado de Tortillas
router.delete('/Tortillas/:id', async (req, res) => {
    const { id } = req.params;
    conexion.query('UPDATE `tortillas` SET `Activa` = 0 WHERE `IdTortilla` = ?', [id], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Tortilla marcada como inactiva"});
        }else{
            console.log(err)
        }
    });
});

//Ruta de Borrado de Pedidos
router.delete('/Pedidos', async (req, res) => {
    const { Cliente, Fecha} = req.body;
    conexion.query('DELETE FROM pedidos WHERE Cliente = ? AND Fecha = ?', [Cliente, Fecha], (err, rows, fields) => {
        if(!err){
            res.json({Status: "Pedido borrado"});
        }else{
            console.log(err)
        }
    });
});

module.exports = router;