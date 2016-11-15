var express = require('express');
var router = express.Router();
var db = require('../models');




router.get('/posts', (req, res) => {
   db.Blog.findAll().then((blogs) => {
      res.render('posts/index', { blogs: blogs });
   });
});

router.get('/posts/new', (req,res) => {
   res.render('posts/new' );
});

router.get('/posts/:id', (req, res) => {
   db.Blog.findById(req.params.id).then((blog) => {
      res.render('posts/show', { blog: blog });
   });
});

router.post('/posts', (req, res) => {
   db.Blog.create(req.body).then(() => {
      res.redirect('/posts');
   });
});

router.put('/posts/:id', (req, res) => {
   db.Blog.update(req.body, {
      where: {
         id: req.params.id
      }
    }).then(() => {
      res.redirect('/posts/' + req.params.id);
   });
});

router.get('/posts/edit/:id', (req, res) => {
   db.Blog.findById(req.params.id).then((blog) => {
      res.render('posts/edit', { blog: blog });
   });
});
router.delete('/posts/:id', (req, res) => {
   db.Blog.destroy({
      where: {
         id: req.params.id
      }
   }).then(() => {
      res.redirect('/posts');
   });
});

module.exports = router;
