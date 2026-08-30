import React, { useMemo, useState } from 'react';
import { PersonDirectoryUser, Role, StudentMember, TeacherMember } from '../types';

interface PeopleHubProps {
  userRole: Role;
  students: StudentMember[];
  teachers: TeacherMember[];
  directoryUsers: PersonDirectoryUser[];
}

type Person = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: 'student' | 'teacher';
  subtitle: string;
  initials?: string;
  avatarUrl?: string;
  online?: boolean;
};

export default function PeopleHub({ userRole, students, teachers, directoryUsers }: PeopleHubProps) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'students' | 'teachers' | 'friends'>('all');
  const [friends, setFriends] = useState<string[]>(['s-2']);
  const [chatWith, setChatWith] = useState<Person | null>(null);
  const [messages, setMessages] = useState<Record<string, string[]>>({});
  const [draft, setDraft] = useState('');

  const people = useMemo<Person[]>(() => {
    const map = new Map<string, Person>();
    teachers.forEach(t => map.set(t.id, {
      id: t.id, name: t.name, username: t.username, email: t.email, role: 'teacher',
      subtitle: `${t.role} • ${t.subject}`, initials: t.initials, avatarUrl: t.avatarUrl,
      online: t.status !== 'offline'
    }));
    students.forEach(s => map.set(s.id, {
      id: s.id, name: s.name, username: s.username, email: s.email, role: 'student',
      subtitle: `${s.section || 'Student'} • ${s.rollNumber}`, initials: s.initials, avatarUrl: s.avatarUrl,
      online: s.status !== 'offline'
    }));
    directoryUsers.forEach(d => {
      if (!map.has(d.id)) map.set(d.id, {
        id: d.id, name: d.name, username: d.username, email: d.email, role: d.defaultRole,
        subtitle: d.defaultRole === 'teacher' ? `${d.subject || 'Teacher'} • ${d.department || 'Faculty'}` : (d.suggestedSection || 'Student'),
        initials: d.initials, avatarUrl: d.avatarUrl, online: false
      });
    });
    return Array.from(map.values());
  }, [students, teachers, directoryUsers]);

  const filtered = people.filter(p => {
    const q = query.toLowerCase().trim();
    const matchesSearch = !q || `${p.name} ${p.username} ${p.email} ${p.subtitle}`.toLowerCase().includes(q);
    const matchesFilter = filter === 'all' || (filter === 'students' && p.role === 'student') || (filter === 'teachers' && p.role === 'teacher') || (filter === 'friends' && friends.includes(p.id));
    return matchesSearch && matchesFilter;
  });

  const toggleFriend = (id: string) => setFriends(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatWith || !draft.trim()) return;
    setMessages(prev => ({ ...prev, [chatWith.id]: [...(prev[chatWith.id] || []), `You: ${draft.trim()}`] }));
    setDraft('');
    setTimeout(() => setMessages(prev => ({ ...prev, [chatWith.id]: [...(prev[chatWith.id] || []), `${chatWith.name}: Got it — I'll get back to you shortly.`] })), 600);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-sm"><span className="material-symbols-outlined">group</span></div>
              <div>
                <h1 className="text-2xl font-black text-slate-900">People & Connections</h1>
                <p className="text-sm text-slate-600">Find classmates, teachers and friends. Start a private conversation from any profile.</p>
              </div>
            </div>
          </div>
          <div className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-2">{friends.length} connections</div>
        </div>

        <div className="mt-5 relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search students, teachers, names or usernames..." className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-900 shadow-sm" />
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {([['all','Everyone'],['students','Students'],['teachers','Teachers'],['friends','My Friends']] as const).map(([id,label]) => (
            <button key={id} onClick={() => setFilter(id)} className={`px-4 py-2 rounded-full text-xs font-bold border whitespace-nowrap ${filter === id ? 'bg-emerald-700 border-emerald-700 text-white' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}>{label}</button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(person => {
          const isFriend = friends.includes(person.id);
          return <article key={person.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className="relative shrink-0">
                {person.avatarUrl ? <img src={person.avatarUrl} alt="" className="w-12 h-12 rounded-full object-cover border border-slate-200" /> : <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black ${person.role === 'teacher' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>{person.initials || person.name.slice(0,2).toUpperCase()}</div>}
                {person.online && <span className="absolute -right-0.5 -bottom-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" title="Online" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 truncate">{person.name}</h3>
                <p className="text-xs text-emerald-800 font-bold">@{person.username.replace(/^@/,'')}</p>
                <p className="text-xs text-slate-500 mt-1 truncate">{person.subtitle}</p>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-full bg-slate-100 text-slate-600">{person.role}</span>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => toggleFriend(person.id)} className={`flex-1 py-2.5 rounded-lg text-xs font-bold border ${isFriend ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-300 hover:text-emerald-800'}`}>
                <span className="material-symbols-outlined text-sm align-middle mr-1">{isFriend ? 'person_check' : 'person_add'}</span>{isFriend ? 'Friend' : 'Add Friend'}
              </button>
              <button onClick={() => setChatWith(person)} title={`Chat with ${person.name}`} className="w-11 h-10 rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-lg">chat</span>
              </button>
            </div>
          </article>;
        })}
      </section>

      {!filtered.length && <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-10 text-center"><span className="material-symbols-outlined text-4xl text-slate-400">person_search</span><p className="mt-2 font-bold text-slate-800">No people found</p><p className="text-sm text-slate-500">Try another name, username or filter.</p></div>}

      {chatWith && <div className="fixed bottom-5 right-5 z-50 w-[min(380px,calc(100vw-2rem))] bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-emerald-700 text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2"><span className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center font-bold">{chatWith.initials || chatWith.name.slice(0,2)}</span><div><p className="text-sm font-extrabold">{chatWith.name}</p><p className="text-[10px] opacity-85">{chatWith.role} {chatWith.online ? '• Online' : ''}</p></div></div>
          <button onClick={() => setChatWith(null)} className="p-1 rounded-lg hover:bg-white/10"><span className="material-symbols-outlined">close</span></button>
        </div>
        <div className="h-56 p-3 bg-slate-50 overflow-y-auto space-y-2">
          {(messages[chatWith.id] || ['Hi! This is a private connection chat.']).map((m,i) => <div key={i} className={`p-2.5 rounded-xl text-xs ${m.startsWith('You:') ? 'ml-8 bg-emerald-100 text-emerald-950' : 'mr-8 bg-white border border-slate-200 text-slate-800'}`}>{m}</div>)}
        </div>
        <form onSubmit={sendMessage} className="p-3 border-t border-slate-200 flex gap-2">
          <input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Write a message..." className="flex-1 px-3 py-2.5 rounded-lg border border-slate-300 text-xs" />
          <button className="w-10 rounded-lg bg-emerald-700 text-white flex items-center justify-center"><span className="material-symbols-outlined text-lg">send</span></button>
        </form>
      </div>}
    </div>
  );
}
