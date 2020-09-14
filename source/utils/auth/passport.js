import { Strategy as VKontakteStrategy } from 'passport-vkontakte';

import { User } from '../../odm/';

export default function(passport) {
  const { VKONTAKTE_APP_ID, VKONTAKTE_APP_SECRET } = process.env;

  passport.use(
    new VKontakteStrategy(
      {
        clientID: VKONTAKTE_APP_ID,
        clientSecret: VKONTAKTE_APP_SECRET,
        callbackURL: 'http://localhost:3000/auth/vkontakte/callback',
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        const newUser = {
          vkId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          accessToken,
        };
        // //oauth.vk.com/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fvkontakte%2Fcallback&scope=profile%2Cnotify%2Cfriends%2Coffline&client_id=7587231
        // https: //oauth.vk.com/authorize?client_id=7587231&scope=65539&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1
        //oauth.vk.com/authorize?client_id=758723&display=page&redirect_uri=http://localhost:3000/auth/vkontakte/callback&scope=friends&response_type=code&v=5.122
        https: // https: req.session.accessToken = accessToken;

        try {
          let user = await User.findOne({ vkId: profile.id });

          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user));
  });
}
