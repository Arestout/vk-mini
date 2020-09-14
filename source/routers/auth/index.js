// Core
import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/vkontakte', passport.authenticate('vkontakte', {}));

router.get(
  '/vkontakte/callback',
  passport.authenticate('vkontakte', { failureRedirect: '/test' }),
  (req, res) => {
    res.redirect('/');
  }
);

export { router as auth };
