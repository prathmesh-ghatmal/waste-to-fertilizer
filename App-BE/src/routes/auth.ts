import { Router } from "express";
import { register, login } from "../controllers/authController";
import { authenticateJWT, AuthRequest } from "../middleware/authMiddleware";
import { Response } from "express";
import { UserModel } from "../models";
const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticateJWT, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    // req.user.id comes from JWT payload
    const user = await UserModel.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;
