'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="glass-card p-12 max-w-md mx-auto">
          <div className="text-6xl mb-6">
            <span className="gradient-text">404</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-400 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="glass-card px-8 py-4 text-white font-semibold glow hover:scale-105 transition-all duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
