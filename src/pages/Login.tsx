import { useState, useEffect } from "react";
import { Eye, EyeOff, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/lib/api/mutations";
import '@/styles/omack-theme.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { mutate: login, isPending, error } = useLogin();

  const backgroundImages = ['/bg1.jpeg', '/bg2.jpeg'];

  // Rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password }, {
      onSuccess: (data) => {
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
      },
    });
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
      style={{
        background: 'black'
      }}
    >
      {/* Background Image Layer - Carousel of images */}
      <div
        key={currentImageIndex}
        className="absolute inset-0 bg-transition"
        style={{
          backgroundImage: `
            linear-gradient(135deg, rgba(22, 92, 75, 0.5) 0%, rgba(13, 61, 50, 0.5) 100%),
            url('${backgroundImages[currentImageIndex]}')
          `,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundBlendMode: 'multiply'
        }}
      />

      {/* Alternative: Add your own image here by replacing the URL above */}
      {/* To use your own images:
        1. Place your images in public/images/ folder
        2. Replace the URL with: url('/images/your-image-name.jpg')
        3. Or import the image and use it: backgroundImage: `url(${yourImage})`
      */}
      {/* Animated background elements */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)`,
          animation: 'float 6s ease-in-out infinite'
        }}
      />

      {/* Healthcare pattern background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)
          `
        }}
      />

      {/* Floating medical icons background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white opacity-5 text-6xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-icon ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          >
            <Stethoscope size={48} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
        }
        
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.05; }
          50% { transform: translateY(-30px) rotate(10deg); opacity: 0.1; }
        }

        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Top branding section */}
      <div className="relative z-10 mb-12 text-center text-white">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <img src="/logo.jpg" alt="O'Mark Logo" className="h-14 w-14" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, letterSpacing: '-0.5px' }}>
              O'Mack Portal
            </h1>
            <p style={{ fontSize: '0.85rem', margin: '0.25rem 0 0 0', opacity: 0.9 }}>
              School of Health Technology
            </p>
          </div>
        </div>
      </div>

      {/* Main Glass Morphism Card */}
      <div
        className="w-full max-w-md relative z-10"
        style={{
          animation: 'slide-in 0.6s ease-out'
        }}
      >
        {/* Glass card container */}
        <div
          className="rounded-3xl shadow-2xl p-8 relative overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          {/* Glossy shine effect */}
          <div
            className="absolute inset-0 rounded-3xl opacity-20"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0', letterSpacing: '-0.3px' }}>
                Welcome Back
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                Sign in to access your portal
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@school.edu"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    borderRadius: '0.75rem',
                    padding: '0.75rem 1rem',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(10px)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                  }}
                />
                <style>{`
                  input::placeholder {
                    color: rgba(255, 255, 255, 0.6);
                  }
                `}</style>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: 'rgba(255,255,255,0.9)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px'
                    }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    style={{
                      fontSize: '0.8rem',
                      color: 'rgba(255,255,255,0.8)',
                      textDecoration: 'none',
                      fontWeight: 600,
                      transition: 'color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{
                      background: 'rgba(255, 255, 255, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      borderRadius: '0.75rem',
                      padding: '0.75rem 1rem 0.75rem 1rem',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      paddingRight: '2.5rem',
                      backdropFilter: 'blur(10px)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute inset-y-0 right-0 h-full w-10 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.5)',
                    borderRadius: '0.75rem',
                    padding: '0.75rem',
                    color: 'rgba(255,255,255,0.95)',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  {error.message}
                </div>
              )}

              {/* Sign In Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full mt-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 168, 107, 0.9) 0%, rgba(38, 214, 138, 0.9) 100%)',
                  color: 'white',
                  padding: '0.875rem',
                  fontSize: '1rem',
                  fontWeight: 700,
                  borderRadius: '0.75rem',
                  border: '1px solid rgba(255,255,255,0.2)',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                  opacity: isPending ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px 0 rgba(0, 168, 107, 0.4)',
                  backdropFilter: 'blur(10px)',
                  letterSpacing: '-0.3px'
                }}
                onMouseEnter={(e) => {
                  if (!isPending) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px 0 rgba(0, 168, 107, 0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPending) {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px 0 rgba(0, 168, 107, 0.4)';
                  }
                }}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                &copy; {new Date().getFullYear()} O'Mark School of Health Technology<br />
                <a
                  href="https://omarkschoolofhealth.edu.ng"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'rgba(255,255,255,1)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                >
                  Visit Website
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom info text */}
        <div className="text-center mt-8 relative z-10">
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '1rem 0 0 0' }}>
            Egan-Igango, Lagos State, Nigeria
          </p>
        </div>
      </div>
    </main>
  );
}
