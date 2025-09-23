import { useIsMobile } from "@/hooks/use-mobile";
// Update the import path if your hook is actually at src/hooks/useAuth.ts
import { useAuth } from "@/hooks/useAuth";
import { MapPin, LogOut, CaseSensitive, Menu } from "lucide-react";
import { useFontSize } from "./FontSizeProvider";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import { Link, NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

export function Navigation() {
  const isMobile = useIsMobile();
  const { user, signOut, role } = useAuth();
  const { toggleLargeFont, isLargeFont } = useFontSize();
  const navigate = useNavigate();

  const navItems = [
    { name: "Heritage", path: "/heritage" },
    { name: "Community", path: "/community" },
    { name: "TripGenie", path: "/trip-genie" },
    { name: "VR Experience", path: "/vr-experience" },
    { name: "Emergency", path: "/emergency" },
    { name: "Weather", path: "/weather" },
    { name: "Bookings", path: "/bookings" },
    ...(user
      ? [
          { name: "Sentiment Analysis", path: "/sentiment-analysis" },
          { name: "Transport", path: "/transport" },
        ]
      : []),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <div className="bg-gradient-hero p-2 rounded-lg shadow-soft">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="hidden font-bold sm:inline-block">Smart Tourism</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-gradient-hero p-2 rounded-lg shadow-soft">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold">Smart Tourism</span>
              </Link>
              <nav className="grid gap-2 text-lg font-medium mt-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) =>
                      `mx-[-0.65rem] flex items-center rounded-lg px-3 py-2 hover:text-foreground/80 ${
                        isActive ? "text-foreground" : "text-foreground/60"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                {role === 'admin' && (
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `mx-[-0.65rem] flex items-center rounded-lg px-3 py-2 hover:text-foreground/80 ${
                        isActive ? "text-foreground" : "text-foreground/60"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                )}
                <div className="border-t border-border pt-4 pb-3 mt-4">
                  <div className="flex items-center justify-between px-3">
                    <span className="text-sm text-muted-foreground">Theme</span>
                    <ModeToggle />
                  </div>
                  <div className="flex items-center justify-between px-3 mt-2">
                    <span className="text-sm text-muted-foreground">Accessibility</span>
                    <Button variant="ghost" size="icon" onClick={toggleLargeFont} aria-label="Toggle font size">
                      <CaseSensitive className={`h-5 w-5 ${isLargeFont ? 'text-primary' : 'text-muted-foreground'}`} />
                    </Button>
                  </div>
                  <div className="flex flex-col space-y-2 mt-4">
                    {user ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground px-3">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <Button
                          variant="ghost"
                          onClick={signOut}
                          className="w-full justify-start"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="default"
                        onClick={() => navigate('/auth')}
                        className="w-full"
                      >
                        Get Started
                      </Button>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex flex-1 items-center justify-between space-x-6 text-sm font-medium">
            <div className="flex items-center space-x-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`
                }
              >
                Home
              </NavLink>
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `transition-colors hover:text-foreground/80 ${
                      isActive ? "text-foreground" : "text-foreground/60"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              {/* Conditional rendering based on user authentication state from useAuth hook */}
              {role === 'admin' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `transition-colors hover:text-foreground/80 ${
                      isActive ? "text-foreground" : "text-foreground/60"
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleLargeFont} aria-label="Toggle font size">
                <CaseSensitive className={`h-5 w-5 ${isLargeFont ? 'text-primary' : 'text-muted-foreground'}`} />
              </Button>
              <ModeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-base font-medium text-foreground/60 hover:text-foreground/80 border border-gray-200 rounded-md px-3 py-2"
                    >
                      {user.user_metadata?.full_name || user.email}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>Profile</DropdownMenuItem>
                    <DropdownMenuItem onClick={signOut}>Sign Out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="default"
                  onClick={() => navigate('/auth')}
                  className="font-medium px-4 py-2 rounded-md"
                >
                  Get Started
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

export default Navigation;