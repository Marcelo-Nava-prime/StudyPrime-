import React, { useState } from 'react';
import { X, Plus, Sparkles, Upload, FileText, Image as ImageIcon, File, CheckCircle } from 'lucide-react';
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
  const [type, setType] = useState<MaterialType>('apunte');
  const [contentText, setContentText] = useState('');
  const [tagsInput, setTagsInput] = useState('Apuntes, Estudio');
  const [autoGenerateAI, setAutoGenerateAI] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload States
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    dataUrl: string;
    fileType: 'pdf' | 'image' | 'text';
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    const reader = new FileReader();

    if (isImage || isPdf) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        const resultUrl = reader.result as string;
        setSelectedFile({
          file,
          dataUrl: resultUrl,
          fileType: isPdf ? 'pdf' : 'image'
        });

        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        if (isPdf) {
          setType('guia');
          setContentText(prev => prev || `Documento PDF adjunto: ${file.name}\n\n[Notas de estudio del archivo PDF]`);
        } else if (isImage) {
          setType('apunte');
          setContentText(prev => prev || `Imagen de apuntes escaneados: ${file.name}\n\n[Texto extraído de la imagen]`);
        }
      };
    } else {
      // Text file
      reader.readAsText(file);
      reader.onload = () => {
        const text = reader.result as string;
        setSelectedFile({
          file,
          dataUrl: '',
          fileType: 'text'
        });
        if (!title) {
          setTitle(file.name.replace(/\.[^/.]+$/, ''));
        }
        setContentText(text);
      };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);

    const finalContent = contentText.trim() || (selectedFile ? `Archivo adjunto: ${selectedFile.file.name}` : 'Sin contenido de texto.');

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
      likesCount: 0,
      commentsCount: 0,
      rating: 5.0,
      views: 1,
      createdAt: new Date().toISOString().split('T')[0],
      contentText: finalContent,
      fileUrl: selectedFile?.dataUrl || undefined,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      isLiked: false,
      isSaved: true
    };

    setTimeout(() => {
      onUploadSuccess(newMat, autoGenerateAI);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl border border-[#E5E5E1] dark:border-neutral-800 shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E5E5E1] dark:border-neutral-800 flex items-center justify-between bg-[#FDFDFB] dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#4F46E5] text-white flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#121212] dark:text-white uppercase tracking-wider font-mono">
                Guardar Apunte Personal
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Sube tus textos, archivos PDF e imágenes para tu estudio y repaso personal.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-[#121212] dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* File Attachment Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-1.5">
              Adjuntar Imagen o Documento PDF (Opcional):
            </label>
            
            <div className="border-2 border-dashed border-[#E5E5E1] dark:border-neutral-700 p-4 bg-[#F5F5F1] dark:bg-neutral-900 text-center relative hover:border-[#4F46E5] transition">
              <input
                type="file"
                accept="image/*,application/pdf,.txt,.md"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              {selectedFile ? (
                <div className="flex items-center justify-center gap-3 text-xs font-bold text-[#4F46E5]">
                  {selectedFile.fileType === 'pdf' && <FileText className="w-6 h-6 text-rose-600" />}
                  {selectedFile.fileType === 'image' && <ImageIcon className="w-6 h-6 text-indigo-600" />}
                  {selectedFile.fileType === 'text' && <File className="w-6 h-6 text-amber-600" />}
                  <span>{selectedFile.file.name} ({(selectedFile.file.size / 1024).toFixed(1)} KB)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 uppercase tracking-wider">
                    ✓ Adjuntado
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 mx-auto text-neutral-400" />
                  <p className="text-xs font-semibold text-[#121212] dark:text-neutral-200">
                    Haz clic aquí o arrastra un archivo PDF o Imagen de tus apuntes
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Soporta imágenes (PNG, JPG, WebP) y PDFs académicos.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-1">
              Título de tus Apuntes *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Resumen Completo de Geometría Analítica"
              className="w-full px-3.5 py-2.5 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          {/* Grid Selectors */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Nivel Educativo
              </label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as EducationalLevel)}
                className="w-full px-2.5 py-2 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700"
              >
                <option value="Secundaria">Secundaria</option>
                <option value="Bachillerato">Bachillerato</option>
                <option value="Universidad">Universidad</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Asignatura
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full px-2.5 py-2 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700"
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
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as MaterialType)}
                className="w-full px-2.5 py-2 text-xs bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700 capitalize"
              >
                <option value="apunte">Apunte</option>
                <option value="resumen">Resumen</option>
                <option value="guia">PDF / Guía</option>
                <option value="flashcards">Flashcards</option>
                <option value="ejercicio">Ejercicio / Problema</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#121212] dark:text-neutral-200 mb-1">
              Contenido del Apunte / Notas de Texto
            </label>
            <textarea
              rows={5}
              value={contentText}
              onChange={(e) => setContentText(e.target.value)}
              placeholder="Escribe o pega aquí las notas teóricas, definiciones o fórmulas de tus apuntes..."
              className="w-full p-3 text-xs font-mono bg-[#F5F5F1] dark:bg-neutral-900 text-[#121212] dark:text-white border border-[#E5E5E1] dark:border-neutral-700 focus:border-[#4F46E5] focus:outline-none"
            />
          </div>

          {/* AI Auto-Generation Checkbox */}
          <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#4F46E5]" />
              <span className="text-xs font-bold text-[#121212] dark:text-neutral-100">
                Generar tarjetas de repaso y test con IA al guardar
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoGenerateAI}
              onChange={(e) => setAutoGenerateAI(e.target.checked)}
              className="w-4 h-4 text-[#4F46E5] cursor-pointer"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold uppercase text-neutral-500 hover:text-[#121212] transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="px-6 py-2.5 bg-[#121212] text-white dark:bg-white dark:text-[#121212] font-bold text-xs uppercase tracking-wider hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition disabled:opacity-50"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar en Mis Apuntes'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

