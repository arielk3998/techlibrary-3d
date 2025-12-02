'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { CheckCircle2, Circle, Loader2, AlertCircle, X } from 'lucide-react';

interface LoadingStep {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'success' | 'error';
  timestamp?: number;
  error?: string;
}

interface LoadingTrackerProps {
  isVisible: boolean;
  onClose?: () => void;
}

export default function LoadingTracker({ isVisible, onClose }: LoadingTrackerProps) {
  const [steps, setSteps] = useState<LoadingStep[]>([
    { id: 'init', label: 'Initializing application', status: 'pending' },
    { id: 'theme', label: 'Loading theme system', status: 'pending' },
    { id: 'store', label: 'Setting up state management', status: 'pending' },
    { id: 'data', label: 'Loading graph data', status: 'pending' },
    { id: 'parser', label: 'Parsing node categories', status: 'pending' },
    { id: 'layout', label: 'Calculating graph layout', status: 'pending' },
    { id: 'render', label: 'Rendering visualization', status: 'pending' },
  ]);

  const [startTime] = useState(() => Date.now());
  const [elapsedTime, setElapsedTime] = useState('0.0');

  // Calculate progress based on completed steps
  const progress = useMemo(() => {
    const completed = steps.filter(s => s.status === 'success').length;
    return (completed / steps.length) * 100;
  }, [steps]);

  // Update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(((Date.now() - startTime) / 1000).toFixed(1));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime]);

  // Auto-track component mount stages
  useEffect(() => {
    const trackStep = (stepId: string, status: 'loading' | 'success' | 'error', error?: string) => {
      setSteps(prev => prev.map(step => 
        step.id === stepId 
          ? { ...step, status, timestamp: Date.now(), error } 
          : step
      ));
    };

    // Step 1: Init
    trackStep('init', 'loading');
    setTimeout(() => trackStep('init', 'success'), 100);

    // Step 2: Theme
    setTimeout(() => {
      trackStep('theme', 'loading');
      const themeLoaded = document.documentElement.hasAttribute('data-theme');
      setTimeout(() => trackStep('theme', themeLoaded ? 'success' : 'error', !themeLoaded ? 'Theme not applied' : undefined), 150);
    }, 100);

    // Step 3: Store
    setTimeout(() => {
      trackStep('store', 'loading');
      setTimeout(() => trackStep('store', 'success'), 200);
    }, 250);

    // Step 4: Data (listen for actual data load)
    setTimeout(() => trackStep('data', 'loading'), 450);
    
    const checkData = setInterval(() => {
      const graphData = document.querySelector('canvas');
      if (graphData) {
        trackStep('data', 'success');
        clearInterval(checkData);
        
        // Step 5: Parser
        setTimeout(() => {
          trackStep('parser', 'loading');
          setTimeout(() => trackStep('parser', 'success'), 300);
        }, 100);
        
        // Step 6: Layout
        setTimeout(() => {
          trackStep('layout', 'loading');
          setTimeout(() => trackStep('layout', 'success'), 400);
        }, 400);
        
        // Step 7: Render
        setTimeout(() => {
          trackStep('render', 'loading');
          setTimeout(() => trackStep('render', 'success'), 500);
        }, 800);
      }
    }, 100);

    return () => clearInterval(checkData);
  }, []);

  const hasErrors = steps.some(s => s.status === 'error');

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center">
      <div className="max-w-md w-full mx-4 relative">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute -top-2 -right-2 z-10 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Close loading tracker"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 animate-pulse flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            PRISM WRITING
          </h2>
          <p className="text-sm text-purple-300/70">LOADING KNOWLEDGE GRAPH</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2 text-xs">
            <span className="text-purple-300">Progress: {Math.round(progress)}%</span>
            <span className="text-purple-300/60">{elapsedTime}s elapsed</span>
          </div>
          <div className="h-2 bg-purple-900/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Loading Steps */}
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-xl p-4 space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {step.status === 'success' && (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                )}
                {step.status === 'loading' && (
                  <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                )}
                {step.status === 'error' && (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                )}
                {step.status === 'pending' && (
                  <Circle className="w-5 h-5 text-purple-400/30" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  step.status === 'success' ? 'text-green-300' :
                  step.status === 'loading' ? 'text-cyan-300' :
                  step.status === 'error' ? 'text-red-300' :
                  'text-purple-300/50'
                }`}>
                  {step.label}
                </p>
                {step.error && (
                  <p className="text-xs text-red-400/80 mt-1">{step.error}</p>
                )}
                {step.timestamp && step.status === 'success' && (
                  <p className="text-xs text-purple-400/60 mt-1">
                    {((step.timestamp - startTime) / 1000).toFixed(2)}s
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Error State */}
        {hasErrors && (
          <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm text-red-300 font-medium mb-2">⚠️ Loading Issues Detected</p>
            <p className="text-xs text-red-400/80">
              Check console for details. The app may still work with limited functionality.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 text-sm transition-colors w-full"
            >
              Reload Application
            </button>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-purple-400/40">
            Debug Mode • {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}
