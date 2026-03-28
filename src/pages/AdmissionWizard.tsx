import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, Check, User, GraduationCap, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from '@/components/admissions/Stepper';
import BiodataStep from '@/components/admissions/BiodataStep';
import OLevelStep from '@/components/admissions/OLevelStep';
import ProgrammeStep from '@/components/admissions/ProgrammeStep';
import { useSubmitApplication } from '@/lib/api/queries';
import { toast } from 'sonner';
import type { SubmitApplicationRequest } from '@/lib/api/types';
// import Navigation from '@/components/landing/Navigation';

// Zod Schema
const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
const ninRegex = /^\d{11}$/;
// Accept 10-14 alphanumeric characters (case-insensitive) to match common JAMB formats
const jambRegex = /^[A-Z0-9]{10,14}$/i;

const olevelSubjectSchema = z.object({
  subject: z.string().min(1, 'Subject is required'),
  grade: z.enum(['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'])
});

const olevelSittingSchema = z.object({
  examType: z.enum(['WAEC', 'NECO', 'NABTEB', 'GCE']),
  examNumber: z.string().min(8, 'Exam number must be at least 8 characters'),
  examYear: z.string().regex(/^\d{4}$/, 'Enter valid year (e.g., 2023)'),
  subjects: z.array(olevelSubjectSchema)
    .min(5, 'Minimum 5 subjects required')
    .max(9, 'Maximum 9 subjects allowed')
    .refine(
      (subjects) => {
        const subjectNames = subjects.map(s => s.subject.toLowerCase());
        return subjectNames.includes('english language') && subjectNames.includes('mathematics');
      },
      { message: 'English Language and Mathematics are compulsory' }
    )
});

