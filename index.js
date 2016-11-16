const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize'),
      db = require('./models'),
      methodOverride = require('method-override'),
      displayRoutes = require('express-routemap');



var app = express();
var adminRouter = require('./routes/admin');

app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(methodOverride(function(req, res){
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method;
    delete req.body._method;
    return method;
  }
}));
app.use('/admin', adminRouter);

// app.get('/admin/posts', (req, res) => {
//    db.Blog.findAll().then((blogs) => {
//       res.render('posts/index', { blogs: blogs });
//    });
// });
//
// app.get('/admin/posts/new', (req,res) => {
//    res.render('posts/new' );
// });
//
// app.get('/admin/posts/:id', (req, res) => {
//    db.Blog.findById(req.params.id).then((blog) => {
//       res.render('posts/show', { blog: blog });
//    });
// });


// app.post('/posts', (req, res) => {
//    db.Blog.create(req.body).then(() => {
//       res.redirect('/admin/posts');
//    });
// });

// app.put('/admin/posts/:id', (req, res) => {
//    db.Blog.update(req.body, {
//       where: {
//          id: req.params.id
//       }
//     }).then(() => {
//       res.redirect('/admin/posts/' + req.params.id);
//    });
// });
//
// app.get('/admin/posts/edit/:id', (req, res) => {
//    db.Blog.findById(req.params.id).then((blog) => {
//       res.render('posts/edit', { blog: blog });
//    });
// });
// app.delete('/admin/posts/:id', (req, res) => {
//    db.Blog.destroy({
//       where: {
//          id: req.params.id
//       }
//    }).then(() => {
//       res.redirect('/admin/posts');
//    });
// });
app.get('/', (req, res) => {
   db.BlogPost.findAll().then((posts) => {
      res.render('posts/index', { posts: posts });
   });
});
app.get('/:id', (req, res) => {
   db.BlogPost.findById(req.params.id).then((post) => {
      return post.getComments().then((comments) => {
         res.render('posts/show', { post: post , comments: comments });
      });
   });

});
app.post('/comments', (req,res) => {
   db.Comment.create(req.body).then((comment) => {
      return comment.getPost().then((post) => {
        res.redirect('/' + req.params.id);
     });
   });
});



db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
