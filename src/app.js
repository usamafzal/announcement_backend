import express from "express";
import { fileURLToPath } from "url";
import { dirname } from "path/win32";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";
import { studentRouter } from "./routes/student.route.js";
import IsUserLoggedIn from "./middleware/auth.middleware.js";
import programRouter from "./routes/program.route.js";
import semesterRouter from "./routes/semester.route.js";
import studentEnrollment from "./routes/student_enrollment.route.js";
import announcementRouter from "./routes/announcement.route.js";
import announcementTarget from "./routes/announcement_target.route.js";
import models from "./models/index.js";
import studentAnnouncementsRouter from "./routes/student_announcements.route.js";
import { isStudentLoggedIn } from "./middleware/student.middleware.js";

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

// semseter router
app.use("/api/semester", IsUserLoggedIn, semesterRouter);

// student enrollment routes
app.use("/api/student-enrollment", IsUserLoggedIn, studentEnrollment);

// announcements
app.use("/api/announcement", IsUserLoggedIn, announcementRouter);

// announcements Targets
app.use("/api/announcement_target", IsUserLoggedIn, announcementTarget);

// get students announcements
app.use("/api/stu_ann", isStudentLoggedIn, studentAnnouncementsRouter);

// Server Start
app.listen(PORT, process.env.URI, (err) =>
  err
    ? console.log(`Server failed to listen: ${err.message}`)
    : console.log(`Server connnected on Port: ${PORT}`)
);
export default app;
