import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

const BuyerCart = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">Cart features coming soon...</p>
      </div>
    </div>
  );
};

export default BuyerCart;