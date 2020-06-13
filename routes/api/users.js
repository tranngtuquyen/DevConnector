const express = require('express');
const gravatar = require('gravatar'); //https://github.com/emerleite/node-gravatar
const bcrypt = require('bcryptjs');

const router = express.Router();
const User = require('../../models/User');

// @route   POST api/users/register
// @desc    Register user 
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({email: req.body.email})
    .then(user => {
      if (user) {
        return res.status(400).json({email: "Email already existed"});
      } else {
        const avatar = gravatar.url(req.body.email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        });

        const newUser = new User({
          name: req.body.name,
          email: req.body.email,
          avatar,
          password: req.body.password
        });

        bcrypt.genSalt(10, (err, salt) => {
          if (err) throw err;
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => res.json(user))
              .catch(err => console.log(err));
          })
        });
      }
    })
    .catch(err => console.log(err));
});

// @route   POST api/users/login
// @desc    Login user/returning a token
// @access  Public
router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({email})
    .then(user => {
      if (!user) {
        return res.status(404).json({email: "User not found"});
      }

      //Check password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) {
            return res.status(400).json({password: "Password incorrect"});
          }
          return res.json({msg: "Success"});
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
})

module.exports = router;