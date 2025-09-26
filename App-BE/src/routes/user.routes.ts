import { Router } from "express";
import { createUser, getUsers } from "../controllers/user.controller";

const router = Router();

router.post("/", createUser); // POST /api/users
router.get("/", getUsers); // GET /api/users

export default router;
