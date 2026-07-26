import React, { useState } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  CheckCircle, 
  FileText, 
  Image as ImageIcon,
  Copy,
  Check,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { UserProfile, Language } from '../types';
import { translations } from '../lib/translations';

interface SmartScannerViewProps {
  user: UserProfile;
  language: Language;
  onUpdateDailyQueries: () => void;
}

export const SmartScannerView: React.FC<SmartScannerViewProps> = ({
  user,
  language,
  onUpdateDailyQueries
}) => {
  const t = translations[language];

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [scannedText, setScannedText] = useState<string>('');
  const [scanMode, setScanMode] = useState<'resolver_ejercicio' | 'resumen_texto'>('resolver_ejercicio');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMimeType(file.type || 'image/jpeg');
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunScanner = async () => {
    if (!selectedImage && !scannedText.trim()) {
      alert('Por favor sube una imagen o ingresa un texto para escanear.');
      return;
    }

    setIsAnalyzing(true);
    setScanResult(null);

    try {
      const response = await fetch('/api/ai/scanner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType,
          textInput: scannedText,
          mode: scanMode,
          language
        })
      });

      const responseText = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(`Respuesta del servidor en formato no válido (${response.status} ${response.statusText})`);
      }

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Error al procesar la imagen');
      }

      setScanResult(data.result);
      onUpdateDailyQueries();
    } catch (error: any) {
      console.error('Error in scanner:', error);
      setScanResult(`⚠️ Ocurrió un error al analizar la imagen: ${error?.message || 'Error de servidor'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyResult = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-6 h-6 text-teal-500" />
          <span>{t.scanner.title}</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t.scanner.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Upload / Image Capture Area */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Modo de escaneo:
            </span>
            
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setScanMode('resolver_ejercicio')}
                className={`px-3 py-1 rounded-lg transition ${
                  scanMode === 'resolver_ejercicio'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                📐 Resolver Ejercicio
              </button>

              <button
                onClick={() => setScanMode('resumen_texto')}
                className={`px-3 py-1 rounded-lg transition ${
                  scanMode === 'resumen_texto'
                    ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs'
                    : 'text-slate-500'
                }`}
              >
                📄 Resumir Libro/Apunte
              </button>
            </div>
          </div>

          {/* Image Dropzone */}
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-teal-500 rounded-2xl p-6 text-center transition bg-slate-50/50 dark:bg-slate-800/30 flex flex-col items-center justify-center min-h-[240px]">
            {selectedImage ? (
              <div className="space-y-3 w-full">
                <img
                  src={selectedImage}
                  alt="Escaneo seleccionado"
                  className="max-h-56 mx-auto rounded-xl object-contain border border-slate-200 dark:border-slate-700 shadow-sm"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-xs font-bold text-rose-500 hover:underline"
                >
                  Cambiar o eliminar foto
                </button>
              </div>
            ) : (
              <label className="cursor-pointer space-y-2 w-full flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-1">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  {t.scanner.dragDrop}
                </span>
                <span className="text-[11px] text-slate-400 block max-w-xs">
                  {t.scanner.supports}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="scanner-file-input"
                />
              </label>
            )}
          </div>

          {/* Alternative Raw Text Input */}
          <div>
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
              O escribe/pega la ecuación o texto manuscrito directamente:
            </label>
            <textarea
              rows={3}
              value={scannedText}
              onChange={(e) => setScannedText(e.target.value)}
              placeholder="Ejemplo: int_0^pi sin(x)^2 dx  o  'El periodo del péndulo simple depende de la longitud L y la gravedad g...'"
              className="w-full p-3 text-xs font-mono rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-transparent focus:border-teal-500 focus:outline-none"
              id="scanner-text-input"
            />
          </div>

          <button
            onClick={handleRunScanner}
            disabled={isAnalyzing || (!selectedImage && !scannedText.trim())}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition disabled:opacity-40 flex items-center justify-center gap-2"
            id="run-scanner-btn"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{t.scanner.analyzing}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Escanear y Resolver con IA</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: AI Resolution Result */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-sm min-h-[350px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-500" />
                <span>Resultado del Análisis y Resolución</span>
              </h3>

              {scanResult && (
                <button
                  onClick={handleCopyResult}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-teal-600 transition flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
              )}
            </div>

            {isAnalyzing ? (
              <div className="py-20 text-center space-y-3">
                <Sparkles className="w-10 h-10 text-teal-500 animate-spin mx-auto" />
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Analizando patrones visuales, fórmulas y derivando la solución paso a paso...
                </p>
              </div>
            ) : scanResult ? (
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[450px] overflow-y-auto">
                {scanResult}
              </div>
            ) : (
              <div className="py-20 text-center space-y-2">
                <Camera className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-500">
                  Ningún ejercicio escaneado todavía.
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                  Sube una fotografía de tu examen, ejercicio manuscrito o libro de texto para obtener la resolución paso a paso.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
