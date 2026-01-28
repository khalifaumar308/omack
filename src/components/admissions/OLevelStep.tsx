import { useFormContext, useFieldArray } from 'react-hook-form';
import { SUBJECTS } from '@/constants/admissionConstants';
import { FileText } from 'lucide-react';

export default function OLevelStep() {
  const { register, control, formState: { errors }, watch } = useFormContext();

  const { fields: firstSittingFields, append: appendFirstSitting, remove: removeFirstSitting } = useFieldArray({ control, name: 'firstSitting.subjects' });
  const { fields: secondSittingFields, append: appendSecondSitting, remove: removeSecondSitting } = useFieldArray({ control, name: 'secondSitting.subjects' });

  const hasSecondSittingExamType = watch('secondSitting.examType');
  // derive visibility from field array and watched exam type to avoid sync setState in effects
  const showSecondSitting = secondSittingFields.length > 0 || Boolean(hasSecondSittingExamType)
  console.log('hasSecondSittingExamType:', hasSecondSittingExamType);
  console.log('showSecondSitting:', showSecondSitting, 'secondSittingFields:', secondSittingFields);
  console.log('OLevelStep errors:', errors);

  const inputClasses = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm";
  const labelClasses = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-cyan-600 bg-clip-text text-transparent">O-Level Results</h2>
      </div>

      <div className="border-2 border-blue-200 rounded-2xl p-6 bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 pointer-events-none" />
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-blue-900 mb-4">First Sitting *</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className={labelClasses}>Exam Type *</label>
              <select {...register('firstSitting.examType')} className={inputClasses}>
                <option value="">Select exam</option>
                <option value="WAEC">WAEC</option>
                <option value="NECO">NECO</option>
                <option value="NABTEB">NABTEB</option>
                <option value="GCE">GCE</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Exam Number *</label>
              <input {...register('firstSitting.examNumber')} className={inputClasses} placeholder="Enter exam number" />
            </div>

            <div>
              <label className={labelClasses}>Year *</label>
              <input {...register('firstSitting.examYear')} className={inputClasses} placeholder="e.g., 2023" maxLength={4} />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-gray-700">Subjects & Grades (5-9 subjects) *</label>
              <button type="button" onClick={() => appendFirstSitting({ subject: '', grade: 'A1' as const })} className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors" disabled={firstSittingFields.length >= 9}>+ Add Subject</button>
            </div>

            {firstSittingFields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-7">
                  <select {...register(`firstSitting.subjects.${index}.subject`)} className={inputClasses}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                  </select>
                </div>

                <div className="md:col-span-3">
                  <select {...register(`firstSitting.subjects.${index}.grade`)} className={inputClasses}>
                    {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <button type="button" onClick={() => removeFirstSitting(index)} className="w-full px-4 py-3 text-red-600 border-2 border-red-300 rounded-xl hover:bg-red-50 font-semibold transition-all duration-300" disabled={firstSittingFields.length <= 2}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-2xl p-6 bg-gray-50/80 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-900">Second Sitting (Optional)</h3>
          </div>

          {!showSecondSitting && (
            <div className="mb-4">
              <button type="button" onClick={() => { appendSecondSitting({ subject: 'English Language', grade: 'A1' }); appendSecondSitting({ subject: 'Mathematics', grade: 'A1' }); }} className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors">+ Add Second Sitting</button>
            </div>
          )}

          {showSecondSitting && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className={labelClasses}>Exam Type</label>
                  <select {...register('secondSitting.examType')} className={inputClasses}>
                    <option value="">Select exam</option>
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="NABTEB">NABTEB</option>
                    <option value="GCE">GCE</option>
                  </select>
                </div>

                <div>
                  <label className={labelClasses}>Exam Number</label>
                  <input {...register('secondSitting.examNumber')} className={inputClasses} placeholder="Enter exam number" />
                </div>

                <div>
                  <label className={labelClasses}>Year</label>
                  <input {...register('secondSitting.examYear')} className={inputClasses} placeholder="e.g., 2023" maxLength={4} />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-gray-700">Subjects & Grades</label>
                  <button type="button" onClick={() => appendSecondSitting({ subject: '', grade: 'A1' as const })} className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors" disabled={secondSittingFields.length >= 9}>+ Add Subject</button>
                </div>

                {secondSittingFields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    <div className="md:col-span-7">
                      <select {...register(`secondSitting.subjects.${index}.subject`)} className={inputClasses}>
                        <option value="">Select subject</option>
                        {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select {...register(`secondSitting.subjects.${index}.grade`)} className={inputClasses}>
                        {['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <button type="button" onClick={() => removeSecondSitting(index)} className="w-full px-4 py-3 text-red-600 border-2 border-red-300 rounded-xl hover:bg-red-50 font-semibold transition-all duration-300">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
