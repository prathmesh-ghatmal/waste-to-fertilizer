import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ShoppingCart, Filter, Search } from 'lucide-react';
import { mockFertilizerProducts, FertilizerType, FertilizerProduct } from '@/lib/data';

const BuyerMarketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  
  // Filter and sort fertilizers
  const filteredFertilizers = mockFertilizerProducts
    .filter(fertilizer => {
      const matchesSearch = fertilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fertilizer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || fertilizer.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.pricePerKg - b.pricePerKg;
        case 'price-high':
          return b.pricePerKg - a.pricePerKg;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const addToCart = (fertilizer: FertilizerProduct) => {
    // In a real app, this would add to a cart context or make an API call
    alert(`Added ${fertilizer.name} to cart!`);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Fertilizer Marketplace</h1>
          <p className="text-muted-foreground mt-2">Discover premium organic and conventional fertilizers from trusted manufacturers</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search fertilizers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value={FertilizerType.ORGANIC_COMPOST}>Organic Compost</SelectItem>
                  <SelectItem value={FertilizerType.LIQUID_FERTILIZER}>Liquid Fertilizer</SelectItem>
                  <SelectItem value={FertilizerType.GRANULAR}>Granular</SelectItem>
                  <SelectItem value={FertilizerType.SPECIALIZED}>Specialized</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="price-low">Price (Low to High)</SelectItem>
                  <SelectItem value="price-high">Price (High to Low)</SelectItem>
                  <SelectItem value="rating">Rating (High to Low)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground flex items-center">
                {filteredFertilizers.length} products found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFertilizers.map((fertilizer) => (
            <Card key={fertilizer.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{fertilizer.name}</CardTitle>
                  <Badge variant={fertilizer.isOrganic ? "default" : "secondary"}>
                    {fertilizer.isOrganic ? "Organic" : "Conventional"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{fertilizer.manufacturerName}</p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{fertilizer.description}</p>
                
                {/* Nutrient Content */}
                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  <h4 className="text-sm font-semibold mb-2">Nutrient Content</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">N:</span> {fertilizer.nutrientContent.nitrogen}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">P:</span> {fertilizer.nutrientContent.phosphorus}%
                    </div>
                    <div>
                      <span className="text-muted-foreground">K:</span> {fertilizer.nutrientContent.potassium}%
                    </div>
                  </div>
                  {fertilizer.nutrientContent.organic_matter && (
                    <div className="text-xs mt-1">
                      <span className="text-muted-foreground">Organic Matter:</span> {fertilizer.nutrientContent.organic_matter}%
                    </div>
                  )}
                </div>

                {/* Price and Rating */}
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-2xl font-bold text-primary">${fertilizer.pricePerKg}</span>
                    <span className="text-sm text-muted-foreground">/kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{fertilizer.rating}</span>
                    <span className="text-xs text-muted-foreground">({fertilizer.reviewCount})</span>
                  </div>
                </div>

                {/* Stock and Certifications */}
                <div className="space-y-2 mb-4">
                  <div className="text-sm">
                    <span className="text-muted-foreground">Stock:</span> {fertilizer.quantity}kg available
                  </div>
                  {fertilizer.certifications.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {fertilizer.certifications.slice(0, 2).map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {fertilizer.certifications.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{fertilizer.certifications.length - 2} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={() => addToCart(fertilizer)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="sm">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredFertilizers.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No fertilizers found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BuyerMarketplace;