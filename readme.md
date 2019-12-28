# Smart Brain Face Recognition API
This is the API for an exercise I completed while learning Node and Express. It handles PUT and POST for user registration, sign in, and entry count.
__NOTE: This is a work in progress; I blew the repo away and restarted to refresh my knowledge.__

## Getting Started

* Clone this repository
* Run `npm install`
* Create a Postgres database using the SQL statements in _sample-database.sql_
* Register for your free API key at https://portal.clarifai.com/signup
* Rename .env.example to .env and replace the following variables:	
	* DATABASE_HOST
	* DATABASE_USER
	* DATABASE_PASSWORD
	* DATABASE_NAME
	* API_PORT
	* CLARIFAI_API_KEY
* Run `npm run start:development` to run locally

## Acknowledgments

* [Andrei Neagoie](https://github.com/aneagoie) for the fantastic [Complete Web Developer](https://www.udemy.com/the-complete-web-developer-zero-to-mastery) course