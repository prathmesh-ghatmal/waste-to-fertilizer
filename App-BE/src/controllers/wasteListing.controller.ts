import { Request, Response } from "express";
import { IWasteListing,WasteListingModel, WasteStatus } from "../models";

import { AuthRequest } from "../middleware/authMiddleware";

// Create a new waste listing
export const createWasteListing = async (req: AuthRequest, res: Response) => {
  try {
    const data: IWasteListing = req.body;

    // Set donor info from the authenticated user
    
    data.donorId = req.user.id;
    data.donorName = req.user.donorName;
   
    data.status=WasteStatus.LISTED
    data.id = `waste-${Date.now()}`;
    data.createdAt = new Date();
    data.updatedAt = new Date();
    data.unit="kg"
    data.images = data.images || [];
    data.latitude = data.latitude || 0;
    data.longitude = data.longitude || 0;
    data.estimatedValue = data.estimatedValue || data.quantity * 0.5; // default estimation
    
    const newListing = new WasteListingModel(data);
    await newListing.save();

    res.status(201).json(newListing);
  } catch (error) {
    console.error("Create WasteListing Error:", error);
    res.status(500).json({ message: "Failed to create listing", error });
  }
};

// Get all waste listings (optional: filter by donor or status)
export const getWasteListings = async (req: AuthRequest, res: Response) => {
  try {
    const listings = await WasteListingModel.find();
    res.json(listings);
  } catch (error) {
    console.error("Get WasteListings Error:", error);
    res.status(500).json({ message: "Failed to fetch listings", error });
  }
};

// Get a single listing by id
export const getWasteListingById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await WasteListingModel.findOne({ id });
    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (error) {
    console.error("Get WasteListingById Error:", error);
    res.status(500).json({ message: "Failed to fetch listing", error });
  }
};

// Update a listing
export const updateWasteListing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body, updatedAt: new Date() };

    const listing = await WasteListingModel.findOneAndUpdate(
      { id },
      updatedData,
      { new: true }
    );

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json(listing);
  } catch (error) {
    console.error("Update WasteListing Error:", error);
    res.status(500).json({ message: "Failed to update listing", error });
  }
};

// Delete a listing
export const deleteWasteListing = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const listing = await WasteListingModel.findOneAndDelete({ id });

    if (!listing) return res.status(404).json({ message: "Listing not found" });

    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("Delete WasteListing Error:", error);
    res.status(500).json({ message: "Failed to delete listing", error });
  }
};


// Get all waste listings for the logged-in donor
export const getMyWasteListings = async (req: AuthRequest, res: Response) => {
  try {
    const donorId = req.user.id; // fetched from JWT
console.log("llllllllllllllllllllllllllllllllllllllllllllllllllllll",donorId)
    const listings = await WasteListingModel.find({ donorId });

    res.json(listings);
  } catch (error) {
    console.error("Get My WasteListings Error:", error);
    res.status(500).json({ message: "Failed to fetch listings", error });
  }
};
