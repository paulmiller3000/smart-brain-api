const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const image = require('./controllers/image');
const profile = require('./controllers/profile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');

const db = knex({
	client: 'postgres',
	connection: {
		host : process.env.HOST,
		user : process.env.USER,
		password : process.env.PASSWORD,
		database : process.env.DATABASE
	}
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send(database.users) });

app.put('/image', (req, res) => { image.handleImage(db) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(db) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/signin', signin.handleSignin(db, bcrypt));

app.listen(process.env.PORT, () => {
	console.log(`Application is running on port ${process.env.PORT}.`);
})