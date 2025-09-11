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
          window.location.href = "/admin/students";
        }
        // Redirect to dashboard or home page
        // window.location.href = "/";
      },
      // onError is handled in the mutation itself
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-gray-100 p-4 sm:p-8">
      <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
        <CardHeader className="text-center">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="mx-auto mb-4 w-16 h-16 rounded-full shadow-md"
          />
          <CardTitle className="text-3xl font-bold text-gray-900">Welcome Back</CardTitle>
          <p className="text-sm text-gray-600 mt-2">Sign in to your account</p>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
                  placeholder="••••••••"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute inset-y-0 right-0 h-full w-10 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {error && <div className="text-red-600 text-sm text-center p-2 bg-red-50 rounded-md border border-red-200">{error.message}</div>}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200"
              disabled={isPending}
            >
              {isPending ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500">
            &copy; {new Date().getFullYear()} HSMS. All rights reserved.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
