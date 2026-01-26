import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/lib/api/mutations";
import Navigation from '@/components/landing/Navigation';
import Footer from '@/components/landing/Footer';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, error } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: (data) => {
        // Save token to localStorage or context
        // console.log(data, 'success')
        const role = data.user.role
        if (role === 'super-admin') {
          window.location.href = "/super-admin/schools";
        } else if (role === 'school-admin') {
          window.location.href = "/admin/";
        } else if (role === 'student') {
          window.location.href = "/student/";
        } else if (role === 'instructor') {
          window.location.href = "/instructor/";
        } else {
          window.location.href = "/";
        }
        // Redirect to dashboard or home page
        // window.location.href = "/";
      },
      // onError is handled in the mutation itself
    });
  };

  return (
    <div>
      <Navigation isScrolled={false} />

      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 p-6 mt-16">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch min-h-[80vh]">
        {/* Decorative panel */}
        <div className="hidden md:flex flex-col items-start justify-center space-y-6 p-10 rounded-3xl bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 text-white shadow-2xl h-full">
          <img src="/acohsatlogo.jpg" alt="ACOHSAT Logo" className="w-32 h-32 rounded-full shadow-lg ring-4 ring-white/20 bg-white p-2" />
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight">ACOHSAT Portal</h2>
            <p className="mt-2 text-sm opacity-95 max-w-md">Apex College of Health Sciences and Technology - Securely manage students, courses and results.</p>
          </div>
          <div className="mt-6 text-sm opacity-95">
            <ul className="space-y-3 pl-3 list-disc">
              <li>Fast, reliable result management</li>
              <li>Bulk uploads and PDF exports</li>
              <li>Role-based dashboards</li>
            </ul>
          </div>
        </div>

        {/* Login card */}
        <Card className="w-full max-w-md mx-auto shadow-2xl rounded-3xl bg-white/95 h-full flex flex-col">
          <CardHeader className="text-center pt-10">
            <img src="/acohsatlogo.jpg" alt="ACOHSAT Logo" className="mx-auto mb-4 w-32 h-32 rounded-full shadow-md bg-white p-2" />
            <CardTitle className="text-3xl font-extrabold text-slate-900">Welcome back</CardTitle>
            <p className="text-sm text-slate-600 mt-1">Sign in to continue to the ACOHSAT portal</p>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8 flex-1">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@school.edu"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm text-blue-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 h-full w-10 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                  </Button>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-md border border-red-200">{error.message}</div>}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg py-3"
                disabled={isPending}
              >
                {isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-400">or continue with</span>
                </div>
              </div>
              <div className="mt-4 flex justify-center space-x-3">
                <Button variant="outline" size="sm">Google</Button>
                <Button variant="outline" size="sm">Microsoft</Button>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-gray-500">
              &copy; {new Date().getFullYear()} ACOHSAT. All rights reserved.
            </div>
          </CardContent>
        </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
