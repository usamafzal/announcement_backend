import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path/win32";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import { studentRouter } from "./routes/student.route.js";
import IsUserLoggedIn from "./middleware/auth.middleware.js";
import programRouter from "./routes/program.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

// Routes
app.get("/", (req, res) => {
  res.send("working");
});

// Routes
// User router
app.use("/api/auth", userRouter);

//Student Router
app.use("/api/student", studentRouter);

// program Router
app.use("/api/program", IsUserLoggedIn, programRouter);
// Server Start
app.listen(PORT, process.env.URI, (err) =>
  err
    ? console.log(`Server failed to listen: ${err.message}`)
    : console.log(`Server connnected on Port: ${PORT}`)
);
export default app;
