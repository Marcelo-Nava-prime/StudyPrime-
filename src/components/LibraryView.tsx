import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Heart, 
  MessageSquare, 
  FileText, 
  Layers, 
  CheckCircle, 
  PlusCircle, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { 
  StudyMaterial, 
  EducationalLevel, 
  Subject, 
  Region, 
  MaterialType, 
  Language 
} from '../types';
import { translations } from '../lib/translations';

interface LibraryViewProps {
  materials: StudyMaterial[];
  language: Language;
  onSelectMaterial: (material: StudyMaterial) => void;
  onToggleLike: (materialId: string) => void;
  onOpenUpload: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  materials,
  language,
  onSelectMaterial,
  onToggleLike,
  onOpenUpload
}) => {
  const t = translations[language];

  const [selectedLevel, setSelectedLevel] = useState<string>('Todos');
  const [selectedSubject, setSelectedSubject] = useState<string>('Todas');
  const [selectedRegion, setSelectedRegion] = useState<string>('Todas');
  const [selectedType, setSelectedType] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'newest'>('popularity');

  const levels = ['Todos', 'Secundaria', 'Bachillerato', 'Universidad'];
  const subjects = ['Todas', 'Matemáticas', 'Historia', 'Biología', 'Física', 'Química', 'Lengua y Literatura', 'Inglés', 'Informática', 'Filosofía', 'Economía'];
  const regions = ['Todas', 'España', 'México', 'Colombia', 'Argentina', 'Chile', 'Perú', 'Internacional'];
  const types = ['Todos', 'apunte', 'resumen', 'flashcards', 'presentacion', 'guia', 'ejercicio'];

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      if (selectedLevel !== 'Todos' && item.level !== selectedLevel) return false;
      if (selectedSubject !== 'Todas' && item.subject !== selectedSubject) return false;
      if (selectedRegion !== 'Todas' && item.region !== selectedRegion) return false;
      if (selectedType !== 'Todos' && item.type !== selectedType) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTopic = item.topic.toLowerCase().includes(q);
        const matchesTags = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTopic && !matchesTags) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'popularity') return b.likesCount - a.likesCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });
  }, [materials, selectedLevel, selectedSubject, selectedRegion, selectedType, searchQuery, sortBy]);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E1] dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-serif font-bold italic text-[#121212] dark:text-white">
            Mis Apuntes y Documentos
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-sans">
            Tus apuntes privados, resúmenes, documentos PDF e imágenes de estudio.
          </p>
        </div>

        <button
          onClick={onOpenUpload}
          className="px-5 py-2.5 bg-[#121212] text-white dark:bg-white dark:text-[#121212] font-semibold text-xs uppercase tracking-widest hover:bg-[#4F46E5] dark:hover:bg-[#4F46E5] dark:hover:text-white transition flex items-center justify-center gap-2 shrink-0"
          id="library-upload-btn"
        >
          <PlusCircle className="w-4 h-4 text-[#FF3D00]" />
          <span>+ Añadir Apunte / PDF</span>
        </button>
      </div>

      {/* Search & Advanced Filters Bar */}
      <div className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por materia, derivadas, historia..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-100 placeholder-neutral-400 border border-transparent focus:border-[#4F46E5] focus:outline-none transition font-sans"
              id="library-search-input"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-mono">Ordenar:</span>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-[#E5E5E1] dark:border-neutral-700 font-semibold uppercase tracking-wider"
              id="library-sort-select"
            >
              <option value="popularity">Más Populares 🔥</option>
              <option value="rating">Mejor Valorados ⭐</option>
              <option value="newest">Más Recientes 🆕</option>
            </select>
          </div>
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#E5E5E1] dark:border-neutral-800">
          
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 font-mono">
              {t.common.level}
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-transparent focus:border-[#4F46E5] focus:outline-none"
              id="filter-level-select"
            >
              {levels.map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 font-mono">
              {t.common.subject}
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-transparent focus:border-[#4F46E5] focus:outline-none"
              id="filter-subject-select"
            >
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 font-mono">
              {t.common.region}
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-transparent focus:border-[#4F46E5] focus:outline-none"
              id="filter-region-select"
            >
              {regions.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-1 font-mono">
              {t.common.type}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#F1F1ED] dark:bg-neutral-800 text-[#121212] dark:text-neutral-200 border border-transparent focus:border-[#4F46E5] focus:outline-none capitalize"
              id="filter-type-select"
            >
              {types.map(tp => (
                <option key={tp} value={tp} className="capitalize">{tp}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Materials Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMaterials.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-neutral-900 border border-dashed border-[#E5E5E1] dark:border-neutral-800">
            <BookOpen className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-sm font-serif font-bold text-[#121212] dark:text-neutral-200">
              No se encontraron materiales con esos filtros.
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto font-sans">
              Intenta cambiar la asignatura, el nivel educativo o borra la búsqueda para ver más resultados.
            </p>
          </div>
        ) : (
          filteredMaterials.map((item) => (
            <div
              key={item.id}
              className="p-5 bg-white dark:bg-neutral-900 border border-[#E5E5E1] dark:border-neutral-800 hover:border-[#121212] transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] uppercase tracking-widest font-semibold text-neutral-500 font-mono">
                    {item.subject}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#121212] dark:text-white font-serif">
                    <Star className="w-3.5 h-3.5 fill-[#FF3D00] text-[#FF3D00]" />
                    <span>{item.rating.toFixed(1)}</span>
                  </div>
                </div>

                <h3 
                  onClick={() => onSelectMaterial(item)}
                  className="font-serif text-lg leading-snug font-normal text-[#121212] dark:text-white mb-2 hover:text-[#4F46E5] cursor-pointer transition"
                >
                  {item.title}
                </h3>

                <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-3 leading-relaxed font-sans">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4 font-mono text-[10px]">
                  <span className="px-2 py-0.5 bg-[#F5F5F1] dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {item.level}
                  </span>
                  <span className="px-2 py-0.5 bg-[#F5F5F1] dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    📍 {item.region}
                  </span>
                  <span className="px-2 py-0.5 bg-[#4F46E5] text-white capitalize">
                    {item.type}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E5E1] dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-[#4F46E5]">
                    @{item.authorName.replace(/\s+/g, '')}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-neutral-500 font-mono">
                  <button
                    onClick={() => onToggleLike(item.id)}
                    className={`flex items-center gap-1 transition ${
                      item.isLiked ? 'text-[#FF3D00] font-bold' : 'hover:text-[#FF3D00]'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-[#FF3D00]' : ''}`} />
                    <span>{item.likesCount}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{item.commentsCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
