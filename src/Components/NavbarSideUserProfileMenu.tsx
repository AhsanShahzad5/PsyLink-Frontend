import { useState } from 'react';
import { CreditCard, LogOut, Settings, User, FileText } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface ProfileMenuProps {
  userName?: string;
  isOnline?: boolean;
  profileImage?: string;
}

export default function Component({
  userName = "Ahsan Shahzad",
  isOnline = true,
  profileImage = "/src/assets/patient/homepage/Vector.png"
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);

  const menuItems = [
    { label: 'Account Setting', icon: User, onClick: () => console.log('Account clicked') },
    { label: 'Card Management', icon: CreditCard, onClick: () => console.log('Card clicked') },
    { label: 'My Posts', icon: FileText, onClick: () => console.log('Posts clicked') },
    { label: 'Settings', icon: Settings, onClick: () => console.log('Settings clicked') },
    { label: 'Logout', icon: LogOut, onClick: () => console.log('Logout clicked') },
  ];

  const handleMenuClick = (itemLabel: string, onClick: () => void) => {
    setSelectedMenuItem(itemLabel);
    onClick();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <div className="relative hidden md:block cursor-pointer">
          <img
            src={profileImage}
            alt="User profile"
            className="h-11 w-11 rounded-full object-contain border-2 border-primary p-1"
          />
          <div
            className={`absolute top-0 right-0 h-3 w-3 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            } border-2 border-white`}
          />
        </div>
      </SheetTrigger>
      <SheetContent className="w-[300px] sm:w-[350px] border-l-4 border-primary">
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-teal-500 p-2 w-12 h-12 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <SheetTitle className="text-2xl font-normal">{userName}</SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex flex-col gap-0.5 mt-2">
          {menuItems.map((item, index) => (
            <div key={item.label}>
              <Button
                variant="ghost"
                className={`w-full justify-start gap-2 px-2 py-6 text-lg transition-all duration-200 ${
                  selectedMenuItem === item.label
                    ? "bg-primary text-white" // Active state: darker green
                    : "hover:bg-secondary" // Hover state: lighter green
                }`}
                onClick={() => handleMenuClick(item.label, item.onClick)}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
              {index < menuItems.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}