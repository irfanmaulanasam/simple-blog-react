const path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cors = require('cors')
const errorhandler = require('errorhandler')
const mongoose = require('mongoose')

mongoose.promise = global.Promise;

const isProduction = process.env.NODE_ENV === 'production'

const app = express()

app.use (cors())
app.use(require('morgan')('dev'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(session({secret:"LightBlog",cookie:{maxAge: 60000},resave: false, saveUniitialized:false}))

if(!isProduction){
 app.use(errorhandler())
}
 mongoose.connect('mongodb://localhost/lightblog')
 mongoose.set('debug',true)

// Add models
require('./models/Articles');
// Add routes

app.use(require('./routes'))

app.use((req,res, next)=>{
	const err = new Error('Not Found')
	err.status = 404
	next(err)
})

if(!isProduction){
  app.use((err,req,res)=>{
	res.status(err.status || 500)
	res.json({
	 message: err.message,
	 error: err,
	})

  })
}

app.use((err, req, res)=>{
	res.status(err.status || 500)

	res.json({
		errors:{
		 message: err.message,
		 error:{}
		}
	})
})

const port = 8000
const server = app.listen(port, ()=>{
	console.log(`server started on http://localhost:${port}`)
})
