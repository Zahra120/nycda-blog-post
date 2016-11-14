const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize');


var app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/admin/posts', (req, res) => {
   res.render('posts/index');
});

app.get('/admin/posts/new', (req,res) => {
   res.render('posts/new');

});
app.post('/posts', (req, res) => {
   res.redirect('/admin/posts');

});


app.listen(3000, function(){
   console.log('web server runs on port 3000');
});
