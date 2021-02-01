const mysql = require('mysql');

const conexionsql =  mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tortillasdeharina'
});

conexionsql.connect(function (err) {
    if(err){
        console.log(err);
        return;
    }else{
        console.log('Base de datos conectada');
    }
});

module.exports = conexionsql;