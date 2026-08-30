import React, { useState } from 'react';

export default function TeachNext() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [deliveredStatus, setDeliveredStatus] = useState(false);

  const slides = [
    {
      title: 'Trigonometry Components in Vector Fields',
      desc: 'Why do we use cos(θ) for horizontal force (Fx) and sin(θ) for vertical force (Fy)?',
      point1: 'Ax is adjacent to the angle θ in a right triangle, so cos(θ) = Ax / A.',
      point2: 'Ay is opposite to the angle θ, so sin(θ) = Ay / A.',
      tip: 'Warning: If θ is measured from the y-axis (vertical), the rules swap! Always verify angle bearings.'
    },
    {
      title: 'Addressing the Denominator Misconception',
      desc: 'Why do students divide by mass instead of multiplying when solving for friction?',
      point1: 'Friction force equation: Ff ≤ μ * Fn, where Fn is the normal support force.',
      point2: 'Fn is equal to m * g on horizontal ground, so Ff ≤ μ * m * g.',
      tip: 'Do not isolate variables arbitrarily. Always substitute Fn first!'
    }
  ];

  const handleDeliver = () => {
    setDeliveredStatus(true);
    setTimeout(() => setDeliveredStatus(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in font-sans">
      
      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">psychology</span>
            </div>
            Active AI Micro-Lesson Workspace
          </h2>
          <p className="text-xs text-slate-600 mt-1 font-medium">
            Prepare and broadcast bite-sized vector intervention lectures immediately to student monitors.
          </p>
        </div>
        <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider self-start sm:self-center shadow-xs">
          Intervention Suggestion Ready
        </span>
      </div>

      {/* Interactive Lecture Slide Canvas */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="space-y-5 relative z-10">
          
          {/* Slide metadata pill bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 text-xs font-bold">
            <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 uppercase tracking-wider text-[11px]">
              Slide {activeSlide + 1} of {slides.length}
            </span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px] bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Physics Kinematics Topic
            </span>
          </div>

          {/* Slide Title & Description */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
              {slides[activeSlide].title}
            </h3>
            <p className="text-sm text-slate-600 italic mt-1 font-medium">
              {slides[activeSlide].desc}
            </p>
          </div>
          
          {/* Key Bullet Points */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                1
              </span>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {slides[activeSlide].point1}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-xs">
                2
              </span>
              <p className="text-sm text-slate-800 font-medium leading-relaxed">
                {slides[activeSlide].point2}
              </p>
            </div>
          </div>

          {/* Cautionary Tip Box */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 leading-relaxed font-medium flex items-start gap-2.5 shadow-xs">
            <span className="text-base leading-none">💡</span>
            <span>{slides[activeSlide].tip}</span>
          </div>
        </div>

        {/* Carousel controls & Broadcast action */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6 relative z-10">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveSlide(prev => Math.max(0, prev - 1))}
              disabled={activeSlide === 0}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                activeSlide === 0
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs active:scale-95'
              }`}
              title="Previous slide"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <span className="text-xs font-bold text-slate-600 px-2">
              {activeSlide + 1} / {slides.length}
            </span>
            <button
              type="button"
              onClick={() => setActiveSlide(prev => Math.min(slides.length - 1, prev + 1))}
              disabled={activeSlide === slides.length - 1}
              className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
                activeSlide === slides.length - 1
                  ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50 cursor-pointer shadow-xs active:scale-95'
              }`}
              title="Next slide"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
          
          {/* Deliver Trigger Button */}
          <button
            type="button"
            onClick={handleDeliver}
            className="bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">
              {deliveredStatus ? 'check_circle' : 'cast_for_education'}
            </span>
            <span>{deliveredStatus ? 'Broadcasted to Students!' : 'Broadcast Live Slide'}</span>
          </button>
        </div>
      </div>

      {/* Companion Insight Card */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-1.5 shadow-sm">
        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base text-emerald-700">insights</span>
          Companion Micro-Lesson Delivery
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Broadcasting this slide instantly updates the Student Dashboard and alerts impacted students via the Companion Knowledge Feed, helping them resolve their misconceptions pre-midterm.
        </p>
      </div>

    </div>
  );
}
