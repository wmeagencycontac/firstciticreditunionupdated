import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { auth, db, BankingUser, isSupabaseConfigured } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: BankingUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  setProfile: (profile: BankingUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<BankingUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with auth store
  const { setLoading: setAuthLoading, setAuthenticated } = useAuthStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    // If Supabase is not configured, don't try to authenticate
    if (!isSupabaseConfigured) {
      console.warn("Supabase not configured - user authentication disabled");
      setLoading(false);
      return;
    }

    const setData = async (session: Session | null) => {
      if (session?.user) {
        setUser(session.user);
        setSession(session);
        setAuthenticated(true);

        try {
          const { data: profileData, error } = await db.getBankingProfile(
            session.user.id,
          );
          if (error) {
            console.error("Error fetching banking profile:", error);
            setProfile(null);
            addNotification({
              type: "warning",
              title: "Profile Error",
              message: "Could not load user profile",
            });
          } else {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          addNotification({
            type: "error",
            title: "Authentication Error",
            message: "Failed to load user data",
          });
        }
      } else {
        setUser(null);
        setSession(null);
        setProfile(null);
        setAuthenticated(false);
      }
      setLoading(false);
      setAuthLoading(false);
    };

    const { data: authListener } = auth.onAuthStateChange(
      async (_event, session) => {
        await setData(session);
      },
    );

    // Initial load
    auth.getUser().then((response) => {
      const user = "data" in response ? response.data?.user : response.user;
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
    try {
      await auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      setAuthenticated(false);

      addNotification({
        type: "info",
        title: "Signed Out",
        message: "You have been successfully signed out",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      addNotification({
        type: "error",
        title: "Sign Out Error",
        message: "Failed to sign out completely",
      });
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signOut,
    setProfile,
    isAuthenticated: !!session?.user,
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
