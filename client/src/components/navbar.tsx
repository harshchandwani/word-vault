import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { Plus, User, LogOut } from "lucide-react";
import { useLocation } from "wouter";

interface NavbarProps {
  onAddEntry: () => void;
}

export function Navbar({ onAddEntry }: NavbarProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-card-border z-50">
      <div className="h-full max-w-4xl mx-auto px-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-medium text-foreground" data-testid="text-app-title">Word Archive</h1>
        
        <div className="flex items-center gap-4">
          <Button
            data-testid="button-add-entry"
            onClick={onAddEntry}
            size="default"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
          
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="button-user-menu"
                variant="outline"
                size="icon"
              >
                <User className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem disabled className="text-sm font-medium" data-testid="text-username">
                {user?.username}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="button-logout"
                onClick={handleLogout}
                className="text-sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
