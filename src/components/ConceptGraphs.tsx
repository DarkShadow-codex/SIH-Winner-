import React, { useState, useRef, useEffect } from 'react';
import { ConceptNode, SyllabusItem } from '../types';

interface ConceptGraphsProps {
  initialNodes: ConceptNode[];
  syllabusItems: SyllabusItem[];
}

export default function ConceptGraphs({ initialNodes, syllabusItems }: ConceptGraphsProps) {
  const [nodes, setNodes] = useState<ConceptNode[]>(initialNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('concept-2'); // default to Velocity (v)
  const [activeFile, setActiveFile] = useState<string | null>('AP_Physics_C_Syllabus.pdf');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Dragging states
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // File Upload Simulator
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setActiveFile(file.name);
    setIsUploading(true);
    setUploadProgress(10);
  };

  useEffect(() => {
    if (!isUploading || uploadProgress === null) return;
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null) return null;
        if (prev >= 100) {
          setIsUploading(false);
          clearInterval(interval);
          
          // Add a new node automatically to show parsing result!
          const newNode: ConceptNode = {
            id: `concept-${Date.now()}`,
            name: 'Momentum (p)',
            description: 'The product of the mass and velocity of an object. A vector quantity describing mass in motion.',
            x: 400,
            y: 40,
            masteryStatus: 'medium',
            masteryPercentage: 68,
            inputs: ['concept-2']
          };
          setNodes(prevNodes => [...prevNodes, newNode]);
          setSelectedNodeId(newNode.id);
          
          return 100;
        }
        return prev + 15;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isUploading, uploadProgress]);

  // Handle Drag Events
  const handleNodeMouseDown = (id: string, e: React.MouseEvent) => {
    setDraggingNodeId(id);
    const node = nodes.find(n => n.id === id);
    if (node) {
      dragOffset.current = {
        x: e.clientX - node.x,
        y: e.clientY - node.y
      };
    }
    setSelectedNodeId(id);
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const newX = Math.max(10, Math.min(containerRect.width - 160, e.clientX - dragOffset.current.x));
    const newY = Math.max(10, Math.min(containerRect.height - 90, e.clientY - dragOffset.current.y));

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === draggingNodeId ? { ...node, x: newX, y: newY } : node
      )
    );
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Toolbar Actions
  const handleAddNode = () => {
    const names = ['Kinetic Energy', 'Force Vector', 'Gravity (g)', 'Uniform Circle Motion', 'Friction Coeff'];
    const descs = [
      'The energy of an object due to its motion, proportional to velocity squared.',
      'A pull or push described by magnitude and direction angle components.',
      'The constant acceleration due to gravity on earth surface roughly 9.8 m/s².',
      'Motion in a circular path at a constant speed, driven by centripetal force.',
      'A dimensionless scalar representing force ratio of friction to normal support.'
    ];
    const randomIndex = Math.floor(Math.random() * names.length);
    const id = `concept-${Date.now()}`;
    const statuses: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    const randomStatus = statuses[Math.floor(Math.random() * 3)];
    const randomMastery = Math.floor(Math.random() * 70) + 30;

    const newNode: ConceptNode = {
      id,
      name: names[randomIndex],
      description: descs[randomIndex],
      x: 100 + Math.random() * 300,
      y: 100 + Math.random() * 180,
      masteryStatus: randomStatus,
      masteryPercentage: randomMastery
    };

    setNodes(prev => [...prev, newNode]);
    setSelectedNodeId(id);
  };

  const handleGenerateDiagnostic = () => {
    alert(`Generating automated custom quiz diagnostic covering: ${selectedNode?.name || 'Kinematics'}`);
  };

  // Helper to find connecting path coordinate points between nodes
  const findNodeCoords = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    // offset to center of the 144px width card
    return { x: node.x + 72, y: node.y + 28 };
  };

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-140px)] animate-fade-in select-none font-sans">
      
      {/* Left Column: Upload & Structured Curriculum Tree */}
      <div className="w-full xl:w-[320px] flex flex-col gap-6 shrink-0 h-full">
        
        {/* Ingest Curriculum Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 flex flex-col shrink-0 shadow-sm">
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-emerald-700">upload_file</span>
            Ingest Curriculum
          </h2>

          {/* Interactive Drag & Drop Area */}
          <label className="border-2 border-dashed border-emerald-300 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-emerald-50/40 hover:bg-emerald-50 relative overflow-hidden group cursor-pointer transition-all">
            <input type="file" accept=".pdf,.txt,.doc" className="hidden" onChange={handleFileUpload} />
            
            <span className="material-symbols-outlined text-emerald-700 text-3xl mb-1.5 group-hover:scale-110 transition-transform">
              document_scanner
            </span>
            <h3 className="text-xs font-bold text-slate-900 mb-0.5 truncate max-w-[240px]">
              {activeFile || 'Upload Syllabus PDF'}
            </h3>
            
            {isUploading && uploadProgress !== null ? (
              <p className="text-[10px] text-emerald-700 font-bold">
                AI Parsing in Progress ({uploadProgress}%)
              </p>
            ) : (
              <p className="text-[10px] text-slate-500 font-medium">
                Click or drag file to extract nodes
              </p>
            )}

            {/* Simulated progress loading bar */}
            {isUploading && (
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}
          </label>
        </div>

        {/* Structured Folder Tree */}
        <div className="bg-white border border-slate-200 rounded-3xl flex flex-col flex-1 min-h-0 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex justify-between items-center">
            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-emerald-700">list_alt</span>
              Extracted Structure
            </h2>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md text-[9px] font-bold">v1.2</span>
          </div>

          <div className="p-3 overflow-y-auto flex-1 text-xs">
            {syllabusItems.map((root) => (
              <ul key={root.id} className="space-y-1">
                <li className="font-bold text-slate-900">
                  <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                    <span className="material-symbols-outlined text-base text-slate-400">expand_more</span>
                    <span className="material-symbols-outlined text-base text-emerald-700">folder_open</span>
                    <span className="truncate">{root.name}</span>
                  </div>
                  {root.children && (
                    <ul className="pl-4 border-l border-slate-200 ml-3.5 mt-1 space-y-1">
                      {root.children.map((child) => (
                        <li key={child.id} className="text-slate-700 font-medium">
                          <div className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                            <span className="material-symbols-outlined text-base text-slate-400">expand_more</span>
                            <span className="material-symbols-outlined text-base text-teal-600">folder</span>
                            <span className="truncate">{child.name}</span>
                          </div>
                          {child.children && (
                            <ul className="pl-4 border-l border-slate-200 ml-3 mt-1 space-y-0.5">
                              {child.children.map((subChild) => {
                                const isSelected = subChild.name.toLowerCase().includes('one dim') && selectedNodeId === 'concept-1';
                                return (
                                  <li key={subChild.id}>
                                    <div
                                      onClick={() => {
                                        if (subChild.name.toLowerCase().includes('one dim')) {
                                          setSelectedNodeId('concept-1');
                                        } else {
                                          setSelectedNodeId('concept-2');
                                        }
                                      }}
                                      className={`flex items-center gap-2 py-1 px-2 rounded-lg cursor-pointer transition-colors ${
                                        isSelected 
                                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-300' 
                                          : 'hover:bg-slate-100'
                                      }`}
                                    >
                                      <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-emerald-600' : 'bg-slate-300'}`}></div>
                                      <span className="truncate text-[11px] text-slate-700">{subChild.name}</span>
                                      {subChild.masteryTrend === 'up' && (
                                        <span className="material-symbols-outlined text-[14px] text-emerald-600 ml-auto">trending_up</span>
                                      )}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
            ))}
          </div>
        </div>

      </div>

      {/* Main Graph Canvas Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl flex flex-col overflow-hidden relative shadow-sm">
        
        {/* Canvas Toolbar Header */}
        <div className="h-14 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between px-4 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Kinematics Domain Map</h2>
            <div className="h-4 w-px bg-slate-300"></div>
            <div className="flex gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                onClick={handleAddNode}
                className="text-slate-700 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                title="Add Concept Card Node"
              >
                <span className="material-symbols-outlined text-base text-emerald-700">add_circle</span>
                <span>Add Node</span>
              </button>
              <div className="w-px bg-slate-200 self-stretch"></div>
              <button
                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition-all cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                title="Establish Connection"
              >
                <span className="material-symbols-outlined text-base">conversion_path</span>
                <span>Connect</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Action Button */}
          <button
            onClick={handleGenerateDiagnostic}
            className="flex items-center gap-1.5 bg-emerald-700 border border-emerald-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            <span>Generate Diagnostic</span>
          </button>
        </div>

        {/* Draggable Graph Space */}
        <div
          ref={containerRef}
          onMouseMove={handleContainerMouseMove}
          className="flex-1 bg-slate-900 relative overflow-hidden cursor-crosshair h-full rounded-b-3xl"
          id="graph-canvas"
        >
          {/* Background Radial Grid */}
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

          {/* SVG Connection Edges Layer */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {nodes.map(node => {
              if (!node.outputs) return null;
              return node.outputs.map(outId => {
                const start = findNodeCoords(node.id);
                const end = findNodeCoords(outId);
                
                // Draw bezier curves
                const dx = Math.abs(end.x - start.x) * 0.4;
                const pathData = `M ${start.x} ${start.y} C ${start.x + dx} ${start.y}, ${end.x - dx} ${end.y}, ${end.x} ${end.y}`;
                
                return (
                  <g key={`${node.id}-${outId}`}>
                    <path
                      d={pathData}
                      fill="none"
                      stroke="rgba(255,255,255,0.4)"
                      strokeWidth="2.5"
                      strokeDasharray={node.masteryStatus === 'low' ? '4 4' : 'none'}
                    />
                    <circle cx={end.x} cy={end.y} r="4" fill="rgba(255,255,255,0.8)" />
                    <text
                      x={(start.x + end.x) / 2}
                      y={(start.y + end.y) / 2 - 8}
                      className="text-[10px] fill-slate-300 font-semibold tracking-wider text-center"
                      textAnchor="middle"
                    >
                      Derivative
                    </text>
                  </g>
                );
              });
            })}
          </svg>

          {/* Nodes Layer */}
          <div className="absolute inset-0 z-20">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div
                  key={node.id}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                  className={`absolute w-40 bg-white border rounded-2xl shadow-xl hover:border-slate-400 cursor-move select-none group transition-all ${
                    isSelected ? 'border-2 border-emerald-500 shadow-emerald-500/30 scale-105 z-30' : 'border-slate-300 z-20'
                  }`}
                >
                  <div className={`h-2 w-full rounded-t-xl ${
                    node.masteryStatus === 'high' 
                      ? 'bg-emerald-500' 
                      : node.masteryStatus === 'medium' 
                        ? 'bg-amber-500' 
                        : 'bg-rose-500'
                  }`}></div>
                  <div className="p-3 text-center relative">
                    <span className="text-xs block truncate font-bold text-slate-900">
                      {node.name}
                    </span>
                    {node.masteryStatus === 'low' && (
                      <div className="absolute -top-3.5 -right-1 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs">
                        Low Mastery
                      </div>
                    )}
                  </div>
                  {/* Connection points visible on hover */}
                  <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-slate-900 border border-white rounded-full transform -translate-y-1/2 hidden group-hover:block"></div>
                  <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-slate-900 border border-white rounded-full transform -translate-y-1/2 hidden group-hover:block"></div>
                </div>
              );
            })}
          </div>

          {/* Floating Context Sidebar Panel on Right */}
          {selectedNode && (
            <div className="absolute right-4 top-4 w-68 bg-white border border-slate-200 rounded-2xl shadow-2xl z-40 flex flex-col animate-scale-up text-slate-900">
              <div className="p-3.5 border-b border-slate-100 bg-slate-50 rounded-t-2xl flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Concept Node Details</span>
                <button
                  onClick={() => setSelectedNodeId('')}
                  className="text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-base">close</span>
                </button>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{selectedNode.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">{selectedNode.description}</p>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">
                    Syllabus Mastery Status
                  </span>
                  <div className="w-full h-2 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        selectedNode.masteryStatus === 'high' 
                          ? 'bg-emerald-500' 
                          : selectedNode.masteryStatus === 'medium' 
                            ? 'bg-amber-500' 
                            : 'bg-rose-500'
                      }`}
                      style={{ width: `${selectedNode.masteryPercentage}%` }}
                    ></div>
                  </div>
                  <span className={`text-[11px] font-bold block mt-1 ${
                    selectedNode.masteryStatus === 'low' ? 'text-rose-600' : 'text-slate-700'
                  }`}>
                    {selectedNode.masteryPercentage}% - {selectedNode.masteryStatus === 'low' ? 'Intervention Suggested' : 'Stabilized'}
                  </span>
                </div>

                <button className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-95">
                  View Curated Lesson Notes
                </button>
              </div>
            </div>
          )}

          {/* Floating Helper Tip */}
          <div className="absolute left-4 bottom-4 bg-slate-900/95 border border-slate-700 text-white rounded-xl p-3 max-w-xs text-xs pointer-events-none shadow-xl z-30 font-medium">
            <span className="font-bold text-amber-400 block mb-0.5">🎮 Interactive Sandbox:</span>
            Drag any concept card node with your cursor to design your preferred syllabus flow layout dynamically!
          </div>

        </div>
      </div>

    </div>
  );
}
