import { useFormContext } from 'react-hook-form';
import PhotoUpload from './PhotoUpload';
import { NIGERIAN_STATES } from '@/constants/admissionConstants';
import { User } from 'lucide-react';

export default function BiodataStep() {
  const { register, formState: { errors } } = useFormContext();

  const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-red-600 text-sm mt-2 font-medium";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <User className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Personal Information</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClasses}>Surname *</label>
          <input {...register('surname')} className={inputClasses} placeholder="Enter surname" />
          {errors.surname?.message && <p className={errorClasses}>{String(errors.surname.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>First Name *</label>
          <input {...register('firstName')} className={inputClasses} placeholder="Enter first name" />
          {errors.firstName?.message && <p className={errorClasses}>{String(errors.firstName.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>Middle Name</label>
          <input {...register('middleName')} className={inputClasses} placeholder="Enter middle name" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClasses}>Date of Birth *</label>
          <input type="date" {...register('dateOfBirth')} className={inputClasses} />
          {errors.dateOfBirth?.message && <p className={errorClasses}>{String(errors.dateOfBirth.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>Gender *</label>
          <select {...register('gender')} className={inputClasses}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender?.message && <p className={errorClasses}>{String(errors.gender.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>Marital Status *</label>
          <select {...register('maritalStatus')} className={inputClasses}>
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          {errors.maritalStatus?.message && <p className={errorClasses}>{String(errors.maritalStatus.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className={labelClasses}>State of Origin *</label>
          <select {...register('stateOfOrigin')} className={inputClasses}>
            <option value="">Select state</option>
            {NIGERIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          {errors.stateOfOrigin?.message && <p className={errorClasses}>{String(errors.stateOfOrigin.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>LGA *</label>
          <input {...register('lga')} className={inputClasses} placeholder="Enter LGA" />
          {errors.lga?.message && <p className={errorClasses}>{String(errors.lga.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>Nationality *</label>
          <input {...register('nationality')} className={inputClasses} placeholder="Enter nationality" />
          {errors.nationality?.message && <p className={errorClasses}>{String(errors.nationality.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Religion *</label>
          <select {...register('religion')} className={inputClasses}>
            <option value="">Select religion</option>
            <option value="Christianity">Christianity</option>
            <option value="Islam">Islam</option>
            <option value="Traditional">Traditional</option>
            <option value="Others">Others</option>
          </select>
          {errors.religion?.message && <p className={errorClasses}>{String(errors.religion.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>NIN (11 digits) *</label>
          <input {...register('nin')} className={inputClasses} placeholder="Enter 11-digit NIN" maxLength={11} />
          {errors.nin?.message && <p className={errorClasses}>{String(errors.nin.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>Phone Number *</label>
          <input {...register('phoneNumber')} className={inputClasses} placeholder="+234 or 0801234567" />
          {errors.phoneNumber?.message && <p className={errorClasses}>{String(errors.phoneNumber.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>Email Address *</label>
          <input type="email" {...register('email')} className={inputClasses} placeholder="your.email@example.com" />
          {errors.email?.message && <p className={errorClasses}>{String(errors.email.message)}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>Residential Address *</label>
        <textarea {...register('residentialAddress')} rows={3} className={`${inputClasses} resize-none`} placeholder="Enter full residential address" />
        {errors.residentialAddress?.message && <p className={errorClasses}>{String(errors.residentialAddress.message)}</p>}
      </div>

      <PhotoUpload />
    </div>
  );
}
