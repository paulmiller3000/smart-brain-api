const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');
const image = require('./controllers/image');
const profile = require('./controllers/profile');
const register = require('./controllers/register');
const signin = require('./controllers/signin');

const APP_PORT = process.env.APP_PORT;
const ENVIRONMENT = process.env.API_ENV;

let connString = {
	host : process.env.DATABASE_HOST,
	user : process.env.DATABASE_USER,
	password : process.env.DATABASE_PASSWORD,
	database : process.env.DATABASE_NAME	
};

if ( ENVIRONMENT !== 'development' ) {
	connString['ssl'] = process.env.DATABASE_SSL
}

//ssl : process.env.DATABASE_SSL

/*const db = knex({
	client: 'postgres',
	connection: {
		host : process.env.DATABASE_HOST,
		user : process.env.DATABASE_USER,
		password : process.env.DATABASE_PASSWORD,
		database : process.env.DATABASE_NAME		
	}
});*/

const db = knex({
	client: 'postgres',
	connection: connString
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('API is working!') });
app.put('/image', (req, res) => { image.handleImage(db) });
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });
app.get('/profile/:id', (req, res) => { profile.handleProfileGet(db) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/signin', signin.handleSignin(db, bcrypt));

app.listen(APP_PORT, () => {
	console.log(`Application is running on port ${APP_PORT}.`);
})