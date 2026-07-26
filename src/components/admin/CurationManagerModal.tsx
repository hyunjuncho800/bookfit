import React, { useState, useEffect } from 'react';
import { Search, X, PlusCircle, CheckCircle2, Sparkles, BookOpen, Loader2, Database, ShieldCheck } from 'lucide-react';
import type { Book } from '../../types';
import { searchAladinBooks } from '../../services/aladinApi';
import { saveCuratedBookToDb } from '../../services/supabaseService';
import { BookCoverImage } from '../common/BookCoverImage';

interface CurationManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookAdded?: () => void;
}

export const CurationManagerModal: React.FC<CurationManagerModalProps> = ({
  isOpen,
  onClose,
  onBookAdded,
}) => {
  const [query, setQuery] = useState<string>('만복이네');
  const [searchTrack, setSearchTrack] = useState<Record<string, 'comfort' | 'challenge' | 'supplement'>>({});
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [savingBookId, setSavingBookId] = useState<string | null>(null);

  // Search trigger
  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchAladinBooks(q);
      setSearchResults(results);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch('만복이네');
    }
  }, [isOpen]);

  // Handle ESC key & scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleTrackChange = (bookId: string, track: 'comfort' | 'challenge' | 'supplement') => {
    setSearchTrack((prev) => ({ ...prev, [bookId]: track }));
  };

  const handleAddBookToDb = async (book: Book) => {
    setSavingBookId(book.id);
    const selectedTrack = searchTrack[book.id] || book.trackType || 'comfort';

    const success = await saveCuratedBookToDb(book, selectedTrack);

    setSavingBookId(null);
    if (success) {
      setSavedBookIds((prev) => [...prev, book.id]);
      if (onBookAdded) onBookAdded();
    } else {
      alert('도서 DB 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-charcoal/75 backdrop-blur-md animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark bg-forest text-white">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-2xl bg-oak text-forest flex items-center justify-center font-bold shadow-sm">
              <Database className="w-5 h-5 stroke-[2.3]" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-serif flex items-center gap-2">
                <span>알라딘 Open API 도서 자동 검색 & 서가 DB 등록</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-oak/30 text-oak border border-oak/40">
                  Admin Tool
                </span>
              </h2>
              <p className="text-xs text-cream-card/80">
                키워드/제목/ISBN 검색 후 3-Step 큐레이션 서가 DB에 1-Click 등록합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
            title="닫기 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream-card p-4 rounded-2xl border border-oak/30 shadow-sm">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="도서 제목, 키워드, 저자 또는 ISBN을 입력하세요..."
                className="w-full pl-11 pr-4 py-3 bg-cream-light border border-oak/30 rounded-xl text-xs sm:text-sm font-medium text-charcoal focus:outline-none focus:border-forest shadow-inner"
              />
              <Search className="w-5 h-5 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-3 bg-forest hover:bg-forest-dark text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-oak" />
                  <span>알라딘 API 검색 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-oak" />
                  <span>알라딘 도서 검색</span>
                </>
              )}
            </button>
          </div>

          {/* Search Results Summary */}
          <div className="flex items-center justify-between text-xs font-bold border-b border-cream-dark pb-2">
            <span className="text-charcoal flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-forest" />
              알라딘 API 검색 결과 ({searchResults.length}건)
            </span>
            <span className="text-charcoal-muted font-normal text-[11px]">
              * 1-Click [서가 DB 저장] 클릭 시 Supabase `books` 테이블에 실시간 등록됩니다.
            </span>
          </div>

          {/* Search Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((book) => {
              const isSaved = savedBookIds.includes(book.id);
              const isSaving = savingBookId === book.id;
              const currentTrack = searchTrack[book.id] || book.trackType || 'comfort';

              return (
                <div
                  key={book.id}
                  className="bg-cream-light border border-oak/30 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="flex gap-4">
                    <BookCoverImage
                      src={book.coverImage}
                      alt={book.title}
                      className="w-24 h-32 object-cover rounded-xl border border-oak/20 shadow-sm shrink-0"
                    />

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2 py-0.5 rounded border border-oak/30">
                          {book.lexileLevel}
                        </span>
                        <span className="text-[10px] font-semibold text-charcoal-muted bg-cream-dark px-2 py-0.5 rounded">
                          {book.gradeTag}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold font-serif text-charcoal line-clamp-1">
                        {book.title}
                      </h4>
                      <p className="text-[11px] text-charcoal-muted line-clamp-1">
                        {book.author} | {book.publisher}
                      </p>
                      <p className="text-[11px] text-charcoal leading-relaxed line-clamp-2 italic bg-cream-card/60 p-2 rounded-lg border border-oak/15">
                        "{book.summary}"
                      </p>
                    </div>
                  </div>

                  {/* Track Select Dropdown & One-Click DB Save Button */}
                  <div className="pt-3 border-t border-cream-dark flex flex-col sm:flex-row items-center gap-2">
                    <div className="w-full sm:w-1/2">
                      <label className="text-[10px] font-bold text-charcoal-muted block mb-0.5">
                        3-Step 큐레이션 트랙 설정
                      </label>
                      <select
                        value={currentTrack}
                        onChange={(e) =>
                          handleTrackChange(
                            book.id,
                            e.target.value as 'comfort' | 'challenge' | 'supplement'
                          )
                        }
                        className="w-full p-2 bg-cream border border-oak/30 rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-forest"
                      >
                        <option value="comfort">Step 1. 적정 도서 (70%)</option>
                        <option value="challenge">Step 2. 도전 도서 (10%)</option>
                        <option value="supplement">Step 3. 약점 보완 (20%)</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleAddBookToDb(book)}
                      disabled={isSaved || isSaving}
                      className={`w-full sm:w-1/2 py-2.5 px-3 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 self-end ${
                        isSaved
                          ? 'bg-forest/15 text-forest border border-forest/30 cursor-default'
                          : 'bg-forest hover:bg-forest-dark text-white'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-oak" />
                          <span>DB 저장 중...</span>
                        </>
                      ) : isSaved ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-forest" />
                          <span>서가 DB 저장 완료</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle className="w-4 h-4 text-oak" />
                          <span>서가 DB 등록하기</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cream-dark bg-cream-card/50 flex items-center justify-between text-xs text-charcoal-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Supabase `books` 큐레이션 서가 테이블 자동 동기화</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-cream border border-oak/30 rounded-lg font-bold text-charcoal hover:bg-cream-dark"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
