import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { getFertilizersByManufacturer, FertilizerType } from '@/lib/data';
import { Package, Plus, TrendingUp, AlertTriangle, Edit, Star, DollarSign } from 'lucide-react';

const ManufacturerInventory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const fertilizers = user ? getFertilizersByManufacturer(user.id) : [];
  
  const filteredFertilizers = fertilizers.filter(fertilizer =>
    fertilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fertilizer.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'destructive' };
    if (quantity < 50) return { status: 'Low Stock', color: 'warning' };
    if (quantity < 200) return { status: 'Medium Stock', color: 'secondary' };
    return { status: 'In Stock', color: 'success' };
  };

  const getTotalValue = () => {
    return fertilizers.reduce((total, fertilizer) => total + (fertilizer.quantity * fertilizer.pricePerKg), 0);
  };

  const getLowStockCount = () => {
    return fertilizers.filter(fertilizer => fertilizer.quantity < 50).length;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground mt-2">Manage your fertilizer products and stock levels</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Create a new fertilizer product for your inventory
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" placeholder="Enter product name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="organic_compost">Organic Compost</SelectItem>
                      <SelectItem value="liquid_fertilizer">Liquid Fertilizer</SelectItem>
                      <SelectItem value="granular">Granular</SelectItem>
                      <SelectItem value="specialized">Specialized</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (kg)</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per kg</Label>
                    <Input id="price" type="number" placeholder="0.00" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Product description" />
                </div>
                <Button className="bg-primary hover:bg-primary/90">Create Product</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFertilizers.map((fertilizer) => {
                const stockStatus = getStockStatus(fertilizer.quantity);
                return (
                  <Card key={fertilizer.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-foreground">{fertilizer.name}</CardTitle>
                          <CardDescription className="mt-1">
                            {fertilizer.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={stockStatus.color === 'success' ? 'default' : 'secondary'}
                          className={`${
                            stockStatus.color === 'destructive' ? 'bg-destructive/10 text-destructive' :
                            stockStatus.color === 'warning' ? 'bg-warning/10 text-warning' :
                            stockStatus.color === 'success' ? 'bg-success/10 text-success' :
                            'bg-secondary/10 text-secondary'
                          }`}
                        >
                          {stockStatus.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-2xl font-bold text-foreground">{fertilizer.quantity}</div>
                          <div className="text-xs text-muted-foreground">kg in stock</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-foreground">${fertilizer.pricePerKg}</div>
                          <div className="text-xs text-muted-foreground">per kg</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Nutrient Content (NPK)</div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="bg-primary/10 rounded px-2 py-1 text-center">
                            <div className="font-medium text-foreground">N: {fertilizer.nutrientContent.nitrogen}%</div>
                          </div>
                          <div className="bg-secondary/10 rounded px-2 py-1 text-center">
                            <div className="font-medium text-foreground">P: {fertilizer.nutrientContent.phosphorus}%</div>
                          </div>
                          <div className="bg-accent/10 rounded px-2 py-1 text-center">
                            <div className="font-medium text-foreground">K: {fertilizer.nutrientContent.potassium}%</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm text-foreground">{fertilizer.rating}</span>
                          <span className="text-xs text-muted-foreground">({fertilizer.reviewCount})</span>
                        </div>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {filteredFertilizers.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Products Found</h3>
                  <p className="text-muted-foreground text-center">
                    {searchTerm ? 'Try adjusting your search terms' : 'Add your first fertilizer product to get started'}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{fertilizers.length}</div>
                  <p className="text-xs text-success">Active products</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Stock</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {fertilizers.reduce((total, f) => total + f.quantity, 0)} kg
                  </div>
                  <p className="text-xs text-muted-foreground">Available stock</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">${getTotalValue().toLocaleString()}</div>
                  <p className="text-xs text-success">+8% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {fertilizers.length > 0 ? (fertilizers.reduce((total, f) => total + f.rating, 0) / fertilizers.length).toFixed(1) : '0.0'}
                  </div>
                  <p className="text-xs text-success">Customer satisfaction</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-warning" />
                  Stock Alerts
                </CardTitle>
                <CardDescription>
                  Products that need your attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getLowStockCount() > 0 ? (
                  <div className="space-y-4">
                    {fertilizers.filter(f => f.quantity < 50).map((fertilizer) => (
                      <div key={fertilizer.id} className="flex items-center justify-between p-4 border border-warning/20 rounded-lg bg-warning/5">
                        <div>
                          <h4 className="font-medium text-foreground">{fertilizer.name}</h4>
                          <p className="text-sm text-muted-foreground">Only {fertilizer.quantity} kg remaining</p>
                        </div>
                        <Badge variant="outline" className="border-warning text-warning">
                          Low Stock
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Package className="w-12 h-12 text-success mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">All Stock Levels Good</h3>
                    <p className="text-muted-foreground text-center">
                      No products require immediate attention
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturerInventory;