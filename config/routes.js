
/*!
 * Module dependencies.
 */

// Note: We can require users, peoples and other cotrollers because we have
// set the NODE_PATH to be ./app/controllers (package.json # scripts # start)

var users = require('../app/controllers/users');
var peoples = require('../app/controllers/people');
var organizations = require('../app/controllers/organizations');
var projects = require('../app/controllers/projects');
var comments = require('../app/controllers/comments');
var tags = require('../app/controllers/tags');
var auth = require('./middlewares/authorization');

/**
 * Route middlewares
 */

var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

/**
 * Expose routes
 */

module.exports = function (app, passport) {

  // user routes
  app.get('/login', users.login);
  app.get('/signup', users.signup);
  app.get('/logout', users.logout);
  app.post('/users', users.create);
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session);
  app.get('/users/:userId', auth.requiresLogin, users.show);
  app.get('/auth/facebook',
    passport.authenticate('facebook', {
      scope: [ 'email', 'user_about_me'],
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/github',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/github/callback',
    passport.authenticate('github', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/twitter',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.signin);
  app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/google',
    passport.authenticate('google', {
      failureRedirect: '/login',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }), users.signin);
  app.get('/auth/google/callback',
    passport.authenticate('google', {
      failureRedirect: '/login'
    }), users.authCallback);
  app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
      failureRedirect: '/login',
      scope: [
        'r_emailaddress'
      ]
    }), users.signin);
  app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
      failureRedirect: '/login'
    }), users.authCallback);

  app.param('userId', users.load);


  // organizations routes
  app.param('idorg', organizations.load);
  app.get('/organizations', auth.requiresLogin, organizations.index);
  app.get('/organizations/new', auth.requiresLogin, organizations.new);
  app.post('/organizations', auth.requiresLogin, organizations.create);
  app.get('/organizations/:idorg', organizations.show);
  app.get('/organizations/:idorg/edit', auth.requiresLogin, organizations.edit);
  app.put('/organizations/:idorg', auth.requiresLogin, organizations.update);
  app.delete('/organizations/:idorg', auth.requiresLogin, organizations.destroy);


  // peoples routes
  app.get('/people/search', peoples.search);

  app.param('id', peoples.load);
  app.get('/people', auth.requiresLogin, peoples.index);
  app.get('/people/new', auth.requiresLogin, peoples.new);
  app.post('/people', auth.requiresLogin, peoples.create);
  app.get('/people/:id', peoples.show);
  app.get('/people/:id/edit', auth.requiresLogin, peoples.edit);
  app.put('/people/:id', auth.requiresLogin, peoples.update);
  app.delete('/people/:id', auth.requiresLogin, peoples.destroy);

  app.param('ide', peoples.loadconnected);
  app.get('/people/:id/person/:ide', auth.requiresLogin, peoples.connected);
  app.get('/people/:id/person', auth.requiresLogin, peoples.newPerson);
  app.post('/people/:id/person', auth.requiresLogin, peoples.createPerson);



  app.get('/people/:id/organization', auth.requiresLogin ,peoples.newOrganization);
  app.post('/people/:id/organization', auth.requiresLogin, peoples.createOrganization);

  app.get('/people/:id/project', auth.requiresLogin ,peoples.newProject);
  app.post('/people/:id/project', auth.requiresLogin, peoples.createProject);


  // projects routes
  app.param('id_project', auth.requiresLogin, projects.load);
  app.get('/projects', auth.requiresLogin, projects.index);
  app.get('/projects/new', auth.requiresLogin, projects.new);
  app.post('/projects', auth.requiresLogin, projects.create);
  app.get('/projects/:id_project', projects.show);
  app.get('/projects/:id_project/edit', auth.requiresLogin, projects.edit);
  app.put('/projects/:id_project', auth.requiresLogin, projects.update);
  app.delete('/projects/:id_project', auth.requiresLogin, projects.destroy);



  // home route
  app.get('/', auth.requiresLogin, peoples.index);

  // comment routes
  app.param('commentId', auth.requiresLogin, comments.load);
  app.post('/people/:id/comments', auth.requiresLogin, comments.create);
  app.get('/people/:id/comments', auth.requiresLogin, comments.create);
  app.delete('/people/:id/comments/:commentId', commentAuth, comments.destroy);

  // tag routes
  app.get('/tags/:tag', tags.index);


  /**
   * Error handling
   */

  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
}
