import { RequestHandler } from "express";
import { supabase, supabaseAdmin } from "../supabase";
import { z } from "zod";

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  bio: z.string().optional(),
  picture: z.string().url().optional(),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const verifyEmailSchema = z.object({
  token: z.string(),
});

export const signUp: RequestHandler = async (req, res) => {
  try {
    const { email, password, name, bio, picture } = signUpSchema.parse(req.body);

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          bio,
          picture,
        },
      },
    });

    if (authError) {
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
      return res.status(400).json({ error: "Failed to create user" });
    }

    // Create initial checking account for new user
    if (authData.user.id) {
      // Generate account number
      const { data: accountNumberData, error: accountNumberError } = await supabaseAdmin
        .rpc('generate_account_number', {
          user_id_input: authData.user.id,
          account_type_input: 'checking'
        });

      if (!accountNumberError && accountNumberData) {
        // Create the account
        const { error: accountError } = await supabaseAdmin
          .from('accounts')
          .insert({
            user_id: authData.user.id,
            account_number: accountNumberData,
            account_type: 'checking',
            balance: 1000.00, // Initial balance
          });

        if (accountError) {
          console.error('Failed to create initial account:', accountError);
        }
      }
    }

    res.json({
      message: "User created successfully. Please check your email to verify your account.",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        email_confirmed: authData.user.email_confirmed_at !== null,
      },
    });
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signIn: RequestHandler = async (req, res) => {
  try {
    const { email, password } = signInSchema.parse(req.body);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data.user) {
      return res.status(400).json({ error: "Authentication failed" });
    }

    // Get user's banking profile
    const { data: bankingUser, error: profileError } = await supabaseAdmin
      .from('banking_users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching banking profile:', profileError);
    }

    res.json({
      message: "Signed in successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        name: bankingUser?.name || 'User',
        email_verified: data.user.email_confirmed_at !== null,
        role: bankingUser?.role || 'user',
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      },
    });
  } catch (error) {
    console.error("Sign in error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

export const signOut: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(' ')[1];
    
    // Create a client with the user's session
    const supabaseUser = supabase.auth.setSession({
      access_token: token,
      refresh_token: '', // We only need access token for sign out
    });

    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Sign out error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify the JWT token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Get user's banking profile
    const { data: bankingUser, error: profileError } = await supabaseAdmin
      .from('banking_users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return res.status(404).json({ error: "Banking profile not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: bankingUser.name,
        bio: bankingUser.bio,
        picture: bankingUser.picture,
        email_verified: user.email_confirmed_at !== null,
        role: bankingUser.role,
        created_at: bankingUser.created_at,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyEmail: RequestHandler = async (req, res) => {
  try {
    const { token } = verifyEmailSchema.parse(req.body);

    const { data, error } = await supabase.auth.verifyOtp({
      token,
      type: 'email',
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update the banking user's email verification status
    if (data.user) {
      const { error: updateError } = await supabaseAdmin
        .from('banking_users')
        .update({ email_verified: true, updated_at: new Date().toISOString() })
        .eq('id', data.user.id);

      if (updateError) {
        console.error('Failed to update email verification status:', updateError);
      }
    }

    res.json({
      message: "Email verified successfully",
      user: {
        id: data.user?.id,
        email: data.user?.email,
        email_verified: true,
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "Invalid input", details: error.errors });
    }
    res.status(500).json({ error: "Internal server error" });
  }
};

// Middleware to authenticate requests using Supabase JWT
export const authenticateUser: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: "No authorization header" });
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Add user to request object
    (req as any).user = user;
    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
