import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  onClick?: () => void;
}

export function StatsCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  gradient,
  onClick 
}: StatsCardProps) {
  return (
    <div 
      onClick={onClick}
      className={`${gradient} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-lg ${
        onClick ? 'cursor-pointer hover:scale-105' : ''
      } transition-all`}
    >
      <div className="flex items-center justify-between mb-1 sm:mb-2">
        <p className="text-white text-sm sm:text-base md:text-lg font-semibold">
          {title}
        </p>
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white/50" />
      </div>
      <p className="text-white text-3xl sm:text-4xl md:text-6xl font-bold">
        {value}
      </p>
      <p className="text-white/80 text-xs sm:text-sm md:text-base mt-1">
        {subtitle}
      </p>
    </div>
  );
}
