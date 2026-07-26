import React, { useState, useEffect } from 'react';
import { searchAladinBooks, ALADIN_CHILDREN_MOCK_BOOKS } from '../../services/aladinApi';
import type { Book } from '../../types';
import { Search, Database, Star, Heart, BookOpen, ChevronRight, SlidersHorizontal, Sparkles } from 'lucide-react';
import { BookCoverImage } from '../common/BookCoverImage';

interface BookSearchSectionProps {
  onSelectBook: (book: Book) => void;
  onOpenDiagnosis: () => void;
}

export const BookSearchSection: React.FC<BookSearchSectionProps> = ({ onSelectBook, onOpenDiagnosis }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [selectedLexileLevel, setSelectedLexileLevel] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>(ALADIN_CHILDREN_MOCK_BOOKS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [savedBookIds, setSavedBookIds] = useState<Set<string>>(new Set());

  // Category Tag Presets
  const categoryTags = [
    '전체',
    '초등저학년',
    '그림책',
    '한자어확장',
    '추론강화',
    '과학/비문학',
  ];

  // Lexile Level Tabs
  const lexileTabs = [
    { id: 'all', label: '전체 레벨' },
    { id: 'L1', label: 'L1 (기초)' },
    { id: 'L2', label: 'L2 (발달)' },
    { id: 'L3', label: 'L3 (중급)' },
    { id: 'L4', label: 'L4 (어휘)' },
    { id: 'L5', label: 'L5 (추론)' },
    { id: 'L6', label: 'L6 (심화)' },
  ];

  // Trigger search on query change
  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const results = await searchAladinBooks(searchQuery);
      setBooks(results);
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Filter books by Tag & Lexile level
  const filteredBooks = books.filter((book) => {
    const matchTag =
      selectedTag === '전체' ||
      book.gradeTag.includes(selectedTag) ||
      book.recommendReason.includes(selectedTag) ||
      book.lexileLevel.includes(selectedTag) ||
      book.summary.includes(selectedTag);

    const matchLexile =
      selectedLexileLevel === 'all' || book.lexileLevel.includes(selectedLexileLevel);

    return matchTag && matchLexile;
  });

  const toggleSaveBook = (bookId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedBookIds((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  return (
    <section id="search-section" className="py-16 bg-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-7xl mx-auto">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest/10 text-forest text-xs font-bold border border-forest/20">
              <Database className="w-4 h-4 text-oak" />
              알라딘 Open API 20만+ 아동 데이터 연동
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-tight">
              도서관 통합 큐레이션 검색대
            </h2>
            <p className="text-sm text-charcoal-light leading-relaxed">
              알라딘 최신 아동 도서 데이터를 실시간으로 가져와 북핏 어휘 레벨(L1~L6)로 자동 변환·큐레이션합니다.
            </p>
          </div>

          <button
            onClick={onOpenDiagnosis}
            className="self-start md:self-auto px-5 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Sparkles className="w-4 h-4 text-oak" />
            <span>내 아이 맞춤 레벨로 도서 큐레이션받기</span>
          </button>
        </div>

        {/* Library Desk Search Console Box */}
        <div className="bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
          
          {/* Main Search Bar Input */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-forest" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="책 제목, 저자, 어휘 키워드(예: 한자어, 미스터리, 속담)를 검색해보세요..."
              className="w-full pl-12 pr-28 py-4 bg-cream border-2 border-oak/30 focus:border-forest rounded-2xl text-sm font-medium text-charcoal placeholder-charcoal-muted focus:outline-none focus:ring-4 focus:ring-forest/10 shadow-inner transition-all"
            />
            <button
              onClick={() => searchAladinBooks(searchQuery)}
              className="absolute right-2 top-2 bottom-2 px-5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1"
            >
              <span>검색</span>
              <ChevronRight className="w-4 h-4 text-oak" />
            </button>
          </div>

          {/* Filters Bar: Tag Presets & Lexile Level Tabs */}
          <div className="space-y-4 pt-2 border-t border-cream-dark">
            
            {/* Category Filter Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-charcoal-muted mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-oak-dark" />
                테마 키워드:
              </span>
              {categoryTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedTag === tag
                      ? 'bg-forest text-white shadow-sm'
                      : 'bg-cream text-charcoal hover:bg-cream-dark border border-oak/20'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Lexile Level Tabs (L1 ~ L6) */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs border-t border-cream-dark/60 pt-3">
              <span className="font-bold text-charcoal-muted mr-2">북핏 어휘 레벨:</span>
              {lexileTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedLexileLevel(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedLexileLevel === tab.id
                      ? 'bg-oak text-forest-dark shadow-sm'
                      : 'bg-cream text-charcoal hover:bg-cream-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>

        </div>

        {/* Book Grid Results Header */}
        <div className="flex items-center justify-between border-b border-cream-dark pb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold font-serif text-charcoal">
              큐레이션 도서 서가 목록
            </span>
            <span className="text-xs font-bold text-forest bg-forest/10 px-2.5 py-0.5 rounded-full">
              총 {filteredBooks.length}권 검색됨
            </span>
          </div>

          {savedBookIds.size > 0 && (
            <div className="text-xs font-bold text-oak-dark bg-oak/15 px-3 py-1 rounded-full flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-oak text-oak-dark" />
              <span>내 서재 담은 책 {savedBookIds.size}권</span>
            </div>
          )}
        </div>

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="py-12 text-center text-xs text-charcoal-muted space-y-2">
            <Sparkles className="w-6 h-6 text-oak mx-auto animate-spin" />
            <p>알라딘 API 데이터를 분석하고 북핏 레벨을 매칭하는 중입니다...</p>
          </div>
        )}

        {/* Curated Book Card Grid (3-4 Columns Responsive) */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => {
              const isSaved = savedBookIds.has(book.id);
              return (
                <div
                  key={book.id}
                  onClick={() => onSelectBook(book)}
                  className="group relative bg-cream-light border border-oak/30 hover:border-forest/60 rounded-2xl p-4 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    
                    {/* Top Cover Image & Heart Save Button */}
                    <div className="relative overflow-hidden rounded-xl bg-cream-dark">
                      <BookCoverImage
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 border border-oak/20"
                      />
                      <button
                        onClick={(e) => toggleSaveBook(book.id, e)}
                        className="absolute top-2 right-2 p-2 bg-cream-light/90 hover:bg-cream-light rounded-full shadow-md transition-transform active:scale-90"
                        aria-label="내 서재에 담기"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            isSaved ? 'fill-red-500 text-red-500' : 'text-charcoal-muted hover:text-red-500'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Book Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold text-forest bg-forest/15 border border-forest/30 px-2 py-0.5 rounded">
                        {book.lexileLevel}
                      </span>
                      <span className="text-[10px] font-semibold text-oak-dark bg-oak/15 px-2 py-0.5 rounded">
                        {book.gradeTag}
                      </span>
                    </div>

                    {/* Book Title & Author */}
                    <div>
                      <h3 className="text-base font-bold font-serif text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-charcoal-muted line-clamp-1 mt-0.5">
                        {book.author} | {book.publisher}
                      </p>
                    </div>

                    {/* Rating & Summary (2 lines limit) */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs font-bold text-oak-dark">
                        <Star className="w-3.5 h-3.5 fill-oak text-oak" />
                        <span>{book.rating}</span>
                      </div>
                      <p className="text-xs text-charcoal-light line-clamp-2 leading-relaxed font-light">
                        {book.summary}
                      </p>
                    </div>

                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-4 pt-3 border-t border-cream-dark flex items-center justify-between text-xs font-semibold text-forest">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-oak" />
                      북핏 가이드
                    </span>
                    <a
                      href={`https://link.coupang.com/a/fFatn3zjDo?q=${encodeURIComponent(book.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 bg-[#D62828] hover:bg-[#B71C1C] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      title="쿠팡에서 최저가 구매하기"
                    >
                      <span>쿠팡 최저가</span>
                    </a>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBooks.length === 0 && (
          <div className="py-16 text-center bg-cream-light rounded-3xl border border-oak/30 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-oak mx-auto" />
            <h4 className="text-lg font-bold font-serif text-charcoal">
              검색 조건에 맞는 도서를 찾지 못했습니다.
            </h4>
            <p className="text-xs text-charcoal-muted">
              검색어를 변경하거나 카테고리 필터를 '전체'로 재설정해보세요.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTag('전체');
                setSelectedLexileLevel('all');
              }}
              className="mt-2 px-4 py-2 bg-forest text-white text-xs font-bold rounded-xl"
            >
              필터 초기화
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
