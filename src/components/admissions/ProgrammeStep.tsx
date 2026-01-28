import { useFormContext } from 'react-hook-form';
import { PROGRAMMES } from '@/constants/admissionConstants';
import { GraduationCap } from 'lucide-react';

export default function ProgrammeStep() {
  const { register, formState: { errors } } = useFormContext();

  const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";
  const errorClasses = "text-red-600 text-sm mt-2 font-medium";

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <GraduationCap className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">Programme & JAMB Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClasses}>JAMB Registration Number *</label>
          <input {...register('jambRegNumber')} className={`${inputClasses} uppercase`} placeholder="e.g., 12345678AB" />
          {errors.jambRegNumber?.message && <p className={errorClasses}>{String(errors.jambRegNumber.message)}</p>}
        </div>

        <div>
          <label className={labelClasses}>JAMB Score (100-400) *</label>
          <input type="number" {...register('jambScore', { valueAsNumber: true })} className={inputClasses} placeholder="Enter JAMB score" min={100} max={400} />
          {errors.jambScore?.message && <p className={errorClasses}>{String(errors.jambScore.message)}</p>}
        </div>
      </div>

      <div>
        <label className={labelClasses}>First Choice of Programme *</label>
        <select {...register('firstChoice')} className={inputClasses}>
          <option value="">Select programme</option>
          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.firstChoice?.message && <p className={errorClasses}>{String(errors.firstChoice.message)}</p>}
      </div>

      <div>
        <label className={labelClasses}>Second Choice of Programme *</label>
        <select {...register('secondChoice')} className={inputClasses}>
          <option value="">Select programme</option>
          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.secondChoice?.message && <p className={errorClasses}>{String(errors.secondChoice.message)}</p>}
      </div>
    </div>
  );
}
