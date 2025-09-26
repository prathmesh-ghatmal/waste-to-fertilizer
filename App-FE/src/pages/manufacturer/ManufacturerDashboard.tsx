import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Factory, 
  TrendingUp, 
  Package, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Truck,
  Beaker,
  Box
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  mockWasteListings, 
  mockFertilizerProducts,
  mockProcessingRecords,
  WasteStatus,
  getFertilizersByManufacturer,
  getProcessingRecordsByManufacturer
} from '@/lib/data';

const ManufacturerDashboard = () => {
  const { user } = useAuth();
  const userFertilizers = user ? getFertilizersByManufacturer(user.id) : [];
  const userProcessing = user ? getProcessingRecordsByManufacturer(user.id) : [];
  const availableWaste = mockWasteListings.filter(w => w.status === WasteStatus.LISTED);
  
  const stats = [
    {
      title: "Active Collections",
      value: mockWasteListings.filter(w => w.manufacturerId === user?.id).length,
      icon: Truck,
      color: "text-warning"
    },
    {
      title: "In Processing",
      value: userProcessing.length,
      icon: Beaker,
      color: "text-primary"
    },
    {
      title: "Fertilizer Products",
      value: userFertilizers.length,
      icon: Package,
      color: "text-success"
    },
    {
      title: "Inventory Value",
      value: `$${userFertilizers.reduce((sum, f) => sum + (f.quantity * f.pricePerKg), 0).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-accent"
    }
  ];

  const getStatusColor = (status: WasteStatus) => {
    switch (status) {
      case WasteStatus.LISTED:
        return 'bg-success text-success-foreground';
      case WasteStatus.REQUESTED:
        return 'bg-warning text-warning-foreground';
      case WasteStatus.COLLECTED:
        return 'bg-primary text-primary-foreground';
      case WasteStatus.IN_PROCESS:
        return 'bg-accent text-accent-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Manufacturer Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Manage waste collection and fertilizer production.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link to="/manufacturer/food-collection">
              <Button variant="outline">
                <Truck className="mr-2 h-4 w-4" />
                Browse Waste
              </Button>
            </Link>
            <Link to="/manufacturer/inventory">
              <Button className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover">
                <Package className="mr-2 h-4 w-4" />
                Manage Inventory
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-card border-0 card-hover">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full bg-muted`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Processing Pipeline */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Processing Pipeline</CardTitle>
                <Link to="/manufacturer/fertilizer-processing">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProcessing.slice(0, 3).map((process) => (
                  <div key={process.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">Batch #{process.id.slice(-4)}</h4>
                        <p className="text-sm text-muted-foreground">{process.currentStage}</p>
                      </div>
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {Math.round(((Date.now() - process.processStartDate.getTime()) / (1000 * 60 * 60 * 24)))} days
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Expected Yield:</span>
                        <div className="font-medium">{process.expectedYield} kg</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quality Score:</span>
                        <div className="font-medium text-success">Good</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {userProcessing.length === 0 && (
                  <div className="text-center py-8">
                    <Beaker className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No active processing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Collect waste to start processing
                    </p>
                    <Link to="/manufacturer/food-collection">
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                        Find Waste
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Available Waste */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Available Waste</CardTitle>
                <Link to="/manufacturer/food-collection">
                  <Button variant="outline" size="sm">Browse All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {availableWaste.slice(0, 3).map((waste) => (
                  <div key={waste.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{waste.title}</h4>
                      <Badge className={getStatusColor(waste.status)}>
                        Available
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{waste.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Quantity:</span>
                        <div className="font-medium">{waste.quantity} kg</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location:</span>
                        <div className="font-medium">{waste.location}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Available:</span>
                        <div className="font-medium">{new Date(waste.availableFrom).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Expires:</span>
                        <div className="font-medium text-warning">{new Date(waste.expiryDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full mt-3 bg-gradient-primary text-primary-foreground">
                      Request Collection
                    </Button>
                  </div>
                ))}
                
                {availableWaste.length === 0 && (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No waste available</h3>
                    <p className="text-sm text-muted-foreground">
                      Check back later for new listings
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 shadow-card border-0">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <Link to="/manufacturer/food-collection" className="block">
                <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <div className="p-4 bg-warning/10 rounded-full w-fit mx-auto mb-4">
                    <Truck className="h-8 w-8 text-warning" />
                  </div>
                  <h3 className="font-medium mb-2">Collection Requests</h3>
                  <p className="text-sm text-muted-foreground">Browse and request waste pickup</p>
                </div>
              </Link>

              <Link to="/manufacturer/fertilizer-processing" className="block">
                <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                    <Beaker className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Processing Tracker</h3>
                  <p className="text-sm text-muted-foreground">Monitor conversion progress</p>
                </div>
              </Link>

              <Link to="/manufacturer/inventory" className="block">
                <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <div className="p-4 bg-success/10 rounded-full w-fit mx-auto mb-4">
                    <Package className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="font-medium mb-2">Inventory Management</h3>
                  <p className="text-sm text-muted-foreground">Manage fertilizer products</p>
                </div>
              </Link>

              <Link to="/manufacturer/profile" className="block">
                <div className="p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer text-center">
                  <div className="p-4 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                    <Factory className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="font-medium mb-2">Business Profile</h3>
                  <p className="text-sm text-muted-foreground">Update facility information</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManufacturerDashboard;