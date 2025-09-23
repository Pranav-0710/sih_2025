import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

// --- LEAFLET ICON FIX ---
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const Transport = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const routeLayersRef = useRef({});
  const animationFrameRef = useRef(null);
  const visibleRouteLayer = useRef(null);

  const [filters, setFilters] = useState({ Bus: true, Train: true, Cab: true, 'Auto-rickshaw': true });
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const routes = {
        "BUS_1": { type: 'Bus', points: [[23.35, 85.32], [23.42, 85.34], [23.45, 85.40], [23.42, 85.45], [23.35, 85.48]] },
        "BUS_2": { type: 'Bus', points: [[23.30, 85.25], [23.35, 85.28], [23.38, 85.35], [23.35, 85.40], [23.28, 85.38]] },
        "TRAIN_1": { type: 'Train', points: [[23.25, 85.20], [23.3642, 85.3345], [23.45, 85.48], [23.50, 85.55]] },
    };

    const generateVehicles = () => {
        const vehicles = [];
        const counts = { bus: 15, train: 2, cab: 8, auto: 8 };
        const WIDER_BOUNDS = { minLat: 23.20, maxLat: 23.55, minLon: 85.18, maxLon: 85.58 };
        const BUS_COLORS = ['#3b82f6', '#16a34a', '#f97316', '#9333ea'];
        const TRAIN_COLORS = ['#ef4444', '#d946ef'];
        const CAB_COLORS = ['#facc15', '#eab308'];
        const AUTO_COLORS = ['#4ade80', '#22c55e'];

        const busRouteIds = Object.keys(routes).filter(id => id.startsWith('BUS'));
        for (let i = 0; i < counts.bus; i++) {
            const routeId = busRouteIds[i % busRouteIds.length];
            vehicles.push({ id: `bus_${i}`, type: 'Bus', routeId, name: `Bus ${i+1}`, color: BUS_COLORS[i % BUS_COLORS.length], segment: Math.floor(Math.random() * (routes[routeId].points.length - 1)), progress: Math.random(), speed: 0.000005 + (Math.random() * 0.000004) });
        }
        const trainRouteIds = Object.keys(routes).filter(id => id.startsWith('TRAIN'));
        for (let i = 0; i < counts.train; i++) {
            const routeId = trainRouteIds[i % trainRouteIds.length];
            vehicles.push({ id: `train_${i}`, type: 'Train', routeId, name: `Train ${i+1}`, color: TRAIN_COLORS[i % TRAIN_COLORS.length], segment: Math.floor(Math.random() * (routes[routeId].points.length - 1)), progress: Math.random(), speed: 0.000015 + (Math.random() * 0.00001) });
        }
        for (let i = 0; i < counts.cab; i++) {
            vehicles.push({ id: `cab_${i}`, type: 'Cab', lat: WIDER_BOUNDS.minLat + Math.random() * (WIDER_BOUNDS.maxLat - WIDER_BOUNDS.minLat), lon: WIDER_BOUNDS.minLon + Math.random() * (WIDER_BOUNDS.maxLon - WIDER_BOUNDS.minLon), name: `Cab #${i + 1}`, color: CAB_COLORS[i % CAB_COLORS.length] });
        }
        for (let i = 0; i < counts.auto; i++) {
            vehicles.push({ id: `auto_${i}`, type: 'Auto-rickshaw', lat: WIDER_BOUNDS.minLat + Math.random() * (WIDER_BOUNDS.maxLat - WIDER_BOUNDS.minLat), lon: WIDER_BOUNDS.minLon + Math.random() * (WIDER_BOUNDS.maxLon - WIDER_BOUNDS.minLon), name: `Auto #${i + 1}`, color: AUTO_COLORS[i % AUTO_COLORS.length] });
        }
        return vehicles;
    };

    const generatedTransports = generateVehicles();

    const getIcon = (type, color, size = 28) => {
        const iconHtml = (type, c) => {
            const templates = {
                Bus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${c}"><path d="M18 2H6C4.9 2 4 2.9 4 4V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V4C20 2.9 19.1 2 18 2ZM12 4C13.1 4 14 4.9 14 6S13.1 8 12 8 10 7.1 10 6 10.9 4 12 4ZM18 16H6V14H18V16ZM18 12H6V10H18V12Z"/></svg>`,
                Train: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${c}"><path d="M12 2C8.69 2 6 2.5 6 4V15H4V17H6V19H8V17H16V19H18V17H20V15H18V4C18 2.5 15.31 2 12 2ZM12 4C14.21 4 16 4.9 16 6H8C8 4.9 9.79 4 12 4Z"/></svg>`,
                Cab: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${c}"><path d="M20.5 6H3.5C2.67 6 2 6.67 2 7.5V17.5C2 18.33 2.67 19 3.5 19H20.5C21.33 19 22 18.33 22 17.5V7.5C22 6.67 21.33 6 20.5 6ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16Z"/></svg>`,
                'Auto-rickshaw': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${c}"><path d="M20 10H4V17H6V15H18V17H20V10ZM16 13H8V11H16V13Z M19.41 4.59L18 6.01V4H16V6.01L14.59 4.59L13.17 6L15.59 8.41L17 7V9H19V7L20.41 8.41L21.83 7L19.41 4.59Z"/></svg>`,
            };
            return templates[type];
        }
        return L.divIcon({ html: iconHtml(type, color), className: 'bg-transparent transition-transform duration-100 ease-in-out', iconSize: [size, size], iconAnchor: [size/2, size/2], popupAnchor: [0, -size/2] });
    };

    const showRoute = (routeId) => {
        // Hide the previously visible route
        if (visibleRouteLayer.current && mapRef.current.hasLayer(visibleRouteLayer.current)) {
            mapRef.current.removeLayer(visibleRouteLayer.current);
        }

        // Show the new route
        if (routeId && routeLayersRef.current[routeId]) {
            const newLayer = routeLayersRef.current[routeId];
            newLayer.addTo(mapRef.current).bringToFront();
            visibleRouteLayer.current = newLayer;
        }
    };

    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, { zoomControl: false }).setView([23.4, 85.4], 10);
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap' }).addTo(mapRef.current);

      // Create route layers but do not add them to the map
      Object.entries(routes).forEach(([id, routeData]) => {
        const isTrain = routeData.type === 'Train';
        const style = isTrain ? { color: '#ef4444', weight: 7, opacity: 1 } : { color: '#e11d48', weight: 7, opacity: 1 };
        routeLayersRef.current[id] = L.polyline(routeData.points, style);
      });

      generatedTransports.forEach(t => {
        const latlng = (t.type === 'Bus' || t.type === 'Train') ? routes[t.routeId].points[t.segment] : [t.lat, t.lon];
        const marker = L.marker(latlng, { icon: getIcon(t.type, t.color) });
        
        marker.on('click', () => {
            setSelectedVehicle(t);
            showRoute(t.routeId);
            mapRef.current.flyTo(marker.getLatLng(), 14);
        });
        marker.on('mouseover', () => marker.setIcon(getIcon(t.type, t.color, 40)));
        marker.on('mouseout', () => marker.setIcon(getIcon(t.type, t.color, 28)));

        markersRef.current[t.id] = { marker, data: t };
        if (filters[t.type]) marker.addTo(mapRef.current);
      });

      const animate = () => {
        Object.values(markersRef.current).forEach(({ marker, data }) => {
          if (data.type === 'Bus' || data.type === 'Train') {
            data.progress += data.speed;
            if (data.progress >= 1) {
              data.progress = 0;
              data.segment = (data.segment + 1) % (routes[data.routeId].points.length - 1);
            }
            const startPoint = routes[data.routeId].points[data.segment];
            const endPoint = routes[data.routeId].points[data.segment + 1];
            const newLatLng = [startPoint[0] + (endPoint[0] - startPoint[0]) * data.progress, startPoint[1] + (endPoint[1] - startPoint[1]) * data.progress];
            marker.setLatLng(newLatLng);

            if (isFollowing && selectedVehicle?.id === data.id) {
              mapRef.current.panTo(newLatLng);
            }
          }
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animate();
    }
    return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
  }, [isFollowing, selectedVehicle]);

  useEffect(() => {
    Object.values(markersRef.current).forEach(({ marker, data }) => {
      const shouldShow = filters[data.type];
      const isVisible = mapRef.current?.hasLayer(marker);
      if (shouldShow && !isVisible) marker.addTo(mapRef.current);
      else if (!shouldShow && isVisible) mapRef.current.removeLayer(marker);
    });
  }, [filters]);

  const handleClosePanel = () => {
    setSelectedVehicle(null);
    setIsFollowing(false);
    showRoute(null); // Hide the route
  }

  return (
    <div ref={mapContainerRef} className="h-[calc(100vh-4rem)] w-full relative">
      {/* Info Panel */}
      {selectedVehicle && (
        <div className="absolute top-4 left-4 z-[1000] bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border w-72">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold">{selectedVehicle.name}</h3>
                <Button variant="ghost" size="icon" onClick={handleClosePanel}><X className="h-4 w-4"/></Button>
            </div>
            <div className="space-y-2 text-sm">
                <p><span className="font-semibold">Type:</span> {selectedVehicle.type}</p>
                {selectedVehicle.speed && <p><span className="font-semibold">Speed:</span> {(selectedVehicle.speed * 100000).toFixed(1)} km/h</p>}
                {selectedVehicle.routeId && <p><span className="font-semibold">Route:</span> {selectedVehicle.routeId}</p>}
            </div>
            <Button className="w-full mt-4" onClick={() => setIsFollowing(!isFollowing)} variant={isFollowing ? 'destructive' : 'default'}>
                {isFollowing ? 'Stop Following' : 'Follow Vehicle'}
            </Button>
        </div>
      )}

      {/* Filter Panel */}
      <div className="absolute top-4 right-4 z-[1000] bg-background/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border w-60">
        <h3 className="text-lg font-semibold mb-3">Live Transport</h3>
        <div className="space-y-3">
          {['Bus', 'Train', 'Cab', 'Auto-rickshaw'].map(type => (
            <div key={type} className="flex items-center space-x-3">
              <Checkbox id={`filter-${type}`} checked={filters[type]} onCheckedChange={(c) => setFilters(f => ({...f, [type]: c}))} />
              <Label htmlFor={`filter-${type}`} className="text-sm font-medium leading-none">{type}s</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Transport;