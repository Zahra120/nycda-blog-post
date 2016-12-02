var assert = require('assert');
var db = require('../models');
describe('Post Model', () => {
  before((done) => {
    db.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
  it('create a blog post', (done) => {
    db.BlogPost.create({
      title: 'cooking',
      slug:   'good book',
      content: '<h1>it\'s about iranian cooking</h1>'
    }).then((post) => {
      assert.equal(post.title, 'cooking');
      assert.equal(post.slug, 'good book');
      assert.equal(post.content, '<h1>it\'s about iranian cooking</h1>');
      done();
    });
  });

  it('can not create post without title', (done) => {
    db.BlogPost.create({
      slug: 'politic',
      content: '<h1>it\'s about iranian politic</h1>'
    }).catch((error) => {
      assert.equal(error.errors[0].message, 'title cannot be null');
      done();
    });
  });

  it('updating blog post', (done) => {
    db.BlogPost.update({
      title: 'new title',
      slug: 'new slug',
      content: 'new content'
    },{
      where:{
        title: 'cooking'
      },
      returning:true
    }).then((updateData) => {
      var post = updateData[1][0];
      assert.equal(post.title, 'new title');
      assert.equal(post.slug, 'new slug');
      assert.equal(post.content, 'new content');
      done();

      });
    });
  it('delete a blogpost', (done) => {
    db.BlogPost.destroy({
      where:{
        title: 'new title'
      }
    }).then((destroyRecordCount) => {
      assert.equal(destroyRecordCount, 1);
      done();
    });
  });
});
