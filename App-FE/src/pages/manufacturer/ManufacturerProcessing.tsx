import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { getProcessingRecordsByManufacturer, getWasteListingsByDonor, mockWasteListings } from '@/lib/data';
import { Activity, Thermometer, Droplets, Leaf, Clock, CheckCircle } from 'lucide-react';

const ManufacturerProcessing = () => {
  const { user } = useAuth();
  const processingRecords = user ? getProcessingRecordsByManufacturer(user.id) : [];
  
  // Get waste listings that are being processed
  const processingWaste = mockWasteListings.filter(waste => 
    waste.manufacturerId === user?.id && 
    ['collected', 'in_process'].includes(waste.status)
  );

  const getStageProgress = (stage: string) => {
    if (stage.includes('Day 1') || stage.includes('Collection')) return 10;
    if (stage.includes('Day 2') || stage.includes('Sorting')) return 25;
    if (stage.includes('Day 3') || stage.includes('Composting')) return 45;
    if (stage.includes('Day 4-7') || stage.includes('Processing')) return 65;
    if (stage.includes('Day 8-14') || stage.includes('Curing')) return 85;
    if (stage.includes('Complete') || stage.includes('Ready')) return 100;
    return 30;
  };

  const getStageColor = (stage: string) => {
    const progress = getStageProgress(stage);
    if (progress >= 100) return 'bg-success';
    if (progress >= 65) return 'bg-warning';
    if (progress >= 25) return 'bg-primary';
    return 'bg-muted';
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Processing Tracker</h1>
            <p className="text-muted-foreground mt-2">Monitor your waste-to-fertilizer conversion pipeline</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Activity className="w-4 h-4 mr-2" />
            View All Processes
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed Batches</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {processingRecords.map((record) => {
                const progress = getStageProgress(record.currentStage);
                return (
                  <Card key={record.id} className="bg-card border-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground">Batch #{record.id.slice(-6)}</CardTitle>
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          {record.currentStage}
                        </Badge>
                      </div>
                      <CardDescription>
                        Started {record.processStartDate.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-foreground font-medium">{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                      
                      {record.qualityMetrics && (
                        <div className="grid grid-cols-3 gap-4 pt-2">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Thermometer className="w-4 h-4 text-orange-500" />
                            </div>
                            <div className="text-xs text-muted-foreground">pH Level</div>
                            <div className="text-sm font-medium text-foreground">{record.qualityMetrics.ph}</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Droplets className="w-4 h-4 text-blue-500" />
                            </div>
                            <div className="text-xs text-muted-foreground">Moisture</div>
                            <div className="text-sm font-medium text-foreground">{record.qualityMetrics.moisture}%</div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-1">
                              <Leaf className="w-4 h-4 text-green-500" />
                            </div>
                            <div className="text-xs text-muted-foreground">Organic</div>
                            <div className="text-sm font-medium text-foreground">{record.qualityMetrics.organicMatter}%</div>
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-2 border-t border-border">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Expected Yield</span>
                          <span className="text-foreground font-medium">{record.expectedYield} kg</span>
                        </div>
                      </div>
                      
                      <Button variant="outline" size="sm" className="w-full">
                        <Clock className="w-4 h-4 mr-2" />
                        Update Progress
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            {processingRecords.length === 0 && (
              <Card className="bg-card border-border">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Activity className="w-12 h-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Active Processing</h3>
                  <p className="text-muted-foreground text-center">
                    Start collecting waste to begin your processing pipeline
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Completed Batches</CardTitle>
                <CardDescription>
                  View your successfully processed fertilizer batches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle className="w-12 h-12 text-success mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Completed Batches Yet</h3>
                  <p className="text-muted-foreground text-center">
                    Completed processing batches will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Processed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">1,250 kg</div>
                  <p className="text-xs text-success">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">85%</div>
                  <p className="text-xs text-success">+3% from last month</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Process Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">14 days</div>
                  <p className="text-xs text-muted-foreground">Standard cycle</p>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">9.2/10</div>
                  <p className="text-xs text-success">Excellent quality</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManufacturerProcessing;