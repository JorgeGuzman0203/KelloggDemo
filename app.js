var express = require('express');
var mysql = require('mysql');
var cors = require('cors');

var app = express();
app.use(express.json());
app.use(cors());


var conexion = mysql.createConnection({
	host:'kelloggdemo.c370jneuet7d.us-east-2.rds.amazonaws.com',
	user:'admin',
	password:'Frusciante3*',
	database:'Kellogg_Demo',
	port:3306
});

conexion.connect(function(error){
	if(error){
		throw error;
		//console.error('Database connection failed: ' + error.stack); return;
	}else{
		console.log("Conexion Ok");
	}
});

const http = require('http');
const path = require('path');


app.use(express.static("express"));
// default URL for website
app.use('/', function(req,res){
    res.sendFile(path.join(__dirname+'/index.html'));
    //__dirname : It will resolve to your project folder.
  });



app.get('/api/articulos', (req,res)=>{
	conexion.query('SELECT * FROM articulos', (error,filas)=>{
		if(error){
			throw error;
		}else{
			res.send(filas);
		}
	})
});

app.get('/api/articulos/:id', (req,res)=>{
	conexion.query('SELECT * FROM articulos WHERE id = ?', [req.params.id], (error,fila)=>{
		if(error){
			throw error;
		}else{
			res.send(fila);
		}
	})
});

app.post('/api/articulos', (req,res)=>{
	let data = {descripcion:req.body.descripcion, precio:req.body.precio, stock:req.body.stock};
	let sql = "INSERT INTO articulos SET ?";
	conexion.query(sql,data,function(error, results){
		if(error){
			throw error;
		}else{
			res.send(results);
		}
	})

});

app.put('/api/articulos/:id', (req, res)=>{
	let id = req.params.id;
	let descripcion = req.body.descripcion;
	let precio = req.body.precio;
	let stock = req.body.stock;
	let sql = "UPDATE articulos SET descripcion = ?, precio = ?, stock = ? WHERE id = ?";

	conexion.query(sql, [descripcion, precio, stock, id], function(error, results){
		if(error){
			throw error;
		}else{
			res.send(results);
		}		
	})
});

app.delete('/api/articulos/:id', (req, res)=>{
	conexion.query('DELETE FROM articulos WHERE id = ?', [req.params.id], (error,filas)=>{
		if(error){
			throw error;
		}else{
			res.send(filas);
		}			
	});
});

const port = process.env.port || 3000;

app.listen(port, function(){
	console.log("Servidor Ok Puerto:" + port);
});