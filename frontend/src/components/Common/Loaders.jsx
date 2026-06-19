import React from 'react';

export const Spinner = ({ size = 'md', color = 'indigo' }) => {
  const sizes = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4',
  };

  const colors = {
    indigo: 'border-blue-500',
    violet: 'border-violet-500',
    white: 'border-white',
  };

  return <div className={`${sizes[size] || sizes.md} ${colors[color] || colors.indigo} animate-spin rounded-full border-t-transparent`} />;
};

export const SkeletonCard = () => (
  <div className="surface-card space-y-4 rounded-[2rem] p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="skeleton-shimmer h-6 w-1/2 rounded-full" />
      <div className="skeleton-shimmer h-8 w-20 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="skeleton-shimmer h-4 w-full rounded-full" />
      <div className="skeleton-shimmer h-4 w-4/5 rounded-full" />
      <div className="skeleton-shimmer h-4 w-3/5 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-3 pt-3">
      <div className="skeleton-shimmer h-11 rounded-2xl" />
      <div className="skeleton-shimmer h-11 rounded-2xl" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, row) => (
      <div key={row} className="surface-card grid gap-3 rounded-[2rem] p-5 md:grid-cols-4">
        {Array.from({ length: cols }).map((__, col) => (
          <div key={col} className="space-y-2">
            <div className="skeleton-shimmer h-3 w-20 rounded-full" />
            <div className="skeleton-shimmer h-5 w-full rounded-full" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonDetails = () => (
  <div className="surface-card mx-auto max-w-4xl space-y-6 rounded-[2rem] p-6 md:p-8">
    <div className="space-y-3">
      <div className="skeleton-shimmer h-8 w-1/3 rounded-full" />
      <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="skeleton-shimmer h-4 w-full rounded-full" />
      <div className="skeleton-shimmer h-4 w-full rounded-full" />
      <div className="skeleton-shimmer h-4 w-4/5 rounded-full" />
    </div>
    <div className="grid gap-3 md:grid-cols-2">
      <div className="skeleton-shimmer h-12 rounded-2xl" />
      <div className="skeleton-shimmer h-12 rounded-2xl" />
    </div>
  </div>
);

