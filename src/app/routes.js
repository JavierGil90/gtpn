const express = require('express');
const User = require('../app/models/user');

module.exports = (app, passport) => {

	// index routes
	app.get('/', (req, res) => {
		res.render('index');
	});

	//login view
	app.get('/login', (req, res) => {
		res.render('login.ejs', {
			message: req.flash('loginMessage')
		});
	});

	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/profile',
		failureRedirect: '/login',
		failureFlash: true
	}));

	// signup view
	app.get('/signup', (req, res) => {
		res.render('signup', {
			message: req.flash('signupMessage')
		});
	});

	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/profile',
		failureRedirect: '/signup',
		failureFlash: true // allow flash messages
	}));

	//profile view
	app.get('/profile', isLoggedIn, (req, res) => {
		res.render('profile', {
			user: req.user,
			tasks:req.user.tareas
		});
	});

	// logout
	app.get('/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

// inicio tareas
app.post('/add', async (req, res, next) => {
	// buscar segun id, tener objeto en memoria
	const usuario_actual = await User.findById({'_id': req.user._id});
	//actualizar el estado de la nueva tarea
	req.body.status=false;
	//concatenar tareas
	const lista_tareas=usuario_actual.tareas.concat(req.body);
	//actualizar listado de tareas
	usuario_actual.tareas=lista_tareas;
	//guardar tareas
	await usuario_actual.save();
	//redireccionar a la misma pagina
	res.redirect('/profile');
});

app.get('/edit/:id', async (req, res, next) => {
	// llamar funcion de busqueda
	var i_task=buscar_id_pos(req.params.id,req.user.tareas);
	var task=req.user.tareas[i_task];
  res.render('edit', { task });
});

app.post('/edit/:id', async (req, res, next) => {
	//obtener parametros
	//params.id
	//obtener datos formulario
	// req.body

	//editar tarea
	var i_task=buscar_id_pos(req.params.id,req.user.tareas);
	var task=req.user.tareas[i_task];
	task.title=req.body.title;
	task.description=req.body.description;
	// buscar segun id, tener objeto en memoria
	const usuario_actual = await User.findById({'_id': req.user._id});
	//actualizar listado de tareas
	const lista_tareas=req.user.tareas;
	usuario_actual.tareas=lista_tareas;
	//guardar tareas
	await usuario_actual.save();
	//redireccionar a la misma pagina
	res.redirect('/profile');
});

app.get('/delete/:id', async (req, res, next) => {
//puntero de la tarea
	var i_task=buscar_id_pos(req.params.id,req.user.tareas);
// eliminar tarea
	req.user.tareas.splice(i_task,1);
	//obtener usuario
	const usuario_actual = await User.findById({'_id': req.user._id});
	//actualizar listado de tareas
	const lista_tareas=req.user.tareas;
	usuario_actual.tareas=lista_tareas;
	//guardar tareas
	await usuario_actual.save();
//redireccionar a la misma pagina
  res.redirect('/profile');
});

app.get('/turn/:id', async (req, res, next) => {
//puntero de la tarea
	var i_task=buscar_id_pos(req.params.id,req.user.tareas);
	var task=req.user.tareas[i_task];
	task.status = !task.status;

	//obtener usuario
	const usuario_actual = await User.findById({'_id': req.user._id});
	//actualizar listado de tareas
	const lista_tareas=req.user.tareas;
	usuario_actual.tareas=lista_tareas;
	//guardar tareas
	await usuario_actual.save();

	//redireccionar a la misma pagina
	res.redirect('/profile');
});

app.get('/new', async (req, res, next) => {
	res.render('new', {
		user: req.user
	});
	// res.redirect('/new');
});




app.post('/new', async (req, res, next) => {
	// buscar segun id, tener objeto en memoria
	const usuario_actual = await User.findById({'_id': req.user._id});
	//actualizar el estado de la nueva tarea
	req.body.status=false;
	//concatenar tareas
	const lista_tareas=usuario_actual.tareas.concat(req.body);
	//actualizar listado de tareas
	usuario_actual.tareas=lista_tareas;
	//guardar tareas
	await usuario_actual.save();
	//redireccionar a la misma pagina
	res.redirect('/profile');
});

// fin tareas
};

function isLoggedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/');
}

function buscar_id_pos(id,lista){
	// var picked=req.user.tareas.find(o=>o._id==req.params._id);
	// console.log("picked");
	// console.log("picked",picked);
	// console.log("/picked");
	limite=lista.length;
	for(var i=0; i < limite; i++) {
		nodo=lista[i];
		if(nodo._id==id){
			// console.log("nodo encontrado");
			return i;
		}
	}
}
