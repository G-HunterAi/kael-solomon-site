'use client'

interface ResumeModalProps {
  answeredCount: number
  onResume: () => void
  onStartOver: () => void
}

export default function ResumeModal({ answeredCount, onResume, onStartOver }: ResumeModalProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-6">
      <div className="bg-[#111] border border-[#333] rounded-lg p-8 max-w-md w-full animate-fade-in">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-3">
          Assessment In Progress
        </p>
        <p className="text-[#e8e8e8] text-lg mb-2">
          You have an assessment in progress
        </p>
        <p className="text-[#888] text-sm mb-8">
          {answeredCount} of 18 questions answered.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onResume}
            className="flex-1 bg-[#c9a84c] text-[#0a0a0a] px-4 py-3 text-sm font-medium hover:bg-[#d4b35a] transition-colors"
          >
            Resume
          </button>
          <button
            onClick={onStartOver}
            className="flex-1 border border-[#333] text-[#888] px-4 py-3 text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}
