import express, { Express } from "express";
import ejs from "ejs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);

app.get("/", async (req, res) => {
    res.render("index");
});

// app.post('/login', (req, res) => {
//     const { Username, password } = req.body;
//     User.findOne({ username: Username }, function(err, user) {
//         if (err) return res.redirect('/login');
//         if (!user) return res.redirect('/login');
//         user.comparePassword(password, function(err, isMatch) {
//             if (err) return res.redirect('/login');
//             if (!isMatch) return res.redirect('/login');
//             req.session.user = user;
//             res.redirect('/');
//         });
//     });
// });

app.get('/registration', (req, res) => {
    res.render('registration'); 
});

app.get('/homepage_fortnite', (req, res) => {
    res.render('homepage_fortnite'); 
});

app.get('/blacklist_detail', (req, res) => {
    res.render('blacklist_detail'); 
});

app.get('/blacklisted_characters', (req, res) => {
    res.render('blacklisted_characters'); 
});

app.get('/character_detail', (req, res) => {
    res.render('character_detail'); 
});

app.get('/characters', (req, res) => {
    res.render('characters'); 
});

app.get('/favorite_characters', (req, res) => {
    res.render('favorite_characters'); 
});

app.get('/favorite_detail', (req, res) => {
    res.render('favorite_detail'); 
});

app.get('/landing-page', (req, res) => {
    res.render('landing-page'); 
});

app.get('/user-profile', (req, res) => {
    res.render('user-profile'); 
});

app.listen(app.get("port"), () => {
    console.log("Server started on http://localhost:" + app.get('port'));
});
