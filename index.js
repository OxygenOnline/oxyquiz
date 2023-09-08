import express from "express";
const app = express();
const port = 3000;

app.listen(port, () => {
   console.log(`Server running on port ${port}.`);
});

app.get("/", (req, res) => {
   res.send("*insert quiz here*");
   // homepage
});

app.get("/about", (req, res) => {
   // about page
});

app.route('/register')
   .get((req, res) => {
   // registry page
})
   .post((req, res) => {
   // register new user
});

app.route('/login')
   .get((req, res) => {
   // login page
})
   .post((req, res) => {
   // login existing user
});

app.get("/quizzes", (req, res) => {
   // quiz browsing page
});

// TODO: individual quizzes operations, results

app.post("/quizzes/new", (req, res) => {
   // quiz creating page
});

// TODO: browsing quizzes according to categories
