import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, Package } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  manufacturerName: string;
  pricePerKg: number;
  quantity: number;
  maxStock: number;
  isOrganic: boolean;
}

const BuyerCart = () => {
  // Mock cart items - in a real app, this would come from context or API
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'fertilizer-1',
      name: 'Premium Organic Compost',
      manufacturerName: 'EcoProcess Solutions',
      pricePerKg: 2.50,
      quantity: 50,
      maxStock: 500,
      isOrganic: true
    },
    {
      id: 'fertilizer-2',
      name: 'Liquid Plant Booster',
      manufacturerName: 'EcoProcess Solutions',
      pricePerKg: 8.99,
      quantity: 10,
      maxStock: 200,
      isOrganic: true
    }
  ]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(0, Math.min(newQuantity, item.maxStock)) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerKg * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    alert('Proceeding to checkout...');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Review your selected fertilizers before checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
              <p className="text-muted-foreground mb-4">Browse our marketplace to find premium fertilizers</p>
              <Button asChild>
                <a href="/buyer/marketplace">Browse Marketplace</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Cart Items ({cartItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg bg-card">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold text-card-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.manufacturerName}</p>
                          </div>
                          <Badge variant={item.isOrganic ? "default" : "secondary"}>
                            {item.isOrganic ? "Organic" : "Conventional"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                              className="w-20 text-center"
                              min="1"
                              max={item.maxStock}
                            />
                            
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.maxStock}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            
                            <span className="text-sm text-muted-foreground">
                              kg (Max: {item.maxStock}kg)
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">${item.pricePerKg}/kg</div>
                              <div className="font-semibold text-primary">
                                ${(item.pricePerKg * item.quantity).toFixed(2)}
                              </div>
                            </div>
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeItem(item.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (8%):</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    {shipping === 0 && (
                      <p className="text-xs text-success">Free shipping on orders over $100!</p>
                    )}
                    <hr />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total:</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleCheckout}
                    disabled={cartItems.length === 0}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Proceed to Checkout
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    Secure checkout powered by Stripe
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Shipping Information</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground space-y-1">
                  <p>• Free shipping on orders over $100</p>
                  <p>• Standard delivery: 5-7 business days</p>
                  <p>• Express delivery available at checkout</p>
                  <p>• Bulk orders may require special handling</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerCart;