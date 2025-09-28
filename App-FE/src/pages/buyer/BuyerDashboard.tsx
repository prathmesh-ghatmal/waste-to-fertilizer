import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, TrendingUp, Star, Eye, Plus } from 'lucide-react';
import { mockFertilizerProducts, mockOrders, getOrdersByBuyer } from '@/lib/data';
import { Link } from 'react-router-dom';

const BuyerDashboard = () => {
  const { user } = useAuth();
  
  // Get buyer's orders
  const buyerOrders = user ? getOrdersByBuyer(user.id) : [];
  
  // Calculate stats
  const totalOrders = buyerOrders.length;
  const totalSpent = buyerOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  const pendingOrders = buyerOrders.filter(order => order.status === 'pending').length;
  
  // Get featured fertilizers (first 3)
  const featuredFertilizers = mockFertilizerProducts.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Buyer Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back, {user?.name}! Discover premium fertilizers for your agricultural needs.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time purchases</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Investment in quality fertilizers</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-warning">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Products</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{mockFertilizerProducts.length}</div>
              <p className="text-xs text-muted-foreground">Premium fertilizers available</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>Explore and purchase premium fertilizers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link to="/buyer/marketplace">
                  <Eye className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/buyer/cart">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  View Cart
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/buyer/orders">
                  <Package className="h-4 w-4 mr-2" />
                  Order History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Featured Fertilizers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning" />
              Featured Fertilizers
            </CardTitle>
            <CardDescription>Premium quality fertilizers from trusted manufacturers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredFertilizers.map((fertilizer) => (
                <div key={fertilizer.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-card-foreground">{fertilizer.name}</h3>
                    <Badge variant={fertilizer.isOrganic ? "default" : "secondary"}>
                      {fertilizer.isOrganic ? "Organic" : "Conventional"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{fertilizer.description}</p>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-primary">${fertilizer.pricePerKg}/kg</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="text-sm">{fertilizer.rating}</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mb-3">
                    Stock: {fertilizer.quantity}kg available
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link to="/buyer/marketplace">View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;