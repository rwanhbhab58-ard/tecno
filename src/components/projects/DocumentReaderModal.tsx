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
  CheckCircle2
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
      // Exponential decay envelope
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

  // Handle ESC key to close modal or exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      } else if (e.key === 'ArrowRight') {
        pageFlipRef.current?.flipNext();
      } else if (e.key === 'ArrowLeft') {
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
      // Create StPageFlip instance
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

  // Run initialization when flipbook view becomes active and DOM elements are rendered
  useEffect(() => {
    if (!isOpen || viewMode !== 'flipbook') return;

    // Wait a frame for DOM to populate pages inside container
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

  const handleNextPage = () => {
    pageFlipRef.current?.flipNext();
  };

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

  const isRtl = lang === 'ar';

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
              <span>{isRtl ? 'قارئ المستندات ثلاثي الأبعاد (StPageFlip)' : '3D Document Flipbook (StPageFlip)'}</span>
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
            {/* Left Nav Arrow */}
            <button 
              type="button" 
              className="flipbook-curl-nav prev"
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              title={isRtl ? 'الصفحة السابقة' : 'Previous Page'}
            >
              {isRtl ? <ChevronRight size={28} /> : <ChevronLeft size={28} />}
            </button>

            {/* Realistic Book Stage */}
            <div className="flipbook-3d-stage">
              {/* Outer Leather Book Cover Edge Frame */}
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
                    // High-Fidelity Default Project 8-Page Technical Document
                    <>
                      {/* PAGE 1: Hard Front Cover */}
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
                              <div className="cover-hint-peel">
                                <span>{isRtl ? 'اضغط أو اسحب زاوية الغلاف للفتح ↗' : 'Drag corner or click to open ↗'}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PAGE 2: Executive Summary & Abstract (Soft) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الأول: الملخص التنفيذي' : 'Chapter 1: Executive Summary'}</span>
                          <span className="doc-page-badge">02</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '١.١ الإطار العام والنطاق العملي' : '1.1 Project Overview & Scope'}</h3>
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
                            <li>
                              <CheckCircle2 size={14} className="bullet-icon" />
                              <span>{isRtl ? 'توفير واجهات تفاعلية تدعم التكامل البرمجي عبر واجهات برمجة التطبيقات (RESTful & WebSockets).' : 'Deliver high-throughput RESTful and WebSocket API endpoints.'}</span>
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
                          <span>2</span>
                        </div>
                      </div>

                      {/* PAGE 3: System Architecture & Technical Specifications (Soft) */}
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
                                <p>{isRtl ? 'تطبيقات الويب التفاعلية، لوحات التحكم الحركية، وأنظمة العرض ثلاثي الأبعاد (React 19 / GSAP / Three.js).' : 'Interactive dashboards, 3D render engine and telemetry feeds.'}</p>
                              </div>
                            </div>
                            <div className="arch-layer">
                              <span className="layer-tag">Layer 02</span>
                              <div className="layer-details">
                                <strong>{isRtl ? 'طبقة الخوادم والمنطق البرمجي (Backend Core)' : 'Core Service Engine & Microservices'}</strong>
                                <p>{isRtl ? 'خوادم معالجة الطلبات عالية الكفاءة مع خوارزميات التوزيع ومزامنة الحالات اللحظية.' : 'High-concurrency event-driven logic with state synchronization.'}</p>
                              </div>
                            </div>
                            <div className="arch-layer">
                              <span className="layer-tag">Layer 03</span>
                              <div className="layer-details">
                                <strong>{isRtl ? 'محرك الذكاء الاصطناعي والحسابات (AI & Compute Engine)' : 'AI Model & Computational Runtime'}</strong>
                                <p>{isRtl ? 'شبكات عصبية مخصصة، خطوط استدلال مسرعة عبر وحدات GPU مع معالجة المتجهات.' : 'TensorRT accelerated neural inferencing with vector indexing.'}</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'متطلبات التشغيل والمواصفات' : 'Hardware & Runtime Requirements'}</h4>
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
                                <td>8-Core 3.2GHz+ (AVX-512 support)</td>
                              </tr>
                              <tr>
                                <td>Inference GPU</td>
                                <td>NVIDIA RTX / CUDA 12.x / TensorRT</td>
                              </tr>
                              <tr>
                                <td>Memory (RAM)</td>
                                <td>16GB DDR5 Dual Channel</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>3</span>
                        </div>
                      </div>

                      {/* PAGE 4: Algorithms & Mathematical Modeling (Soft) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الثالث: الخوارزميات والمنهجية' : 'Chapter 3: Algorithmic Pipeline'}</span>
                          <span className="doc-page-badge">04</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٣.١ خط التدفق الرياضي واستخراج السمات' : '3.1 Mathematical Formulation'}</h3>
                          <p>{isRtl ? 'تعتمد المنظومة على دالة تقارب متري مع تطبيق التحسين التدرجي لتقليل نسبة الخطأ إلى الحد الأدنى:' : 'Optimization framework relies on metric loss minimization with cosine distance projection:'}</p>

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

                      {/* PAGE 5: Empirical Benchmarks & Results (Soft) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الرابع: مؤشرات الأداء والنتائج' : 'Chapter 4: Live Benchmarks'}</span>
                          <span className="doc-page-badge">05</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٤.١ نتائج الاختبارات المعملية والميدانية' : '4.1 Empirical Evaluation Matrix'}</h3>
                          
                          <div className="metrics-summary-grid">
                            <div className="metric-box">
                              <span className="metric-num">98.6%</span>
                              <span className="metric-label">{isRtl ? 'دقة الاستدلال (Accuracy)' : 'Model Accuracy'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">&lt;16ms</span>
                              <span className="metric-label">{isRtl ? 'زمن الاستجابة (Latency)' : 'Inference Latency'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">60 FPS</span>
                              <span className="metric-label">{isRtl ? 'معدل المعالجة اللحظية' : 'Realtime Frame Rate'}</span>
                            </div>
                            <div className="metric-box">
                              <span className="metric-num">0.992</span>
                              <span className="metric-label">{isRtl ? 'معامل الثقة (F1-Score)' : 'F1 Confidence'}</span>
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

                      {/* PAGE 6: Security, Compliance & Governance (Soft) */}
                      <div className="st-page inner-page" data-density="soft">
                        <div className="page-header-strip">
                          <span className="doc-section-name">{isRtl ? 'الفصل الخامس: الأمان والحوكمة' : 'Chapter 5: Security & Compliance'}</span>
                          <span className="doc-page-badge">06</span>
                        </div>
                        <div className="page-text-content">
                          <h3 className="page-section-title">{isRtl ? '٥.١ بروتوكولات حماية البيانات المشفرة' : '5.1 Cryptographic Standards'}</h3>
                          <p>{isRtl ? 'تخضع كافة مخرجات المنظومة لمعايير التشفير المتطورة لضمان الخصوصية والامتثال للمواصفات العالمية:' : 'All payloads are secured with enterprise cryptographic controls and audited pipelines:'}</p>

                          <div className="security-badges-container">
                            <div className="sec-badge-card">
                              <ShieldCheck size={20} className="text-cyan-400" />
                              <div>
                                <strong>AES-256 GCM</strong>
                                <p>{isRtl ? 'تشفير شامل للبيانات المخزنة والمتبادلة عبر الشبكة.' : 'End-to-end at-rest and in-transit payload encryption.'}</p>
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

                      {/* PAGE 7: Roadmap, Future Scope & Citations (Soft) */}
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
                                <p>{isRtl ? 'نشر وحدات المعالجة الذكية الطرفية.' : 'Deploying decentralized edge computing nodes.'}</p>
                              </div>
                            </div>
                            <div className="roadmap-step">
                              <span className="step-num">02</span>
                              <div>
                                <strong>{isRtl ? 'المحاكاة ثلاثية الأبعاد المؤتمتة' : 'Autonomous 3D Simulation'}</strong>
                                <p>{isRtl ? 'توليد سيناريوهات فحص افتراضية تعزز دقة النظم.' : 'Synthetic scenario generation for robust model tuning.'}</p>
                              </div>
                            </div>
                          </div>

                          <h4 className="page-sub-title">{isRtl ? 'المراجع الأكاديمية والتوثيق' : 'Scholarly References'}</h4>
                          <ol className="citations-list">
                            <li>IEEE Transactions on Neural Networks & Intelligent Systems (2025).</li>
                            <li>ACM Digital Library - Modern Engineering Architectures & Scalable Pipelines (2026).</li>
                          </ol>
                        </div>
                        <div className="page-footer-strip">
                          <span>{isRtl ? 'منظومة تكنو إنجاز للحلول الهندسية' : 'Techno Enjaz Engineering Platform'}</span>
                          <span>7</span>
                        </div>
                      </div>

                      {/* PAGE 8: Hard Back Cover */}
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
                                : 'Official monograph issued under Techno Enjaz Engineering & Software Systems. All intellectual property and trademarks strictly reserved.'}
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
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Nav Arrow */}
            <button 
              type="button" 
              className="flipbook-curl-nav next"
              onClick={handleNextPage}
              title={isRtl ? 'الصفحة التالية' : 'Next Page'}
            >
              {isRtl ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
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
                        <button type="button" onClick={() => handleJumpToPage(2)} className={currentPage === 2 ? 'active' : ''}>
                          <span>02. {isRtl ? 'الملخص التنفيذي' : 'Executive Summary'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(3)} className={currentPage === 3 ? 'active' : ''}>
                          <span>03. {isRtl ? 'المعمارية التقنية' : 'System Architecture'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(4)} className={currentPage === 4 ? 'active' : ''}>
                          <span>04. {isRtl ? 'الخوارزميات والمنطق' : 'Algorithmic Pipeline'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(5)} className={currentPage === 5 ? 'active' : ''}>
                          <span>05. {isRtl ? 'مؤشرات الأداء والنتائج' : 'Live Benchmarks'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(6)} className={currentPage === 6 ? 'active' : ''}>
                          <span>06. {isRtl ? 'الأمان والحوكمة' : 'Security & Compliance'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(7)} className={currentPage === 7 ? 'active' : ''}>
                          <span>07. {isRtl ? 'خارطة الطريق والمراجع' : 'Roadmap & Citations'}</span>
                        </button>
                        <button type="button" onClick={() => handleJumpToPage(8)} className={currentPage === 8 ? 'active' : ''}>
                          <span>08. {isRtl ? 'الغلاف الخلفي والختم' : 'Back Cover & Seal'}</span>
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
                ? (isRtl ? '💡 نصيحة: يمكنك سحب أطراف الصفحات بالماوس للمحاكاة الواقعية ثلاثية الأبعاد' : '💡 Tip: Drag page corners with mouse to fold and curl in 3D')
                : (isRtl ? 'معاينة مباشرة من سحابة تكنو إنجاز' : 'Direct secure cloud stream')}
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DocumentReaderModal;
