import React, { useState } from 'react';
import { RadarNode } from '../types';

interface ClassroomRadarProps {
  radarNodes: RadarNode[];
  onSelectTeachNext: () => void;
}

export default function ClassroomRadar({ radarNodes, onSelectTeachNext }: ClassroomRadarProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node-2'); // default to Alex Mercer (Intervention)
  
  const selectedNode = radarNodes.find(n => n.id === selectedNodeId);

  const getStatusColor = (status: RadarNode['status']) => {
    if (status === 'mastered') return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    if (status === 'review') return 'bg-amber-100 text-amber-800 border-amber-300';
    return 'bg-rose-100 text-rose-800 border-rose-300';
  };

  const getStatusBgSolid = (status: RadarNode['status']) => {
    if (status === 'mastered') return 'bg-emerald-600';
    if (status === 'review') return 'bg-amber-500';
    return 'bg-rose-600';
  };

  const getStatusText = (status: RadarNode['status']) => {
    if (status === 'mastered') return 'Mastered';
    if (status === 'review') return 'Review';
    return 'Intervention';
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Page Header */}
      <header className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700">radar</span>
            Classroom Intelligence & Vector Radar
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Physics 101 - Cohort A • Real-time Comprehension Tracking</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Mastered: {radarNodes.filter(n => n.status === 'mastered').length}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Review: {radarNodes.filter(n => n.status === 'review').length}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
            <span>Intervention: {radarNodes.filter(n => n.status === 'intervention').length}</span>
          </span>
        </div>
      </header>

      {/* Bento Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Radar Interactive Map */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl flex flex-col relative overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center z-10 relative">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm animate-pulse text-rose-600">sensors</span>
              Classroom Radar - Live Student Feed
            </h3>
            <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 rounded-full flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Live Syncing
            </span>
          </div>

          {/* Interactive Radar Grid Stage */}
          <div className="flex-1 p-6 relative bg-slate-900 flex items-center justify-center min-h-[420px] select-none rounded-b-3xl">
            
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, #ffffff 1.5px, transparent 0)', backgroundSize: '24px 24px' }}></div>

            {/* Concentric Circle Outlines */}
            <div className="absolute w-[90%] aspect-square rounded-full border border-slate-600/40"></div>
            <div className="absolute w-[65%] aspect-square rounded-full border border-slate-600/60"></div>
            <div className="absolute w-[40%] aspect-square rounded-full border border-slate-600/80"></div>
            <div className="absolute w-[15%] aspect-square rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shadow-inner">
              <span className="material-symbols-outlined text-emerald-300 text-lg">my_location</span>
            </div>

            {/* Sweep Animation Line */}
            <div className="absolute inset-0 origin-center bg-gradient-to-r from-transparent via-transparent to-emerald-500/15 rounded-full pointer-events-none animate-[spin_8s_linear_infinite]"></div>

            {/* Render Stateful Radar Student Nodes */}
            {radarNodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all ${
                    isSelected 
                      ? 'scale-150 ring-4 ring-white/50 z-30 font-extrabold shadow-lg' 
                      : 'hover:scale-125 ring-2 ring-white/30 z-20 shadow-sm'
                  }`}
                  title={`${node.name} - ${node.topic}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full block border-2 border-white ${
                    node.status === 'mastered' 
                      ? 'bg-emerald-500' 
                      : node.status === 'review' 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500 animate-pulse'
                  }`}></span>
                </button>
              );
            })}

            {/* Selected Node Floating Details Card */}
            {selectedNode && (
              <div
                style={{
                  left: `${selectedNode.x > 50 ? selectedNode.x - 34 : selectedNode.x + 4}%`,
                  top: `${selectedNode.y > 50 ? selectedNode.y - 25 : selectedNode.y + 4}%`
                }}
                className="absolute z-40 p-4 w-64 max-w-sm pointer-events-auto transition-all animate-scale-up bg-white border border-slate-200 rounded-2xl shadow-xl text-slate-900"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-xs font-bold text-slate-900">{selectedNode.name}</h4>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${getStatusColor(selectedNode.status)}`}>
                    {getStatusText(selectedNode.status)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mb-2 font-medium">Topic Focus: <span className="font-bold text-slate-900">{selectedNode.topic}</span></p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Concept Mastery</span>
                    <span className="text-slate-900">{selectedNode.masteryPercentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                      className={`h-full rounded-full ${getStatusBgSolid(selectedNode.status)}`}
                      style={{ width: `${selectedNode.masteryPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex justify-between items-center">
                  <button
                    onClick={() => {
                      setSelectedNodeId(null);
                    }}
                    className="text-slate-500 hover:text-slate-900 text-[10px] uppercase font-bold transition-colors cursor-pointer"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={onSelectTeachNext}
                    className="text-emerald-700 hover:text-emerald-800 text-[10px] font-bold uppercase flex items-center gap-0.5 transition-colors cursor-pointer"
                  >
                    Teach Next
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Instructions bar */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-600 font-medium">
            💡 Click any colored student circle on the radar stage to inspect real-time mastery metrics.
          </div>
        </div>

        {/* Right Columns: Critical Misconceptions, Trajectory, AI Suggestion */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Critical Misconceptions Box */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shadow-sm">
            <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-base">warning</span>
              Critical Misconception
            </h3>
            <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200">
              <p className="text-sm font-bold text-rose-950 mb-1">Denominator Rule Confusion</p>
              <p className="text-xs text-rose-900 leading-relaxed mb-3 font-medium">
                7 students consistently misapplying fractional force components and trigonometry vector denominators.
              </p>
              <div className="flex items-center gap-2.5">
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-rose-700 border border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">A</div>
                  <div className="w-6 h-6 rounded-full bg-rose-700 border border-white flex items-center justify-center text-[10px] font-bold text-white shadow-xs">M</div>
                  <div className="w-6 h-6 rounded-full bg-rose-200 border border-rose-300 flex items-center justify-center text-[10px] font-bold text-rose-900 shadow-xs">+5</div>
                </div>
                <span className="text-[11px] text-rose-800 font-bold uppercase tracking-wider">Impacted Students</span>
              </div>
            </div>
          </div>

          {/* Syllabus Trajectory / Progress timeline */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 flex-1 flex flex-col shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Syllabus Trajectory
            </h3>
            <div className="space-y-6 relative flex-1 flex flex-col justify-center">
              
              {/* Connecting line */}
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200"></div>

              {/* Step 1: Motion */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-sm">check</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Motion in 1D & 2D</p>
                  <p className="text-[10px] text-slate-500 font-medium">Completed Syllabus Chapter</p>
                  <div className="h-1.5 w-36 bg-slate-100 border border-slate-200 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-emerald-600 w-full"></div>
                  </div>
                </div>
              </div>

              {/* Step 2: Force (Active) */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-indigo-600 text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-sm">radio_button_checked</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-indigo-900">Forces & Newton's Laws</p>
                  <p className="text-[10px] text-indigo-700 font-medium">Current Section — 75% Mastered</p>
                  <div className="h-1.5 w-36 bg-slate-100 border border-slate-200 rounded-full mt-1.5 overflow-hidden flex">
                    <div className="h-full bg-indigo-600 w-3/4"></div>
                    <div className="h-full bg-indigo-300 w-1/4"></div>
                  </div>
                </div>
              </div>

              {/* Step 3: Energy (Locked) */}
              <div className="flex items-start gap-4 relative z-10 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-sm">lock</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Work, Power, & Energy</p>
                  <p className="text-[10px] text-slate-500 font-medium">Locks until Forces masteries are stable</p>
                  <div className="h-1.5 w-36 bg-slate-100 border border-slate-200 rounded-full mt-1.5 overflow-hidden"></div>
                </div>
              </div>

            </div>
          </div>

          {/* AI Recommendation Suggestion */}
          <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-5 flex flex-col justify-between shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-emerald-800">smart_toy</span>
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">AI Diagnostics Recommendation</h3>
              </div>
              <p className="text-base font-bold text-slate-900 mb-1">Intervene on Vector Mathematics</p>
              <p className="text-xs text-slate-600 leading-relaxed mb-5 font-medium">
                Launch a 5-minute interactive micro-lesson targeting trigonometry fractions before proceeding to multi-mass force systems.
              </p>
            </div>
            <button
              onClick={onSelectTeachNext}
              className="w-full bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer active:scale-95"
            >
              <span>TEACH NEXT</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