const admissionSchema = z.object({
  // Biodata
  surname: z.string().min(2, 'Surname is required'),
  firstName: z.string().min(2, 'First name is required'),
  middleName: z.string().optional(),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female']),
  stateOfOrigin: z.string().min(2, 'State of origin is required'),
  lga: z.string().min(2, 'LGA is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  religion: z.enum(['Christianity', 'Islam', 'Traditional', 'Others']),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  phoneNumber: z.string().regex(phoneRegex, 'Invalid Nigerian phone number'),
  email: z.string().email('Invalid email address'),
  residentialAddress: z.string().min(10, 'Address must be at least 10 characters'),
  nin: z.string().regex(ninRegex, 'NIN must be exactly 11 digits'),
  passportPhoto: z.string().url('Valid photo URL is required'),

  // JAMB Details
  jambRegNumber: z.string().regex(jambRegex, 'Invalid JAMB registration number'),
  jambScore: z.number().min(100, 'JAMB score must be at least 100').max(400, 'JAMB score cannot exceed 400'),

  // Programme
  firstChoice: z.string().min(2, 'Select first choice of programme'),
  secondChoice: z.string().min(2, 'Select second choice of programme'),

  // O-Level Results
  firstSitting: olevelSittingSchema,
  secondSitting: olevelSittingSchema.optional(),

  // Next of Kin
  nokFullName: z.string().min(3, 'Next of kin full name is required'),
  nokRelationship: z.string().min(2, 'Relationship is required'),
  nokPhoneNumber: z.string().regex(phoneRegex, 'Invalid phone number'),
  nokAddress: z.string().min(10, 'Address must be at least 10 characters')
});

type FormData = z.infer<typeof admissionSchema>;




// States now provided by `constants/admissionConstants.ts` and used inside `BiodataStep`.

export default function AdmissionWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);
  const [isRedirecting, setIsRedirecting] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { mutate: submitApplication, isPending, isSuccess } = useSubmitApplication();

  const backgroundImages = ['/bg5.jpeg', '/bg6.jpeg', '/bg3.jpeg', '/bg4.jpeg'];

  // Rotate background images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const methods = useForm<FormData>({
    resolver: zodResolver(admissionSchema),
    mode: 'onBlur',
    defaultValues: {
      nationality: 'Nigeria',
      passportPhoto: '',
      firstSitting: {
        subjects: [
          { subject: 'English Language', grade: 'A1' as const },
          { subject: 'Mathematics', grade: 'A1' as const }
        ]
      }
    }
  });

  const { register, handleSubmit, formState: { errors }, trigger } = methods;

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
  };

  // Photo upload/preview handled by `PhotoUpload` component via form context

  const steps = [
    { id: 1, name: 'Biodata', icon: User },
    { id: 2, name: 'Programme', icon: GraduationCap },
    { id: 3, name: 'O-Level Results', icon: FileText },
    { id: 4, name: 'Next of Kin', icon: Users }
  ];

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ['surname', 'firstName', 'dateOfBirth', 'gender', 'stateOfOrigin', 'lga', 'nationality', 'religion', 'maritalStatus', 'phoneNumber', 'email', 'residentialAddress', 'nin', 'passportPhoto'];
    } else if (step === 2) {
      fieldsToValidate = ['jambRegNumber', 'jambScore', 'firstChoice', 'secondChoice'];
    } else if (step === 3) {
      fieldsToValidate = ['firstSitting'];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid && step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const onSubmit = async (data: FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const submitData: SubmitApplicationRequest = { ...(data as any), school: "68bedd3118ba258795f458c6" };
    submitApplication(submitData, {
      onSuccess: (response) => {
        toast.success('Application submitted successfully!, Initializing Payment...');
        console.log('Payment Info:', response.payment);
        if (response.payment) {
          // Initialize redirect flow: show success UI with countdown, then redirect after 5s
          setRedirectUrl(response.payment.authorization_url);
          setRedirectCountdown(5);
          setIsRedirecting(true);
        }
      },
      onError: (error) => {
        toast.error(`Submission failed: ${error.message}`);
      }
    });
  }

  // Redirect countdown effect (runs when redirect flow is started)
  useEffect(() => {
    if (!isRedirecting || !redirectUrl) return;

    const tick = setInterval(() => {
      setRedirectCountdown((c) => {
        if (c <= 1) {
          clearInterval(tick);
          // final redirect
          window.location.href = redirectUrl;
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [isRedirecting, redirectUrl]);


  if (isSuccess) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
        style={{
          background: 'black'
        }}
      >
        {/* Background Image Layer */}
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

        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(20px); }
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

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
          style={{
            animation: 'slide-in 0.6s ease-out'
          }}
        >
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
            <div className="relative z-10 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: '0 0 1rem 0', letterSpacing: '-0.3px' }}>
                Application Submitted!
              </h2>

              <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 1.5rem 0', lineHeight: '1.6' }}>
                Your complementary admission application has been received. You will be notified via email about the next steps.
              </p>

              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '0.75rem',
                  padding: '0.75rem',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.95)',
                  marginBottom: '1.5rem',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Important: Your application will not be considered until payment is completed. You will be redirected to the payment gateway to complete payment.
                </p>
              </div>

              {isRedirecting ? (
                <div>
                  <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 1.5rem 0' }}>
                    Redirecting to payment gateway in <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1.1rem' }}>{redirectCountdown}</span>s...
                  </p>
                  <div className="flex flex-col gap-3">
                    <button
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 168, 107, 0.6) 0%, rgba(38, 214, 138, 0.6) 100%)',
                        color: 'white',
                        padding: '0.875rem 1.5rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        borderRadius: '0.75rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'not-allowed',
                        opacity: 0.7,
                        backdropFilter: 'blur(10px)'
                      }}
                      disabled
                    >
                      Redirecting…
                    </button>

                    {/* Optional immediate proceed button */}
                    {redirectUrl && (
                      <button
                        onClick={() => { window.location.href = redirectUrl; }}
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)',
                          color: 'white',
                          padding: '0.875rem 1.5rem',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          borderRadius: '0.75rem',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          boxShadow: '0 4px 15px 0 rgba(34, 197, 94, 0.4)',
                          backdropFilter: 'blur(10px)',
                          letterSpacing: '-0.3px'
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px 0 rgba(34, 197, 94, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px 0 rgba(34, 197, 94, 0.4)';
                        }}
                        aria-label="Proceed to payment now"
                      >
                        Proceed Now
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => window.location.reload()}
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)',
                    color: 'white',
                    padding: '0.875rem 2rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px 0 rgba(34, 197, 94, 0.4)',
                    backdropFilter: 'blur(10px)',
                    letterSpacing: '-0.3px',
                    width: '100%'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px 0 rgba(34, 197, 94, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                    (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px 0 rgba(34, 197, 94, 0.4)';
                  }}
                >
                  Submit Another Application
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen flex flex-col relative overflow-hidden"
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

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(20px); }
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

        input::placeholder,
        textarea::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      `}</style>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen pt-20 pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl">
          {/* Header with Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl shadow-2xl p-8 mb-6 relative overflow-hidden"
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

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
              <img
                src="/logo.jpg"
                alt="OMARK Logo"
                className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', margin: '0 0 0.5rem 0', letterSpacing: '-0.3px' }} className="md:text-xl md:leading-tight">
                   O’MARK SCHOOL OF HEALTH TECHNOLOGY
                </h1>
                <p style={{ fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)', margin: '0 0 0.25rem 0', fontWeight: 500 }}>
                  Complementary Admission Application Form
                </p>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', margin: '0.25rem 0 0 0', fontStyle: 'italic' }}>
                  Self Reliance and Empowering a Healthier Community
                </p>
              </div>
            </div>
          </motion.div>

          <Stepper steps={steps} step={step} />

          {/* Form Content */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
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

            <div className="relative z-10">
              <FormProvider {...methods}>
                <AnimatePresence initial={false} mode="wait">
                  {step === 1 && (
                    <motion.div key={1} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                      <BiodataStep />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key={2} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                      <ProgrammeStep />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key={3} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="space-y-8">
                      <OLevelStep />
                    </motion.div>
                  )}

                  {/* Step 4: Next of Kin */}
                  {step === 4 && (
                    <motion.div key={4} custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }} className="space-y-6">
                      <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)' }}>
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white', margin: 0, letterSpacing: '-0.3px' }}>
                          Next of Kin Information
                        </h2>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          Full Name *
                        </label>
                        <input
                          {...register('nokFullName')}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                          }}
                          placeholder="Enter full name"
                          onFocus={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                          }}
                        />
                        {errors.nokFullName?.message && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>{String(errors.nokFullName.message)}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                            Relationship *
                          </label>
                          <input
                            {...register('nokRelationship')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '0.75rem',
                              background: 'rgba(255, 255, 255, 0.15)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              fontSize: '0.95rem',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                            }}
                            placeholder="e.g., Father, Mother, Guardian"
                            onFocus={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                            }}
                          />
                          {errors.nokRelationship?.message && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>{String(errors.nokRelationship.message)}</p>}
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                            Phone Number *
                          </label>
                          <input
                            {...register('nokPhoneNumber')}
                            style={{
                              width: '100%',
                              padding: '0.75rem 1rem',
                              borderRadius: '0.75rem',
                              background: 'rgba(255, 255, 255, 0.15)',
                              border: '1px solid rgba(255, 255, 255, 0.3)',
                              color: 'white',
                              fontSize: '0.95rem',
                              transition: 'all 0.3s ease',
                              backdropFilter: 'blur(10px)',
                            }}
                            placeholder="+234 or 0801234567"
                            onFocus={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                              e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                            }}
                          />
                          {errors.nokPhoneNumber?.message && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>{String(errors.nokPhoneNumber.message)}</p>}
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                          Address *
                        </label>
                        <textarea
                          {...register('nokAddress')}
                          rows={3}
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            borderRadius: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.15)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            color: 'white',
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            backdropFilter: 'blur(10px)',
                            resize: 'none',
                          }}
                          placeholder="Enter full address"
                          onFocus={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.5)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                            e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.3)';
                          }}
                        />
                        {errors.nokAddress?.message && <p style={{ color: 'rgba(255,100,100,0.9)', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>{String(errors.nokAddress.message)}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 1.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        color: 'rgba(255,255,255,0.9)',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        transition: 'all 0.3s ease',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px 0 rgba(255, 255, 255, 0.2)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <ChevronLeft className="w-5 h-5 mr-2" />
                      Previous
                    </button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.75rem 2rem',
                        background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)',
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        marginLeft: 'auto',
                        boxShadow: '0 4px 15px 0 rgba(34, 197, 94, 0.4)',
                        backdropFilter: 'blur(10px)',
                        letterSpacing: '-0.3px'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px 0 rgba(34, 197, 94, 0.6)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px 0 rgba(34, 197, 94, 0.4)';
                      }}
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isPending}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem 2.5rem',
                        background: isPending ? 'rgba(34, 197, 94, 0.5)' : 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(74, 222, 128, 0.9) 100%)',
                        color: 'white',
                        borderRadius: '0.75rem',
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        marginLeft: 'auto',
                        boxShadow: isPending ? '0 4px 15px 0 rgba(34, 197, 94, 0.2)' : '0 4px 15px 0 rgba(34, 197, 94, 0.4)',
                        backdropFilter: 'blur(10px)',
                        letterSpacing: '-0.3px',
                        opacity: isPending ? 0.7 : 1,
                      }}
                      onMouseEnter={(e) => {
                        if (!isPending) {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 8px 20px 0 rgba(34, 197, 94, 0.6)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isPending) {
                          (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 15px 0 rgba(34, 197, 94, 0.4)';
                        }
                      }}
                    >
                      {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  )}
                </div>
              </FormProvider>
            </div>
          </motion.form>
        </div>
      </div>
    </main>
  );
}