import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Recycle, 
  Leaf, 
  TrendingUp, 
  Users, 
  Factory, 
  ShoppingCart,
  ArrowRight,
  CheckCircle,
  Globe,
  Award
} from 'lucide-react';
import heroImage from '@/assets/hero-waste-to-fertilizer.jpg';

const Landing = () => {
  const features = [
    {
      icon: Recycle,
      title: 'Food Waste Donors',
      description: 'Restaurants, hotels, and businesses can list their organic waste for sustainable collection.',
      color: 'text-success'
    },
    {
      icon: Factory,
      title: 'Fertilizer Manufacturers', 
      description: 'Process collected waste into high-quality organic fertilizers with complete tracking.',
      color: 'text-warning'
    },
    {
      icon: ShoppingCart,
      title: 'Fertilizer Marketplace',
      description: 'Farmers and gardeners can discover and purchase eco-friendly fertilizers directly.',
      color: 'text-accent'
    }
  ];

  const stats = [
    { value: '50,000+', label: 'Kg Waste Processed', icon: Recycle },
    { value: '1,200+', label: 'Active Users', icon: Users },
    { value: '25,000+', label: 'Kg Fertilizer Produced', icon: Leaf },
    { value: '98%', label: 'Customer Satisfaction', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-success text-success-foreground px-4 py-2">
                  🌱 Sustainable Future
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Transform
                  <span className="block text-primary">Food Waste</span>
                  into Premium
                  <span className="block text-success">Fertilizers</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Join the circular economy revolution. Connect food waste donors, 
                  processors, and fertilizer buyers in one sustainable marketplace.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <Button 
                    size="lg" 
                    className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover px-8 py-4"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-4"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-8">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-glow">
                <img 
                  src={heroImage} 
                  alt="Waste to Fertilizer Process" 
                  className="w-full h-[400px] lg:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating Achievement Card */}
              <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-card border">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-success rounded-full">
                    <Globe className="h-6 w-6 text-success-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Carbon Neutral</div>
                    <div className="text-sm text-muted-foreground">Zero waste mission</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our platform connects three key players in the sustainable waste-to-fertilizer ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="relative card-hover border-0 shadow-card">
                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-4 rounded-full bg-muted w-fit mb-4`}>
                    <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-eco">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Making a Real Impact</h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Together, we're creating a sustainable future through innovative waste management
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto p-4 bg-white/10 rounded-full w-fit mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card p-12 rounded-3xl shadow-card">
            <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you're a waste donor, fertilizer manufacturer, or buyer, 
              start making a positive environmental impact today.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span>Free to get started</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span>Verified partners</span>
              </div>
              <div className="flex items-center space-x-2 text-success">
                <CheckCircle className="h-5 w-5" />
                <span>24/7 support</span>
              </div>
            </div>

            <Link to="/signup">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-primary-foreground shadow-primary eco-hover px-12 py-4 text-lg"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-6 w-6" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Recycle className="h-6 w-6" />
                <span className="text-xl font-bold">Waste2Fertilizer</span>
              </div>
              <p className="text-primary-foreground/80">
                Transforming waste into opportunity for a sustainable future.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <div><Link to="/about" className="hover:text-primary-foreground">About Us</Link></div>
                <div><Link to="/help" className="hover:text-primary-foreground">Help Center</Link></div>
                <div>Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Businesses</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <div>Become a Donor</div>
                <div>Manufacturing Solutions</div>
                <div>Bulk Purchasing</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <div className="space-y-2 text-primary-foreground/80">
                <div>Sustainability Guide</div>
                <div>API Documentation</div>
                <div>Blog</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-primary-foreground/60">
            <p>&copy; 2024 Waste2Fertilizer. All rights reserved. Built with sustainability in mind.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;