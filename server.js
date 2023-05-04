import express from "express";
import cors from "cors";
import loginRouter from "./routes/loginRoute.js";
import connectDB from "./db/database.js";
import cookieParser from "cookie-parser";
import session from "express-session";
const app = express();
// for connecting the server to the database
connectDB();
// to get the json data from frontend
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: [process.env.FRONTEND_URI],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: process.env.NODE_ENV === 'development' ? 'lax' : 'none',
    secure: process.env.NODE_ENV === 'development' ? false : true,
  }
}));

// this is for the routes
app.use("/user", loginRouter);


app.get("/",(req,res)=>{
   res.send("<h1>the server is working fine</h1>")
})
app.listen(process.env.PORT, () => {
  console.log("Server is listening on Port " + process.env.PORT + " in " + process.env.NODE_ENV + " Mode");
});
