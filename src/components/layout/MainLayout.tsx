
import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { useToast } from "@/components/ui/use-toast";
import { Menu, X } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  const { toast } = useToast();

  // Handle responsive sidebar display
  useEffect(() => {
    // Set initial sidebar state based on screen size
    setSidebarOpen(!isMobileView);
    
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileView(mobile);
      
      // Auto-open sidebar on desktop view
      if (!mobile) {
        setSidebarOpen(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isMobileView && sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
      )}
      
      {/* Sidebar - responsive positioning */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} ${isMobileView ? 'fixed inset-y-0 left-0 z-50' : 'relative'} lg:block flex-shrink-0`}>
        <div className={`flex flex-col h-full ${isMobileView ? 'w-64' : 'w-64'}`}>
          <div className={`${isMobileView ? 'flex' : 'hidden'} items-center justify-between h-16 px-4 border-b border-gray-200 bg-white`}>
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png" 
                alt="Labamu Manufacturing" 
                className="h-8 w-auto"
              />
            </div>
            <button onClick={() => setSidebarOpen(false)} className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none">
              <X className="h-6 w-6" />
            </button>
          </div>
          <Sidebar />
        </div>
      </div>
      
      {/* Main content area - responsive layout */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        <header className="bg-white shadow-sm z-10 border-b">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
              <img 
                src="/lovable-uploads/bca2590c-b286-4921-9c95-52a4a7306fcd.png" 
                alt="Labamu Manufacturing" 
                className="h-8 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900 truncate max-w-[150px] sm:max-w-full">{title}</h1>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => 
                    toast({
                      title: "Notifications",
                      description: "You have no new notifications",
                    })
                  }
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <span className="sr-only">View notifications</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </button>
              </div>

              <div className="ml-3 relative">
                <div>
                  <button
                    className="flex items-center max-w-xs bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => 
                      toast({
                        title: "User Profile",
                        description: "Profile settings coming soon",
                      })
                    }
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                      <span className="text-sm font-medium">JD</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
