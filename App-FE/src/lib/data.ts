// Centralized data structure for Waste2Fertilizer app
// All mock data, TypeScript interfaces, and enums stored here

export enum UserRole {
  DONOR = 'donor',
  MANUFACTURER = 'manufacturer',
  BUYER = 'buyer',
  ADMIN = 'admin'
}

export enum WasteType {
  FRUIT_VEGETABLE = 'fruit_vegetable',
  BAKERY = 'bakery',
  DAIRY = 'dairy',
  MEAT_FISH = 'meat_fish',
  GRAINS_CEREALS = 'grains_cereals',
  OTHER = 'other'
}

export enum WasteStatus {
  LISTED = 'listed',
  REQUESTED = 'requested',
  COLLECTED = 'collected',
  IN_PROCESS = 'in_process',
  CONVERTED = 'converted',
  EXPIRED = 'expired'
}

export enum FertilizerType {
  ORGANIC_COMPOST = 'organic_compost',
  LIQUID_FERTILIZER = 'liquid_fertilizer',
  GRANULAR = 'granular',
  SPECIALIZED = 'specialized'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export interface User {
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
}

export interface WasteListing {
  id: string;
  donorId: string;
  donorName: string;
  title: string;
  description: string;
  wasteType: WasteType;
  quantity: number; // in kg
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
  manufacturerId?: string; // who collected it
  createdAt: Date;
  updatedAt: Date;
}

export interface FertilizerProduct {
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
  quantity: number; // available stock in kg
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

export interface Order {
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

export interface ProcessingRecord {
  id: string;
  wasteListingId: string;
  manufacturerId: string;
  processStartDate: Date;
  processEndDate?: Date;
  currentStage: string;
  expectedYield: number; // in kg of fertilizer
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

// Mock Data
export const mockUsers: User[] = [
  {
    id: 'donor-1',
    email: 'john@greenrestaurant.com',
    name: 'John Smith',
    role: UserRole.DONOR,
    avatar: '/images/avatars/john.jpg',
    phone: '+1-555-0123',
    address: '123 Green St',
    city: 'Portland',
    state: 'OR',
    zipCode: '97201',
    createdAt: new Date('2024-01-15'),
    isVerified: true
  },
  {
    id: 'manufacturer-1',
    email: 'sarah@ecoprocess.com',
    name: 'Sarah Johnson',
    role: UserRole.MANUFACTURER,
    avatar: '/images/avatars/sarah.jpg',
    phone: '+1-555-0456',
    address: '456 Industrial Ave',
    city: 'Portland',
    state: 'OR',
    zipCode: '97202',
    createdAt: new Date('2024-01-10'),
    isVerified: true
  },
  {
    id: 'buyer-1',
    email: 'mike@organicfarms.com',
    name: 'Mike Davis',
    role: UserRole.BUYER,
    avatar: '/images/avatars/mike.jpg',
    phone: '+1-555-0789',
    address: '789 Farm Rd',
    city: 'Salem',
    state: 'OR',
    zipCode: '97301',
    createdAt: new Date('2024-01-20'),
    isVerified: true
  }
];

export const mockWasteListings: WasteListing[] = [
  {
    id: 'waste-1',
    donorId: 'donor-1',
    donorName: 'Green Restaurant',
    title: 'Fresh Vegetable Scraps - Daily Collection',
    description: 'High-quality vegetable peelings, trimmings, and expired produce from our organic restaurant. Consistent daily volume.',
    wasteType: WasteType.FRUIT_VEGETABLE,
    quantity: 25,
    unit: 'kg',
    location: 'Portland Downtown, OR',
    latitude: 45.5152,
    longitude: -122.6784,
    availableFrom: new Date('2024-09-26'),
    expiryDate: new Date('2024-09-28'),
    status: WasteStatus.LISTED,
    images: ['/images/waste/vegetables-1.jpg', '/images/waste/vegetables-2.jpg'],
    estimatedValue: 75,
    specialInstructions: 'Please collect during business hours (8AM-6PM). Material is stored in refrigerated area.',
    createdAt: new Date('2024-09-26'),
    updatedAt: new Date('2024-09-26')
  },
  {
    id: 'waste-2',
    donorId: 'donor-1',
    donorName: 'Grand Hotel Catering',
    title: 'Mixed Food Waste - Event Leftovers',
    description: 'Large volume of mixed organic waste from corporate catering events. Includes fruits, vegetables, and bakery items.',
    wasteType: WasteType.OTHER,
    quantity: 150,
    unit: 'kg',
    location: 'Portland Convention Center, OR',
    availableFrom: new Date('2024-09-26'),
    expiryDate: new Date('2024-09-27'),
    status: WasteStatus.REQUESTED,
    images: ['/images/waste/mixed-1.jpg'],
    estimatedValue: 300,
    manufacturerId: 'manufacturer-1',
    collectionNotes: 'Scheduled for pickup tomorrow morning at 9AM',
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-09-26')
  }
];

export const mockFertilizerProducts: FertilizerProduct[] = [
  {
    id: 'fertilizer-1',
    manufacturerId: 'manufacturer-1',
    manufacturerName: 'EcoProcess Solutions',
    name: 'Premium Organic Compost',
    description: 'Rich, dark compost made from locally sourced food waste. Perfect for vegetable gardens and flower beds.',
    type: FertilizerType.ORGANIC_COMPOST,
    nutrientContent: {
      nitrogen: 3.2,
      phosphorus: 2.1,
      potassium: 1.8,
      organic_matter: 65
    },
    quantity: 500,
    pricePerKg: 2.50,
    images: ['/images/fertilizer/compost-1.jpg', '/images/fertilizer/compost-2.jpg'],
    applicationRate: '2-4 inches thick, work into top 6 inches of soil',
    storageInstructions: 'Store in dry, covered area. Keep away from direct sunlight.',
    certifications: ['OMRI Listed', 'USDA Organic', 'Oregon Certified'],
    rating: 4.8,
    reviewCount: 127,
    isOrganic: true,
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-09-25')
  },
  {
    id: 'fertilizer-2',
    manufacturerId: 'manufacturer-1',
    manufacturerName: 'EcoProcess Solutions',
    name: 'Liquid Plant Booster',
    description: 'Concentrated liquid fertilizer extracted from processed organic waste. Quick-acting nutrients for all plants.',
    type: FertilizerType.LIQUID_FERTILIZER,
    nutrientContent: {
      nitrogen: 5.0,
      phosphorus: 3.0,
      potassium: 4.0,
      organic_matter: 15
    },
    quantity: 200,
    pricePerKg: 8.99,
    images: ['/images/fertilizer/liquid-1.jpg'],
    applicationRate: 'Dilute 1:10 with water, apply every 2 weeks during growing season',
    storageInstructions: 'Store in cool, dark place. Do not freeze.',
    certifications: ['OMRI Listed', 'Oregon Certified'],
    rating: 4.6,
    reviewCount: 89,
    isOrganic: true,
    createdAt: new Date('2024-09-20'),
    updatedAt: new Date('2024-09-25')
  }
];

export const mockOrders: Order[] = [
  {
    id: 'order-1',
    buyerId: 'buyer-1',
    buyerName: 'Organic Farms Co.',
    manufacturerId: 'manufacturer-1',
    manufacturerName: 'EcoProcess Solutions',
    products: [
      {
        productId: 'fertilizer-1',
        productName: 'Premium Organic Compost',
        quantity: 100,
        pricePerKg: 2.50,
        totalPrice: 250
      }
    ],
    totalAmount: 250,
    status: OrderStatus.CONFIRMED,
    shippingAddress: '789 Farm Rd, Salem, OR 97301',
    estimatedDelivery: new Date('2024-09-30'),
    trackingNumber: 'ECO123456789',
    paymentMethod: 'Credit Card',
    notes: 'Please deliver to the main barn area',
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-09-26')
  }
];

export const mockProcessingRecords: ProcessingRecord[] = [
  {
    id: 'process-1',
    wasteListingId: 'waste-2',
    manufacturerId: 'manufacturer-1',
    processStartDate: new Date('2024-09-25'),
    currentStage: 'Composting - Day 3',
    expectedYield: 45,
    qualityMetrics: {
      ph: 6.8,
      moisture: 55,
      organicMatter: 72
    },
    notes: 'Temperature maintaining at 140°F. Good decomposition rate.',
    createdAt: new Date('2024-09-25'),
    updatedAt: new Date('2024-09-26')
  }
];

// Utility functions
export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const getWasteListingsByDonor = (donorId: string): WasteListing[] => {
  return mockWasteListings.filter(waste => waste.donorId === donorId);
};

export const getFertilizersByManufacturer = (manufacturerId: string): FertilizerProduct[] => {
  return mockFertilizerProducts.filter(fertilizer => fertilizer.manufacturerId === manufacturerId);
};

export const getOrdersByBuyer = (buyerId: string): Order[] => {
  return mockOrders.filter(order => order.buyerId === buyerId);
};

export const getProcessingRecordsByManufacturer = (manufacturerId: string): ProcessingRecord[] => {
  return mockProcessingRecords.filter(record => record.manufacturerId === manufacturerId);
};