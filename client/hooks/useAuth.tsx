import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { auth, db, BankingUser } from "@/lib/supabase";
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
        try {
          const { data: profileData, error } = await db.getBankingProfile(
            session.user.id,
          );
          if (error) {
            console.error("Error fetching banking profile:", error);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } catch (error) {
          console.error("Profile fetch error:", error);
          setProfile(null);
        }
      } else {
        // Check for admin token in localStorage
        const adminToken = localStorage.getItem("admin_token");
        const adminUser = localStorage.getItem("admin_user");

        if (adminToken && adminUser) {
          try {
            const userData = JSON.parse(adminUser);
            // Create a mock user object for admin
            setUser({
              id: userData.id,
              email: userData.email,
              user_metadata: { name: userData.name }
            } as User);
            setProfile({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              role: userData.role,
              bio: null,
              picture: null,
              email_verified: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            } as BankingUser);
          } catch (error) {
            console.error("Admin auth parsing error:", error);
            localStorage.removeItem("admin_token");
            localStorage.removeItem("admin_user");
          }
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
      }
      setLoading(false);
    };

    const { data: authListener } = auth.onAuthStateChange(
      async (_event, session) => {
        await setData(session);
      },
    );

    // Initial load - check for admin session first
    const adminToken = localStorage.getItem("admin_token");
    if (adminToken) {
      setData(null); // This will trigger admin auth check
    } else {
      auth.getUser().then(({ data: { user } }) => {
        if (user) {
          auth.getSession().then(({ data: { session } }) => {
            setData(session);
          });
        } else {
          setLoading(false);
        }
      }).catch((error) => {
        console.error("Auth initialization error:", error);
        setLoading(false);
      });
    }

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    // Check if this is an admin session
    const adminToken = localStorage.getItem("admin_token");

    if (adminToken) {
      // Admin logout
      try {
        await fetch("/api/admin/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${adminToken}`,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Admin logout error:", error);
      }
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_user");
    } else {
      // Regular user logout
      await auth.signOut();
    }

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
