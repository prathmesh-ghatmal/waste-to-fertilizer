import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Recycle, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Loader2,
  Factory,
  ShoppingCart,
  Truck
} from 'lucide-react';
import { UserRole } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    role: '' as UserRole | '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: ''
  });
  const [error, setError] = useState('');
  const { signup, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate=useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password || !formData.name || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const success = await signup({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role as UserRole,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
      });

      navigate("/login")
      if (success) {
        toast({
          title: "Welcome to Waste2Fertilizer!",
          description: "Your account has been created successfully.",
        });
      } else {
        setError('An account with this email already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const roleOptions = [
    { 
      value: UserRole.DONOR, 
      label: 'Food Waste Donor', 
      description: 'Restaurant, hotel, or business with organic waste',
      icon: Truck 
    },
    { 
      value: UserRole.MANUFACTURER, 
      label: 'Fertilizer Manufacturer', 
      description: 'Process waste into organic fertilizers',
      icon: Factory 
    },
    { 
      value: UserRole.BUYER, 
      label: 'Fertilizer Buyer', 
      description: 'Farmer, gardener, or agricultural business',
      icon: ShoppingCart 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-primary mb-6">
              <Recycle className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="text-3xl font-bold">Join Waste2Fertilizer</h2>
            <p className="mt-2 text-muted-foreground">
              Create your account and start making a positive environmental impact
            </p>
          </div>

          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>
                Fill out the form below to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Role Selection */}
                <div className="space-y-3">
                  <Label>I am a *</Label>
                  <div className="grid gap-3">
                    {roleOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleInputChange('role', option.value)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.role === option.value
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <option.icon className={`h-6 w-6 mt-1 ${
                            formData.role === option.value ? 'text-primary' : 'text-muted-foreground'
                          }`} />
                          <div className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-muted-foreground">{option.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Password */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Create a password"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Confirm your password"
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Enter your phone number"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Enter your street address"
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="City"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      placeholder="ZIP"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-primary text-primary-foreground shadow-primary eco-hover"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link 
                      to="/login" 
                      className="font-medium text-primary hover:underline"
                    >
                      Sign in here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Back to Landing */}
          <div className="text-center">
            <Link 
              to="/landing" 
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;