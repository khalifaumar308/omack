import { useFormContext } from 'react-hook-form';
import PhotoUpload from './PhotoUpload';
import { NIGERIAN_STATES } from '@/constants/admissionConstants';

export default function BiodataStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Surname *</label>
          <input {...register('surname')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter surname" />
          {errors.surname?.message && <p className="text-red-600 text-sm mt-1">{String(errors.surname.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
          <input {...register('firstName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter first name" />
          {errors.firstName?.message && <p className="text-red-600 text-sm mt-1">{String(errors.firstName.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
          <input {...register('middleName')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter middle name" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
          <input type="date" {...register('dateOfBirth')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          {errors.dateOfBirth?.message && <p className="text-red-600 text-sm mt-1">{String(errors.dateOfBirth.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
          <select {...register('gender')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          {errors.gender?.message && <p className="text-red-600 text-sm mt-1">{String(errors.gender.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Marital Status *</label>
          <select {...register('maritalStatus')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Select status</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          {errors.maritalStatus?.message && <p className="text-red-600 text-sm mt-1">{String(errors.maritalStatus.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">State of Origin *</label>
          <select {...register('stateOfOrigin')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Select state</option>
            {NIGERIAN_STATES.map(state => <option key={state} value={state}>{state}</option>)}
          </select>
          {errors.stateOfOrigin?.message && <p className="text-red-600 text-sm mt-1">{String(errors.stateOfOrigin.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">LGA *</label>
          <input {...register('lga')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter LGA" />
          {errors.lga?.message && <p className="text-red-600 text-sm mt-1">{String(errors.lga.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
          <input {...register('nationality')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter nationality" />
          {errors.nationality?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nationality.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Religion *</label>
          <select {...register('religion')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Select religion</option>
            <option value="Christianity">Christianity</option>
            <option value="Islam">Islam</option>
            <option value="Traditional">Traditional</option>
            <option value="Others">Others</option>
          </select>
          {errors.religion?.message && <p className="text-red-600 text-sm mt-1">{String(errors.religion.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">NIN (11 digits) *</label>
          <input {...register('nin')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter 11-digit NIN" maxLength={11} />
          {errors.nin?.message && <p className="text-red-600 text-sm mt-1">{String(errors.nin.message)}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
          <input {...register('phoneNumber')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="+234 or 0801234567" />
          {errors.phoneNumber?.message && <p className="text-red-600 text-sm mt-1">{String(errors.phoneNumber.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
          <input type="email" {...register('email')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="your.email@example.com" />
          {errors.email?.message && <p className="text-red-600 text-sm mt-1">{String(errors.email.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Residential Address *</label>
        <textarea {...register('residentialAddress')} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter full residential address" />
        {errors.residentialAddress?.message && <p className="text-red-600 text-sm mt-1">{String(errors.residentialAddress.message)}</p>}
      </div>

      <PhotoUpload />
    </div>
  );
}
