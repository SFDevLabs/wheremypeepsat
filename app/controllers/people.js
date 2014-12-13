
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var Article = mongoose.model('People')
var utils = require('../../lib/utils')
var extend = require('util')._extend

/**
 * Load
 */

exports.load = function (req, res, next, id){
  var User = mongoose.model('User');

  Article.load(id, function (err, article) {
    if (err) return next(err);
    if (!article) return next(new Error('not found'));
    req.article = article;
    next();
  });
};

/**
 * List
 */

exports.index = function (req, res){
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  var perPage = 30;
  var options = {
    perPage: perPage,
    page: page
  };

  Article.list(options, function (err, articles) {
    if (err) return res.render('500');
    Article.count().exec(function (err, count) {
      res.render('peoples/index', {
        title: 'People',
        articles: articles,
        page: page + 1,
        pages: Math.ceil(count / perPage)
      });
    });
  });
};

/**
 * New article
 */

exports.new = function (req, res){
  res.render('peoples/new', {
    title: 'New Person',
    article: new Article({})
  });
};

/**
 * New Person
 */

exports.newPerson = function (req, res){

  res.render('peoples/newperson', {
    title: 'NewPerson',
    article: req.article
  });
};

/**
 * Create Person
 */

exports.createPerson = function (req, res){
  var article = req.article;
  article.People.push(req.body);
  article.save(function(err){
        if (err) {
          req.flash('error', 'An Error Occured, Person not added.');
        } else{
          req.flash('success', 'Successfully added person!');
        }
      return res.redirect('/people/'+article._id);
  });


};

/**
 * New Organization
 */

exports.newOrganization = function (req, res){
  res.render('peoples/neworganization', {
    title: 'NewOrganization',
    article: req.article
  });
};

/**
 * Create Organization
 */

exports.createOrganization = function (req, res){
  var article = req.article;
  article.Organizations.push(req.body);

  article.save(function(err){
        if (err) {
          req.flash('error', 'An Error Occured, Organization not added.');
        } else{
          req.flash('success', 'Successfully added organization!');
        }
      return res.redirect('/people/'+article._id);
  });
};

/**
 * New Organization
 */

exports.newProject = function (req, res){

  res.render('peoples/newproject', {
    title: 'NewProject',
    article: req.article
  });
};

/**
 * Create Organization
 */

exports.createProject = function (req, res){
  var article = req.article;
  article.Projects.push(req.body);
  article.save(function(err){
        if (err) {
          req.flash('error', 'An Error Occured, Project not added.');
        } else{
          req.flash('success', 'Successfully added project!');
        }
      return res.redirect('/people/'+article._id);
  });
};

/**
 * Create an article
 * Upload an image
 */

exports.create = function (req, res) {
  var article = new Article(req.body);
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  article.createdBy = req.user;
  article.uploadAndSave(images, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created article!');
      return res.redirect('/people/'+article._id);
    }
    console.log(err);
    res.render('peoples/new', {
      title: 'New Article',
      article: article,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Edit an article
 */

exports.edit = function (req, res) {
  res.render('peoples/edit', {
    title: 'Edit ' + req.article.title,
    article: req.article
  });
};

/**
 * Update article
 */

exports.update = function (req, res){
  var article = req.article;
  var images = req.files.image
    ? [req.files.image]
    : undefined;

  // make sure no one changes the user
  delete req.body.user;
  article = extend(article, req.body);

  article.uploadAndSave(images, function (err) {
    if (!err) {
      return res.redirect('/people/' + article._id);
    }

    res.render('peoples/edit', {
      title: 'Edit Article',
      article: article,
      errors: utils.errors(err.errors || err)
    });
  });
};

/**
 * Show
 */

exports.show = function (req, res){
  res.render('peoples/show', {
    title: req.article.title,
    article: req.article
  });
};

/**
 * Delete an article
 */

exports.destroy = function (req, res){
  var article = req.article;
  article.remove(function (err){
    req.flash('info', 'Deleted successfully');
    res.redirect('/people');
  });
};
