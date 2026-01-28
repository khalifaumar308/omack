import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

type Step = { id: number; name: string; icon: React.ElementType };

export default function Stepper({ steps, step }: { steps: Step[]; step: number }) {
  return (
    <div className="bg-white/80 backdrop-blur-xl shadow-2xl px-6 py-10 mb-6 rounded-3xl border border-white/20 relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 pointer-events-none" />

      <div className="relative z-10 flex justify-between items-center max-w-3xl mx-auto">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = step === s.id;
          const isComplete = step > s.id;

          return (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${isComplete
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600'
                      : isActive
                        ? 'bg-gradient-to-br from-blue-600 to-cyan-600 ring-4 ring-blue-200'
                        : 'bg-gray-300'
                    }`}
                >
                  {isComplete ? (
                    <Check className="w-7 h-7 text-white" strokeWidth={3} />
                  ) : (
                    <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                  )}
                </motion.div>
                <span className={`mt-3 text-sm font-semibold transition-colors duration-300 ${isActive
                    ? 'text-blue-700'
                    : isComplete
                      ? 'text-cyan-600'
                      : 'text-gray-500'
                  }`}>
                  {s.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 h-2 mx-4 rounded-full relative overflow-hidden bg-gray-200">
                  <motion.div
                    initial={false}
                    animate={{
                      width: step > s.id ? '100%' : '0%'
                    }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
