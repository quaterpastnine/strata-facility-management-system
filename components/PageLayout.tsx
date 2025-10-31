'use client';

import { ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
  showBackground?: boolean;
}

export default function PageLayout({ children, showBackground = true }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-x-hidden">
      
      {/* Background Image */}
      {showBackground && (
        <div 
          className="fixed inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/background.jpg")',
            zIndex: 0
          }}
        />
      )}
      
      {/* Content Wrapper */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
