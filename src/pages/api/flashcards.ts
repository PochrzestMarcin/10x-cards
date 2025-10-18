import type { APIRoute } from "astro";
import { listFlashcards, createFlashcards } from "../../lib/services/flashcard.service";
import type { CreateFlashcardsResponseDto } from "../../types";
import { ZodError } from "zod";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // Ensure we have auth context from middleware
    const { supabase, user } = locals;

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse URL search params
    const url = new URL(request.url);
    const queryParams = Object.fromEntries(url.searchParams);
    // Get paginated flashcards via service
    const response = await listFlashcards(queryParams, user.id, supabase);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: "Invalid query parameters",
          errors: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

// Keep existing POST endpoint...
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Ensure we have auth context from middleware
    const { supabase, user } = locals;

    if (!user) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = user.id;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error(e);
      return new Response(JSON.stringify({ message: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create flashcards via service
    const flashcards = await createFlashcards(body, userId, supabase);

    // Return success response
    const response: CreateFlashcardsResponseDto = { flashcards };
    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating flashcards:", error);

    // Handle known error types
    if (error instanceof ZodError) {
      return new Response(
        JSON.stringify({
          message: "Validation failed",
          errors: error.errors,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (error instanceof Error) {
      // Handle specific error messages from service
      if (error.message.includes("Generations not found")) {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback error response
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
