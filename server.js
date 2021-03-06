// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT          = process.env.PORT || 8080;
const ENV           = process.env.ENV || "development";
const express       = require("express");
const bodyParser    = require("body-parser");
const sass          = require("node-sass-middleware");
const cookieSession = require("cookie-session");
const app           = express();
const morgan        = require('morgan');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes     = require("./routes/users");
const widgetsRoutes   = require("./routes/widgets");
const createQuiz      = require("./routes/createQuiz");
const quizRoutes      = require("./routes/quiz");
const myQuizzes       = require("./routes/myQuizzes");
const myResults       = require("./routes/results");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users",   usersRoutes(db));
app.use("/api/widgets", widgetsRoutes(db));
// Note: mount other resources here, using the same pattern above
app.use("/create",      createQuiz(db));
app.use("/quiz",        quizRoutes(db));
app.use("/myquiz",      myQuizzes(db));
app.use("/results",     myResults(db));


app.get("/", (req, res) => {
  db.query(`
  SELECT quizzes.id as quizid, quizzes.title, quizzes.is_private, users.id as userid, users.name
  FROM quizzes
  JOIN users ON users.id = user_id
  WHERE quizzes.is_private = false;
  `)
    .then(user => {

      let templateVars = { userData: user.rows, userId: user.rows };

      res.render("index", templateVars);
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

app.get('/login/:id', (req, res) => {
  // session cookies
  req.session.user_id = req.params.id;
  //cookie parse
  res.redirect('/');
});




app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
