// src/components/kyc/ProgressStepper.jsx

export const ProgressStepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Start', icon: '📋' },
    { number: 2, label: 'Aadhaar', icon: '🆔' },
    { number: 3, label: 'Face', icon: '📸' },
    { number: 4, label: 'Complete', icon: '✅' },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6">
      {/* Desktop & Tablet: Horizontal */}
      <div className="hidden sm:flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg
                  transition-all duration-300
                  ${
                    currentStep > step.number
                      ? 'bg-black text-white'  // Completed
                      : currentStep === step.number
                      ? 'bg-black text-white ring-4 ring-gray-200'  // Active
                      : 'bg-gray-200 text-gray-500'  // Upcoming
                  }
                `}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>
              <p
                className={`
                  mt-2 text-sm font-medium
                  ${currentStep >= step.number ? 'text-black' : 'text-gray-400'}
                `}
              >
                {step.label}
              </p>
            </div>

            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-1 bg-gray-200 relative">
                <div
                  className={`
                    absolute top-0 left-0 h-full bg-black transition-all duration-500
                    ${currentStep > step.number ? 'w-full' : 'w-0'}
                  `}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: Vertical */}
      <div className="sm:hidden">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-start mb-6 last:mb-0">
            {/* Step Circle */}
            <div className="flex flex-col items-center mr-4">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-bold
                  transition-all duration-300
                  ${
                    currentStep > step.number
                      ? 'bg-black text-white'
                      : currentStep === step.number
                      ? 'bg-black text-white ring-4 ring-gray-200'
                      : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {currentStep > step.number ? '✓' : step.number}
              </div>

              {/* Vertical Line */}
              {index < steps.length - 1 && (
                <div className="w-1 h-12 bg-gray-200 mt-2 relative">
                  <div
                    className={`
                      absolute top-0 left-0 w-full bg-black transition-all duration-500
                      ${currentStep > step.number ? 'h-full' : 'h-0'}
                    `}
                  />
                </div>
              )}
            </div>

            {/* Step Info */}
            <div className="flex-1 pt-2">
              <h3
                className={`
                  font-medium text-base
                  ${currentStep >= step.number ? 'text-black' : 'text-gray-400'}
                `}
              >
                {step.label}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {step.number === 1 && 'Begin verification process'}
                {step.number === 2 && 'Verify your Aadhaar number'}
                {step.number === 3 && 'Complete face verification'}
                {step.number === 4 && 'Verification complete'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
