const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const morgan = require('morgan');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/authorization');


const API_PORT = process.env.API_PORT;
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

const db = knex({
	client: 'postgres',
	connection: connString
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => { res.send('API is working!') });
app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) });
app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });
app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });
app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });
app.post('/signin', signin.signInAuthentication(db, bcrypt));

app.listen(API_PORT, () => {
	console.log(`Server application is running on port ${API_PORT}.`);
})