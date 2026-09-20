import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Heart, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Check, 
  MessageSquare, 
  Send,
  User
} from 'lucide-react';
import type { BlogArticle, BlogComment } from '../../data/blogArticlesData';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { useSavedProjects } from '../../hooks/useSavedProjects';
import { getLoggedInUser, requireAuth } from '../../utils/authUtils';
import './ArticleDetailView.css';

interface ArticleDetailViewProps {
  article: BlogArticle;
  onBack: () => void;
  onSelectArticle: (article: BlogArticle) => void;
  likes: number;
  isLiked: boolean;
  onToggleLike: () => void;
  comments: BlogComment[];
  onAddComment: (comment: BlogComment) => void;
  allArticles: BlogArticle[];
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  article,
  onBack,
  onSelectArticle,
  likes,
  isLiked,
  onToggleLike,
  comments,
  onAddComment,
  allArticles
}) => {
  const { lang } = useThemeLanguage();
  const isEn = lang === 'en';
  const { isSaved, toggleSave } = useSavedProjects();

  const [commentText, setCommentText] = useState('');
  const [copied, setCopied] = useState(false);
  const loggedUser = getLoggedInUser();

  // Scroll to top on article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [article.id]);

  const isItemSaved = isSaved(article.id);
  const title = isEn ? article.titleEn : article.title;
  const category = isEn ? article.categoryEn : article.category;
  const publishDate = isEn ? article.publishDateEn : article.publishDate;
  const readTime = isEn ? article.readTimeEn : article.readTime;
  const authorName = isEn ? article.author.nameEn : article.author.name;
  const excerpt = isEn ? article.excerptEn : article.excerpt;
  const content = isEn ? article.contentEn : article.content;

  const handleShare = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requireAuth()) return;
    if (!commentText.trim()) return;

    const currentUser = getLoggedInUser();
    const commentAuthor = currentUser?.name || (isEn ? 'Techno User' : 'مستخدم تكنو');

    const newComment: BlogComment = {
      id: 'c-' + Date.now(),
      author: commentAuthor,
      date: isEn ? 'Just now' : 'الآن',
      text: commentText.trim()
    };

    onAddComment(newComment);
    setCommentText('');
  };

  // Find related articles (same category or others, excluding current)
  const relatedArticles = allArticles
    .filter(a => a.id !== article.id)
    .slice(0, 3);

  return (
    <article className="article-fullscreen-view" dir={isEn ? 'ltr' : 'rtl'}>
      {/* Top Breadcrumb / Back Navigation */}
      <div className="article-view-top-bar">
        <button 
          type="button" 
          className="article-back-nav-btn"
          onClick={onBack}
        >
          {isEn ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
          <span>{isEn ? "Back to All Articles" : "العودة إلى كافة المقالات"}</span>
        </button>

        <div className="article-top-actions">
          <button
            type="button"
            className="article-top-share-btn"
            onClick={handleShare}
            title={isEn ? "Share link" : "مشاركة الرابط"}
          >
            {copied ? <Check size={16} color="#10b981" /> : <Share2 size={16} />}
            <span>{copied ? (isEn ? "Copied!" : "تم النسخ!") : (isEn ? "Share" : "مشاركة")}</span>
          </button>
        </div>
      </div>

      <div className="article-fullscreen-layout">
        {/* Main Reading Column */}
        <div className="article-main-container">
          {/* Category Pill Tag */}
          <div className="article-lead-category-wrap">
            <span 
              className="article-lead-category-pill"
              style={{ 
                backgroundColor: `${article.categoryColor}18`, 
                color: article.categoryColor,
                borderColor: `${article.categoryColor}35`
              }}
            >
              {category}
            </span>
            <span className="article-lead-readtime">
              <Clock size={13} />
              <span>{readTime}</span>
            </span>
          </div>

          {/* Massive Headline Title */}
          <h1 className="article-fullscreen-title">
            {title}
          </h1>

          {/* Lead Excerpt Paragraph */}
          <p className="article-fullscreen-excerpt">
            {excerpt}
          </p>

          {/* Author Capsule Row (Single unified share button remains in top bar) */}
          <div className="article-author-capsule-row">
            <div className="article-author-capsule-pill">
              <img 
                src={article.author.avatar} 
                alt={authorName} 
                className="author-capsule-avatar" 
              />
              <div className="author-capsule-text">
                <span className="author-capsule-name">{authorName}</span>
                <span className="author-capsule-divider">|</span>
                <span className="author-capsule-date">{publishDate}</span>
              </div>
            </div>
          </div>

          {/* High-Definition Featured Banner */}
          <div className="article-fullscreen-banner-wrap">
            <img 
              src={article.image} 
              alt={title} 
              className="article-fullscreen-banner-img" 
            />
            <div className="article-banner-ambient-glow" style={{ backgroundColor: article.categoryColor }} />
          </div>

          {/* Article Body Content */}
          <div className="article-fullscreen-content">
            {content.map((paragraph, index) => (
              <p key={index} className="article-content-paragraph">
                {paragraph}
              </p>
            ))}

            {/* Tags Row */}
            <div className="article-tags-wrap">
              {article.tags.map((tag, idx) => (
                <span key={idx} className="article-tag-chip">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Engagement Interactive Bar (Likes & Save only, unified share in top bar) */}
            <div className="article-engagement-bar">
              <div className="engagement-actions-group">
                <button
                  type="button"
                  className={`engagement-btn like-btn ${isLiked ? 'liked' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!requireAuth()) return;
                    onToggleLike();
                  }}
                  title={isLiked ? (isEn ? "Unlike" : "إلغاء الإعجاب") : (isEn ? "Like" : "إعجاب")}
                >
                  <Heart size={18} fill={isLiked ? "#ef4444" : "none"} color={isLiked ? "#ef4444" : "currentColor"} />
                  <span>{likes}</span>
                </button>

                <button
                  type="button"
                  className={`engagement-btn save-btn ${isItemSaved ? 'saved' : ''}`}
                  onClick={() => {
                    toggleSave({
                      id: article.id,
                      title: article.title,
                      titleEn: article.titleEn,
                      category: 'مقالات تقنية',
                      categoryLabel: category,
                      description: article.excerpt,
                      descriptionEn: article.excerptEn,
                      type: 'article',
                      tags: article.tags
                    });
                  }}
                  title={isItemSaved ? (isEn ? "Saved" : "محفوظ") : (isEn ? "Save" : "حفظ المقال")}
                >
                  {isItemSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                  <span>{isItemSaved ? (isEn ? "Saved" : "محفوظ") : (isEn ? "Save" : "حفظ")}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
          <section className="article-comments-section" id="comments">
            <div className="comments-section-header">
              <div className="comments-header-title">
                <MessageSquare size={20} style={{ color: 'var(--accent-cyan, #00d2ff)' }} />
                <h3>{isEn ? `Discussion & Insights (${comments.length})` : `نقاشات وتعليقات المهندسين (${comments.length})`}</h3>
              </div>
            </div>

            {/* Comment Form */}
            <form className="article-comment-form" onSubmit={handleCommentSubmit}>
              {loggedUser ? (
                <div 
                  className="comment-user-identity" 
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '12px',
                    padding: '5px 14px',
                    borderRadius: '20px',
                    background: 'rgba(14, 165, 233, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    color: 'var(--accent-cyan, #38bdf8)',
                    fontSize: '0.85rem',
                    fontWeight: 600
                  }}
                >
                  {loggedUser.avatar ? (
                    <img 
                      src={loggedUser.avatar} 
                      alt="" 
                      style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <User size={14} />
                  )}
                  <span>{loggedUser.name}</span>
                </div>
              ) : (
                <div 
                  className="comment-guest-prompt"
                  onClick={() => requireAuth()}
                  style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    marginBottom: '12px',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px dashed rgba(255, 255, 255, 0.2)',
                    color: '#94a3b8',
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <User size={14} />
                  <span>{isEn ? "Sign in to join the discussion as yourself" : "سجل الدخول للمشاركة باسم حسابك"}</span>
                </div>
              )}
              <div className="comment-textarea-wrap">
                <textarea
                  placeholder={loggedUser 
                    ? (isEn ? "Share your engineering feedback, inquiry, or insights..." : "شاركنا رأيك أو استفسارك الهندسي حول هذا المقال...")
                    : (isEn ? "Please sign in to write a comment..." : "يرجى تسجيل الدخول لكتابة تعليق...")}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onFocus={() => {
                    if (!loggedUser) requireAuth();
                  }}
                  className="comment-text-field"
                  rows={3}
                  required
                />
                <button type="submit" className="comment-submit-btn">
                  <Send size={16} />
                  <span>{isEn ? "Post" : "إرسال"}</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="article-comments-list">
              {comments.length === 0 ? (
                <div className="no-comments-msg">
                  <p>{isEn ? "Be the first to comment on this article!" : "كن أول من يشارك برأيه حول هذا المقال الهندسي!"}</p>
                </div>
              ) : (
                comments.map((c) => (
                  <div key={c.id} className="article-comment-item">
                    <div className="comment-avatar-placeholder">
                      {c.author.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-bubble">
                      <div className="comment-bubble-header">
                        <span className="comment-author-name">{c.author}</span>
                        <span className="comment-date-meta">{c.date}</span>
                      </div>
                      <p className="comment-body-text">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

        {/* ==========================================================================
            RELATED ARTICLES (المقالات ذات صلة - On the Left Side Vertically)
            ========================================================================== */}
        <aside className="article-related-sidebar">
          <div className="related-sidebar-header">
            <h3 className="related-sidebar-title">
              {isEn ? "Related Articles" : "مقالات ذات صلة"}
            </h3>
          </div>

          <div className="related-sidebar-list">
            {relatedArticles.map((rel) => {
              const relTitle = isEn ? rel.titleEn : rel.title;
              const relCategory = isEn ? rel.categoryEn : rel.category;
              const relReadTime = isEn ? rel.readTimeEn : rel.readTime;
              const relAuthor = isEn ? rel.author.nameEn : rel.author.name;
              const relDate = isEn ? rel.publishDateEn : rel.publishDate;

              return (
                <div 
                  key={rel.id} 
                  className="related-sidebar-card"
                  onClick={() => onSelectArticle(rel)}
                >
                  {/* Card Cover Image */}
                  <div className="related-sidebar-media">
                    <img src={rel.image} alt={relTitle} className="related-sidebar-img" loading="lazy" />
                    <div className="related-sidebar-overlay" />
                  </div>

                  {/* Card Body */}
                  <div className="related-sidebar-body">
                    {/* Category & Read Time Row */}
                    <div className="related-sidebar-meta">
                      <span 
                        className="related-category-pill"
                        style={{ 
                          backgroundColor: `${rel.categoryColor}18`, 
                          color: rel.categoryColor,
                          borderColor: `${rel.categoryColor}35`
                        }}
                      >
                        {relCategory}
                      </span>
                      <span className="related-readtime">
                        <Clock size={11} />
                        <span>{relReadTime}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="related-sidebar-item-title">{relTitle}</h4>

                    {/* Author Capsule */}
                    <div className="related-sidebar-author">
                      <img 
                        src={rel.author.avatar} 
                        alt={relAuthor} 
                        className="related-sidebar-avatar" 
                      />
                      <span className="related-sidebar-author-name">{relAuthor}</span>
                      <span className="related-sidebar-divider">|</span>
                      <span className="related-sidebar-date">{relDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </article>
  );
};

export default ArticleDetailView;
