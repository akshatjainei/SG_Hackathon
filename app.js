const express = require('express');
const app = express();
const  tasks = require('./routes/tasks')
const session = require('express-session')
const passport = require('passport')
const connectDB = require('./db/connect')
const path = require('path');
const User = require('./model/user');
const sendAnalysis = require('./sentiment');
require('dotenv').config()
require('./config/passport')

app.use(express.static('./public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/v1/tasks',tasks);

app.get('/home' , (req , res)=>{
  res.sendFile(path.join(__dirname, './public', 'home.html'))
})

// Google OAuth routes
app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

// Update user location
app.post('/api/update_location', async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!req.user) {
    return res.status(401).send('Not authenticated');
  }

  const user = await User.findByIdAndUpdate(req.user.id, {
    location: {
      type: 'Point',
      coordinates: [longitude, latitude]
    }
  }, { new: true });

  res.send(user);
});

const port = 3000;

const start = async () => {
    try {
      const SentimentObj = await sendAnalysis('http://localhost:8000/analyze', 'I love this product')
      const polar = SentimentObj.polarity
      console.log(polar)
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } 
    catch (error) {
      console.log(error);
    }
};
start()
