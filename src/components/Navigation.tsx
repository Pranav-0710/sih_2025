import { Button } from "@/components/ui/button";
import { MapPin, Menu, X, LogOut, Brain } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 hover:opacity-80 transition-smooth"
          >
            <div className="bg-gradient-hero p-2 rounded-lg shadow-soft">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Smart Tourism</h1>
              <p className="text-xs text-muted-foreground">Jharkhand</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => navigate('/')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Home
            </button>
            <button 
              onClick={() => navigate('/heritage')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Heritage
            </button>
            <button 
              onClick={() => navigate('/trip-genie')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Trip Genie
            </button>
            <button 
              onClick={() => navigate('/community')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Community
            </button>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Bookings
            </button>
            <button 
              onClick={() => navigate('/emergency')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Emergency
            </button>
            <button 
              onClick={() => navigate('/sentiment-analysis')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Sentiment Analysis
            </button>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/ar-vr-experience')}
              className="text-foreground hover:text-primary transition-smooth"
            >
              AR/VR Experience
            </button>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.user_metadata?.full_name || user.email}
                </span>
                <Button variant="ghost" onClick={signOut} size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>Sign In</Button>
                <Button variant="heritage" onClick={() => navigate('/auth')}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => {
                  navigate('/');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Home
              </button>
              <button
                onClick={() => {
                  navigate('/heritage');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Heritage
              </button>
              <button
                onClick={() => {
                  navigate('/trip-genie');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Trip Genie
              </button>
              <button
                onClick={() => {
                  navigate('/community');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Community
              </button>
              <button
                onClick={() => {
                  navigate('/bookings');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Bookings
              </button>
              <button
                onClick={() => {
                  navigate('/emergency');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Emergency
              </button>
              <button
                onClick={() => {
                  navigate('/sentiment-analysis');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Sentiment Analysis
              </button>
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate('/ar-vr-experience');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-smooth"
              >
                AR/VR Experience
              </button>
              <div className="border-t border-border pt-4 pb-3">
                <div className="flex flex-col space-y-2">
                  {user ? (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground px-3">
                        {user.user_metadata?.full_name || user.email}
                      </p>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          signOut();
                          setIsMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="heritage" 
                        onClick={() => {
                          navigate('/auth');
                          setIsMenuOpen(false);
                        }}
                      >
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;