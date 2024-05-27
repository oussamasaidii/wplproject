import express, { Express, Request, Response } from "express";
import ejs from "ejs";
import path from "path";
import { connect } from "./database";
import sessionMiddleware from "./sessionMiddleware";
import { secureMiddleware } from "./secureMiddleware";
import { userCollection, login, register } from './database';
import { User } from './types';

const app: Express = express();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("port", process.env.PORT || 3000);
app.use(sessionMiddleware);

app.post('/register', async (req: Request, res: Response) => {
    try {
        const { username, email, password, game } = req.body;
        await register(username, email, password, game);
        res.redirect('/');
    } catch (error: any) {
        console.error("Error registering user:", error);
        throw error;
    }
});

app.post('/index', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user: User | undefined = await login(email, password);
        if (user) {
            req.session.user = user;
            res.redirect('/landing-page');
        } else {
            res.status(400).send('Onjuiste gebruikersnaam of wachtwoord');
        }
    } catch (error: any) {
        console.error("Error logging in:", error);
        throw error;
    }
});

// Bescherm alle volgende routes met inlogvereiste
app.use(secureMiddleware);

// Overige routes hieronder...

app.get('/registration', (req: Request, res: Response) => {
    res.render('registration');
});

app.get('/homepage_fortnite', (req: Request, res: Response) => {
    res.render('homepage_fortnite');
});

app.get('/blacklist_detail', (req: Request, res: Response) => {
    res.render('blacklist_detail');
});

app.get('/blacklisted_characters', (req: Request, res: Response) => {
    res.render('blacklisted_characters');
});

app.get('/character_detail', (req: Request, res: Response) => {
    res.render('character_detail');
});

app.get('/characters', (req: Request, res: Response) => {
    res.render('characters');
});

app.get('/favorite_characters', (req: Request, res: Response) => {
    res.render('favorite_characters');
});

app.get('/favorite_detail', (req: Request, res: Response) => {
    res.render('favorite_detail');
});

app.get('/landing-page', (req: Request, res: Response) => {
    res.render('landing-page');
});

app.get('/user-profile', (req: Request, res: Response) => {
    res.render('user-profile');
});

app.listen(app.get("port"), async () => {
    try {
        await connect();
        console.log("Server started on http://localhost:" + app.get('port'));
    } catch (e) {
        console.log(e);
        process.exit(1); 
    }
});
