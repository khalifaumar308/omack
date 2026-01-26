import { useFormContext } from 'react-hook-form';
import { PROGRAMMES } from '@/constants/admissionConstants';

export default function ProgrammeStep() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Programme & JAMB Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JAMB Registration Number *</label>
          <input {...register('jambRegNumber')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase" placeholder="e.g., 12345678AB" />
          {errors.jambRegNumber?.message && <p className="text-red-600 text-sm mt-1">{String(errors.jambRegNumber.message)}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">JAMB Score (100-400) *</label>
          <input type="number" {...register('jambScore', { valueAsNumber: true })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter JAMB score" min={100} max={400} />
          {errors.jambScore?.message && <p className="text-red-600 text-sm mt-1">{String(errors.jambScore.message)}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">First Choice of Programme *</label>
        <select {...register('firstChoice')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="">Select programme</option>
          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.firstChoice?.message && <p className="text-red-600 text-sm mt-1">{String(errors.firstChoice.message)}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Second Choice of Programme *</label>
        <select {...register('secondChoice')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="">Select programme</option>
          {PROGRAMMES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        {errors.secondChoice?.message && <p className="text-red-600 text-sm mt-1">{String(errors.secondChoice.message)}</p>}
      </div>
    </div>
  );
}
