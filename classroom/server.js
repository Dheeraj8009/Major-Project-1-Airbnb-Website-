const express = require('express');
const app = express();
const port = 8080;
const userRoutes = require('./routes/user.js');
const postRoutes = require('./routes/posts.js');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const path = require('path');

app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'views'));

const sessionOptions = {
  secret: 'mysupersecretstring',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
};

app.use(session(sessionOptions)); 

app.use(flash());

app.get('/register', (req, res) => {
  let { name = 'dheeraaa' } = req.query;
  req.session.name = name;
  if (name === "mongo") {
    req.flash('error', 'Name is required to register.');
  } else {
    req.flash('success', 'You have registered successfully!');
  }
  res.redirect('/hello');   // 👈 redirect instead of send
});


app.get('/hello' , (req, res) => {
  res.locals.messages = req.flash('success');
  res.locals.errors = req.flash('error');
  res.render('page.ejs', {name: req.session.name});
});









// app.get('/reqcount', (req, res) => {
//   if (req.session.views) {
//     req.session.views++;
//   } else {
//     req.session.views = 1;
//   }
//   res.send(`Number of requests made in this session: ${req.session.views}`);
// });




// app.get('/test' , (req, res) => {
//   res.send('Session is working!');
// });







app.listen(port, () => {
  console.log(`Classroom server is running on http://localhost:${port}`);
});












// app.get('/getsignedcookie', (req, res) => {
//   res.cookie('Name', 'JohnDoe', { signed: true, httpOnly: true });
//   res.send('Signed cookie has been set');
// });

// app.get('/verifysignedcookie', (req, res) => {
//   let { Name } = req.signedCookies;
//   if (Name) {
//     res.send(`Signed cookie value: ${Name}`);
//   } else {
//     res.send('No signed cookie found');
//   } 
// });


// app.get('/getcookies', (req, res) => {
//   res.cookie('session_id', 'abc123', { httpOnly: true });
//   res.send('Cookie has been set');
// });


// app.get('/greet', (req, res) => {
//   let {Name } = req.cookies  ;
//   res.send(`Hello, ${Name}! Welcome to the Classroom Server.`);
// });

// app.get('/', (req, res) => {
//   console.dir(req.cookies);
//   res.send('Welcome to the Classroom Server!');
// });

// app.use('/users', userRoutes);
// app.use('/posts', postRoutes);



