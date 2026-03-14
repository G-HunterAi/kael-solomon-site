'use client'

interface OptionCardProps {
  label: string
  text: string
  selected: boolean
  onClick: () => void
}

export default function OptionCard({ label, text, selected, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full text-left p-4 md:p-5 rounded-lg border transition-colors duration-150 ${
        selected
          ? 'border-[#c9a84c] bg-[#c9a84c]/10'
          : 'border-[#333] hover:border-[#c9a84c]'
      }`}
    >
      <div className="flex gap-3 items-start">
        <span
          className={`text-sm font-medium mt-0.5 shrink-0 ${
            selected ? 'text-[#c9a84c]' : 'text-[#c9a84c]/60'
          }`}
        >
          {label})
        </span>
        <span className="text-[#e8e8e8] text-sm md:text-base leading-relaxed">{text}</span>
      </div>
    </button>
  )
}
