import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogin } from "@/lib/api/mutations";

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
        console.log(data, 'success')
        const role = data.user.role
        if(role === 'super-admin'){
          window.location.href = "/super-admin/schools";
        } else if(role === 'school-admin'){
          window.location.href = "/admin/";
        } else if(role === 'student'){
          window.location.href = "/student/results";
        }
        // Redirect to dashboard or home page
        // window.location.href = "/";
      },
      // onError is handled in the mutation itself
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Decorative panel */}
        <div className="hidden md:flex flex-col items-start justify-center space-y-6 p-8 rounded-2xl bg-gradient-to-b from-indigo-600 to-indigo-400 text-white shadow-xl">
          <img src="/favicon.ico" alt="Logo" className="w-20 h-20 rounded-full shadow-lg" />
          <div>
            <h2 className="text-2xl font-bold">HSMS Portal</h2>
            <p className="mt-1 text-sm opacity-90 max-w-xs">Securely manage students, courses and results. Quick access for admins and students.</p>
          </div>
          <div className="mt-4 text-sm opacity-90">
            <ul className="space-y-2">
              <li>• Fast, reliable result management</li>
              <li>• Bulk uploads and PDF exports</li>
              <li>• Role-based dashboards</li>
            </ul>
          </div>
        </div>

        {/* Login card */}
        <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
          <CardHeader className="text-center pt-8">
            <img src="/favicon.ico" alt="Logo" className="mx-auto mb-4 w-20 h-20 rounded-full shadow-md" />
            <CardTitle className="text-2xl font-extrabold text-gray-900">Welcome back</CardTitle>
            <p className="text-sm text-gray-500 mt-1">Sign in to continue to the HSMS dashboard</p>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
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
                  className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="you@school.edu"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
                  <a href="#" className="text-sm text-indigo-600 hover:underline">Forgot?</a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-md"
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
              &copy; {new Date().getFullYear()} HSMS. All rights reserved.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
