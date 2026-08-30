import React, { useState } from 'react';

interface ResourceItem {
  id: number;
  title: string;
  tag: string;
  downloads: number;
  desc: string;
  subject?: string;
  author?: string;
  uploadedAt?: string;
  fileSize?: string;
  fileType?: string;
  targetClass?: string;
}

export default function KnowledgeHub() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedNoteDetail, setSelectedNoteDetail] = useState<ResourceItem | null>(null);
  const [uploadToast, setUploadToast] = useState<string | null>(null);

  // Form states for uploading notes
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');
  const [noteTag, setNoteTag] = useState('Lecture Notes');
  const [noteClass, setNoteClass] = useState('Class 9-A');
  const [noteDesc, setNoteDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [resources, setResources] = useState<ResourceItem[]>([
    {
      id: 1,
      title: 'Trigonometric Vector Equations Cheat Sheet',
      tag: 'Cheat Sheet',
      downloads: 142,
      desc: 'A quick sheet describing components resolution for slanted support vectors with step-by-step vector projections and angular formulas.',
      subject: 'Physics - Vectors & Mechanics',
      author: 'Dr. Sarah Connor',
      uploadedAt: 'Oct 14, 2026',
      fileSize: '2.4 MB',
      fileType: 'PDF Document',
      targetClass: 'Class 9-A'
    },
    {
      id: 2,
      title: 'Newtonian Force Diagrams & Friction Tables',
      tag: 'Lecture Notes',
      downloads: 98,
      desc: 'Common laboratory friction, mass support, tension, and pulleys diagram schematics with real lab measurement logs.',
      subject: 'Physics - Classical Mechanics',
      author: 'Prof. Marcus Vance',
      uploadedAt: 'Oct 18, 2026',
      fileSize: '4.1 MB',
      fileType: 'PDF Document',
      targetClass: 'Class 9-B'
    },
    {
      id: 3,
      title: 'Inelastic Collisions Practice Set & Solutions',
      tag: 'Exercises',
      downloads: 55,
      desc: 'Intervention practice problems designed to boost collision momentum comprehension with graded step-by-step solutions.',
      subject: 'Physics - Momentum',
      author: 'Alex Mercer',
      uploadedAt: 'Oct 22, 2026',
      fileSize: '1.8 MB',
      fileType: 'DOCX Document',
      targetClass: 'Class 10-A'
    },
    {
      id: 4,
      title: 'Optics: Refraction Lab Report Primer & Guidelines',
      tag: 'Lab Guide',
      downloads: 110,
      desc: 'Snell equations, indices formulas, laser refraction angles, and laboratory target measures for midterm experiment setups.',
      subject: 'Physics - Optics',
      author: 'Elena Rostova',
      uploadedAt: 'Oct 26, 2026',
      fileSize: '3.6 MB',
      fileType: 'PDF Document',
      targetClass: 'Lab Cohort 302'
    }
  ]);

  const filteredResources = resources.filter(res => {
    const term = searchTerm.toLowerCase().trim();
    return !term ||
      res.title.toLowerCase().includes(term) ||
      res.desc.toLowerCase().includes(term) ||
      res.tag.toLowerCase().includes(term) ||
      (res.subject && res.subject.toLowerCase().includes(term)) ||
      (res.author && res.author.toLowerCase().includes(term));
  });

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    const newNote: ResourceItem = {
      id: Date.now(),
      title: noteTitle.trim(),
      tag: noteTag,
      downloads: 0,
      desc: noteDesc.trim() || 'Uploaded study note and curriculum reference material for classroom review.',
      subject: noteSubject,
      author: 'Jordan Smith (You)',
      uploadedAt: 'Just now',
      fileSize: selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB` : '1.5 MB',
      fileType: selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() + ' File' : 'PDF Document',
      targetClass: noteClass
    };

    setResources(prev => [newNote, ...prev]);
    setShowUploadModal(false);
    setNoteTitle('');
    setNoteDesc('');
    setSelectedFile(null);

    setUploadToast(`Note "${newNote.title}" uploaded successfully!`);
    setTimeout(() => setUploadToast(null), 4000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 max-w-4xl mx-auto animate-fade-in relative">
      {/* Toast notification */}
      {uploadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-emerald-700 animate-slide-up">
          <span className="material-symbols-outlined text-emerald-400 text-lg">check_circle</span>
          <p className="text-xs font-semibold">{uploadToast}</p>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-700">library_books</span>
            Smart Knowledge Hub
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">Explore curated, AI-generated summary reviews, study documents, and upload notes.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Upload Notes Button */}
          <button
            type="button"
            id="upload-notes-btn"
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-base">upload_file</span>
            <span>Upload Notes</span>
          </button>

          {/* Filter Resources Search Box */}
          <div className="relative flex-1 md:w-60">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base">
              search
            </span>
            <input
              type="text"
              placeholder="Filter resources..."
              className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl pl-9 pr-8 py-2 text-xs focus:outline-none focus:border-emerald-600 focus:bg-white transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs p-0.5 rounded cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">
            <span className="material-symbols-outlined text-4xl text-slate-300 mb-2">find_in_page</span>
            <p className="text-sm font-semibold text-slate-700">No matching resources found</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting your search query or upload a new note.</p>
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Upload First Note
            </button>
          </div>
        ) : (
          filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 hover:border-slate-300 hover:shadow-md transition-all space-y-3 flex flex-col justify-between group"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-[9px] font-bold uppercase tracking-wider">
                    {res.tag}
                  </span>
                  {res.subject && (
                    <span className="text-[10px] text-slate-500 font-medium truncate max-w-[150px]">
                      {res.subject}
                    </span>
                  )}
                </div>

                <h3 className="text-xs font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                  {res.title}
                </h3>
                <p className="text-[11px] text-slate-600 font-sans leading-relaxed line-clamp-2">
                  {res.desc}
                </p>

                {res.author && (
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-xs">person</span>
                      {res.author}
                    </span>
                    {res.fileSize && (
                      <span>• {res.fileSize}</span>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center pt-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedNoteDetail(res)}
                  className="text-[11px] font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">visibility</span>
                  <span>View Details</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">{res.downloads} dl</span>
                  <button
                    type="button"
                    onClick={() => {
                      setResources(prev => prev.map(item => item.id === res.id ? { ...item, downloads: item.downloads + 1 } : item));
                      alert(`Downloading document: ${res.title}`);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-xs flex items-center gap-0.5 cursor-pointer transition-colors bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                  >
                    <span>Download</span>
                    <span className="material-symbols-outlined text-sm">download</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPLOAD NOTES MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Notes Details</h3>
                  <p className="text-xs text-slate-500">Provide document metadata, syllabus tags, and attach files.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {/* Note Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note / Document Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="e.g. Thermodynamics & Heat Capacity Formula Guide"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Subject & Category Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject / Domain</label>
                  <select
                    value={noteSubject}
                    onChange={(e) => setNoteSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Physics - Mechanics">Physics - Mechanics</option>
                    <option value="Physics - Optics & Waves">Physics - Optics & Waves</option>
                    <option value="Physics - Thermodynamics">Physics - Thermodynamics</option>
                    <option value="Mathematics - Calculus">Mathematics - Calculus</option>
                    <option value="Chemistry - Organic">Chemistry - Organic</option>
                    <option value="General Science">General Science</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Resource Type Tag</label>
                  <select
                    value={noteTag}
                    onChange={(e) => setNoteTag(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                  >
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Exercises">Exercises & Practice</option>
                    <option value="Lab Guide">Lab Guide / Manual</option>
                    <option value="Exam Revision">Exam Revision Sheet</option>
                  </select>
                </div>
              </div>

              {/* Target Class Section */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Class / Section</label>
                <select
                  value={noteClass}
                  onChange={(e) => setNoteClass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 font-medium"
                >
                  <option value="Class 9-A">Class 9-A</option>
                  <option value="Class 9-B">Class 9-B</option>
                  <option value="Class 10-A">Class 10-A</option>
                  <option value="Lab Cohort 302">Lab Cohort 302</option>
                  <option value="All Enrolled Classes">All Enrolled Classes (Public)</option>
                </select>
              </div>

              {/* Description / Summary */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Note Summary / Key Concepts
                </label>
                <textarea
                  rows={3}
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  placeholder="Summarize what equations, concepts, problem types, or experiments are covered in this note..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all font-medium resize-none"
                />
              </div>

              {/* File Attachment Upload Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Attach Document / File
                </label>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-4 text-center transition-all ${
                    isDragging
                      ? 'border-emerald-600 bg-emerald-50'
                      : selectedFile
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="file"
                    id="note-file-input"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.doc,.pptx,.txt,.png,.jpg"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-between bg-white border border-emerald-200 rounded-xl p-2.5">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-emerald-700 text-lg">description</span>
                        <div className="text-left truncate">
                          <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                          <p className="text-[10px] text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-slate-400 hover:text-rose-600 p-1 text-xs cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="note-file-input" className="cursor-pointer block space-y-1">
                      <span className="material-symbols-outlined text-2xl text-emerald-700">cloud_upload</span>
                      <p className="text-xs font-bold text-slate-700">Drag & drop note file, or <span className="text-emerald-700 underline">browse</span></p>
                      <p className="text-[10px] text-slate-400">Supports PDF, Word, PowerPoint, Text, and Images (up to 25MB)</p>
                    </label>
                  )}
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">check</span>
                  Save & Publish Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW NOTE DETAIL MODAL */}
      {selectedNoteDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                  {selectedNoteDetail.tag}
                </span>
                <span className="text-xs text-slate-500 font-semibold">• {selectedNoteDetail.targetClass || 'All Classes'}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNoteDetail(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {selectedNoteDetail.title}
                </h3>
                <p className="text-xs text-emerald-800 font-semibold mt-1">
                  {selectedNoteDetail.subject}
                </p>
              </div>

              {/* Note Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Uploaded By</span>
                  <span className="font-semibold text-slate-800">{selectedNoteDetail.author || 'Instructor'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Date Published</span>
                  <span className="font-semibold text-slate-800">{selectedNoteDetail.uploadedAt || 'Recent'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">File Format</span>
                  <span className="font-semibold text-slate-800">{selectedNoteDetail.fileType || 'PDF Document'}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Downloads</span>
                  <span className="font-semibold text-slate-800">{selectedNoteDetail.downloads} times</span>
                </div>
              </div>

              {/* Detailed Summary */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1.5">Description & Concept Coverage</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 font-normal">
                  {selectedNoteDetail.desc}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSelectedNoteDetail(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setResources(prev => prev.map(item => item.id === selectedNoteDetail.id ? { ...item, downloads: item.downloads + 1 } : item));
                    alert(`Downloading document: ${selectedNoteDetail.title}`);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">download</span>
                  Download File ({selectedNoteDetail.fileSize || '2 MB'})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


