import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel,
  onAction 
}: EmptyStateProps) {
  return (
    <div className="bg-gray-800/60 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
      <Icon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold text-gray-400 mb-2">{title}</h3>
      <p className="text-xl text-gray-500 mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-500 transition-all"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
