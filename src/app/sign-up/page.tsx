'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const runtime = 'edge';

interface SignUpResponse {
  error?: string;
  success?: boolean;
  message?: string;
}

export default function SignUp() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      companyName: formData.get('companyName'),
      subdomain: formData.get('subdomain'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json() as SignUpResponse;

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create account');
      }

      toast({
        title: "Success!",
        description: "Account created successfully",
      });
      
      router.push(`https://${data.subdomain}.canny.io/dashboard`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : 'Something went wrong',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 lg:flex-none lg:w-1/2">
        <div className="w-full max-w-sm mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              canny
            </Link>
          </div>
          
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Easily gather, track, and manage user feedback
            </h1>
            <p className="mt-2 text-gray-600">
              Get started with Canny for free
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                name="fullName"
                placeholder="Full Name"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="email"
                name="email"
                placeholder="Work Email"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                type="text"
                name="companyName"
                placeholder="Company/App Name"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <Input
                type="text"
                name="subdomain"
                placeholder="Subdomain"
                className="w-full pl-4 pr-16"
                required
                disabled={isLoading}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                .canny.io
              </div>
            </div>
            <div>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full"
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'CREATE MY ACCOUNT'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:text-blue-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:text-blue-500">
                Privacy Policy
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
      <div>
        {/* Background Image */}
        <div className="absolute bottom-0 right-0 w-96 h-[500px]">
          <Image
            src="/human-standing.webp"
            alt="Person standing with laptop"
            fill
            className="object-contain object-bottom"
            priority
          />
        </div>
      </div>
    </div>
  );
} 