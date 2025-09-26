import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  Weight,
  Calendar,
  Truck,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { mockWasteListings, WasteType, WasteStatus } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

const ManufacturerCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWasteType, setSelectedWasteType] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const { toast } = useToast();

  // Filter waste listings
  const filteredWaste = mockWasteListings.filter(waste => {
    const matchesSearch = waste.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         waste.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedWasteType === 'all' || waste.wasteType === selectedWasteType;
    const matchesLocation = selectedLocation === 'all' || waste.location.includes(selectedLocation);
    
    return matchesSearch && matchesType && matchesLocation;
  });

  const handleRequestCollection = (wasteId: string, title: string) => {
    toast({
      title: "Collection Request Sent",
      description: `Your request to collect "${title}" has been sent to the donor.`,
    });
  };

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

  const getWasteTypeLabel = (type: WasteType) => {
    const labels = {
      [WasteType.FRUIT_VEGETABLE]: 'Fruits & Vegetables',
      [WasteType.BAKERY]: 'Bakery Items',
      [WasteType.DAIRY]: 'Dairy Products',
      [WasteType.MEAT_FISH]: 'Meat & Fish',
      [WasteType.GRAINS_CEREALS]: 'Grains & Cereals',
      [WasteType.OTHER]: 'Other Organic'
    };
    return labels[type] || type;
  };

  const getDaysUntilExpiry = (expiryDate: Date) => {
    const days = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const wasteTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: WasteType.FRUIT_VEGETABLE, label: 'Fruits & Vegetables' },
    { value: WasteType.BAKERY, label: 'Bakery Items' },
    { value: WasteType.DAIRY, label: 'Dairy Products' },
    { value: WasteType.MEAT_FISH, label: 'Meat & Fish' },
    { value: WasteType.GRAINS_CEREALS, label: 'Grains & Cereals' },
    { value: WasteType.OTHER, label: 'Other Organic' }
  ];

  const locationOptions = [
    { value: 'all', label: 'All Locations' },
    { value: 'Portland', label: 'Portland Area' },
    { value: 'Salem', label: 'Salem Area' },
    { value: 'Eugene', label: 'Eugene Area' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Food Waste Collection</h1>
          <p className="text-muted-foreground">
            Browse available food waste listings and request collections for processing
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search waste listings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Waste Type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {locationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {filteredWaste.length} waste listings
          </p>
          <div className="flex space-x-2">
            <Badge variant="outline">
              <CheckCircle className="mr-1 h-3 w-3 text-success" />
              {filteredWaste.filter(w => w.status === WasteStatus.LISTED).length} Available
            </Badge>
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3 text-warning" />
              {filteredWaste.filter(w => w.status === WasteStatus.REQUESTED).length} Requested
            </Badge>
          </div>
        </div>

        {/* Waste Listings */}
        <div className="grid gap-6">
          {filteredWaste.map((waste) => {
            const daysUntilExpiry = getDaysUntilExpiry(new Date(waste.expiryDate));
            const isUrgent = daysUntilExpiry <= 1;
            const isExpiringSoon = daysUntilExpiry <= 3 && daysUntilExpiry > 1;
            
            return (
              <Card key={waste.id} className="shadow-card border-0 card-hover">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{waste.title}</h3>
                        <Badge className={getStatusColor(waste.status)}>
                          {waste.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">
                          {getWasteTypeLabel(waste.wasteType)}
                        </Badge>
                        {isUrgent && (
                          <Badge variant="destructive" className="animate-pulse">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Urgent
                          </Badge>
                        )}
                        {isExpiringSoon && (
                          <Badge variant="secondary" className="bg-warning text-warning-foreground">
                            <Clock className="mr-1 h-3 w-3" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{waste.description}</p>
                      
                      {/* Waste Details Grid */}
                      <div className="grid md:grid-cols-4 gap-4 text-sm mb-4">
                        <div className="flex items-center space-x-2">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <div className="font-medium">{waste.quantity} kg</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Location:</span>
                            <div className="font-medium">{waste.location}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Available:</span>
                            <div className="font-medium">{new Date(waste.availableFrom).toLocaleDateString()}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">Expires:</span>
                            <div className={`font-medium ${isUrgent ? 'text-destructive' : isExpiringSoon ? 'text-warning' : ''}`}>
                              {daysUntilExpiry} days ({new Date(waste.expiryDate).toLocaleDateString()})
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Donor Information */}
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg mb-4">
                        <div>
                          <span className="text-sm text-muted-foreground">Donor:</span>
                          <div className="font-medium">{waste.donorName}</div>
                        </div>
                        {waste.estimatedValue && (
                          <div className="text-right">
                            <span className="text-sm text-muted-foreground">Estimated Value:</span>
                            <div className="font-medium text-success">${waste.estimatedValue}</div>
                          </div>
                        )}
                      </div>

                      {/* Special Instructions */}
                      {waste.specialInstructions && (
                        <div className="p-3 bg-accent/10 rounded-lg mb-4">
                          <span className="text-sm font-medium text-accent">Special Instructions:</span>
                          <p className="text-sm mt-1">{waste.specialInstructions}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="ml-6 flex flex-col space-y-2">
                      {waste.status === WasteStatus.LISTED && (
                        <Button 
                          onClick={() => handleRequestCollection(waste.id, waste.title)}
                          className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover"
                        >
                          <Truck className="mr-2 h-4 w-4" />
                          Request Collection
                        </Button>
                      )}
                      
                      {waste.status === WasteStatus.REQUESTED && waste.manufacturerId && (
                        <div className="text-center">
                          <Badge variant="secondary" className="bg-warning text-warning-foreground mb-2">
                            Collection Requested
                          </Badge>
                          <p className="text-xs text-muted-foreground">Waiting for donor confirmation</p>
                        </div>
                      )}
                      
                      {waste.status === WasteStatus.COLLECTED && (
                        <div className="text-center">
                          <Badge className="bg-primary text-primary-foreground mb-2">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Collected
                          </Badge>
                          <p className="text-xs text-muted-foreground">Ready for processing</p>
                        </div>
                      )}
                      
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          
          {filteredWaste.length === 0 && (
            <Card className="shadow-card border-0">
              <CardContent className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No waste listings found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search criteria or check back later for new listings
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedWasteType('all');
                    setSelectedLocation('all');
                  }}
                  variant="outline"
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManufacturerCollection;