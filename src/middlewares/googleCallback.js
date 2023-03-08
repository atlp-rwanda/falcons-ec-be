import passport from 'passport';

const googleCallBack = (req, res, next) => {
  passport.authenticate('google', {
    successRedirect:'/welcome',
    failureRedirect: '/auth/google',
  })(req, res, next);
};

export default googleCallBack
