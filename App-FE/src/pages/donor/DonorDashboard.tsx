import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Plus, 
  TrendingUp, 
  Recycle, 
  Clock, 
  CheckCircle,
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getWasteListingsByDonor, mockWasteListings, WasteStatus } from '@/lib/data';
import { getMyWasteListings } from '@/api/wasteApi';

const DonorDashboard = () => {
  const { user } = useAuth();
  const [userWaste , setUserWaste] = React.useState(getWasteListingsByDonor(user?.id || ''));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      const fetchListings = async () => {
        
        try {
          const data = await getMyWasteListings();
          setUserWaste(data);
        } catch (err: any) {
          setError(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      fetchListings();
    }, []);
  const stats = [
    {
      title: "Active Listings",
      value: userWaste.filter(w => w.status === WasteStatus.LISTED).length,
      icon: Recycle,
      color: "text-success"
    },
    {
      title: "Total Waste Listed",
      value: `${userWaste.reduce((sum, w) => sum + w.quantity, 0)} kg`,
      icon: TrendingUp,
      color: "text-primary"
    },
    {
      title: "Pending Collection",
      value: userWaste.filter(w => w.status === WasteStatus.REQUESTED).length,
      icon: Clock,
      color: "text-warning"
    },
    {
      title: "Completed",
      value: userWaste.filter(w => w.status === WasteStatus.COLLECTED).length,
      icon: CheckCircle,
      color: "text-success"
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
      case WasteStatus.EXPIRED:
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Donor Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back, {user?.name}! Manage your waste listings and track collections.
            </p>
          </div>
          <Link to="/donor/waste-listings">
            <Button className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover">
              <Plus className="mr-2 h-4 w-4" />
              Add Waste Listing
            </Button>
          </Link>
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

        {/* Recent Listings */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-card border-0">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Recent Waste Listings</CardTitle>
                <Link to="/donor/waste-listings">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userWaste.slice(0, 3).map((waste) => (
                  <div key={waste.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{waste.title}</h4>
                      <p className="text-sm text-muted-foreground">{waste.quantity} kg • {waste.wasteType}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Listed {new Date(waste.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge className={getStatusColor(waste.status)}>
                      {waste.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                
                {userWaste.length === 0 && (
                  <div className="text-center py-8">
                    <Recycle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No waste listings yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start by creating your first waste listing
                    </p>
                    <Link to="/donor/waste-listings">
                      <Button size="sm" className="bg-gradient-primary text-primary-foreground">
                        Create Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to="/donor/waste-listings" className="block">
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <Plus className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <h4 className="font-medium">Create New Listing</h4>
                        <p className="text-sm text-muted-foreground">List your available food waste</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <Link to="/donor/profile" className="block">
                  <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Complete Profile</h4>
                        <p className="text-sm text-muted-foreground">Add business verification details</p>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <h4 className="font-medium">Environmental Impact</h4>
                      <p className="text-sm text-muted-foreground">You've diverted {userWaste.reduce((sum, w) => sum + w.quantity, 0)} kg from landfills!</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tips Section */}
        <Card className="mt-8 shadow-card border-0">
          <CardHeader>
            <CardTitle>Pro Tips for Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-4 bg-success/10 rounded-full w-fit mx-auto mb-4">
                  <Clock className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-medium mb-2">List Early</h3>
                <p className="text-sm text-muted-foreground">
                  Post your waste listings 1-2 days in advance for better collection rates
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto mb-4">
                  <Recycle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Quality Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Separate and store waste properly to attract more manufacturers
                </p>
              </div>
              <div className="text-center">
                <div className="p-4 bg-accent/10 rounded-full w-fit mx-auto mb-4">
                  <DollarSign className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-medium mb-2">Track Value</h3>
                <p className="text-sm text-muted-foreground">
                  Regular donations can lead to partnership opportunities and benefits
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonorDashboard;