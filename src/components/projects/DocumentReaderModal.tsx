import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  BookOpen, 
  Maximize2, 
  Minimize2, 
  ShieldCheck, 
  FileText,
  Volume2,
  VolumeX,
  List,
  RotateCcw,
  Upload,
  Layers,
  Sparkles,
  CheckCircle2,
  Info
} from 'lucide-react';
import { PageFlip } from 'page-flip';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import type { DriveProject } from '../../data/driveProjectsData';
import './DocumentReaderModal.css';

interface DocumentReaderModalProps {
  project: DriveProject | null;
  isOpen: boolean;
  onClose: () => void;
}

// Generate realistic paper rustle sound using Web Audio API (no external asset dependencies)
function playRealisticPaperSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Create subtle white noise burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const env = Math.exp(-i / (bufferSize * 0.3));
      data[i] = (Math.random() * 2 - 1) * env * 0.45;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Lowpass filter to simulate soft paper texture
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1400, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.14);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.22, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start();
    noise.stop(ctx.currentTime + 0.15);
  } catch {
    // AudioContext blocked by browser policy
  }
}

export const DocumentReaderModal: React.FC<DocumentReaderModalProps> = ({
  project,
  isOpen,
  onClose
}) => {
  const { lang } = useThemeLanguage();
  const isRtl = lang === 'ar';

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'flipbook' | 'original'>('flipbook');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(8);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [tocOpen, setTocOpen] = useState(false);
  const [customPdfPages, setCustomPdfPages] = useState<string[] | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const pageFlipRef = useRef<PageFlip | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const soundEnabledRef = useRef(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Handle ESC and Arrow keys for turning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        // In Arabic reading: Left arrow advances forward (flipping from right to left)
        pageFlipRef.current?.flipNext();
      } else if (e.key === 'ArrowRight') {
        // In Arabic reading: Right arrow goes back to previous page
        pageFlipRef.current?.flipPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentPage(1);
    } else {
      document.body.style.overflow = '';
      if (pageFlipRef.current) {
        pageFlipRef.current.destroy();
        pageFlipRef.current = null;
      }
      setCustomPdfPages(null);
      setPdfLoadError(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Initialize or re-initialize StPageFlip
  const initPageFlip = useCallback(() => {
    if (!bookContainerRef.current) return;

    if (pageFlipRef.current) {
      try {
        pageFlipRef.current.destroy();
      } catch {
        // Destroy safely
      }
      pageFlipRef.current = null;
    }

    try {
      const pageFlip = new PageFlip(bookContainerRef.current, {
        width: 480,
        height: 640,
        size: 'stretch' as any,
        minWidth: 300,
        maxWidth: 720,
        minHeight: 400,
        maxHeight: 960,
        maxShadowOpacity: 0.55,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: true,
        flippingTime: 750,
        drawShadow: true,
        showPageCorners: true,
        useMouseEvents: true,
        autoSize: true,
        swipeDistance: 35
      });

      const pages = bookContainerRef.current.querySelectorAll<HTMLElement>('.st-page');
      if (pages.length > 0) {
        pageFlip.loadFromHTML(pages);
        setTotalPages(pages.length);
        setCurrentPage(1);
      }

      pageFlip.on('flip', (e: any) => {
        const pageIdx = typeof e.data === 'number' ? e.data : 0;
        setCurrentPage(pageIdx + 1);
        if (soundEnabledRef.current) {
          playRealisticPaperSound();
        }
      });

      pageFlipRef.current = pageFlip;
    } catch (err) {
      console.error('Error initializing StPageFlip:', err);
    }
  }, []);

  // Run initialization when flipbook view becomes active
  useEffect(() => {
    if (!isOpen || viewMode !== 'flipbook') return;

    const timer = setTimeout(() => {
      initPageFlip();
    }, 60);

    return () => {
      clearTimeout(timer);
      if (pageFlipRef.current) {
        try {
          pageFlipRef.current.destroy();
        } catch {
          // ignore
        }
        pageFlipRef.current = null;
      }
    };
  }, [isOpen, viewMode, customPdfPages, initPageFlip]);

  // Handle custom PDF upload via PDF.js
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoadingPdf(true);
    setPdfLoadError(null);

    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;

      const pageImages: string[] = [];
      const pagesToRender = Math.min(pdf.numPages, 30);

      for (let i = 1; i <= pagesToRender; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.92));
        }
      }

      setCustomPdfPages(pageImages);
      setViewMode('flipbook');
    } catch (err: any) {
      console.error('Failed to load custom PDF:', err);
      setPdfLoadError(lang === 'ar' ? 'تعذر قراءة ملف PDF. يرجى تجربة ملف آخر.' : 'Failed to parse PDF. Please try another file.');
    } finally {
      setIsLoadingPdf(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleResetDefault = () => {
    setCustomPdfPages(null);
    setPdfLoadError(null);
  };

  if (!isOpen || !project) return null;

  const title = lang === 'ar' ? project.title : project.titleEn;
  const desc = lang === 'ar' ? project.description : project.descriptionEn;
  const pdfId = project.pdfId || '1edEWYRLqtgSVRw0Eq7NmCldb_fxzi5OW';
  const previewUrl = `https://drive.google.com/file/d/${pdfId}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${pdfId}`;
  const pptxDownloadUrl = project.pptxId ? `https://drive.google.com/uc?export=download&id=${project.pptxId}` : null;
  const docxDownloadUrl = project.docxId ? `https://drive.google.com/uc?export=download&id=${project.docxId}` : null;

  // Next Page: Turns from Right to Left (تقدم في القراءة لليسار)
  const handleNextPage = () => {
    pageFlipRef.current?.flipNext();
  };

  // Prev Page: Turns back to the Right (رجوع لليمين)
  const handlePrevPage = () => {
    pageFlipRef.current?.flipPrev();
  };

  const handleJumpToPage = (pageNum: number) => {
    pageFlipRef.current?.flip(pageNum - 1);
    setTocOpen(false);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`flipbook-modal-backdrop ${isFullscreen ? 'fullscreen-mode' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div ref={modalRef} className="flipbook-modal-window">
        {/* Top Metallic Engineering Bar */}
        <header className="flipbook-header">
          <div className="flipbook-header-left">
            <div className="flipbook-book-badge">
              <BookOpen size={17} className="text-cyan-400" />
              <span>{isRtl ? 'قارئ المستندات ثلاثي الأبعاد (تقليب من اليمين إلى اليسار)' : '3D Document Flipbook (Right-to-Left Mode)'}</span>
            </div>
            <div className="flipbook-ip-badge">
              <ShieldCheck size={15} />
              <span>{isRtl ? 'منظومة تكنو إنجاز • حقوق الملكية محفوظة' : 'Techno Enjaz Intellectual Property Protected'}</span>
            </div>
          </div>

          {/* Center Mode Switch: 3D Flipbook vs Drive Original */}
          <div className="flipbook-view-switcher">
            <button
              type="button"
              className={`switcher-tab ${viewMode === 'flipbook' ? 'active' : ''}`}
              onClick={() => setViewMode('flipbook')}
              title={isRtl ? 'تصفح ورقي ثلاثي الأبعاد بمحرك StPageFlip' : 'Interactive 3D Flipbook Mode'}
            >
              <Sparkles size={14} />
              <span>{isRtl ? 'تصفح ورقي 3D' : '3D Flipbook'}</span>
            </button>
            <button
              type="button"
              className={`switcher-tab ${viewMode === 'original' ? 'active' : ''}`}
              onClick={() => setViewMode('original')}
              title={isRtl ? 'معاينة ملف Google Drive المباشر' : 'View Raw Drive PDF'}
            >
              <Layers size={14} />
              <span>{isRtl ? 'المستند المباشر' : 'Original PDF'}</span>
            </button>
          </div>

          {/* Action buttons on header right */}
          <div className="flipbook-header-actions">
            {/* Custom PDF Upload */}
            <input 
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={handlePdfUpload}
            />
            <button
              type="button"
              className="flipbook-tool-btn upload-btn"
              onClick={() => fileInputRef.current?.click()}
              title={isRtl ? 'رفع ملف PDF محلي للمعاينة في الكتاب 3D' : 'Upload custom PDF to view in 3D'}
            >
              <Upload size={16} />
              <span className="btn-label-hidden">{isRtl ? 'فتح PDF' : 'Open PDF'}</span>
            </button>

            {customPdfPages && (
              <button
                type="button"
                className="flipbook-tool-btn reset-btn"
                onClick={handleResetDefault}
                title={isRtl ? 'استعادة وثيقة المشروع الافتراضية' : 'Reset to default project book'}
              >
                <RotateCcw size={16} />
              </button>
            )}

            {/* Sound Toggle */}
            {viewMode === 'flipbook' && (
              <button
                type="button"
                className={`flipbook-tool-btn ${soundEnabled ? 'sound-active' : ''}`}
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? (isRtl ? 'كتم صوت الورق' : 'Mute Sound') : (isRtl ? 'تفعيل صوت تقليب الورق' : 'Enable Flip Sound')}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
            )}

            {/* Fullscreen Toggle */}
            <button
              type="button"
              className="flipbook-tool-btn"
              onClick={toggleFullscreen}
              title={isFullscreen ? (isRtl ? 'تصغير' : 'Exit Fullscreen') : (isRtl ? 'ملء الشاشة' : 'Fullscreen')}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>

            {/* Close Button */}
            <button
              type="button"
              className="flipbook-tool-btn close-btn"
              onClick={onClose}
              title={isRtl ? 'إغلاق' : 'Close'}
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Project Meta Info Header */}
        <div className="flipbook-meta-bar">
          <div className="flipbook-title-info">
            <div className="flipbook-title-row">
              <h2 className="flipbook-project-title">{title}</h2>
              <span className="flipbook-category-tag">
                {project.category.toUpperCase()}
              </span>
            </div>
            <p className="flipbook-project-summary">{desc}</p>
          </div>

          <div className="flipbook-downloads-cluster">
            {docxDownloadUrl && (
              <a
                href={docxDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flipbook-action-download-btn docx"
                title={isRtl ? 'تحميل ملف الوورد DOCX' : 'Download DOCX'}
              >
                <Download size={14} />
                <span>DOCX</span>
              </a>
            )}
            {pptxDownloadUrl && (
              <a
                href={pptxDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flipbook-action-download-btn pptx"
                title={isRtl ? 'تحميل العرض التقديمي PPTX' : 'Download PPTX'}
              >
                <Download size={14} />
                <span>PPTX</span>
              </a>
            )}
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flipbook-action-download-btn pdf"
              title={isRtl ? 'تحميل ملف المستند PDF' : 'Download Document PDF'}
            >
              <FileText size={14} />
              <span>PDF</span>
            </a>
          </div>
        </div>

        {/* PDF Loading / Error notification */}
        {isLoadingPdf && (
          <div className="flipbook-loading-overlay">
            <div className="flipbook-spinner" />
            <span>{isRtl ? 'جاري تحويل صفحات الـ PDF إلى محرك 3D...' : 'Rendering PDF pages into 3D Flipbook...'}</span>
          </div>
        )}

        {pdfLoadError && (
          <div className="flipbook-error-banner">
            <span>{pdfLoadError}</span>
          </div>
        )}

        {/* View Mode 1: 3D Flipbook using StPageFlip Engine */}
        {viewMode === 'flipbook' && (
          <div className="flipbook-stage-wrapper">
            {/* LEFT NAV BUTTON: In Arabic RTL, this is PREVIOUS (turns back to the right) */}
            <button 
              type="button" 
              className="flipbook-curl-nav nav-left"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              title={isRtl ? 'الصفحة السابقة (الرجوع لليمين →)' : 'Previous Page'}
            >
              <ChevronRight size={28} />
              <span className="nav-btn-caption">{isRtl ? 'السابق' : 'Prev'}</span>
            </button>

            {/* Realistic Book Stage */}
            <div className="flipbook-3d-stage">
              <div className="flipbook-outer-case">
                <div className="flipbook-spine-binding" />
                
                {/* StPageFlip Mount Target */}
                <div 
                  ref={bookContainerRef} 
                  className="stpageflip-book-container"
                  dir="ltr"
                >
                  {customPdfPages ? (
                    // Custom Uploaded PDF Pages
                    customPdfPages.map((imgUrl, index) => {
                      const isCover = index === 0 || index === customPdfPages.length - 1;
                      return (
                        <div 
                          key={`custom-page-${index}`}
                          className={`st-page ${isCover ? 'cover-page' : 'inner-page'}`}
                          data-density={isCover ? 'hard' : 'soft'}
                        >
                          <div className="st-page-inner custom-pdf-content">
                            <img 
                              src={imgUrl} 
                              alt={`Page ${index + 1}`} 
                              className="custom-pdf-page-img"
                              loading="eager"
                            />
                            <div className="st-page-number">{index + 1}</div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    // High-Fidelity Default Project Document (RTL Reading Order: Right Page first, Left Page second)
                    <>
                      {/* P0: Hard Front Cover (Opens from Right to Left) */}
                      <div className="st-page hard-cover front-cover" data-density="hard">
                        <div className="cover-card-art">
                          <div className="cover-circuit-overlay" />
                          <div className="cover-gold-border">
                            <div className="cover-header-brand">
                              <span className="brand-dot" />
                              <span>تكنو إنجاز | TECHNO ENJAZ</span>
                            </div>

                            <div className="cover-badge-top">
                              <Sparkles size={14} className="text-cyan-400" />
                              <span>{isRtl ? 'وثيقة هندسية وتقنية موثقة' : 'Verified Technical Monograph'}</span>
                            </div>

                            <div className="cover-title-box">
                              <h1 className="cover-h1">{title}</h1>
                              <h2 className="cover-h2-en">{project.titleEn}</h2>
                            </div>

                            <div className="cover-meta-grid">
                              <div className="cover-meta-item">
                                <span className="meta-lbl">{isRtl ? 'التصنيف الهيكلي' : 'Domain Category'}</span>
                                <span className="meta-val highlight">{project.category.toUpperCase()} ARCHITECTURE</span>
                              </div>
                              <div className="cover-meta-item">
                                <span className="meta-lbl">{isRtl ? 'رقم الوثيقة' : 'Document ID'}</span>
                                <span className="meta-val font-mono">TE-{project.id.toUpperCase().substring(0, 10)}-2026</span>
                              </div>
                              <div className="cover-meta-item">
                                <span className="meta-lbl">{isRtl ? 'مستوى الاعتماد' : 'Certification'}</span>
                                <span className="meta-val">{isRtl ? 'معيار مؤسسي كامل' : 'Full Enterprise Grade'}</span>
                              </div>
                            </div>

                            <div className="cover-footer-seal">
                              <div className="seal-emblem">
                                <ShieldCheck size={26} />
                                <span>TECHNO ENJAZ SEAL</span>
                              </div>
                              <div className="cover-hint-peel rtl-direction-prompt">
                                <span>{isRtl ? 'اقلب الغلاف من اليمين إلى اليسار ◂' : 'Drag corner or click next ↗'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* P1: Inside Cover Left Page (معايير التوثيق والاعتماد الأكاديمي) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'بيان الاعتماد والملكية الفكرية' : 'Certification & Compliance'}</span>
                          <span className="doc-page-badge">02</span>
                        </div>
                        <div className="page-text-content">
                          <div className="academic-seal-banner">
                            <ShieldCheck size={32} className="text-cyan-400" />
                            <div>
                              <h4 style={{ margin: 0, color: '#0f172a', fontSize: '13px' }}>{isRtl ? 'منظومة تكنو إنجاز للابتكار الهندسي' : 'Techno Enjaz Engineering Monograph'}</h4>
                              <p style={{ margin: '3px 0 0 0', fontSize: '10.5px', color: '#64748b' }}>{isRtl ? 'سجل التوثيق البرمجي — معيار ISO/IEC 25010' : 'Software Quality Standard ISO/IEC 25010'}</p>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'منهجية الفحص والتدقيق' : 'Verification Methodology'}</h4>
                          <p className="page-lead-para">{isRtl ? 'تمت مراجعة هذا المشروع وتدقيق كافة خوارزمياته عبر منصات المحاكاة المعملية لضمان أعلى معايير الاستقرار والأمان.' : 'All algorithms and architectures undergo rigorous verification and simulation testing.'}</p>

                          <div className="page-spec-table-wrapper">
                            <table className="page-spec-table">
                              <tbody>
                                <tr>
                                  <td><strong>{isRtl ? 'تاريخ الإصدار' : 'Issue Date'}</strong></td>
                                  <td>2026-09-17</td>
                                </tr>
                                <tr>
                                  <td><strong>{isRtl ? 'الجهة المطورة' : 'Dev Organisation'}</strong></td>
                                  <td>Techno Enjaz Labs (Riyadh)</td>
                                </tr>
                                <tr>
                                  <td><strong>{isRtl ? 'مستوى الفحص' : 'Audit Status'}</strong></td>
                                  <td><span style={{ color: '#059669', fontWeight: 'bold' }}>✓ {isRtl ? 'معتمد ومكتمل بنجاح' : 'Passed & Verified'}</span></td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          <div className="rtl-page-hint-box">
                            <Info size={14} className="text-cyan-600" />
                            <span>{isRtl ? '👈 تصفح مستمر: تقلب الصفحات من اليمين نحو اليسار' : 'Reading order progresses Right to Left'}</span>
                          </div>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز' : 'Techno Enjaz'}</span>
                          <span>2</span>
                        </div>
                      </div>

                      {/* P2: Spread 1 Right Page (الفصل الأول: الملخص التنفيذي والأهداف - يقرأ أولاً في اليمين) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الأول: الملخص التنفيذي' : 'Chapter 1: Executive Summary'}</span>
                          <span className="doc-page-badge">01</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '١.١ الإطار العام والنطاق العملي للمشروع' : '1.1 Project Overview & Scope'}</h3>
                          <p className="page-lead-para">{desc}</p>

                          <h4 className="page-sub-title">{isRtl ? 'الأهداف الهندسية الاستراتيجية' : 'Strategic Engineering Objectives'}</h4>
                          <ul className="page-bullet-list">
                            <li>
                              <CheckCircle2 size={14} className="bullet-icon" />
                              <span>{isRtl ? 'تصميم خوارزمية ذكية متقدمة لمعالجة البيانات واستخلاص الأنماط اللحظية بدقة استثنائية.' : 'Design advanced real-time pipeline for ultra-accurate pattern inference.'}</span>
                            </li>
                            <li>
                              <CheckCircle2 size={14} className="bullet-icon" />
                              <span>{isRtl ? 'تحسين زمن المعالجة (Latency Optimization) ليعمل بكفاءة عالية في بيئات الموارد المحدودة.' : 'Optimize execution latency for constrained production environments.'}</span>
                            </li>
                            <li>
                              <CheckCircle2 size={14} className="bullet-icon" />
                              <span>{isRtl ? 'تطبيق معايير الأمان السيبراني وعزل الصلاحيات وحماية البيانات الحساسة.' : 'Enforce zero-trust cyber protocols and granular identity management.'}</span>
                            </li>
                          </ul>

                          <div className="page-callout-box">
                            <span className="callout-title">{isRtl ? 'الكلمات المفتاحية والمحددات:' : 'Indexed Keywords:'}</span>
                            <div className="callout-tags">
                              {project.tags.map(t => (
                                <span key={t} className="page-keyword-tag">#{t}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>1</span>
                        </div>
                      </div>

                      {/* P3: Spread 2 Left Page (الفصل الثالث: الخوارزميات والمنطق البرمجي) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الثالث: الخوارزميات والمنطق' : 'Chapter 3: Algorithmic Logic'}</span>
                          <span className="doc-page-badge">04</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٣.١ خط التدفق الرياضي واستخراج السمات' : '3.1 Mathematical Formulation'}</h3>
                          <p className="page-lead-para">{isRtl ? 'تعتمد المنظومة على دالة تقارب متري مع تطبيق التحسين التدرجي لتقليل نسبة الخطأ إلى الحد الأدنى:' : 'Optimization framework relies on metric loss minimization:'}</p>

                          <div className="page-formula-card">
                            <code>
                              L_total = λ₁ * L_triplet + λ₂ * L_cross_entropy + γ * ||W||²
                            </code>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'مخطط تنفيذ الخوارزمية البرمجية' : 'Pseudocode Implementation Flow'}</h4>
                          <pre className="page-code-snippet">
{`async function executePipeline(inputTensor) {
  const normalized = await preprocess(inputTensor);
  const embeddings = await modelEngine.extract(normalized);
  const verified = matchVectorIndex(embeddings, THRESHOLD);
  return { status: "VERIFIED", confidence: verified.score };
}`}
                          </pre>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>4</span>
                        </div>
                      </div>

                      {/* P4: Spread 2 Right Page (الفصل الثاني: المعمارية التقنية - يقرأ في اليمين أولاً) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الثاني: المعمارية التقنية' : 'Chapter 2: System Architecture'}</span>
                          <span className="doc-page-badge">03</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٢.١ هيكلية الطبقات البرمجية (Layered Architecture)' : '2.1 Layered System Architecture'}</h3>
                          
                          <div className="arch-blueprint-card">
                            <div className="arch-layer">
                              <span className="layer-tag">Layer 01</span>
                              <div className="layer-details">
                                <strong>{isRtl ? 'طبقة العرض والواجهات (Presentation Layer)' : 'Presentation UI / UX Layer'}</strong>
                                <p>{isRtl ? 'واجهات تفاعلية وأنظمة عرض ثلاثية الأبعاد (React 19 / GSAP / Three.js).' : 'Interactive dashboards and 3D render engine.'}</p>
                              </div>
                            </div>
                            <div className="arch-layer">
                              <span className="layer-tag">Layer 02</span>
                              <div className="layer-details">
                                <strong>{isRtl ? 'طبقة الخوادم والمنطق (Backend Core)' : 'Core Service Engine'}</strong>
                                <p>{isRtl ? 'خوادم معالجة الطلبات عالية الكفاءة مع خوارزميات التوزيع ومزامنة الحالات.' : 'High-concurrency event-driven logic.'}</p>
                              </div>
                            </div>
                            <div className="arch-layer">
                              <span className="layer-tag">Layer 03</span>
                              <div className="layer-details">
                                <strong>{isRtl ? 'محرك الحسابات والاستدلال (AI & Compute Engine)' : 'AI Model & Runtime'}</strong>
                                <p>{isRtl ? 'شبكات عصبية مخصصة واستدلال مسرع عبر وحدات GPU.' : 'Accelerated neural inferencing with vector indexing.'}</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'متطلبات التشغيل والمواصفات' : 'Hardware Requirements'}</h4>
                          <table className="page-spec-table">
                            <thead>
                              <tr>
                                <th>{isRtl ? 'العنصر' : 'Component'}</th>
                                <th>{isRtl ? 'المواصفة الموصى بها' : 'Recommended Spec'}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>CPU Runtime</td>
                                <td>8-Core 3.2GHz+ (AVX-512)</td>
                              </tr>
                              <tr>
                                <td>Inference GPU</td>
                                <td>NVIDIA RTX / CUDA 12.x</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>3</span>
                        </div>
                      </div>

                      {/* P5: Spread 3 Left Page (الفصل الخامس: الأمان وحوكمة البيانات) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الخامس: الأمان والحوكمة' : 'Chapter 5: Security & Compliance'}</span>
                          <span className="doc-page-badge">06</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٥.١ بروتوكولات حماية البيانات المشفرة' : '5.1 Cryptographic Standards'}</h3>
                          <p className="page-lead-para">{isRtl ? 'تخضع كافة مخرجات المنظومة لمعايير التشفير المتطورة لضمان الخصوصية والامتثال للمواصفات العالمية:' : 'All payloads are secured with enterprise cryptographic controls:'}</p>

                          <div className="security-badges-container">
                            <div className="sec-badge-card">
                              <ShieldCheck size={20} className="text-cyan-400" />
                              <div>
                                <strong>AES-256 GCM</strong>
                                <p>{isRtl ? 'تشفير شامل للبيانات المخزنة والمتبادلة عبر الشبكة.' : 'End-to-end payload encryption.'}</p>
                              </div>
                            </div>
                            <div className="sec-badge-card">
                              <ShieldCheck size={20} className="text-cyan-400" />
                              <div>
                                <strong>Zero-Trust RBAC</strong>
                                <p>{isRtl ? 'صلاحيات وصول دقيقة تعتمد على التوثيق متعدد العوامل.' : 'Strict multi-factor role-based access verification.'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>6</span>
                        </div>
                      </div>

                      {/* P6: Spread 3 Right Page (الفصل الرابع: مؤشرات الأداء والنتائج - يقرأ في اليمين أولاً) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الرابع: مؤشرات الأداء' : 'Chapter 4: Live Benchmarks'}</span>
                          <span className="doc-page-badge">05</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٤.١ نتائج الاختبارات المعملية والميدانية' : '4.1 Empirical Evaluation Matrix'}</h3>
                          
                          <div className="metrics-summary-grid">
                            <div className="metric-box">
                              <span className="metric-num">98.6%</span>
                              <span className="metric-label">{isRtl ? 'دقة الاستدلال' : 'Accuracy'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">&lt;16ms</span>
                              <span className="metric-label">{isRtl ? 'زمن الاستجابة' : 'Latency'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">60 FPS</span>
                              <span className="metric-label">{isRtl ? 'المعالجة اللحظية' : 'Frame Rate'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">0.992</span>
                              <span className="metric-label">{isRtl ? 'معامل الثقة' : 'F1 Confidence'}</span>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'مقارنة الأداء في ظروف التشغيل القصوى' : 'Stress Testing Comparative'}</h4>
                          <div className="performance-bars">
                            <div className="p-bar-item">
                              <div className="p-bar-lbl">
                                <span>{isRtl ? 'كفاءة استهلاك الذاكرة' : 'Memory Footprint'}</span>
                                <strong>94%</strong>
                              </div>
                              <div className="p-bar-track"><div className="p-bar-fill" style={{ width: '94%' }} /></div>
                            </div>
                            <div className="p-bar-item">
                              <div className="p-bar-lbl">
                                <span>{isRtl ? 'تحمل الأحمال المتزامنة' : 'Concurrency Scale'}</span>
                                <strong>91%</strong>
                              </div>
                              <div className="p-bar-track"><div className="p-bar-fill" style={{ width: '91%' }} /></div>
                            </div>
                          </div>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>5</span>
                        </div>
                      </div>

                      {/* P7: Spread 4 Left Page (الغلاف الخلفي المقوى والختم الرقمي) */}
                      <div className="st-page hard-cover back-cover" data-density="hard">
                        <div className="back-cover-art">
                          <div className="back-circuit-pattern" />
                          <div className="back-seal-box">
                            <div className="back-gold-emblem">
                              <ShieldCheck size={38} className="text-cyan-400" />
                              <span className="emblem-title">TECHNO ENJAZ</span>
                              <span className="emblem-sub">OFFICIAL ENGINEERING MONOGRAPH</span>
                            </div>

                            <p className="back-disclaimer">
                              {isRtl 
                                ? 'هذا المستند التقني صادر رسمياً وموثق ضمن سجلات منظومة تكنو إنجاز للحلول البرمجية والهندسية. جميع حقوق الملكية الفكرية والعلامات التجارية محفوظة ومحمية دولياً.'
                                : 'Official monograph issued under Techno Enjaz Engineering & Software Systems. All intellectual property strictly reserved.'}
                            </p>

                            <div className="back-qr-block">
                              <div className="back-mockup-qr" />
                              <div className="back-qr-info">
                                <strong>VERIFIED DIGITAL ASSET</strong>
                                <span>TE-HASH: 7390-6F49-94C2</span>
                                <span>Riyadh • Global R&amp;D</span>
                              </div>
                            </div>

                            <div className="back-close-prompt">
                              <span>{isRtl ? '© 2026 تكنو إنجاز — نحوّل الفكرة الهندسية إلى واقع' : '© 2026 Techno Enjaz — Engineering Ideas Into Reality'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* P8: Spread 4 Right Page (الفصل السادس: خارطة الطريق والمراجع - يقرأ في اليمين أولاً) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل السادس: التوصيات والمراجع' : 'Chapter 6: Roadmap & Citations'}</span>
                          <span className="doc-page-badge">07</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٦.١ مراحل التطوير والتوسع القادمة' : '6.1 Strategic Expansion Phases'}</h3>
                          <div className="roadmap-mini-steps">
                            <div className="roadmap-step">
                              <span className="step-num">01</span>
                              <div>
                                <strong>{isRtl ? 'التكامل السحابي الموزع' : 'Edge Distributed Mesh'}</strong>
                                <p>{isRtl ? 'نشر وحدات المعالجة الذكية الطرفية.' : 'Deploying decentralized edge nodes.'}</p>
                              </div>
                            </div>
                            <div className="roadmap-step">
                              <span className="step-num">02</span>
                              <div>
                                <strong>{isRtl ? 'المحاكاة ثلاثية الأبعاد المؤتمتة' : 'Autonomous 3D Simulation'}</strong>
                                <p>{isRtl ? 'توليد سيناريوهات فحص افتراضية.' : 'Synthetic scenario generation.'}</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'المراجع الأكاديمية والتوثيق' : 'Scholarly References'}</h4>
                          <ol className="citations-list">
                            <li>IEEE Transactions on Neural Networks & Intelligent Systems (2025).</li>
                            <li>ACM Digital Library - Modern Scalable Architectures (2026).</li>
                          </ol>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>7</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT NAV BUTTON: In Arabic RTL, this is NEXT (flips from Right to Left ◂) */}
            <button 
              type="button" 
              className="flipbook-curl-nav nav-right"
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              title={isRtl ? 'الصفحة التالية (قلب من اليمين إلى اليسار ◂)' : 'Next Page'}
            >
              <ChevronLeft size={28} />
              <span className="nav-btn-caption">{isRtl ? 'التالي ◂' : 'Next'}</span>
            </button>
          </div>
        )}

        {/* View Mode 2: Direct Google Drive Embedded PDF Document */}
        {viewMode === 'original' && (
          <div className="flipbook-direct-frame-stage">
            <iframe
              src={previewUrl}
              title={title}
              className="flipbook-drive-iframe"
              allow="autoplay"
            />
          </div>
        )}

        {/* Bottom Bar: Interactive Controls & Page Progress */}
        <footer className="flipbook-bottom-bar">
          <div className="flipbook-bottom-left">
            {viewMode === 'flipbook' && (
              <>
                {/* Table of Contents Dropdown Popover */}
                <div className="flipbook-toc-wrapper">
                  <button
                    type="button"
                    className="flipbook-toc-trigger"
                    onClick={() => setTocOpen(!tocOpen)}
                    title={isRtl ? 'فهرس فصول المستند' : 'Table of Contents'}
                  >
                    <List size={15} />
                    <span>{isRtl ? 'فهرس الفصول' : 'Contents'}</span>
                  </button>

                  {tocOpen && (
                    <div className="flipbook-toc-dropdown">
                      <div className="toc-dropdown-header">
                        <span>{isRtl ? 'انتقال سريع للفصل:' : 'Jump to Chapter:'}</span>
                        <button type="button" onClick={() => setTocOpen(false)}><X size={14} /></button>
                      </div>
                      <div className="toc-dropdown-items">
                        <button type="button" onClick={() => handleJumpToPage(1)} className={currentPage === 1 ? 'active' : ''}>
                          <span>01. {isRtl ? 'الغلاف الخارجي' : 'Front Cover'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(2)} className={currentPage === 2 || currentPage === 3 ? 'active' : ''}>
                          <span>02. {isRtl ? 'الفصل الأول: الملخص التنفيذي' : 'Chapter 1: Summary'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(4)} className={currentPage === 4 || currentPage === 5 ? 'active' : ''}>
                          <span>03. {isRtl ? 'الفصل الثاني: المعمارية التقنية' : 'Chapter 2: Architecture'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(4)} className={currentPage === 4 || currentPage === 5 ? 'active' : ''}>
                          <span>04. {isRtl ? 'الفصل الثالث: الخوارزميات والمنطق' : 'Chapter 3: Pipeline'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(6)} className={currentPage === 6 || currentPage === 7 ? 'active' : ''}>
                          <span>05. {isRtl ? 'الفصل الرابع: مؤشرات الأداء' : 'Chapter 4: Benchmarks'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(6)} className={currentPage === 6 || currentPage === 7 ? 'active' : ''}>
                          <span>06. {isRtl ? 'الفصل الخامس: الأمان والحوكمة' : 'Chapter 5: Security'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(8)} className={currentPage === 8 ? 'active' : ''}>
                          <span>07. {isRtl ? 'الفصل السادس: التوصيات والمراجع' : 'Chapter 6: Roadmap'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(8)} className={currentPage === 8 ? 'active' : ''}>
                          <span>08. {isRtl ? 'الغلاف الخلفي والختم الرسمي' : 'Back Cover & Seal'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flipbook-page-counter">
                  <span className="page-pill">
                    {isRtl ? `الصفحة ${currentPage} من ${totalPages}` : `Page ${currentPage} of ${totalPages}`}
                  </span>
                </div>
              </>
            )}

            {viewMode === 'original' && (
              <div className="flipbook-page-counter">
                <span className="page-pill">
                  {isRtl ? 'وضع معاينة Google Drive الأصلية' : 'Google Drive Preview Mode'}
                </span>
              </div>
            )}
          </div>

          <div className="flipbook-bottom-right">
            <span className="flipbook-help-hint">
              {viewMode === 'flipbook' 
                ? (isRtl ? '💡 اتجاه التصفح: اقلب من اليمين إلى اليسار بواسطة زر "التالي ◂" على اليمين أو بسحب زوايا الورق' : '💡 Tip: Drag page corners from right to left or click Next button on the right')
                : (isRtl ? 'معاينة مباشرة من سحابة تكنو إنجاز' : 'Direct secure cloud stream')}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DocumentReaderModal;
