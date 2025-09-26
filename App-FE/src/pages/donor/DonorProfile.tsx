import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const DonorProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    zipCode: user?.zipCode || '',
    businessName: 'Green Restaurant',
    businessType: 'Restaurant',
    businessDescription: 'Organic farm-to-table restaurant committed to sustainability and zero waste practices.',
    operatingHours: '8:00 AM - 10:00 PM',
    wasteVolume: '20-30 kg daily',
    certifications: ['Organic Certified', 'Green Business Certified']
  });

  const handleSave = () => {
    // Save profile logic here
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const verificationSteps = [
    { 
      title: 'Basic Information', 
      completed: true, 
      description: 'Contact details and business info' 
    },
    { 
      title: 'Business Verification', 
      completed: true, 
      description: 'Business license and documentation' 
    },
    { 
      title: 'Waste Generation Profile', 
      completed: false, 
      description: 'Historical waste data and patterns' 
    },
    { 
      title: 'Collection Logistics', 
      completed: false, 
      description: 'Access instructions and scheduling preferences' 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Donor Profile</h1>
            <p className="text-muted-foreground mt-1">
              Manage your business information and verification status
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge 
              variant="secondary" 
              className="bg-success text-success-foreground"
            >
              <CheckCircle className="mr-1 h-3 w-3" />
              Verified
            </Badge>
            
            <Button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover"
            >
              {isEditing ? (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              ) : (
                'Edit Profile'
              )}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold">{profileData.name}</h3>
                    <p className="text-sm text-muted-foreground">Food Waste Donor</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : '2024'}
                    </p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="businessName"
                        value={profileData.businessName}
                        onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                        className="pl-10"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      id="address"
                      value={`${profileData.address}, ${profileData.city}, ${profileData.state} ${profileData.zipCode}`}
                      onChange={(e) => {
                        // Handle address parsing if needed
                      }}
                      className="pl-10"
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    value={profileData.businessDescription}
                    onChange={(e) => setProfileData({...profileData, businessDescription: e.target.value})}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hours">Operating Hours</Label>
                    <Input
                      id="hours"
                      value={profileData.operatingHours}
                      onChange={(e) => setProfileData({...profileData, operatingHours: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volume">Average Daily Waste Volume</Label>
                    <Input
                      id="volume"
                      value={profileData.wasteVolume}
                      onChange={(e) => setProfileData({...profileData, wasteVolume: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Verification Status */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className={`p-1 rounded-full mt-0.5 ${
                        step.completed ? 'bg-success' : 'bg-muted'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="h-4 w-4 text-success-foreground" />
                        ) : (
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`text-sm font-medium ${
                          step.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium">Complete verification</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete all steps to unlock premium features and higher collection priority.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Certifications */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profileData.certifications.map((cert, index) => (
                    <Badge key={index} variant="secondary" className="w-full justify-center py-2">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      {cert}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    Add Certification
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-card border-0">
              <CardHeader>
                <CardTitle>Impact Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">2,450 kg</div>
                    <div className="text-xs text-muted-foreground">Total waste diverted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">98%</div>
                    <div className="text-xs text-muted-foreground">Collection success rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">15</div>
                    <div className="text-xs text-muted-foreground">Active partnerships</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonorProfile;