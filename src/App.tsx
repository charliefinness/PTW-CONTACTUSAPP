import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import ContactForm from './components/ContactForm';
import CRMDashboard from './components/CRMDashboard';
import Login from './components/Login';

type View = 'form' | 'login' | 'dashboard';

function App() {
  const [view, setView] = useState<View>('form');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');

    if (viewParam === 'admin' || viewParam === 'crm') {
      setView('login');
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
      if (session && (viewParam === 'admin' || viewParam === 'crm')) {
        setView('dashboard');
      }
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setIsAuthenticated(!!session);
        if (session) {
          setView('dashboard');
        } else if (view === 'dashboard') {
          setView('login');
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (view === 'dashboard' && isAuthenticated) {
    return <CRMDashboard />;
  }

  if (view === 'login') {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-green-50 flex items-center justify-center p-4">
      <ContactForm />
    </div>
  );
}

export default App;
