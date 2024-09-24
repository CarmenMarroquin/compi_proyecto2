import express from "express";
import morgan from "morgan";
import cors from "cors";
import { router as rutasInter } from "./interprete/rutasInter";

//import { router as interpRoute } from "./interpreter/interRoutes";


export const app: express.Application = express();

// Import routers from here
// import route from "path";


// Middleware
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/', (req, res) => {
    res.status(200).json({message: "OK :)"});
});

app.use('/api/interprete', rutasInter);


export default app;