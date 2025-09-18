import Navigation from "@/components/Navigation";

const ArVrExperience = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8" style={{ height: 'calc(100vh - 64px)' }}>
        <h1 className="text-3xl font-bold mb-4">AR/VR Experience</h1>
        <p className="text-muted-foreground mb-6">Explore immersive AR/VR content from Jharkhand.</p>
        <iframe
          src="http://localhost:3000"
          title="Jharkhand AR/VR Experience"
          width="100%"
          height="100%"
          frameBorder="0"
          allowFullScreen
          style={{ border: 'none' }}
        ></iframe>
      </div>
    </div>
  );
};

export default ArVrExperience;
