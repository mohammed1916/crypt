import React from "react";

interface LoadingSkeletonProps {
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ className = "" }) => (
  <div className={`animate-pulse bg-muted rounded w-full h-32 ${className}`} />
);

export default LoadingSkeleton;
