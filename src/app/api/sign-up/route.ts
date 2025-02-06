import { z } from 'zod';
import { createAuthToken } from '@/lib/auth';
import { getPrismaClient } from '@/lib/db';
import bcrypt from 'bcryptjs';

// Specify Edge Runtime
export const runtime = 'edge';

// Input validation schema
const SignUpSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  companyName: z.string().min(1, 'Company name is required'),
  subdomain: z.string().min(1, 'Subdomain is required')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new Response(null, {
    headers: corsHeaders,
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('Starting sign-up process');
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    // Validate input
    const validatedData = SignUpSchema.parse(body);
    console.log('Input validation passed');
    
    try {
      const prisma = getPrismaClient();
      console.log('Prisma client initialized');

      // Check if email exists
      const existingEmail = await prisma.account.findUnique({
        where: { email: validatedData.email },
        select: { email: true }
      });
      console.log('Email check completed');
      
      if (existingEmail) {
        return new Response(
          JSON.stringify({ error: 'Email already exists' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }
      
      // Check if subdomain exists
      const existingSubdomain = await prisma.account.findUnique({
        where: { subdomain: validatedData.subdomain },
        select: { subdomain: true }
      });
      console.log('Subdomain check completed');
      
      if (existingSubdomain) {
        return new Response(
          JSON.stringify({ error: 'Subdomain already taken' }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            }
          }
        );
      }

      // Hash password using bcrypt
      console.log('Starting password hashing');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      console.log('Password hashing completed');
      
      // Create account
      const account = await prisma.account.create({
        data: {
          fullName: validatedData.fullName,
          email: validatedData.email,
          companyName: validatedData.companyName,
          subdomain: validatedData.subdomain,
          password: hashedPassword
        }
      });
      console.log('Account created successfully');

      if (!account) {
        throw new Error('Failed to create account - account is null');
      }

      // Create and set auth token
      const token = await createAuthToken({
        email: account.email,
        subdomain: account.subdomain
      });
      console.log('Auth token created');

      // Create response with cookie
      const response = new Response(
        JSON.stringify({
          success: true,
          message: 'Account created successfully'
        }),
        { 
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Set-Cookie': `auth-token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${7 * 24 * 60 * 60}`,
            ...corsHeaders
          }
        }
      );

      return response;

    } catch (dbError) {
      console.error('Database operation failed:', dbError);
      throw new Error(`Database error: ${dbError instanceof Error ? dbError.message : 'Unknown database error'}`);
    }

  } catch (error) {
    console.error('Sign-up error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');

    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          error: error.errors[0].message,
          details: error.errors
        }),
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
} 