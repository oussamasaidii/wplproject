// import express from 'express';
// import http from 'http';
// import bodyParser from 'body-parser';
// import cookieParser from 'cookie-parser';
// import compression from 'compression';
// import cors from 'cors';
// import mongoose from 'mongoose';

// import router from './router';

// const app = express();

// app.use(cors({
//     credentials: true,
// }));

// app.use(compression());
// app.use(cookieParser());
// app.use(bodyParser.json());

// const server = http.createServer(app);

// server.listen(8080, () => {
//     console.log('Server running on http://localhost:8080/');
// });

// const MONGO_URL = 'mongodb+srv://TiltedTowers:TiltedTowersBOM@cluster0.iwefcqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

// mongoose.Promise = Promise;
// mongoose.connect(MONGO_URL);
// mongoose.connection.on('error', (error: Error) => console.log(error));

// app.use('/', router());
import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';

import router from './router';
import { login } from './controllers/authentication';

const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await login(email, password);
        res.redirect('/landing-page');
    } catch (error) {
        res.render('login', { errorMessage: (error as Error).message });
    }
});

app.get("/", (req, res) => {
    res.render("login", { errorMessage: null });
});

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

const server = http.createServer(app);

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000/');
});

const MONGO_URL = 'mongodb+srv://TiltedTowers:TiltedTowersBOM@cluster0.iwefcqe.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());



