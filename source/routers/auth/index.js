// Core
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get(
  '/vkontakte',
  passport.authenticate('vkontakte', {
    scope: ['profile', 'notify', 'friends', 'offline'],
  })
);

router.get(
  '/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/test' }),
  (req, res) => {
    res.redirect('/');
  }
);

export { router as auth };
