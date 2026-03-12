// @ts-nocheck
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ToolShell } from '@/components/diagnostics/tool-shell';
import {
  DOMAIN_DEFINITIONS,
  type DecisionDomain,
} from '@/lib/career/decision-domains';

type Phase = 'intro' | 'selection' | 'details';

export default function DomainOutputViewerPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('intro');
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const selectedDomain = selectedDomainId
    ? DOMAIN_DEFINITIONS.find((d) => d.id === selectedDomainId)
    : null;

  const handleStartExploring = () => {
    setPhase('selection');
  };

  const handleSelectDomain = (domainId: string) => {
    setSelectedDomainId(domainId);
    setPhase('details');
    setExpandedTools(new Set());
  };

  const handleBackToDashboard = () => {
    router.push('/map');
  };

  const handleChangeSelection = () => {
    setPhase('selection');
    setSelectedDomainId(null);
    setExpandedTools(new Set());
  };

  const toggleToolExpanded = (toolId: string) => {
    const newExpanded = new Set(expandedTools);
    if (newExpanded.has(toolId)) {
      newExpanded.delete(toolId);
    } else {
      newExpanded.add(toolId);
    }
    setExpandedTools(newExpanded);
  };

  const handleNavigateToTool = (toolId: string) => {
    router.push(`/map/${toolId}`);
  };

  return (
    <ToolShell
      title="Domain Output Viewer"
      subtitle="Explore decision domain frameworks and the tools available for each"
      duration="~2 min"
    >
      {phase === 'intro' && (
        <div className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-purple-900">
              Learn about the 5 decision domains that guide career development. Each domain focuses on a specific area of career decision-making and includes specialized tools to help you succeed.
            </p>
          </div>
          <button
            onClick={handleStartExploring}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition"
          >
            Explore Decision Domains
          </button>
        </div>
      )}

      {phase === 'selection' && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">Select a domain to view its framework and tools:</p>
          <div className="grid gap-3">
            {DOMAIN_DEFINITIONS.map((domain) => (
              <button
                key={domain.id}
                onClick={() => handleSelectDomain(domain.id)}
                className="w-full text-left p-4 border border-gray-300 hover:border-purple-500 hover:bg-purple-50 rounded-lg transition space-y-2"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{domain.icon}</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{domain.name}</h3>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                  <div className="text-gray-400">→</div>
                </div>
              </button>
            ))}
          </div>
          <button
            onClick={handleBackToDashboard}
            className="w-full mt-6 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
          >
            Back to Tools
          </button>
        </div>
      )}

      {phase === 'details' && selectedDomain && (
        <div className="space-y-8">
          {/* Domain Header */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{selectedDomain.icon}</div>
              <div>
                <h2 className="text-3xl font-bold text-purple-900">{selectedDomain.name}</h2>
                <p className="text-purple-700 mt-1">{selectedDomain.description}</p>
              </div>
            </div>
          </div>

          {/* Core Information Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Core Decision */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Core Decision</h4>
              <p className="text-gray-700">{selectedDomain.coreDecision}</p>
            </div>

            {/* Age Range */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Age Range</h4>
              <p className="text-gray-700">{selectedDomain.ageRange}</p>
            </div>

            {/* Weight Emphasis */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Key Focus Areas</h4>
              <div className="space-y-1">
                {selectedDomain.weightEmphasis.map((emphasis, idx) => (
                  <div key={idx} className="text-sm text-gray-700 flex items-start space-x-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{emphasis}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Related Domains */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-gray-900 text-sm">Related Domains</h4>
              <div className="space-y-1">
                {selectedDomain.relatedDomains.map((relatedId, idx) => {
                  const relatedDomain = DOMAIN_DEFINITIONS.find((d) => d.id === relatedId);
                  return relatedDomain ? (
                    <div key={idx} className="text-sm text-gray-700">
                      {relatedDomain.icon} {relatedDomain.name}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>

          {/* Primary Tools Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Primary Tools for This Domain</h3>
            <div className="space-y-3">
              {selectedDomain.primaryTools.map((toolId) => (
                <div
                  key={toolId}
                  className="border border-gray-300 rounded-lg overflow-hidden hover:border-purple-400 transition"
                >
                  <button
                    onClick={() => toggleToolExpanded(toolId)}
                    className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-900 flex items-center justify-between"
                  >
                    <span>→ {toolId.replace(/-/g, ' ').toUpperCase()}</span>
                    <span className="text-gray-500">
                      {expandedTools.has(toolId) ? '−' : '+'}
                    </span>
                  </button>
                  {expandedTools.has(toolId) && (
                    <div className="px-4 py-3 bg-white border-t border-gray-200 space-y-3">
                      <p className="text-sm text-gray-600">
                        This tool is specifically designed to help you address the core decision of the{' '}
                        <strong>{selectedDomain.name}</strong> domain.
                      </p>
                      <button
                        onClick={() => handleNavigateToTool(toolId)}
                        className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition"
                      >
                        Open {toolId.replace(/-/g, ' ').toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Secondary Tools Section */}
          {selectedDomain.secondaryTools && selectedDomain.secondaryTools.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Secondary Tools</h3>
              <div className="space-y-3">
                {selectedDomain.secondaryTools.map((toolId) => (
                  <div
                    key={toolId}
                    className="border border-gray-300 rounded-lg overflow-hidden hover:border-purple-400 transition"
                  >
                    <button
                      onClick={() => toggleToolExpanded(toolId)}
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-900 flex items-center justify-between"
                    >
                      <span>→ {toolId.replace(/-/g, ' ').toUpperCase()}</span>
                      <span className="text-gray-500">
                        {expandedTools.has(toolId) ? '−' : '+'}
                      </span>
                    </button>
                    {expandedTools.has(toolId) && (
                      <div className="px-4 py-3 bg-white border-t border-gray-200 space-y-3">
                        <p className="text-sm text-gray-600">
                          This complementary tool provides additional support for the{' '}
                          <strong>{selectedDomain.name}</strong> domain.
                        </p>
                        <button
                          onClick={() => handleNavigateToTool(toolId)}
                          className="w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded transition"
                        >
                          Open {toolId.replace(/-/g, ' ').toUpperCase()}
                        </button>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={handleChangeSelection}
              className="flex-1 px-4 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition"
            >
              View Another Domain
            </button>
            <button
              onClick={handleBackToDashboard}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition"
            >
              Back to Tools
            </button>
          </div>
        </div>
      )}
    </ToolShell>
  );
}
