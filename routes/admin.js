var express = require('express');
var router = express.Router();
var db = require('../models');




router.get('/posts', (req, res) => {
   db.BlogPost.findAll().then((posts) => {
      res.render('posts/index', { posts: posts });
   });
});

router.get('/posts/new', (req,res) => {
   res.render('posts/new' );
});

router.get('/posts/:id', (req, res) => {
   db.BlogPost.findById(req.params.id).then((post) => {
      res.render('posts/show', { post: post});
   });
});

router.post('/posts', (req, res) => {
   db.BlogPost.create(req.body).then(() => {
      res.redirect('/');
   });
});

router.put('/posts/:id', (req, res) => {
   db.BlogPost.update(req.body, {
      where: {
         id: req.params.id
      }
    }).then(() => {
      res.redirect('/' + req.params.id);
   });
});

router.get('/posts/edit/:id', (req, res) => {
   db.BlogPost.findById(req.params.id).then((post) => {
      res.render('posts/edit', { post: post });
   });
});
router.delete('/posts/:id', (req, res) => {
   db.BlogPost.destroy({
      where: {
         id: req.params.id
      }
   }).then(() => {
      res.redirect('/');
   });
});

module.exports = router;
