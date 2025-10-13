import type { APIRoute } from 'astro';
import { GenerateFlashcardsCommandSchema } from '../../lib/schemas/generation.schema';
import { GenerationService } from '../../lib/services/generation.service';
import { DEFAULT_USER_ID } from '../../db/supabase.client';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Extract supabase client and user from locals
    const supabase = locals.supabase;
    // Use default test user ID for now - auth will be implemented later
    const userId = DEFAULT_USER_ID;
    
    // Parse and validate request body
    const body = await request.json();
    const result = GenerateFlashcardsCommandSchema.safeParse(body);

    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid request body',
          details: result.error 
        }), 
        { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
         }
      );
    }

    const apiKey = import.meta.env.OPENROUTER_API_KEY;
    // Generate flashcards
    const generationService = new GenerationService(supabase, apiKey);
    const response = await generationService.generateFlashcards(
      result.data.source_text,
       userId
    );

    return new Response(
      JSON.stringify(response),
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Internal server error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } 
    });
  }
};
