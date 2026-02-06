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
import Navigation from '@/components/landing/Navigation';

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
  const { mutate: submitApplication, isPending, isSuccess } = useSubmitApplication();

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
    const submitData: SubmitApplicationRequest = { ...(data as any), school: "69539d1badfedb6b7d51126c" };
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
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center p-4"
      >
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/20 relative overflow-hidden">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Check className="w-14 h-14 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent mb-4">Application Submitted!</h2>
            <p className="text-gray-700 mb-6 text-lg">Your complementary admission application has been received. You will be notified via email about the next steps.</p>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
              <p className="text-sm text-red-800 font-medium">Important: Your application will not be considered until payment is completed. You will be redirected to the payment gateway to complete payment.</p>
            </div>
            {isRedirecting ? (
              <div>
                <p className="text-gray-700 mb-4 text-lg">Redirecting to payment gateway in <span className="font-bold text-blue-600 text-xl">{redirectCountdown}</span>s...</p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-6 py-3 rounded-xl opacity-80 cursor-not-allowed shadow-lg"
                    disabled
                  >
                    Redirecting…
                  </button>

                  {/* Optional immediate proceed button */}
                  {redirectUrl && (
                    <button
                      onClick={() => { window.location.href = redirectUrl; }}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Submit Another Application
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Navigation isScrolled={false} />
      <div className="min-h-screen pt-20 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header with Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mb-6 border border-white/20 relative overflow-hidden"
          >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-6">
              <img
                src="/acohsatlogo.jpg"
                alt="ACOHSAT Logo"
                className="w-24 h-24 md:w-28 md:h-28 object-contain drop-shadow-lg"
              />
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent mb-2">
                  Apex College of Health Sciences and Technology
                </h1>
                <p className="text-lg text-gray-700 font-medium">Complementary Admission Application Form</p>
                <p className="text-sm text-gray-600 mt-1 italic">Self Reliance and Empowering a Healthier Community</p>
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
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 relative overflow-hidden"
          >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-transparent pointer-events-none" />

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
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Next of Kin Information</h2>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                        <input
                          {...register('nokFullName')}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter full name"
                        />
                        {errors.nokFullName?.message && <p className="text-red-600 text-sm mt-2 font-medium">{String(errors.nokFullName.message)}</p>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Relationship *</label>
                          <input
                            {...register('nokRelationship')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            placeholder="e.g., Father, Mother, Guardian"
                          />
                          {errors.nokRelationship?.message && <p className="text-red-600 text-sm mt-2 font-medium">{String(errors.nokRelationship.message)}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number *</label>
                          <input
                            {...register('nokPhoneNumber')}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                            placeholder="+234 or 0801234567"
                          />
                          {errors.nokPhoneNumber?.message && <p className="text-red-600 text-sm mt-2 font-medium">{String(errors.nokPhoneNumber.message)}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
                        <textarea
                          {...register('nokAddress')}
                          rows={3}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm resize-none"
                          placeholder="Enter full address"
                        />
                        {errors.nokAddress?.message && <p className="text-red-600 text-sm mt-2 font-medium">{String(errors.nokAddress.message)}</p>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-10 pt-8 border-t-2 border-gray-200">
                  {step > 1 ? (
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex items-center px-6 py-3 border-2 border-blue-300 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-300 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
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
                      className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 ml-auto font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Next
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isPending}
                      className="flex items-center px-10 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ml-auto font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                    >
                      {isPending ? 'Submitting...' : 'Submit Application'}
                    </button>
                  )}
                </div>
              </FormProvider>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}