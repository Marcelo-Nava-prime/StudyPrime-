import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  Trash2, 
  Users, 
  FileText, 
  TrendingUp,
  Search
} from 'lucide-react';
import { StudyMaterial, UserProfile } from '../types';

interface AdminPanelModalProps {
  materials: StudyMaterial[];
  users: UserProfile[];
  onClose: () => void;
  onDeleteMaterial: (id: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  materials,
  users,
  onClose,
  onDeleteMaterial
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'reports' | 'materials'>('stats');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample reported items
  const [reports, setReports] = useState([
    { id: 'rep-1', title: 'Apunte con posible contenido incompleto o spam', author: 'UsuarioAnonimo', reason: 'Información poco clara', date: 'Hace 2 horas', materialId: materials[0]?.id },
    { id: 'rep-2', title: 'Comentario inadecuado en resumen de Historia', author: 'CarlosG', reason: 'Lenguaje inapropiado', date: 'Hace 5 horas', materialId: materials[1]?.id }
  ]);

  const safeMaterials = materials || [];
  const safeUsers = users || [];

  const filteredMaterials = safeMaterials.filter(m => 
    (m.title || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.subject || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDismissReport = (repId: string) => {
    setReports(reports.filter(r => r.id !== repId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-400" />
            <div>
              <h2 className="text-base font-extrabold">Panel de Moderación y Administración</h2>
              <p className="text-[11px] text-slate-400">StudyPrime System Admin • Control de Calidad</p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'stats' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Métricas de Plataforma</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'reports' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Reportes de la Comunidad ({reports.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'materials' ? 'bg-teal-600 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Gestión de Apuntes ({materials.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: METRICS STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 block">{users.length + 1240}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Estudiantes Activos</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 block">{materials.length}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Apuntes Publicados</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-extrabold text-teal-600 dark:text-teal-400 block">4.8 / 5</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Satisfacción IA</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 block">99.8%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Uptime Servidores</span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                  Desglose por Asignatura y Nivel Educativo
                </h3>
                <p className="text-xs text-slate-500">
                  Bachillerato representa el 58% del tráfico total (preparación de exámenes EBAU/Selectividad).
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: COMMUNITY REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  🎉 ¡No hay reportes pendientes de moderación!
                </div>
              ) : (
                reports.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{r.title}</h4>
                      <p className="text-[11px] text-slate-500">Reportado por {r.author} • {r.reason} ({r.date})</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDismissReport(r.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold"
                      >
                        Descartar
                      </button>
                      <button
                        onClick={() => {
                          if (r.materialId) onDeleteMaterial(r.materialId);
                          handleDismissReport(r.id);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 text-xs font-bold"
                      >
                        Eliminar Apunte
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: MATERIALS MANAGEMENT */}
          {activeTab === 'materials' && (
            <div className="space-y-4">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar apunte por título o asignatura..."
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
              />

              <div className="space-y-2">
                {filteredMaterials.map((m) => (
                  <div key={m.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{m.title}</h4>
                      <p className="text-[10px] text-slate-500">{m.subject} • Por {m.authorName} ({m.createdAt})</p>
                    </div>

                    <button
                      onClick={() => onDeleteMaterial(m.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-lg transition"
                      title="Eliminar Apunte"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
