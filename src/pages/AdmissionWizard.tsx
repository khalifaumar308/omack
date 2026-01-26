import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, ChevronLeft, Check, User, GraduationCap, FileText, Users, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Stepper from '../components/admissions/Stepper';
import BiodataStep from '../components/admissions/BiodataStep';
import OLevelStep from '../components/admissions/OLevelStep';
import ProgrammeStep from '../components/admissions/ProgrammeStep';
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
  const [applicationNumber, setApplicationNumber] = useState<string | null>(null);
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
    const submitData: SubmitApplicationRequest = { ...(data as any) };
    submitApplication(submitData, {
      onSuccess: (response) => {
          toast.success('Application submitted successfully!, Initializing Payment...');
            setApplicationNumber(response.application._id);
        if (response.payment) {
          // Redirect to payment gateway
          window.location.href = response.payment.authorization_url;
        }
      },
      onError: (error) => {
        toast.error(`Submission failed: ${error.message}`);
      }
    });
  }
    

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-linear-to-br from-emerald-50 to-teal-100 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">Your complementary admission application has been received. You will be notified via email about the next steps.</p>
          {applicationNumber && (
            <div className="mb-6">
              <p className="text-lg font-semibold text-gray-800 mb-2">Your Application Number:</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-2xl font-bold text-indigo-700">{applicationNumber}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(applicationNumber);
                    toast.success('Application number copied!');
                  }}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Copy application number"
                >
                  <Clipboard className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Submit Another Application
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div>
      <Navigation isScrolled={false} />
      <div className="min-h-screen mt-16  py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-2xl shadow-xl p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Apex College OF Health</h1>
            <p className="text-center text-gray-600">Complementary Admission Application Form</p>
          </div>

          <Stepper steps={steps} step={step} />

          {/* Form Content */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-b-2xl shadow-xl p-8">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Next of Kin Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    {...register('nokFullName')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter full name"
                  />
                  {errors.nokFullName?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nokFullName.message)}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship *</label>
                    <input
                      {...register('nokRelationship')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Father, Mother, Guardian"
                    />
                    {errors.nokRelationship?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nokRelationship.message)}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      {...register('nokPhoneNumber')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="+234 or 0801234567"
                    />
                    {errors.nokPhoneNumber?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nokPhoneNumber.message)}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    {...register('nokAddress')}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter full address"
                  />
                  {errors.nokAddress?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nokAddress.message)}</p>}
                </div>
              </motion.div>
            )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
                >
                  {isPending ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
            </FormProvider>
          </form>
        </div>
      </div>
    </div>
  );
}