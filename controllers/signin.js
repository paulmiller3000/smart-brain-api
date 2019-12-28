const jwt = require('jsonwebtoken');
const redis = require('redis');

const redisClient = redis.createClient({host: '127.0.0.1'});

const handleSignin = (db, bcrypt, req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return Promise.reject('Incorrect form submission.');
	}
	return db.select('email', 'hash').from('login')
		.where('email', '=', email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select('*').from('users')
					.where('email', '=', email)
					.then(user => user[0])
					.catch(err => Promise.reject('Unable to get user'))			
			} else {
				Promise.reject('Wrong credentials')
			}			
		})
		.catch(err => Promise.reject('Wrong credentials'))
}

// https://github.com/auth0/jwt-decode/issues/53
/*
var current_time = Date.now() / 1000;
if ( jwt.exp < current_time) {
 console.log('Expired')
}

Just an important addition: Beware of timezone-Errors.

I think you need to use 'Date.now().valueOf() / 1000;' to get the plain UTC time (UTC is the same format as 
the 'exp' from the JWT-Token). Otherwise the 'Date.now()' will be converted to you local timezone when comparing, 
which could be a different one than the jwt-issuer.

Not using 'valueOf()' will in many timezone-related cases invalidate your token and depending on 
timezone-difference between client and server (or more exact: between jwt-issuer and jwt-validator) you might 
not be able to use it ever because the timezone-difference is too big.

Edit: I should add as clarification, that this happens because the EXP-Date in the token is not a DATE-Object, 
it is just a Timestamp-Number which cannot contain any timezone-information. Therefore the EXP in the token will 
ALWAYS (unless you change it manually) be the neutral timezone (0) UTC and to compare it, you need your time as 
plain UTC-number too.

You may not encounter this problem at first (when you set the token EXP to 24 hours you will not run in the 
problem of instant invalidation) but you should still be aware of using the time-comparison correctly.

----

Also worth mentioning that the exp claim is optional (https://tools.ietf.org/html/rfc7519#section-4.1.4) so 
you (may) want to handle that use case:

    if (typeof jwt.exp === 'undefined') return 'Never expires!'
*/

const getAuthTokenId = (req, res) => {
	const { authorization } = req.headers;
	return redisClient.get(authorization, (err, reply) => {
		if (err || !reply) {
			return res.status(400).json('Unauthorized');
		}
		return res.json({id: reply})
	})
}

const signToken = (email) => {
	const jwtPayload = { email };
	return jwt.sign(jwtPayload, process.env.JWT_SECRET, { expiresIn: '2 days'});
}

const setToken = (token, id) => {
	return Promise.resolve(redisClient.set(token, id))
}

const createSessions = (user) => {
	const { email, id } = user;
	const token = signToken(email);
	return setToken(token, id)
		.then(() => { 
			return { success: 'true', userId: id, token }
		})
		.catch(console.log)
}

const signInAuthentication = (db, bcrypt) => (req, res) => {
	const { authorization } = req.headers;
	return authorization ? getAuthTokenId(req, res) : 
		handleSignin(db, bcrypt, req, res)
			.then(data => {
				return data.id && data.email ? createSessions(data) : Promise.reject(data)
			})
			.then(session => res.json(session))
			.catch(err => res.status(400).json(err))
}

module.exports = {
	signInAuthentication: signInAuthentication,
	redisClient: redisClient
}