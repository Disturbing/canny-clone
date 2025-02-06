import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";

export const runtime = 'edge';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                canny
              </Link>
            </div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Product</NavigationMenuTrigger>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-3 py-2">Customers</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink className="px-3 py-2">Pricing</NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            Build better products with<br />customer feedback
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Centralize product feedback to uncover insights and make<br />informed product decisions
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg">Request a demo</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/sign-up">Get started</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500">No credit card required</p>
          
          {/* Hero Image */}
          <div className="mt-12 relative w-full max-w-4xl mx-auto">
            <Image
              src="/hero-1x-image.webp"
              alt="Canny product interface showing feedback management"
              width={1200}
              height={800}
              priority
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Collect feedback</CardTitle>
              <CardDescription>Gather, analyze, and organize feedback in a centralized location</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Analyze feedback</CardTitle>
              <CardDescription>Uncover valuable customer insights to make better product decisions</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Prioritize requests</CardTitle>
              <CardDescription>Develop formulas to automatically score feedback and feature requests</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-16">Leading companies use Canny to close the feedback loop</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">50K+</div>
                <div className="text-gray-600">registered companies</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">1M+</div>
                <div className="text-gray-600">product updates sent</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-blue-600 mb-2">15M+</div>
                <div className="text-gray-600">feedback items captured</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
