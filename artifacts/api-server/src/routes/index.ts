import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import lessonsRouter from "./lessons";
import storiesRouter from "./stories";
import quizRouter from "./quiz";
import assignmentsRouter from "./assignments";
import submissionsRouter from "./submissions";
import studentsRouter from "./students";
import dashboardRouter from "./dashboard";
import storageRouter from "./storage";
import adminRouter from "./admin";
import materialsRouter from "./materials";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(adminRouter);
router.use(lessonsRouter);
router.use(storiesRouter);
router.use(quizRouter);
router.use(assignmentsRouter);
router.use(submissionsRouter);
router.use(studentsRouter);
router.use(dashboardRouter);
router.use(storageRouter);
router.use(materialsRouter);

export default router;
