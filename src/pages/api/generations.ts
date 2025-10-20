import type { APIRoute } from "astro";
import { GenerateFlashcardsCommandSchema } from "../../lib/schemas/generation.schema";
import { GenerationService } from "../../lib/services/generation.service";
import { OPENROUTER_API_KEY } from "astro:env/server";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Extract supabase client and user from locals
    const { supabase, user } = locals;

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Parse and validate request body
    const body = await request.json();
    const result = GenerateFlashcardsCommandSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: result.error,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    
    // Generate flashcards
    const generationService = new GenerationService(supabase, OPENROUTER_API_KEY);
    const response = await generationService.generateFlashcards(result.data.source_text, userId);

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating flashcards:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
