const express = require('express');
const app = express();
const  tasks = require('./routes/tasks')
const session = require('express-session')
const passport = require('passport')
const connectDB = require('./db/connect')
const path = require('path');
const run = require('./genModel')
const cors = require('cors');
const { MongoClient } = require('mongodb');
const User = require('./model/user');
const Doc = require('./model/doc')
const sendSentimentValue = require('./sentiment');
require('dotenv').config()
require('./config/passport')
const port = 3000

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
app.use(cors());
app.use('/api/v1/tasks',tasks);

app.get('/home' , (req , res)=>{
  res.sendFile(path.join(__dirname, './public', 'home.html'))
})

const client = new MongoClient(process.env.MONGO_URI , {useNewUrlParser: true, useUnifiedTopology: true})
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

app.get('/therapists', async (req, res) => {
  try {
    await client.connect();
    const database = client.db('test'); 
    const collection = database.collection('therapist'); 
    
    const therapists = await collection.find().toArray();
    
    res.json(therapists);
  } catch (error) {
    console.error('Error fetching therapists:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }

});

const start = async () => {
    try {
      const val = await sendSentimentValue('http://127.0.0.1:8000/analyze' , '')
      console.log(val.polarity)
      if(val.polarity<-0.5){
        console.log('therapist')
      }
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port http://localhost:${port}`)
      );
    } 
    catch (error) {
      console.log(error);
    }
};
start()
