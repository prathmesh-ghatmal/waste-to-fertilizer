import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, TruckIcon, CheckCircle, Clock, XCircle, Search, Eye } from 'lucide-react';
import { getOrdersByBuyer, OrderStatus } from '@/lib/data';

const BuyerOrders = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Get buyer's orders
  const buyerOrders = user ? getOrdersByBuyer(user.id) : [];
  
  // Filter orders
  const filteredOrders = buyerOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.manufacturerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.products.some(p => p.productName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock className="h-4 w-4" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle className="h-4 w-4" />;
      case OrderStatus.SHIPPED:
        return <TruckIcon className="h-4 w-4" />;
      case OrderStatus.DELIVERED:
        return <Package className="h-4 w-4" />;
      case OrderStatus.CANCELLED:
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "outline";
      case OrderStatus.CONFIRMED:
        return "default";
      case OrderStatus.SHIPPED:
        return "secondary";
      case OrderStatus.DELIVERED:
        return "default";
      case OrderStatus.CANCELLED:
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order History</h1>
          <p className="text-muted-foreground mt-2">Track your fertilizer orders and delivery status</p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" />
              Search & Filter Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                  <SelectItem value={OrderStatus.CONFIRMED}>Confirmed</SelectItem>
                  <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                  <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                  <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="text-sm text-muted-foreground flex items-center">
                {filteredOrders.length} orders found
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-4">
                {buyerOrders.length === 0 
                  ? "You haven't placed any orders yet"
                  : "Try adjusting your search terms or filters"
                }
              </p>
              {buyerOrders.length === 0 && (
                <Button asChild>
                  <a href="/buyer/marketplace">Browse Marketplace</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {order.createdAt.toLocaleDateString()} • {order.manufacturerName}
                      </p>
                    </div>
                    <Badge variant={getStatusColor(order.status)} className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Order Products */}
                  <div className="space-y-3 mb-4">
                    {order.products.map((product, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{product.productName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {product.quantity}kg × ${product.pricePerKg}/kg
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${product.totalPrice.toFixed(2)}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">Shipping Address</h4>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Order Details</h4>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Amount:</span>
                          <span className="font-semibold text-primary">${order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment:</span>
                          <span>{order.paymentMethod}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Tracking:</span>
                            <span className="font-mono text-xs">{order.trackingNumber}</span>
                          </div>
                        )}
                        {order.estimatedDelivery && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Est. Delivery:</span>
                            <span>{order.estimatedDelivery.toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {order.notes && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground italic">{order.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    {order.status === OrderStatus.SHIPPED && order.trackingNumber && (
                      <Button variant="outline" size="sm">
                        <TruckIcon className="h-4 w-4 mr-2" />
                        Track Package
                      </Button>
                    )}
                    {order.status === OrderStatus.DELIVERED && (
                      <Button variant="outline" size="sm">
                        Reorder
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerOrders;