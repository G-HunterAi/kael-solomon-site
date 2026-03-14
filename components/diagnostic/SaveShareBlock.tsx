'use client'

import { useState } from 'react'

interface SaveShareBlockProps {
  archetypeName: string
  resultUrl: string
}

export default function SaveShareBlock({ archetypeName, resultUrl }: SaveShareBlockProps) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const text = `I just got my ACUITY profile. I'm ${archetypeName}. Check yours:`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'My ACUITY Profile', text, url: resultUrl })
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${resultUrl}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 mb-16">
      {/* Share */}
      <div className="flex justify-center">
        <button
          onClick={handleShare}
          className="border border-[#c9a84c] text-[#c9a84c] px-8 py-3 text-sm hover:bg-[#c9a84c]/10 transition-colors"
        >
          {copied ? 'Link copied!' : 'Share your profile'}
        </button>
      </div>

      {/* Email capture placeholder */}
      <div className="border border-[#222] rounded p-6 text-center">
        <p className="text-[#888] text-sm tracking-wide uppercase mb-2">Coming Soon</p>
        <p className="text-[#e8e8e8] text-lg mb-1">
          Save your results + 90-day retest reminder
        </p>
        <p className="text-[#666] text-sm">
          Email results and track your constellation over time.
        </p>
        <p className="text-[#666] text-xs mt-4">Available in the next release.</p>
      </div>

      {/* Archetype rarity */}
      <div className="border border-[#222] rounded p-4 text-center">
        <p className="text-[#666] text-sm">
          How rare is your archetype? Available after 500 assessments.
        </p>
      </div>
    </div>
  )
}
