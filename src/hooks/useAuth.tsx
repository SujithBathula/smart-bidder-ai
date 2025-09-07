import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User, AuthError, AuthResponse } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Check active session
    (async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (err) {
        setError(err as AuthError);
      } finally {
        setLoading(false);
      }
    })();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      return await supabase.auth.signUp({ email, password });
    } catch (err) {
      setError(err as AuthError);
      throw err;
    }
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      setError(null);
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (err) {
      setError(err as AuthError);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await supabase.auth.signOut();
    } catch (err) {
      setError(err as AuthError);
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        signUp, 
        signIn, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

const { user, loading, error, signIn, signUp, signOut } = useAuth();
