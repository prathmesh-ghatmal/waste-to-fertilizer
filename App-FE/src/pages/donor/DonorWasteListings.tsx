import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon,
  MapPin,
  Weight,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getWasteListingsByDonor, WasteType, WasteStatus } from '@/lib/data';
import { format, set } from 'date-fns';
import { cn } from '@/lib/utils';
import { createWasteListing, getMyWasteListings } from '@/api/wasteApi';
import { create } from 'domain';

const DonorWasteListings = () => {
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
  const [showForm, setShowForm] = useState(false);
  const [availableDate, setAvailableDate] = useState<Date>();
  const [expiryDate, setExpiryDate] = useState<Date>();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    wasteType: '' as WasteType | '',
    quantity: '',
    location: '',
    specialInstructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    const formPayload = {
      ...formData,
      quantity: Number(formData.quantity),
      availableFrom: availableDate,
      expiryDate: expiryDate
    };
    const res=await createWasteListing(formPayload)
    setUserWaste([...userWaste,res]);
    console.log('Form submitted:', formData, availableDate, expiryDate);
    setShowForm(false);
    // Reset form
    
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

  const wasteTypeOptions = [
    { value: WasteType.FRUIT_VEGETABLE, label: 'Fruits & Vegetables' },
    { value: WasteType.BAKERY, label: 'Bakery Items' },
    { value: WasteType.DAIRY, label: 'Dairy Products' },
    { value: WasteType.MEAT_FISH, label: 'Meat & Fish' },
    { value: WasteType.GRAINS_CEREALS, label: 'Grains & Cereals' },
    { value: WasteType.OTHER, label: 'Other Organic Waste' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Waste Listings</h1>
            <p className="text-muted-foreground mt-1">
              Manage your food waste listings and track collections
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </div>

        {/* Add New Listing Form */}
        {showForm && (
          <Card className="mb-8 shadow-card border-0">
            <CardHeader>
              <CardTitle>Create New Waste Listing</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Listing Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Fresh Vegetable Scraps - Daily"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Waste Type *</Label>
                    <Select 
                      value={formData.wasteType} 
                      onValueChange={(value) => setFormData({...formData, wasteType: value as WasteType})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select waste type" />
                      </SelectTrigger>
                      <SelectContent>
                        {wasteTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the waste type, quality, and any special conditions"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity (kg) *</Label>
                    <div className="relative">
                      <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="Enter weight in kg"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Available From *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !availableDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {availableDate ? format(availableDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={availableDate}
                          onSelect={setAvailableDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>Expires On *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !expiryDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {expiryDate ? format(expiryDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={expiryDate}
                          onSelect={setExpiryDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Pickup Location *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Enter pickup address"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={formData.specialInstructions}
                    onChange={(e) => setFormData({...formData, specialInstructions: e.target.value})}
                    placeholder="Any special handling instructions or pickup requirements"
                    rows={2}
                  />
                </div>

                <div className="flex space-x-4">
                  <Button 
                    type="submit" 
                    className="bg-gradient-primary text-primary-foreground shadow-primary"
                  >
                    Create Listing
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Existing Listings */}
        <div className="grid gap-6">
          {userWaste.map((waste) => (
            <Card key={waste.id} className="shadow-card border-0 card-hover">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{waste.title}</h3>
                      <Badge className={getStatusColor(waste.status)}>
                        {waste.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{waste.description}</p>
                    
                    <div className="grid md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span>{waste.quantity} kg</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{waste.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Available: {new Date(waste.availableFrom).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {new Date(waste.expiryDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {waste.collectionNotes && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm"><strong>Collection Note:</strong> {waste.collectionNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {userWaste.length === 0 && !showForm && (
            <Card className="shadow-card border-0">
              <CardContent className="text-center py-12">
                <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No waste listings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first waste listing to start contributing to the circular economy
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-primary text-primary-foreground shadow-primary"
                >
                  Create Your First Listing
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonorWasteListings;
