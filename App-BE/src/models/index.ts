// models/index.ts
import mongoose, { Schema, Document } from "mongoose";

/* ----------------------------- ENUMS ----------------------------- */
export enum UserRole {
  DONOR = "donor",
  MANUFACTURER = "manufacturer",
  BUYER = "buyer",
  ADMIN = "admin",
}

export enum WasteType {
  FRUIT_VEGETABLE = "fruit_vegetable",
  BAKERY = "bakery",
  DAIRY = "dairy",
  MEAT_FISH = "meat_fish",
  GRAINS_CEREALS = "grains_cereals",
  OTHER = "other",
}

export enum WasteStatus {
  LISTED = "listed",
  REQUESTED = "requested",
  COLLECTED = "collected",
  IN_PROCESS = "in_process",
  CONVERTED = "converted",
  EXPIRED = "expired",
}

export enum FertilizerType {
  ORGANIC_COMPOST = "organic_compost",
  LIQUID_FERTILIZER = "liquid_fertilizer",
  GRANULAR = "granular",
  SPECIALIZED = "specialized",
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

/* ----------------------------- USER ----------------------------- */
export interface IUser extends Document {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  createdAt: Date;
  isVerified: boolean;
  password: string;
}

const UserSchema = new Schema<IUser>({

  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, enum: Object.values(UserRole), required: true },
  avatar: String,
  phone: String,
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, required: true },
  isVerified: { type: Boolean, required: true },
  password: { type: String, required: true },
});

/* ----------------------------- WASTE LISTING ----------------------------- */
export interface IWasteListing extends Document {
  id: string;
  donorId: string;
  donorName: string;
  title: string;
  description: string;
  wasteType: WasteType;
  quantity: number;
  unit: string;
  location: string;
  latitude?: number;
  longitude?: number;
  availableFrom: Date;
  expiryDate: Date;
  status: WasteStatus;
  images: string[];
  estimatedValue?: number;
  specialInstructions?: string;
  collectionNotes?: string;
  manufacturerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WasteListingSchema = new Schema<IWasteListing>({
  id: { type: String, required: true, unique: true },
  donorId: { type: String, required: true },
  donorName: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  wasteType: { type: String, enum: Object.values(WasteType), required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  location: { type: String, required: true },
  latitude: Number,
  longitude: Number,
  availableFrom: { type: Date, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: String, enum: Object.values(WasteStatus), required: true },
  images: { type: [String], required: true },
  estimatedValue: Number,
  specialInstructions: String,
  collectionNotes: String,
  manufacturerId: String,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

/* ----------------------------- FERTILIZER PRODUCT ----------------------------- */
export interface IFertilizerProduct extends Document {
  id: string;
  manufacturerId: string;
  manufacturerName: string;
  name: string;
  description: string;
  type: FertilizerType;
  nutrientContent: {
    nitrogen: number;
    phosphorus: number;
    potassium: number;
    organic_matter?: number;
  };
  quantity: number;
  pricePerKg: number;
  images: string[];
  applicationRate: string;
  storageInstructions: string;
  certifications: string[];
  rating: number;
  reviewCount: number;
  isOrganic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FertilizerProductSchema = new Schema<IFertilizerProduct>({
  id: { type: String, required: true, unique: true },
  manufacturerId: { type: String, required: true },
  manufacturerName: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: Object.values(FertilizerType), required: true },
  nutrientContent: {
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    organic_matter: Number,
  },
  quantity: { type: Number, required: true },
  pricePerKg: { type: Number, required: true },
  images: { type: [String], required: true },
  applicationRate: { type: String, required: true },
  storageInstructions: { type: String, required: true },
  certifications: { type: [String], required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  isOrganic: { type: Boolean, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

/* ----------------------------- ORDER ----------------------------- */
export interface IOrder extends Document {
  id: string;
  buyerId: string;
  buyerName: string;
  manufacturerId: string;
  manufacturerName: string;
  products: {
    productId: string;
    productName: string;
    quantity: number;
    pricePerKg: number;
    totalPrice: number;
  }[];
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: string;
  estimatedDelivery?: Date;
  trackingNumber?: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  id: { type: String, required: true, unique: true },
  buyerId: { type: String, required: true },
  buyerName: { type: String, required: true },
  manufacturerId: { type: String, required: true },
  manufacturerName: { type: String, required: true },
  products: [
    {
      productId: { type: String, required: true },
      productName: { type: String, required: true },
      quantity: { type: Number, required: true },
      pricePerKg: { type: Number, required: true },
      totalPrice: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: Object.values(OrderStatus), required: true },
  shippingAddress: { type: String, required: true },
  estimatedDelivery: Date,
  trackingNumber: String,
  paymentMethod: { type: String, required: true },
  notes: String,
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

/* ----------------------------- PROCESSING RECORD ----------------------------- */
export interface IProcessingRecord extends Document {
  id: string;
  wasteListingId: string;
  manufacturerId: string;
  processStartDate: Date;
  processEndDate?: Date;
  currentStage: string;
  expectedYield: number;
  actualYield?: number;
  qualityMetrics?: {
    ph: number;
    moisture: number;
    organicMatter: number;
  };
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProcessingRecordSchema = new Schema<IProcessingRecord>({
  id: { type: String, required: true, unique: true },
  wasteListingId: { type: String, required: true },
  manufacturerId: { type: String, required: true },
  processStartDate: { type: Date, required: true },
  processEndDate: Date,
  currentStage: { type: String, required: true },
  expectedYield: { type: Number, required: true },
  actualYield: Number,
  qualityMetrics: {
    ph: Number,
    moisture: Number,
    organicMatter: Number,
  },
  notes: { type: String, required: true },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

/* ----------------------------- EXPORT MODELS ----------------------------- */
export const UserModel = mongoose.model<IUser>("User", UserSchema);
export const WasteListingModel = mongoose.model<IWasteListing>(
  "WasteListing",
  WasteListingSchema
);
export const FertilizerProductModel = mongoose.model<IFertilizerProduct>(
  "FertilizerProduct",
  FertilizerProductSchema
);
export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
export const ProcessingRecordModel = mongoose.model<IProcessingRecord>(
  "ProcessingRecord",
  ProcessingRecordSchema
);
