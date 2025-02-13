require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require("fs");
const handlebars = require("express-handlebars");
const hbs = require('hbs');
const session = require('express-session');
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs',handlebars.engine({extname:"hbs",defaultLayout:'layout',layoutDir:__dirname+"/views/layouts/",PartialDir:__dirname+"/views/partials/"}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// Use session middleware
app.use(session({
    secret: 'your-secret-key', // Change this to a stronger secret in production
    resave: false,
    saveUninitialized: true
  }));

  hbs.registerHelper('increment', function (value) {
    return value + 1;
  });
  hbs.registerHelper('objectEntries', (obj) => {
    return Object.entries(obj || {}); // Convert object to array of key-value pairs
  });
  
const routes=require('./server/routes/siteRoutes.js');
const { error } = require('console');


app.use('/',routes);




app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });