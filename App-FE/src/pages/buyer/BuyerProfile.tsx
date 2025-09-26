import React from 'react';
import { Navbar } from '@/components/layout/Navbar';

const BuyerProfile = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold">Buyer Profile</h1>
        <p className="text-muted-foreground mt-2">Profile features coming soon...</p>
      </div>
    </div>
  );
};

export default BuyerProfile;