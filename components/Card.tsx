'use client';

import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export function Card({ children, className = '', onClick, hover = false }: CardProps) {
  const hoverClass = hover ? 'hover:scale-105 active:scale-95 cursor-pointer' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';
  
  return (
    <div
      onClick={onClick}
      className={`bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-700 transition-all ${hoverClass} ${clickClass} ${className}`}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: number | string;
  color: 'blue' | 'yellow' | 'green' | 'teal' | 'orange' | 'red';
  onClick?: () => void;
}

export function StatCard({ icon, title, value, color, onClick }: StatCardProps) {
  const colors = {
    blue: 'bg-blue-600/20 border-blue-500/30',
    yellow: 'bg-yellow-600/20 border-yellow-500/30',
    green: 'bg-green-600/20 border-green-500/30',
    teal: 'bg-teal-600/20 border-teal-500/30',
    orange: 'bg-orange-600/20 border-orange-500/30',
    red: 'bg-red-600/20 border-red-500/30',
  };

  const iconColors = {
    blue: 'text-blue-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
    teal: 'text-teal-400',
    orange: 'text-orange-400',
    red: 'text-red-400',
  };

  const textColors = {
    blue: 'text-blue-300',
    yellow: 'text-yellow-300',
    green: 'text-green-300',
    teal: 'text-teal-300',
    orange: 'text-orange-300',
    red: 'text-red-300',
  };

  return (
    <div
      onClick={onClick}
      className={`${colors[color]} border rounded-lg p-4 ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''} transition-all`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className={iconColors[color]}>{icon}</div>
        <span className={`${textColors[color]} font-semibold text-base`}>{title}</span>
      </div>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
}
