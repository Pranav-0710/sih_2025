import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, IndianRupee, Search, Filter, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { useToast } from '@/hooks/use-toast';
import BetlaNationalPark from '@/assets/betla_national_park.jpg';
import BaidyanathTemple from '@/assets/baidyanath_temple.jpg';
import Weather from './Weather';

interface HeritageSite {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  latitude: number;
  longitude: number;
  historical_significance: string;
  best_time_to_visit: string;
  entry_fee: number;
  images: any;
  audio_story_url?: string;
  virtual_tour_url?: string;
}

const imageMapping: { [key: string]: string } = {
  "Betla National Park": BetlaNationalPark,
  "Baidyanath Temple": BaidyanathTemple,
};

const Heritage = () => {
  const [sites, setSites] = useState<HeritageSite[]>([]);
  const [filteredSites, setFilteredSites] = useState<HeritageSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchHeritageSites();
  }, []);

  useEffect(() => {
    filterSites();
  }, [sites, searchTerm, selectedCategory]);

  const fetchHeritageSites = async () => {
    try {
      const { data, error } = await supabase
        .from('heritage_sites')
        .select('*')
        .order('name');

      if (error) throw error;
      setSites(data || []);
    } catch (error) {
      console.error('Error fetching heritage sites:', error);
      toast({
        title: "Error",
        description: "Failed to load heritage sites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSites = () => {
    let filtered = sites;

    if (searchTerm) {
      filtered = filtered.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(site => site.category === selectedCategory);
    }

    setFilteredSites(filtered);
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      heritage: 'bg-amber-100 text-amber-800 border-amber-300',
      nature: 'bg-green-100 text-green-800 border-green-300',
      culture: 'bg-purple-100 text-purple-800 border-purple-300',
      adventure: 'bg-red-100 text-red-800 border-red-300',
      pilgrimage: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Heritage Sites of Jharkhand
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the rich cultural heritage, ancient temples, and natural wonders 
            that make Jharkhand a treasure trove of history and spirituality.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search heritage sites..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="heritage">Heritage</SelectItem>
              <SelectItem value="nature">Nature</SelectItem>
              <SelectItem value="culture">Culture</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="pilgrimage">Pilgrimage</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Heritage Sites Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSites.map((site) => (
            <Card key={site.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-subtle relative">
                {imageMapping[site.name] ? (
                  <img src={imageMapping[site.name]} alt={site.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <MapPin className="h-12 w-12 text-white" />
                  </div>
                )}
                <Badge className={`absolute top-4 left-4 ${getCategoryColor(site.category)}`}>
                  {site.category}
                </Badge>
              </div>
              
              <CardHeader>
                <CardTitle className="text-xl">{site.name}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4" />
                  {site.location}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {site.description}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="font-medium">Best time:</span>
                    <span>{site.best_time_to_visit}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-primary" />
                    <span className="font-medium">Entry fee:</span>
                    <span>{site.entry_fee === 0 ? 'Free' : `₹${site.entry_fee}`}</span>
                  </div>
                </div>
                
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm mb-2">Weather</h4>
                  <Weather lat={site.latitude} lon={site.longitude} />
                </div>

                <div className="flex gap-2">
                  <Button variant="heritage" size="sm" className="flex-1">
                    Learn More
                  </Button>
                  {/* Placeholder for AR Feature */}
                  <Button variant="outline" size="sm" onClick={() => alert('AR feature coming soon!')}>
                    Launch AR
                  </Button>
                  {/* Placeholder for VR Feature */}
                  <Button variant="outline" size="sm" onClick={() => alert('VR Tour coming soon!')}> 
                    Start VR Tour
                  </Button>
                  {site.virtual_tour_url && (
                    <Button variant="outline" size="sm">
                      Virtual Tour
                    </Button>
                  )}
                </div>
                
                {site.historical_significance && (
                  <div className="border-t pt-3">
                    <h4 className="font-semibold text-sm mb-2">Historical Significance</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3">
                      {site.historical_significance}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSites.length === 0 && !loading && (
          <div className="text-center py-12">
            <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No heritage sites found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Heritage;