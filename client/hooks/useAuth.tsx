import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { auth, db, BankingUser, isSupabaseConfigured } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: BankingUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BankingUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setData = async (session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        const { data: profileData, error } = await db.getBankingProfile(
          session.user.id,
        );
        if (error) {
          console.error("Error fetching banking profile:", error);
          setProfile(null);
        } else {
          setProfile(profileData);
        }
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
      }
      setLoading(false);
    };

    const { data: authListener } = auth.onAuthStateChange(
      async (_event, session) => {
        await setData(session);
      },
    );

    // Initial load
    auth.getUser().then(({ data: { user } }) => {
      if (user) {
        auth.getSession().then(({ data: { session } }) => {
          setData(session);
        });
      } else {
        setLoading(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
