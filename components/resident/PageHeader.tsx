'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  color: 'orange' | 'teal' | 'blue' | 'green';
  showBackButton?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
}

const colorClasses = {
  orange: 'from-orange-600 via-orange-500 to-orange-600',
  teal: 'from-teal-600 via-teal-500 to-teal-600',
  blue: 'from-blue-600 via-blue-500 to-blue-600',
  green: 'from-green-600 via-green-500 to-green-600',
};

export function PageHeader({ 
  title, 
  subtitle, 
  icon: Icon, 
  color,
  showBackButton = false,
  backUrl = '/resident',
  actions 
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-6">
      <div className={`bg-gradient-to-r ${colorClasses[color]} rounded-xl sm:rounded-2xl py-4 px-4 sm:py-6 sm:px-6 md:py-8 md:px-8 shadow-2xl`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <button 
                onClick={() => router.push(backUrl)}
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-all"
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            )}
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <Icon className="w-8 h-8" />
                {title}
              </h1>
              {subtitle && (
                <p className="text-white/90 text-base sm:text-lg md:text-xl mt-1">{subtitle}</p>
              )}
            </div>
          </div>
          {actions}
        </div>
      </div>
    </div>
  );
}
