import express from 'express';
import { isAuthenticated } from '../middlewares/middleware.js';
import { addTodoTask, getAllTask } from '../controller/controller.js';

const router = express.Router();


router.post("/add",isAuthenticated ,addTodoTask);

router.get("/getTask",isAuthenticated,getAllTask)


export default router;