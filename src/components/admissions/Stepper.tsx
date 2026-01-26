import React from 'react';
import { Check } from 'lucide-react';

type Step = { id: number; name: string; icon: React.ElementType };

export default function Stepper({ steps, step }: { steps: Step[]; step: number }) {
  return (
    <div className="bg-white shadow-xl px-6 py-8">
      <div className="flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isComplete = step > s.id;

          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  isComplete ? 'bg-emerald-600' : isActive ? 'bg-indigo-600' : 'bg-gray-300'
                }`}>
                  {isComplete ? <Check className="w-6 h-6 text-white" /> : <Icon className="w-6 h-6 text-white" />}
                </div>
                <span className={`mt-2 text-xs font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>{s.name}</span>
              </div>
              {idx < steps.length - 1 && <div className={`flex-1 h-1 mx-2 rounded ${step > s.id ? 'bg-emerald-600' : 'bg-gray-300'}`} />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
