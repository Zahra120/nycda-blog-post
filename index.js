const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize'),
      db = require('./models');



var app = express();

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.get('/admin/posts', (req, res) => {
   db.Blog.findAll().then((blogs)=> {
   res.render('posts/index', {blogs: blogs});
   });
});

app.get('/admin/posts/new', (req,res) => {
   res.render('posts/new' );
});
app.get('/admin/posts/show/:id', (req, res) =>{
   db.Blog.findById(req.params.id).then((blog) => {
      res.render('posts/show',{blog: blog});
});

});
app.post('/posts', (req, res) => {
   db.Blog.create(req.body).then(() => {
   res.redirect('/admin/posts');
   });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
  });
});
