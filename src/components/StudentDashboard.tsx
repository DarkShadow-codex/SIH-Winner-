import React, { useState } from 'react';
import { FeedPost, Assessment } from '../types';

interface StudentDashboardProps {
  feedPosts: FeedPost[];
  assessments: Assessment[];
  onAddPost: (content: string, type: 'note' | 'question') => void;
  onLikePost: (id: string) => void;
}

export default function StudentDashboard({
  feedPosts,
  assessments,
  onAddPost,
  onLikePost
}: StudentDashboardProps) {
  const [newPostText, setNewPostText] = useState('');
  const [postType, setPostType] = useState<'note' | 'question'>('note');
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [isPlayingLesson, setIsPlayingLesson] = useState(false);

  // Radar chart selected point info
  const [selectedRadarPoint, setSelectedRadarPoint] = useState<string | null>('Kinematics');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    onAddPost(newPostText, postType);
    setNewPostText('');
  };

  const radarMetrics: Record<string, { current: number; status: string; desc: string }> = {
    Kinematics: { current: 85, status: 'Mastered', desc: 'Syllabus master of projectile curves and position derivatives.' },
    Forces: { current: 70, status: 'Reviewing', desc: 'Newtonian force equations are stable. Working on friction indices.' },
    Energy: { current: 50, status: 'Reviewing', desc: 'Potential and kinetic energy conservation formulas needs work.' },
    Momentum: { current: 60, status: 'Reviewing', desc: 'Inelastic collisions vector resolution is slightly unstable.' },
    Waves: { current: 30, status: 'Intervention Required', desc: 'Struggling with wavelength frequency equations on midterm preps.' },
    Optics: { current: 40, status: 'Reviewing', desc: 'Snell refraction calculations are slightly slow but correct.' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Welcome Greetings Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back, Sam.</h1>
          <p className="text-sm text-slate-600">Here is your learning landscape for today.</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest mb-1">Current Focus</div>
          <div className="text-xs font-bold px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg inline-block shadow-sm">
            Physics: Kinematics
          </div>
        </div>
      </div>

      {/* Main Grid: Learning, Knowledge Radar, Curated Resources, Assessments & Feed */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Today's Learning Up Next Hero Card */}
        <div className="col-span-1 md:col-span-12 lg:col-span-8 glass-panel overflow-hidden shadow-xl flex flex-col group relative">
          <div className="h-48 relative overflow-hidden bg-white/5 border-b border-white/10">
            {/* Geometric Background Art Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1.5px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent"></div>
            
            <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
              <div>
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider bg-indigo-500/20 border border-indigo-500/30 px-2 py-0.5 rounded mb-2 inline-block">
                  Up Next
                </span>
                <h2 className="text-lg font-bold text-white animate-pulse">Physics: Motion in 2D</h2>
              </div>
              <button
                onClick={() => setIsPlayingLesson(true)}
                className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-lg border border-indigo-400/30 cursor-pointer"
                title="Launch Virtual micro-learning simulator"
              >
                <span className="material-symbols-outlined text-2xl">play_arrow</span>
              </button>
            </div>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-between">
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Master projectile curves and uniform circular mechanics before tomorrow's dynamic laboratory test. Your personal AI companion recommends consolidating vector component mathematics first.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-300 uppercase">
                <span>Mastery Projection</span>
                <span className="text-indigo-300">85% Target Goal</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden flex border border-white/5">
                <div className="h-full bg-indigo-500 shadow-lg shadow-indigo-500/50" style={{ width: '60%' }}></div>
                <div className="h-full bg-cyan-400 opacity-80" style={{ width: '25%' }}></div>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold mt-1">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span>Current Mastery (60%)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                  <span>AI Companion Projected (+25%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Radar Chart Panel */}
        <div className="col-span-1 md:col-span-6 lg:col-span-4 glass-panel p-5 flex flex-col shadow-xl">
          <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
            <span className="material-symbols-outlined text-indigo-300">radar</span>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Knowledge Radar</h3>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center relative">
            <div className="w-full max-w-[210px] aspect-square relative">
              {/* Radar chart SVG */}
              <svg className="w-full h-full drop-shadow-sm" viewBox="0 0 100 100">
                {/* Radial Polygons grid */}
                <polygon fill="none" points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" stroke="rgba(255,255,255,0.12)" strokeWidth="1"></polygon>
                <polygon fill="none" points="50,20 80,35 80,65 50,80 20,65 20,35" stroke="rgba(255,255,255,0.12)" strokeWidth="1"></polygon>
                <polygon fill="none" points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5" stroke="rgba(255,255,255,0.12)" strokeWidth="1"></polygon>
                
                {/* Axes lines */}
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="50" y2="5"></line>
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="95" y2="27.5"></line>
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="95" y2="72.5"></line>
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="50" y2="95"></line>
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="5" y2="72.5"></line>
                <line stroke="rgba(255,255,255,0.12)" strokeWidth="1" x1="50" y1="50" x2="5" y2="27.5"></line>
                
                {/* Mastery Area Shape (Teal fill, border) */}
                <polygon
                  className="fill-indigo-500/20 stroke-indigo-400 hover:fill-indigo-500/30 transition-colors cursor-pointer"
                  points="50,15 82,30 73,63 50,77 15,62 32,32"
                  strokeWidth="2"
                ></polygon>

                {/* Nodes with interactive state onClick */}
                <circle cx="50" cy="15" r="3" fill="#818cf8" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Kinematics')} />
                <circle cx="82" cy="30" r="3" fill="#818cf8" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Forces')} />
                <circle cx="73" cy="63" r="3" fill="#818cf8" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Energy')} />
                <circle cx="50" cy="77" r="3" fill="#818cf8" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Momentum')} />
                <circle cx="15" cy="62" r="3" fill="#f43f5e" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Waves')} />
                <circle cx="32" cy="32" r="3" fill="#818cf8" className="cursor-pointer" onClick={() => setSelectedRadarPoint('Optics')} />
              </svg>
            </div>

            {/* Radar point details overlay */}
            {selectedRadarPoint && (
              <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl text-left w-full">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-bold text-white">{selectedRadarPoint} Mastery</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    radarMetrics[selectedRadarPoint].status.includes('Intervention')
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                  }`}>
                    {radarMetrics[selectedRadarPoint].status} ({radarMetrics[selectedRadarPoint].current}%)
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed">{radarMetrics[selectedRadarPoint].desc}</p>
              </div>
            )}
          </div>
          <div className="text-center pt-2 text-[10px] text-slate-500 font-semibold uppercase">
            Click radar endpoints to view topics
          </div>
        </div>

        {/* Curated Resources Card list */}
        <div className="col-span-1 md:col-span-6 lg:col-span-6 glass-panel p-6 flex flex-col h-full shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-300 animate-pulse">auto_awesome</span>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Curated Lessons For You</h3>
            </div>
            <span className="text-[9px] font-bold text-indigo-200 bg-white/10 border border-white/10 px-2 py-0.5 rounded">
              Companion Curated
            </span>
          </div>

          <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
            {[
              {
                id: 'res-1',
                title: 'Vector Addition Condensed Notes',
                desc: 'Condensed physics notes highlighting trigonometric component vectors. Targeting your recent diagnostic quiz errors.',
                icon: 'summarize',
                bg: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
                content: 'Trigonometry components rule: Ax = A * cos(θ) and Ay = A * sin(θ). Always check if θ is measured relative to horizontal!'
              },
              {
                id: 'res-2',
                title: 'Visualizing 2D Kinematics',
                desc: 'Highly-rated virtual simulation guide demonstrating projectile trajectory curves. YouTube • 12 min play.',
                icon: 'smart_display',
                bg: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
                content: 'Launch simulator variables: initial velocity, release angle (45 degrees gives maximum horizontal range on flat ground), and local gravity.'
              },
              {
                id: 'res-3',
                title: "Mr. Davis' Lab Primer",
                desc: 'Mandatory reading material covering laboratory friction measures before tomorrow\'s laboratory sessions.',
                icon: 'description',
                bg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
                content: 'Laboratory setup details: static friction coefficient vs kinetic friction coefficient measures using friction blocks and electronic force sensors.'
              }
            ].map((res) => (
              <div
                key={res.id}
                onClick={() => setSelectedResource(res.title + ' | ' + res.content)}
                className="group flex items-start gap-3.5 p-3 rounded-2xl border border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10 cursor-pointer transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${res.bg}`}>
                  <span className="material-symbols-outlined">{res.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-[10px] text-slate-300 mt-1 leading-relaxed">{res.desc}</p>
                </div>
                <span className="material-symbols-outlined text-slate-400 group-hover:text-indigo-300 text-base self-center transition-colors">
                  arrow_forward
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right side Column: Assessments widget and Knowledge Forum Feed */}
        <div className="col-span-1 md:col-span-12 lg:col-span-6 flex flex-col gap-6">
          
          {/* Upcoming Tests Widget */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">
              Assessments Timeline
            </h3>
            <div className="flex items-center gap-4 p-3 bg-rose-500/10 border-l-4 border-rose-500 rounded-r-xl">
              <div className="flex flex-col items-center justify-center w-12 h-12 bg-slate-950/40 border border-white/10 rounded-xl shadow shrink-0 text-white">
                <span className="text-[10px] font-extrabold text-rose-400 leading-none">OCT</span>
                <span className="text-base font-extrabold text-white leading-none mt-1">14</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Physics Kinematics Midterm Exam</h4>
                <p className="text-[10px] text-rose-400 font-bold mt-1.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">warning</span> In 2 days (Oct 14)
                </p>
              </div>
            </div>
          </div>

          {/* Knowledge Forum Feed */}
          <div className="glass-panel flex-1 flex flex-col overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-300">forum</span>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Class Knowledge Feed</h3>
              </div>
              <span className="text-[10px] font-bold text-indigo-200 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">
                {feedPosts.length} Active Posts
              </span>
            </div>

            {/* Submit New Note/Question Form */}
            <form onSubmit={handlePostSubmit} className="p-4 border-b border-white/10 bg-white/5 flex gap-2">
              <input
                type="text"
                placeholder="Share a tip or ask a kinematics question..."
                className="flex-1 glass-input rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
              />
              <select
                className="glass-input rounded-xl text-[10px] px-2 focus:outline-none"
                value={postType}
                onChange={(e) => setPostType(e.target.value as 'note' | 'question')}
              >
                <option value="note" className="bg-slate-950 text-white">Note</option>
                <option value="question" className="bg-slate-950 text-white">Question</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow"
              >
                Post
              </button>
            </form>

            <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[220px] bg-white/5">
              {feedPosts.map((post) => (
                <div key={post.id} className="bg-slate-950/40 p-4 rounded-2xl border border-white/10 shadow-sm space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white border border-indigo-400/30 flex items-center justify-center text-xs font-bold shadow">
                        {post.authorInitials}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{post.authorName}</span>
                          <span className="text-[9px] bg-white/10 text-slate-300 border border-white/10 px-1.5 rounded font-normal">
                            {post.authorRole}
                          </span>
                        </div>
                        <div className="text-[9px] text-slate-400 font-semibold uppercase">{post.timeAgo} • {post.type}</div>
                      </div>
                    </div>
                    <button className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                      <span className="material-symbols-outlined text-lg">bookmark_add</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">{post.content}</p>
                  
                  <div className="flex gap-3 pt-1 border-t border-white/10">
                    <button
                      onClick={() => onLikePost(post.id)}
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors cursor-pointer border ${
                        post.hasLiked 
                          ? 'bg-indigo-500/30 border-indigo-500/40 text-indigo-200' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-300'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[13px] filled">thumb_up</span>
                      <span>{post.likes}</span>
                    </button>
                    {post.replies !== undefined && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-white/5 px-2 py-1 border border-white/10 rounded-lg">
                        <span className="material-symbols-outlined text-[13px]">reply</span>
                        <span>{post.replies} answers</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Floating Resource Viewer overlay */}
      {selectedResource && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-heavy p-0 max-w-lg w-full overflow-hidden animate-scale-up">
            <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
              <span className="text-xs font-bold text-indigo-300 uppercase">Smart Study Material</span>
              <button onClick={() => setSelectedResource(null)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-base font-extrabold text-white">{selectedResource.split('|')[0]}</h3>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl text-xs leading-relaxed text-slate-200 font-sans">
                {selectedResource.split('|')[1]}
              </div>
            </div>
            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Reader
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Play virtual micro-learning simulator popup */}
      {isPlayingLesson && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-panel-heavy p-0 max-w-2xl w-full overflow-hidden animate-scale-up">
            <div className="p-5 bg-slate-950/80 border-b border-white/10 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-400 animate-pulse">videocam</span>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Companion Micro-Learning Sandbox</span>
              </div>
              <button onClick={() => setIsPlayingLesson(false)} className="text-slate-400 hover:text-white cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            
            {/* Interactive physics simulation */}
            <div className="p-6 space-y-6 text-white">
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Projectile Target Coordinates Simulation</h3>
                <p className="text-xs text-slate-300 font-sans">Learn how launch angles change position trajectory curves in real-time.</p>
              </div>

              {/* Graphical representation of projectile */}
              <div className="bg-slate-950/90 rounded-2xl h-48 relative border border-white/10 overflow-hidden flex items-end p-4">
                <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #818cf8 1.5px, transparent 0)', backgroundSize: '16px 16px' }}></div>
                
                {/* Simulated parabolic curve trajectory path */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M 40 180 Q 200 10, 420 180" fill="none" stroke="#818cf8" strokeWidth="3" strokeDasharray="4 4" className="animate-[dash_2s_linear_infinite]" />
                  <circle cx="200" cy="95" r="5" fill="#eab308" />
                  <text x="200" y="80" fill="#a5b4fc" className="text-[10px] font-bold text-center" textAnchor="middle">Apex Peak</text>
                </svg>

                <div className="text-[10px] text-indigo-300 font-mono space-y-0.5 z-10 bg-slate-900 border border-white/10 p-2.5 rounded-xl">
                  <div>Initial Velocity: 24 m/s</div>
                  <div>Launch Angle: 45° (Optimal)</div>
                  <div>Range: 58.7 meters</div>
                </div>
              </div>

              {/* Mini controls */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Angle Angle</span>
                  <div className="text-base font-extrabold text-indigo-300 mt-1">45 Degrees</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Horizontal Velocity</span>
                  <div className="text-base font-extrabold text-indigo-300 mt-1">16.9 m/s</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Vertical Velocity</span>
                  <div className="text-base font-extrabold text-indigo-300 mt-1">16.9 m/s</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end gap-3">
              <button
                onClick={() => setIsPlayingLesson(false)}
                className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/30 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow"
              >
                Mastered Topic! Complete Lesson
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
