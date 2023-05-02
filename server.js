import express from "express";
import cors from "cors";
import loginRouter from "./routes/loginRoute.js";
import connectDB from "./db/database.js";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.js";

const app = express();
// for connecting the server to the database
connectDB();
// to get the json data from frontend
app.use(cors({
  origin: process.env.FRONTEND_URI,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

// this is for the routes
app.use("/user", loginRouter);
app.use("/task", taskRouter);

app.listen(process.env.PORT, () => {
  console.log("Server is listening on Port http://localhost:" + process.env.PORT + " in " + process.env.NODE_ENV + " Mode");
});
