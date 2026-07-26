import React, { useState } from 'react';
import { X, Plus, Sparkles, Upload, FileText, CheckCircle } from 'lucide-react';
import { 
  EducationalLevel, 
  Subject, 
  Region, 
  MaterialType, 
  StudyMaterial, 
  UserProfile, 
  Language 
} from '../types';
import { translations } from '../lib/translations';

interface UploadMaterialModalProps {
  user: UserProfile;
  language: Language;
  onClose: () => void;
  onUploadSuccess: (newMaterial: StudyMaterial, autoGenerateAI: boolean) => void;
}

export const UploadMaterialModal: React.FC<UploadMaterialModalProps> = ({
  user,
  language,
  onClose,
  onUploadSuccess
}) => {
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<EducationalLevel>('Bachillerato');
  const [subject, setSubject] = useState<Subject>('Matemáticas');
  const [region, setRegion] = useState<Region>('España');
  const [type, setType] = useState<MaterialType>('resumen');
  const [contentText, setContentText] = useState('');
  const [tagsInput, setTagsInput] = useState('EBAU, Apuntes, Resumen');
  const [autoGenerateAI, setAutoGenerateAI] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !contentText.trim()) return;

    setIsSubmitting(true);

    const newMat: StudyMaterial = {
      id: `mat-${Date.now()}`,
      title,
      description: description || title,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      authorRole: user.role,
      level,
      subject,
      topic: subject,
      region,
      type,
      likesCount: 1,
      commentsCount: 0,
      rating: 5.0,
      views: 12,
      createdAt: new Date().toISOString().split('T')[0],
      contentText,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      isLiked: true,
      isSaved: true
    };

    setTimeout(() => {
      onUploadSuccess(newMat, autoGenerateAI);
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Compartir Apuntes en la Biblioteca
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Ayuda a la comunidad compartiendo resúmenes, guías y ejercicios.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Título del Material *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Resumen Completo de la Guerra Civil Española (1936-1939)"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Descripción Breve
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej. Esquema de causas, bandos, etapas del conflicto y consecuencias políticas."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* Grid Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Nivel Educativo
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as EducationalLevel)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:border-teal-500"
              >
                <option value="Secundaria">Secundaria</option>
                <option value="Bachillerato">Bachillerato</option>
                <option value="Universidad">Universidad</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Asignatura
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:border-teal-500"
              >
                <option value="Matemáticas">Matemáticas</option>
                <option value="Historia">Historia</option>
                <option value="Biología">Biología</option>
                <option value="Física">Física</option>
                <option value="Química">Química</option>
                <option value="Lengua y Literatura">Lengua y Literatura</option>
                <option value="Inglés">Inglés</option>
                <option value="Informática">Informática</option>
                <option value="Filosofía">Filosofía</option>
                <option value="Economía">Economía</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                País / Región
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value as Region)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:border-teal-500"
              >
                <option value="España">España</option>
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
                <option value="Argentina">Argentina</option>
                <option value="Chile">Chile</option>
                <option value="Perú">Perú</option>
                <option value="Internacional">Internacional</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-transparent focus:border-teal-500 capitalize"
              >
                <option value="resumen">Resumen</option>
                <option value="apunte">Apunte</option>
                <option value="flashcards">Flashcards</option>
                <option value="guia">Guía</option>
                <option value="ejercicio">Ejercicio</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Contenido del Apunte / Texto *
            </label>
            <textarea
              required
              rows={6}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Pega o escribe aquí el contenido pedagógico de tus apuntes, fórmulas o resúmenes..."
              className="w-full p-3 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="EBAU, Examen, Historia, Apuntes"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
            />
          </div>

          {/* AI Auto-Generation Checkbox */}
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Generar tarjetas (Flashcards) y Quiz test con Inteligencia Artificial automáticamente
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateAI}
              onChange={(e) => setAutoGenerateAI(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-90 transition disabled:opacity-50"
            >
              {isSubmitting ? 'Publicando...' : 'Publicar en la Comunidad'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
