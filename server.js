const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex')({
  client: 'postgres',
  connection: {
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
  }
});

const app = express();

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date()
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com'
		}
	]
}

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.send(database.users);
})

app.post('/signin', (req, res) => {
/*	bcrypt.compare("apples", '$2a$10$qgpqwZGi5J54vHfoLtlB2OjQkSRRGlVHjg/4gW2zzXO9aNau1SpKS', function(err, res) {
	    console.log('first guess ', res);
	});
	bcrypt.compare("veggies", '$2a$10$qgpqwZGi5J54vHfoLtlB2OjQkSRRGlVHjg/4gW2zzXO9aNau1SpKS', function(err, res) {
	    console.log('second guess ', res);
	});*/	
	if (req.body.email === database.users[0].email && 
		req.body.password === database.users[0].password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('error logging in');
	}
})

app.post('/register', (req, res) => {
	const { email, name, password } = req.body;
/*	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(password, salt, function(err, hash) {
	        console.log(hash);
	    });
	});*/
	database.users.push({
		id: '125',
		name: name,
		email: email,
		entries: 0,
		joined: new Date()
	})
	res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
	const { id } = req.params;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			return res.json(user);
		}		
	})
	if (!found) {
		res.status(400).json('Not found.');
	}
})

app.put('/image', (req, res) => {
	const { id } = req.body;
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}		
	})
	if (!found) {
		res.status(400).json('Not found.');
	}
})



// Load hash from your password DB.
/*bcrypt.compare("B4c0/\/", hash, function(err, res) {
    // res === true
});
bcrypt.compare("not_bacon", hash, function(err, res) {
    // res === false
});*/

app.listen(3001, () => {
	console.log('Application is running on port 3001.');
})

/*
/ --> res = this is working
/signin --> POST = success/fail
/register --> POST = user
/image --> PUT --> user

*/