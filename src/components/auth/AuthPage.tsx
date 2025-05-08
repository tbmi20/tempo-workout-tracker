import { useState } from 'react';
import { Login } from './Login';
import { Signup } from './Signup';
import { ForgotPassword } from './ForgotPassword';
import gsap from 'gsap';
import { useRef, useEffect } from 'react';

type AuthView = 'login' | 'signup' | 'forgot-password';

export function AuthPage() {
  const [currentView, setCurrentView] = useState<AuthView>('login');
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  // Handle view transitions with animations
  const switchView = (view: AuthView) => {
    if (containerRef.current) {
      // Fade out current view
      gsap.to(containerRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.inOut',
        onComplete: () => {
          setCurrentView(view);
          // Fade in new view
          gsap.to(containerRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'back.out(1.7)',
            delay: 0.1,
          });
        }
      });
    } else {
      setCurrentView(view);
    }
  };

  // Logo animation on mount
  useEffect(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      );
    }
  }, []);

  // Render appropriate auth component based on current view
  const renderAuthComponent = () => {
    switch(currentView) {
      case 'login':
        return (
          <Login 
            onSwitchToSignup={() => switchView('signup')} 
            onForgotPassword={() => switchView('forgot-password')} 
          />
        );
      case 'signup':
        return <Signup onSwitchToLogin={() => switchView('login')} />;
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={() => switchView('login')} />;
      default:
        return <Login 
          onSwitchToSignup={() => switchView('signup')} 
          onForgotPassword={() => switchView('forgot-password')} 
        />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      {/* Logo and App Name */}
      <div ref={logoRef} className="mb-8 text-center">
        <div className="text-primary text-5xl font-bold mb-2">Tempo</div>
        <div className="text-muted-foreground text-xl">Workout Tracker</div>
      </div>
      
      {/* Auth Component Container */}
      <div ref={containerRef} className="w-full max-w-md">
        {renderAuthComponent()}
      </div>
      
      {/* Footer */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Tempo Workout Tracker. All rights reserved.
      </div>
    </div>
  );
}