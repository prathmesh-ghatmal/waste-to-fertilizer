import { Router } from "express";
import {
  createWasteListing,
  getWasteListings,
  getWasteListingById,
  updateWasteListing,
  deleteWasteListing,
  getMyWasteListings,
} from "../controllers/wasteListing.controller";
import { authenticateJWT } from "../middleware/authMiddleware";

const router = Router();

// All routes are protected
router.use(authenticateJWT);
router.get("/my", getMyWasteListings);
router.post("/", createWasteListing);
router.get("/", getWasteListings);
router.get("/:id", getWasteListingById);
router.put("/:id", updateWasteListing);
router.delete("/:id", deleteWasteListing);


export default router;
