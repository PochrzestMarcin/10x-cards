import { createClient } from "@supabase/supabase-js";
import type { Database } from "../../src/db/database.types";

// Ensure environment variables are defined with type assertions
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;
const testUserId = process.env.E2E_USERNAME_ID as string;

// Validate required environment variables
const requiredEnvVars = {
  SUPABASE_URL: supabaseUrl,
  SUPABASE_KEY: supabaseKey,
  E2E_USERNAME_ID: testUserId,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`);
}

// Create a Supabase client with the public key
const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export async function cleanupTestData() {
  try {
    // Delete only records created by the test user
    const { error } = await supabase.from("flashcards").delete().eq("user_id", testUserId);

    if (error) {
      console.error("Error cleaning up test data:", error);
      throw error;
    }
  } catch (error) {
    console.error("Failed to cleanup test data:", error);
    throw error;
  }
}
