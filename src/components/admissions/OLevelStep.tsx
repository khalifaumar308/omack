import { useFormContext, useFieldArray } from 'react-hook-form';
import { SUBJECTS } from '@/constants/admissionConstants';

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
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">O-Level Results</h2>

      <div className="border-2 border-indigo-200 rounded-xl p-6 bg-indigo-50">
        <h3 className="text-xl font-semibold text-indigo-900 mb-4">First Sitting *</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type *</label>
            <select {...register('firstSitting.examType')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select exam</option>
              <option value="WAEC">WAEC</option>
              <option value="NECO">NECO</option>
              <option value="NABTEB">NABTEB</option>
              <option value="GCE">GCE</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Exam Number *</label>
            <input {...register('firstSitting.examNumber')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter exam number" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year *</label>
            <input {...register('firstSitting.examYear')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g., 2023" maxLength={4} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-gray-700">Subjects & Grades (5-9 subjects) *</label>
            <button type="button" onClick={() => appendFirstSitting({ subject: '', grade: 'A1' as const })} className="text-indigo-600 text-sm font-medium hover:text-indigo-700" disabled={firstSittingFields.length >= 9}>+ Add Subject</button>
          </div>

          {firstSittingFields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-7">
                <select {...register(`firstSitting.subjects.${index}.subject`)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">Select subject</option>
                  {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                </select>
              </div>

              <div className="md:col-span-3">
                <select {...register(`firstSitting.subjects.${index}.grade`)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  {['A1','B2','B3','C4','C5','C6','D7','E8','F9'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div className="md:col-span-2">
                <button type="button" onClick={() => removeFirstSitting(index)} className="w-full px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50" disabled={firstSittingFields.length <= 2}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Second Sitting (Optional)</h3>
        </div>

        {!showSecondSitting && (
          <div className="mb-4">
            <button type="button" onClick={() => { appendSecondSitting({ subject: 'English Language', grade: 'A1' }); appendSecondSitting({ subject: 'Mathematics', grade: 'A1' }); }} className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">+ Add Second Sitting</button>
          </div>
        )}

        {showSecondSitting && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Type</label>
                <select {...register('secondSitting.examType')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="">Select exam</option>
                  <option value="WAEC">WAEC</option>
                  <option value="NECO">NECO</option>
                  <option value="NABTEB">NABTEB</option>
                  <option value="GCE">GCE</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exam Number</label>
                <input {...register('secondSitting.examNumber')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter exam number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                <input {...register('secondSitting.examYear')} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="e.g., 2023" maxLength={4} />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-700">Subjects & Grades</label>
                <button type="button" onClick={() => appendSecondSitting({ subject: '', grade: 'A1' as const })} className="text-indigo-600 text-sm font-medium hover:text-indigo-700" disabled={secondSittingFields.length >= 9}>+ Add Subject</button>
              </div>

              {secondSittingFields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-7">
                    <select {...register(`secondSitting.subjects.${index}.subject`)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      <option value="">Select subject</option>
                      {SUBJECTS.map(subj => <option key={subj} value={subj}>{subj}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-3">
                    <select {...register(`secondSitting.subjects.${index}.grade`)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                      {['A1','B2','B3','C4','C5','C6','D7','E8','F9'].map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <button type="button" onClick={() => removeSecondSitting(index)} className="w-full px-4 py-3 text-red-600 border border-red-300 rounded-lg hover:bg-red-50">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
