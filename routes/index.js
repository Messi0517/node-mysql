const express = require('express');
const router = express.Router();
const knex = require('../db/knex');

router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    const userId = req.user.id;
    knex("tasks")
      .select("*")
      .where({user_id: userId})
      .then(function (results) {
        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
        });
      });
  } else {
    res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
    });
  }
});

router.post('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (!isAuth) {
    return res.redirect('/signin');
  }
  const userId = req.user.id;
  const todo = req.body.add;
  const dueDate = req.body.due_date;
  knex("tasks")
    .insert({user_id: userId, content: todo, due_date: dueDate})
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.get('/calendar', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (!isAuth) {
    return res.redirect('/signin');
  }
  const userId = req.user.id;
  knex("tasks")
    .select("*")
    .where({user_id: userId})
    .orderBy('due_date', 'asc')
    .then(function (results) {
      res.render('calendar', {
        title: 'カレンダー',
        tasks: results,
        isAuth: isAuth,
      });
    })
    .catch(function (err) {
      console.error(err);
      res.render('calendar', {
        title: 'カレンダー',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;