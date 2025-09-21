// src/pages/heritage.tsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Play, StopCircle } from "lucide-react";

const spots = [
  {
    name: "Baidhyanath Temple",
    top: "45%",
    left: "60%",
    img: "/images/spots/baidyanath.jpg",
    desc: "One of the 12 Jyotirlingas, an important pilgrimage site in Deoghar.",
    wiki: "https://en.wikipedia.org/wiki/Baidyanath_Temple",
    category: "Temple",
  },
  {
    name: "Netarhat",
    top: "30%",
    left: "40%",
    img: "/images/spots/netarhat.jpg",
    desc: "Known as the Queen of Chotanagpur, famous for sunrise and sunset views.",
    wiki: "https://en.wikipedia.org/wiki/Netarhat",
    category: "Nature",
  },
  {
    name: "Parasnath Hills",
    top: "20%",
    left: "55%",
    img: "/images/spots/parasnath.jpg",
    desc: "Highest peak in Jharkhand, a major Jain pilgrimage site.",
    wiki: "https://en.wikipedia.org/wiki/Parasnath",
    category: "Nature",
  },
  {
    name: "Hazaribagh National Park",
    top: "25%",
    left: "50%",
    img: "/images/spots/hazaribagh.jpg",
    desc: "Wildlife sanctuary known for tigers, leopards, and rich flora.",
    wiki: "https://en.wikipedia.org/wiki/Hazaribagh_National_Park",
    category: "Park",
  },
  {
    name: "Betla National Park",
    top: "70%",
    left: "40%",
    img: "/images/spots/betla.jpg",
    desc: "Part of the Palamau Tiger Reserve, rich in wildlife and history.",
    wiki: "https://en.wikipedia.org/wiki/Betla_National_Park",
    category: "Park",
  },
  {
    name: "Jagannath Temple, Ranchi",
    top: "55%",
    left: "45%",
    img: "/images/spots/jagannath.jpg",
    desc: "A 17th-century temple resembling Puri's Jagannath Temple.",
    wiki: "https://en.wikipedia.org/wiki/Jagannath_Temple,_Ranchi",
    category: "Temple",
  },
  {
    name: "Hundru Falls",
    top: "60%",
    left: "50%",
    img: "/images/spots/hundru.jpg",
    desc: "A spectacular 98m waterfall on the Subarnarekha River.",
    wiki: "https://en.wikipedia.org/wiki/Hundru_Falls",
    category: "Waterfall",
  },
  {
    name: "Dassam Falls",
    top: "58%",
    left: "52%",
    img: "/images/spots/dassam.jpg",
    desc: "A beautiful waterfall near Ranchi, popular picnic spot.",
    wiki: "https://en.wikipedia.org/wiki/Dassam_Falls",
    category: "Waterfall",
  },
  {
    name: "Jonha Falls",
    top: "62%",
    left: "53%",
    img: "/images/spots/jonha.jpg",
    desc: "Also known as Gautamdhara, falls named after Lord Buddha.",
    wiki: "https://en.wikipedia.org/wiki/Jonha_Falls",
    category: "Waterfall",
  },
  {
    name: "Shikharji",
    top: "22%",
    left: "58%",
    img: "/images/spots/shikharji.jpg",
    desc: "Most important Jain pilgrimage site, located on Parasnath Hill.",
    wiki: "https://en.wikipedia.org/wiki/Shikharji",
    category: "Temple",
  },
];

const categories = ["All", "Temple", "Nature", "Park", "Waterfall"];

const Heritage: React.FC = () => {
  const [selectedSpot, setSelectedSpot] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isTourRunning, setIsTourRunning] = useState(false);
  const tourIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const mapWrapperRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-1, 1], [20, -20]);
  const rotateY = useTransform(x, [-1, 1], [-20, 20]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!mapWrapperRef.current) return;

    const rect = mapWrapperRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const startTour = () => {
    setIsTourRunning(true);
    setSelectedSpot(0);
    let currentSpot = 1;
    tourIntervalRef.current = setInterval(() => {
      setSelectedSpot(currentSpot);
      currentSpot = (currentSpot + 1) % spots.length;
    }, 3000);
  };

  const stopTour = () => {
    setIsTourRunning(false);
    if (tourIntervalRef.current) {
      clearInterval(tourIntervalRef.current);
    }
    setSelectedSpot(null);
  };

  useEffect(() => {
    return () => {
      if (tourIntervalRef.current) {
        clearInterval(tourIntervalRef.current);
      }
    };
  }, []);

  const filteredSpots = useMemo(() => {
    return spots.filter((spot) => {
      const matchesCategory =
        activeCategory === "All" || spot.category === activeCategory;
      const matchesSearch = spot.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url(/images/map.png)", perspective: "1000px" }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className="relative z-10 flex flex-col items-center w-full h-full min-h-screen p-4">
        <div className="w-full max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-extrabold text-white mt-8 mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Explore the Heritage of Jharkhand
            </h1>
            <p className="text-lg text-white mb-8">
                Discover the rich culture and natural beauty of Jharkhand.
            </p>
        </div>

        <div className="w-full max-w-4xl mx-auto bg-white/20 backdrop-blur-sm p-4 rounded-lg shadow-lg mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <Input
                    type="text"
                    placeholder="Search for a location..."
                    className="w-full md:w-1/3 bg-white/80"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={isTourRunning}
                />
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`${ activeCategory === category ? "bg-blue-600 text-white" : "bg-white/80 text-black" } hover:bg-blue-500 hover:text-white`}
                            disabled={isTourRunning}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
                <div className="flex-grow" />
                {!isTourRunning ? (
                    <Button onClick={startTour} className="bg-green-500 hover:bg-green-600 text-white">
                        <Play className="mr-2" size={16}/>
                        Start Guided Tour
                    </Button>
                ) : (
                    <Button onClick={stopTour} className="bg-red-500 hover:bg-red-600 text-white">
                        <StopCircle className="mr-2" size={16}/>
                        Stop Tour
                    </Button>
                )}
            </div>
        </div>

        <motion.div
          ref={mapWrapperRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full max-w-4xl" 
        >
          <div style={{ aspectRatio: '1088 / 960', transform: "translateZ(0)" }}>
            {/* Markers */}
            {filteredSpots.map((spot, index) => {
              const originalIndex = spots.findIndex(s => s.name === spot.name);
              return (
              <div
                key={originalIndex}
                className="absolute"
                style={{ top: spot.top, left: spot.left, transform: "translateZ(20px)" }}
                onClick={() => setSelectedSpot(originalIndex)}
              >
                <motion.div
                  className="w-5 h-5 bg-pink-500 rounded-full shadow-lg cursor-pointer border-2 border-white animate-pulse"
                  whileHover={{ scale: 1.3 }}
                />
              </div>
            )})}

            {/* Card */}
            {selectedSpot !== null && (
              <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute z-50 w-72"
                  style={{
                      top: `calc(${spots[selectedSpot].top} - 10rem)`,
                      left: `calc(${spots[selectedSpot].left} + 2rem)`,
                      transform: "translateZ(50px)"
                  }}
              >
                <Card className="shadow-xl border-2 border-blue-500 relative">
                  <Button
                      onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSpot(null);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white p-0"
                  >
                      <X size={16} />
                  </Button>
                  <CardContent className="p-2">
                    <img
                      src={spots[selectedSpot].img}
                      alt={spots[selectedSpot].name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mt-2">{spots[selectedSpot].name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{spots[selectedSpot].desc}</p>
                    <Button
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                      onClick={() => window.open(spots[selectedSpot].wiki, "_blank")}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Heritage;