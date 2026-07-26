import React, { useState } from 'react';
import { 
  Users, 
  Send, 
  Plus, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  CheckCircle,
  Paperclip,
  FileText
} from 'lucide-react';
import { StudyGroup, GroupMessage, UserProfile, Language } from '../types';

interface StudyGroupsViewProps {
  groups: StudyGroup[];
  user: UserProfile;
  language: Language;
  onJoinToggle: (groupId: string) => void;
  onSendMessage: (groupId: string, text: string) => void;
  onCreateGroup: (name: string, description: string, subject: any, isPrivate: boolean) => void;
}

export const StudyGroupsView: React.FC<StudyGroupsViewProps> = ({
  groups,
  user,
  language,
  onJoinToggle,
  onSendMessage,
  onCreateGroup
}) => {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup>(groups[0]);
  const [messageText, setMessageText] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Group Form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupSubject, setNewGroupSubject] = useState<any>('Matemáticas');
  const [newGroupPrivate, setNewGroupPrivate] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedGroup) return;

    onSendMessage(selectedGroup.id, messageText);
    setMessageText('');
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;

    onCreateGroup(newGroupName, newGroupDesc, newGroupSubject, newGroupPrivate);
    setShowCreateModal(false);
    setNewGroupName('');
    setNewGroupDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-500" />
            <span>Grupos de Estudio Colaborativos</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Únete a salas de chat temáticas para resolver dudas en grupo y compartir apuntes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500 transition flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Crear Nuevo Grupo</span>
        </button>
      </div>

      {/* Main Grid: Groups List Sidebar & Active Group Chat Room */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-12rem)] min-h-[500px]">
        
        {/* Left: Group List */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 px-2">
            Mis Grupos y Recomendados
          </h3>

          {groups.map((grp) => (
            <div
              key={grp.id}
              onClick={() => setSelectedGroup(grp)}
              className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                selectedGroup?.id === grp.id
                  ? 'bg-teal-50/80 dark:bg-teal-950/60 border-teal-500'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={grp.groupAvatar}
                  alt=""
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {grp.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {grp.membersCount} miembros • {grp.subject}
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onJoinToggle(grp.id);
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 ${
                  grp.isJoined
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-teal-600 text-white hover:bg-teal-500'
                }`}
              >
                {grp.isJoined ? 'Unido ✓' : 'Unirme'}
              </button>
            </div>
          ))}
        </div>

        {/* Right: Selected Group Chat Room */}
        <div className="lg:col-span-2 p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm">
          
          {selectedGroup ? (
            <>
              {/* Chat Room Top Bar */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedGroup.groupAvatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {selectedGroup.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {selectedGroup.description}
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  👥 {selectedGroup.membersCount} miembros
                </span>
              </div>

              {/* Messages Feed */}
              <div className="flex-1 py-4 overflow-y-auto space-y-3">
                {(!selectedGroup?.recentMessages || selectedGroup.recentMessages.length === 0) ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    Inicia la conversación compartiendo tus dudas o apuntes sobre {selectedGroup?.subject || 'este grupo'}.
                  </div>
                ) : (
                  (selectedGroup.recentMessages || []).map((msg) => (
                    <div key={msg.id} className="flex items-start gap-2.5">
                      <img src={msg.senderAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{msg.senderName}</span>
                          <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 max-w-md leading-relaxed">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Send Message Bar */}
              <form onSubmit={handleSend} className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Enviar mensaje a ${selectedGroup.name}...`}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="px-4 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-md hover:bg-teal-500 transition disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-20 text-slate-400 text-xs">
              Selecciona un grupo para chatear.
            </div>
          )}

        </div>

      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Crear Nuevo Grupo de Estudio
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Nombre del Grupo *</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="Ej. Grupo de Estudio Física Cuántica"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Descripción</label>
                <input
                  type="text"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Ej. Resolución diaria de problemas de nivel universitario"
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Asignatura</label>
                <select
                  value={newGroupSubject}
                  onChange={(e) => setNewGroupSubject(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="Matemáticas">Matemáticas</option>
                  <option value="Biología">Biología</option>
                  <option value="Física">Física</option>
                  <option value="Historia">Historia</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                >
                  Crear Grupo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
