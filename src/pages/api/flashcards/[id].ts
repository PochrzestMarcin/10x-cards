import type { APIRoute } from 'astro';
import { FlashcardService } from '../../../lib/services/flashcard.service';
import { flashcardUpdateSchema } from '../../../lib/schemas/flashcard.schema';
import { ZodError } from 'zod';

export const PUT: APIRoute = async ({ request, locals, params }) => {
  try {
    // Ensure we have auth context from middleware
    const { supabase, user } = locals;
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate ID parameter
    const id = Number(params.id);
    if (isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ message: 'Invalid flashcard ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ message: 'Invalid JSON' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate update data
    const validatedData = flashcardUpdateSchema.parse(body);

    // Update flashcard via service
    const updatedFlashcard = await FlashcardService.updateFlashcard(
      id,
      validatedData,
      user.id,
      supabase
    );

    return new Response(JSON.stringify(updatedFlashcard), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating flashcard:', error);

    if (error instanceof ZodError) {
      return new Response(JSON.stringify({ 
        message: 'Validation failed', 
        errors: error.errors 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (error instanceof Error) {
      if (error.message === 'Flashcard not found') {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ locals, params }) => {
  try {
    // Ensure we have auth context from middleware
    const { supabase, user } = locals;
    
    if (!user) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate ID parameter
    const id = Number(params.id);
    if (isNaN(id) || id <= 0) {
      return new Response(JSON.stringify({ message: 'Invalid flashcard ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete flashcard via service
    await FlashcardService.deleteFlashcard(id, user.id, supabase);

    return new Response(JSON.stringify({
      message: 'Flashcard deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error deleting flashcard:', error);

    if (error instanceof Error) {
      if (error.message === 'Flashcard not found') {
        return new Response(JSON.stringify({ message: error.message }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
