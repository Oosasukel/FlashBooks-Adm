import { Book } from '../types/book';
import { ContentType, KeyPointType } from '../types/book';
import { categories } from '../constants/categories';
import { useState, useEffect } from 'react';
import '../styles/BookPreview.css';

interface BookPreviewProps {
  book: Book;
}

export function BookPreview({ book }: BookPreviewProps) {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const bookCategories = categories.filter((category) =>
    book.categoryIds.includes(category.id)
  );

  const nextChapter = () => {
    if (currentChapterIndex < book.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const goToChapter = (index: number) => {
    setCurrentChapterIndex(index);
  };

  const currentChapter = book.chapters[currentChapterIndex];

  // Reset scroll when chapter changes
  useEffect(() => {
    const scrollElement = document.querySelector('.chapter-scroll-content');
    if (scrollElement) {
      scrollElement.scrollTop = 0;
    }
  }, [currentChapterIndex]);

  return (
    <div className="book-preview">
      <div className="book-preview-header">
        <img
          src={book.imageUrl || 'https://placehold.co/160x230'}
          alt={book.title}
          className="book-preview-image"
        />
        <div className="book-preview-info">
          <h1>{book.title}</h1>
          <p className="author">{book.author}</p>
          <div className="categories">
            {bookCategories.map((category) => (
              <span key={category.id} className="category-tag">
                <span className="category-emoji">{category.emoji}</span>
                {category.name}
              </span>
            ))}
          </div>
          <p className="description">{book.description}</p>
        </div>
      </div>

      <div className="book-preview-chapters-mobile">
        {/* Indicador de progresso */}
        <div className="chapter-progress">
          <div className="chapter-indicator">
            <span className="chapter-number">{currentChapterIndex + 1}</span>
            <span className="chapter-total">de {book.chapters.length}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  ((currentChapterIndex + 1) / book.chapters.length) * 100
                }%`,
              }}></div>
          </div>
        </div>

        {/* Container do capítulo com scroll */}
        <div className="chapter-container">
          <div className="chapter-content-mobile">
            <div className="chapter-scroll-content">
              <h3 className="chapter-title">{currentChapter.title}</h3>
              {currentChapter.content.map((content, contentIndex) => {
                switch (content.type) {
                  case ContentType.PARAGRAPH:
                    return (
                      <p key={contentIndex} className="paragraph">
                        {content.text}
                      </p>
                    );
                  case ContentType.KEY_POINT:
                    return (
                      <div key={contentIndex} className="key-point">
                        <p
                          className={`key-point-text ${
                            content.keyPointType === KeyPointType.QUOTE
                              ? 'quote'
                              : content.keyPointType === KeyPointType.INSIGHT
                              ? 'insight'
                              : 'moment'
                          }`}>
                          {content.keyPointType === KeyPointType.QUOTE
                            ? `"${content.text}"`
                            : content.text}
                        </p>
                        {content.keyPointType === KeyPointType.QUOTE &&
                          content.reference && (
                            <p className="key-point-reference">
                              — {content.reference}
                            </p>
                          )}
                      </div>
                    );
                  default:
                    return null;
                }
              })}
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="chapter-navigation">
          <button
            className="nav-button prev-button"
            onClick={prevChapter}
            disabled={currentChapterIndex === 0}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="chapter-dots">
            {book.chapters.map((_, index) => (
              <button
                key={index}
                className={`chapter-dot ${
                  index === currentChapterIndex ? 'active' : ''
                }`}
                onClick={() => goToChapter(index)}
              />
            ))}
          </div>

          <button
            className="nav-button next-button"
            onClick={nextChapter}
            disabled={currentChapterIndex === book.chapters.length - 1}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
