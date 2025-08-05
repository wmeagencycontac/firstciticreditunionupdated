import { RequestHandler } from "express";
import { supabaseAdmin } from "../supabase";

// Create banking profile for new user
export const createBankingProfile: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      email,
      name,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      address,
      accountType,
      optInMarketing,
    } = req.body;

    if (!userId || !email || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create banking user profile
    const { data: bankingUser, error: profileError } = await supabaseAdmin
      .from("banking_users")
      .insert({
        id: userId,
        email,
        name,
        bio: `Member since ${new Date().getFullYear()}. ${accountType === 'business' ? 'Business' : 'Personal'} banking.`,
        email_verified: false,
        role: "user",
      })
      .select()
      .single();

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return res.status(500).json({ error: "Failed to create banking profile" });
    }

    // Create additional profile data table if needed (for extended info like address, phone, etc.)
    // This would be a separate table for PII data
    const { error: extendedProfileError } = await supabaseAdmin
      .from("user_profiles")
      .insert({
        user_id: userId,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        address_street: address?.street,
        address_city: address?.city,
        address_state: address?.state,
        address_zip: address?.zipCode,
        account_type: accountType,
        opt_in_marketing: optInMarketing,
      });

    // Don't fail if extended profile creation fails (table might not exist yet)
    if (extendedProfileError) {
      console.log("Extended profile creation failed (this might be expected):", extendedProfileError.message);
    }

    // The trigger function will automatically create accounts and cards
    // Let's verify they were created
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("user_id", userId);

    if (accountsError) {
      console.error("Error fetching created accounts:", accountsError);
    }

    const { data: cards, error: cardsError } = await supabaseAdmin
      .from("cards")
      .select("*")
      .eq("user_id", userId);

    if (cardsError) {
      console.error("Error fetching created cards:", cardsError);
    }

    res.json({
      success: true,
      message: "Banking profile created successfully",
      user: bankingUser,
      accounts: accounts || [],
      cards: cards || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get banking profile for existing user
export const getBankingProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Get banking user profile
    const { data: bankingUser, error: profileError } = await supabaseAdmin
      .from("banking_users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      return res.status(404).json({ error: "Banking profile not found" });
    }

    // Get accounts
    const { data: accounts, error: accountsError } = await supabaseAdmin
      .from("accounts")
      .select("*")
      .eq("user_id", userId);

    if (accountsError) {
      console.error("Accounts fetch error:", accountsError);
      return res.status(500).json({ error: "Failed to fetch accounts" });
    }

    // Get cards
    const { data: cards, error: cardsError } = await supabaseAdmin
      .from("cards")
      .select("*")
      .eq("user_id", userId);

    if (cardsError) {
      console.error("Cards fetch error:", cardsError);
      return res.status(500).json({ error: "Failed to fetch cards" });
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabaseAdmin
      .from("transactions")
      .select(`
        *,
        accounts!inner(user_id, account_number, account_type)
      `)
      .eq("accounts.user_id", userId)
      .order("timestamp", { ascending: false })
      .limit(10);

    if (transactionsError) {
      console.error("Transactions fetch error:", transactionsError);
      // Don't fail the request, just log the error
    }

    res.json({
      success: true,
      user: bankingUser,
      accounts: accounts || [],
      cards: cards || [],
      recentTransactions: transactions || [],
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update banking profile
export const updateBankingProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    // Update banking user profile
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("banking_users")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Profile update error:", updateError);
      return res.status(500).json({ error: "Failed to update banking profile" });
    }

    res.json({
      success: true,
      message: "Banking profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
