const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize');


var app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
   res.render('index');
});
app.get('/new', (req,res) => {
   res.render('new');

});


app.listen(3000, function(){
   console.log('web server runs on port 3000');
});
