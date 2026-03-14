'use client'

import { useState, useEffect } from 'react'

interface ConstellationRevealProps {
  archetypeName: string
  onComplete: () => void
}

export default function ConstellationReveal({ archetypeName, onComplete }: ConstellationRevealProps) {
  const [stage, setStage] = useState(0)
  const [displayedName, setDisplayedName] = useState('')

  useEffect(() => {
    const timers: NodeJS.Timeout[] = []

    // Stage 0: "Mapping..." (1s)
    timers.push(setTimeout(() => setStage(1), 1000))
    // Stage 1: "Drawing axes..." (1.5s)
    timers.push(setTimeout(() => setStage(2), 2500))
    // Stage 2: "Scoring..." (1s)
    timers.push(setTimeout(() => setStage(3), 3500))
    // Stage 3: Type archetype name (0.5s total)
    timers.push(setTimeout(() => {
      let i = 0
      const typeInterval = setInterval(() => {
        i++
        setDisplayedName(archetypeName.slice(0, i))
        if (i >= archetypeName.length) {
          clearInterval(typeInterval)
        }
      }, 500 / archetypeName.length)
      timers.push(typeInterval as unknown as NodeJS.Timeout)
    }, 3500))
    // Navigate after full animation
    timers.push(setTimeout(onComplete, 4500))

    return () => timers.forEach((t) => { clearTimeout(t); clearInterval(t) })
  }, [archetypeName, onComplete])

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6">
      <div className="text-center">
        {stage < 3 && (
          <p className="text-[#c9a84c] text-sm tracking-[0.3em] uppercase animate-pulse">
            {stage === 0 && 'Mapping your Capability Constellation...'}
            {stage === 1 && 'Drawing axes...'}
            {stage === 2 && 'Scoring your profile...'}
          </p>
        )}
        {stage >= 3 && displayedName && (
          <div className="animate-fade-in">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">
              Your Archetype
            </p>
            <h1 className="text-[#e8e8e8] text-3xl md:text-5xl font-light">
              {displayedName}
            </h1>
          </div>
        )}
      </div>
    </div>
  )
}
