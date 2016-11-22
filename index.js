const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize'),
      db = require('./models'),
      methodOverride = require('method-override'),
      displayRoutes = require('express-routemap'),
      session = require('express-session');

var app = express();
var adminRouter = require('./routes/admin');

app.set('view engine', 'pug');

app.use(express.static('public'));

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

// app.set('trust proxy', 1) ;// trust first proxy

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));


app.get('/', (req, res) => {
   db.BlogPost.findAll().then((posts) => {
      res.render('posts/index', { posts: posts });
   });
});

app.post('/comments/:id', (req,res) => {
   var incomingComment = req.body;

   incomingComment.BlogPostId = req.params.id;
   console.log(incomingComment);
   db.Comment.create(incomingComment).then((comment) => {
      res.redirect('/' + req.params.id);
   });
});

app.get('/register', (req, res) => {
   if (req.session.user) {
      res.redirect('/admin/posts');
   } else {
      res.render('users/new');
   }
});

app.get('/logout', (req, res) => {
   req.session.user = undefined;
   res.redirect('/');
});

// app.get('/login', (req, res) => {
//    db.User.findById(req.params.id).then((user) =>{
//       res.render('/users/information.pug', {user: user});
//    });
//
// });

app.get('/:id', (req, res) => {
   db.BlogPost.findById(req.params.id).then((post) => {
      return post.getComments().then((comments) => {
         res.render('posts/show', { post: post , comments: comments });
      });
   });
});

app.post('/users', (req, res) => {
   db.User.create(req.body).then(() => {
      res.redirect('/');
   });
});

app.post('/login', (req, res) => {
   db.User.findOne({
      where:{
         email: req.body.email
      }
   }).then((userInDb) => {
      if (req.body.passward === userInDb.passward) {
         req.session.user = userInDb;
         res.redirect('/');
      } else {
         res.redirect('/register');
      }
   }).catch((error) => {
      res.redirect('/register');
   });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
