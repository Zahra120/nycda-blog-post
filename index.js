const express = require('express'),
      pug = require('pug'),
      morgan = require('morgan'),
      bodyParser = require('body-parser'),
      Sequelize = require('sequelize'),
      db = require('./models'),
      methodOverride = require('method-override'),
      displayRoutes = require('express-routemap'),
      session = require('express-session'),
      bcrypt = require ('bcrypt'),
      crypto = require('crypto'),
      base64url = require('base64url'),
      nodemailer = require('nodemailer');

var app = express();
var adminRouter = require('./routes/admin');

var transporter = nodemailer.createTransport(
 'smtps://nycdaamswdi%40gmail.com:'+
 process.env.EMAIL_PASSWORD_Blog_App+'@smtp.gmail.com');

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

app.use(session({
  secret: 'keyboard cat',
  resave: true,
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

app.get('/forgot-password', (req, res) => {
   res.render('users/forgot-password');
});

// app.post('/forgot-password', (req, res) => {
//    //check if the email exists in the database
//    db.User.findOne({
//       where:{
//          email:req.body.email
//       }
//    }).then((user) => {
//       if (user) {
//          //send email to that email with unique link
//          var passwordResetToken = base64url(crypto.randomBytes(48));
//          user.save().then(user() => {
//             transporter.sendMail({
//               to:user.email,
//               subject:"change password request",
//               text:
//               `hi, please go this link and change your password!
//                   http://localhost:3000/change-password/${user.passwordResetToken}
//             `
//              }, (error, info) => {
//                 if(error){ throw error; }
//                 console.log('password reset email sent to: ');
//                 console.log(info);
//             });
//          }).
//
//          res.redirect('/change-password/:passwordResetToken');
//       } else {
//          res.redirect('/forgot-password');
//       }
//    }).catch((error) => {
//       console.log(error);
//    });
// });
// //    }).then((user) => {
// //       res.render('change-password');
// //    });
// //       res.render('/');
// // });

app.post('/forgot-password', (req, res) => {
  db.User.findOne({
    where: {
      email: req.body.email
     }
   }).then((user) => {
     if (user) {
      // 2 - send an email with a unique link
      user.passwordResetToken = base64url(crypto.randomBytes(48));
      user.save().then((user) => {
        transporter.sendMail({
          to: user.email,
          subject: 'Blog application password change request',
          text: `
            Hi there,
            You have requested to change your password. If you haven't requested it please ignore this email.
           You can change your password below:

           http://localhost:3000/change-password/${user.passwordResetToken}
          `
       }, (error, info) => {
          if (error) { throw error; }
          console.log('Password reset email sent:');
          console.log(info);
       });
      });

      res.redirect('/');
     } else {
      res.redirect('/forgot-password');
     }
   });
 });

app.get('/change-password/:passwordResetToken', (req, res) => {
      //from unique identifier we will get the user
      //it should be a column in user table, it only be generateted when
      //we send email
      //get the new password from req.body and change the password to new one
      db.User.findOne({
         where:{
            passwordResetToken: req.params.passwordResetToken
         }
      }).then((user) => {
         res.render('users/change-password', {user: user});
      });
});

app.get('/:id', (req, res) => {
   db.BlogPost.findById(req.params.id).then((post) => {
      return post.getComments().then((comments) => {
         res.render('posts/show', { post: post , comments: comments });
      });
   });
});

app.post('/users', (req, res) => {
   var user = req.body;
   bcrypt.hash(user.passward, 10, (error, hash) => {
      user.passward = hash;
      db.User.create(user).then((user) => {
         res.redirect('/');
      }).catch((error) => {
         console.log(error);
         res.redirect('/register');
      });
   });
});



app.post('/login', (req, res) => {
   db.User.findOne({
      where:{
         email: req.body.email
      }
   }).then((userInDb) => {
      bcrypt.compare(req.body.passward, userInDb.passward, (error, result) => {
          if(result){
            req.session.user = userInDb;
            res.redirect('/');
         } else {
            res.redirect('/admin/login');
         }
      });
   }).catch((error) => {
      res.redirect('/register');
   });
});

app.post('/change-password/:passwordResetToken', (req,res) => {
   db.User.findOne({
      where: {
         passwordResetToken: req.params.passwordResetToken
      }
   }).then((user) => {
      user.passwordDigest = req.body.passwordDigest ;
      user.save().then((user) => {
         req.session.user = user;
         res.redirect('/');
      });
   }).catch((error) => {
      res.redirect('/change-password/' + req.params.passwordResetToken);
   });
});


db.sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Web Server is running on port 3000');
    displayRoutes(app);
  });
});
