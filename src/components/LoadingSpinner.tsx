// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="flex h-full w-full items-center justify-center py-12">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-orange/30 border-t-orange"></div>
    </div>
  );
}

export default LoadingSpinner;
