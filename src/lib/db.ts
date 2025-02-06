import { PrismaClient } from '@prisma/client';
import { PrismaD1 } from '@prisma/adapter-d1';

let prisma: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  try {
    if (!prisma) {
      console.log('Initializing new Prisma client');
      const db = process.env.DB;
      
      if (!db) {
        throw new Error('DB environment variable is not defined');
      }
      
      if (typeof db === 'string') {
        throw new Error('DB environment variable is a string, expected D1Database');
      }

      console.log('Creating D1 adapter');
      const adapter = new PrismaD1(db);
      
      console.log('Creating Prisma client with adapter');
      prisma = new PrismaClient({ adapter });
      console.log('Prisma client initialized successfully');
    }
    
    return prisma;
  } catch (error) {
    console.error('Failed to initialize Prisma client:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    throw error;
  }
}

// Raw query helpers for cases where Prisma's API isn't sufficient
export async function queryDB<T extends Record<string, unknown>>(
  query: string,
  params: (string | number | boolean | null)[] = []
): Promise<{ results: T[] }> {
  try {
    console.log('Executing raw query:', query);
    console.log('Query parameters:', params);
    
    const db = process.env.DB as D1Database | undefined;
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    const result = await db.prepare(query).bind(...params).all();
    console.log('Query executed successfully');
    return result;
  } catch (error) {
    console.error('Failed to execute raw query:', error);
    throw error;
  }
}

export async function executeDB(
  query: string,
  params: (string | number | boolean | null)[] = []
): Promise<{ success: boolean }> {
  try {
    console.log('Executing raw command:', query);
    console.log('Command parameters:', params);
    
    const db = process.env.DB as D1Database | undefined;
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    const result = await db.prepare(query).bind(...params).run();
    console.log('Command executed successfully');
    return result;
  } catch (error) {
    console.error('Failed to execute raw command:', error);
    throw error;
  }
} 