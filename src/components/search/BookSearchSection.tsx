import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { fetchCuratedBooksFromDb } from '../../services/supabaseService';
import type { Book } from '../../types';
import { Search, Database, Star, Heart, BookOpen, ChevronRight, SlidersHorizontal, Sparkles, AlertTriangle } from 'lucide-react';
import { BookCoverImage } from '../common/BookCoverImage';

interface BookSearchSectionProps {
  onSelectBook: (book: Book) => void;
  onOpenDiagnosis: () => void;
}

export const BookSearchSection: React.FC<BookSearchSectionProps> = ({ onSelectBook, onOpenDiagnosis }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('전체');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbAlert, setDbAlert] = useState<string | null>(null);
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

  // 1. 데이터 Fetch 함수 (단순 명료한 구조)
  const loadBooks = async () => {
    try {
      setIsLoading(true);
      setDbAlert(null);

      // 무조건 전체 도서 가져오기
      let { data, error } = await supabase
        .from('books') // 실제 테이블명으로 지정
        .select('*')
        .order('id', { ascending: false });

      if (error) {
        console.error('Supabase Fetch Error:', error);
        // id 컬럼 순서 정렬 실패 시 기본 조회 재시도
        const retry = await supabase.from('books').select('*');
        data = retry.data;
        error = retry.error;
      }

      if (error || !data || data.length === 0) {
        const warnMessage = '[Alert] DB 데이터 0건 불러옴 (RLS 권한 또는 테이블명 확인 필요)';
        console.warn(warnMessage);
        setDbAlert(warnMessage);

        // Backup 폴백 시도
        const fallbackData = await fetchCuratedBooksFromDb();
        if (fallbackData && fallbackData.length > 0) {
          setBooks(fallbackData);
          setIsLoading(false);
          return;
        }

        setBooks([]);
        setIsLoading(false);
        return;
      }

      // 2. 검색어/필터 적용 (검색어나 필터가 있는 경우에만 적용, 없을 때는 data 그대로)
      let result = data;

      if (searchTerm && searchTerm.trim() !== '') {
        const term = searchTerm.trim().toLowerCase();
        result = result.filter((book: any) =>
          (book.title && String(book.title).toLowerCase().includes(term)) ||
          (book.author && String(book.author).toLowerCase().includes(term))
        );
      }

      if (selectedTag && selectedTag !== '#전체' && selectedTag !== '전체' && selectedTag !== 'all') {
        result = result.filter((book: any) =>
          book.theme_keyword === selectedTag ||
          (book.tags && Array.isArray(book.tags) && book.tags.includes(selectedTag)) ||
          (book.grade_tag && String(book.grade_tag).includes(selectedTag)) ||
          (book.gradeTag && String(book.gradeTag).includes(selectedTag))
        );
      }

      if (selectedLevel && selectedLevel !== '전체 레벨' && selectedLevel !== 'all' && selectedLevel !== '전체') {
        result = result.filter((book: any) =>
          book.step_level === selectedLevel ||
          (book.lexile_level && String(book.lexile_level).includes(selectedLevel)) ||
          (book.lexileLevel && String(book.lexileLevel).includes(selectedLevel))
        );
      }

      // 화면 표시용 Book 객체 매핑
      const mappedBooks: Book[] = result.map((item: any) => ({
        id: String(item.id || item.isbn || Math.random().toString()),
        title: item.title || '제목 없음',
        author: item.author || '저자 미상',
        publisher: item.publisher || '출판사',
        coverImage:
          item.cover_image ||
          item.cover_url ||
          item.image_url ||
          item.coverImage ||
          'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg',
        gradeTag: item.grade_tag || item.gradeTag || '전 학년',
        lexileLevel: item.lexile_level || item.lexileLevel || '어휘 L3 (맞춤)',
        trackType: (item.track_type || item.trackType || 'comfort') as any,
        recommendReason: item.recommend_reason || item.recommendReason || '북핏 추천 도서',
        summary: item.summary || item.description || '어린이 문해력 성장에 도움을 주는 도서입니다.',
        vocabularyPoints: item.vocabulary_points || item.vocabularyPoints || ['어휘력', '독해력'],
        parentQuestions: item.parent_questions || item.parentQuestions || ['이 책을 읽고 어떤 느낌이 들었나요?'],
        rating: Number(item.rating) || 4.9,
      }));

      setBooks(mappedBooks);
    } catch (err) {
      console.error('Uncaught error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. 페이지 마운트 및 검색어/필터 변경 시 자동 실행
  useEffect(() => {
    loadBooks();
  }, [searchTerm, selectedTag, selectedLevel]);

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

        {/* DB Alert Notice if 0 items or RLS block */}
        {dbAlert && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-center gap-3 text-amber-900 text-xs font-semibold shadow-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold">{dbAlert}</p>
              <p className="text-[11px] text-amber-700 mt-0.5">
                Supabase Dashboard &gt; Table Editor &gt; books 테이블의 RLS(Row Level Security) READ 정책이 활성화되어 있는지 확인해 주세요.
              </p>
            </div>
          </div>
        )}

        {/* Library Desk Search Console Box */}
        <div className="bg-cream-light border-2 border-oak/40 rounded-3xl p-6 sm:p-8 shadow-elevated space-y-6">
          
          {/* Main Search Bar Input */}
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-forest" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="책 제목, 저자, 어휘 키워드(예: 한자어, 미스터리, 속담)를 검색해보세요..."
              className="w-full pl-12 pr-28 py-4 bg-cream border-2 border-oak/30 focus:border-forest rounded-2xl text-sm font-medium text-charcoal placeholder-charcoal-muted focus:outline-none focus:ring-4 focus:ring-forest/10 shadow-inner transition-all"
            />
            <button
              onClick={() => loadBooks()}
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
                  onClick={() => setSelectedLevel(tab.id)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    selectedLevel === tab.id
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
              총 {books.length}권 검색됨
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
            <p>Supabase DB 데이터를 조회하고 도서를 정렬하는 중입니다...</p>
          </div>
        )}

        {/* Curated Book Card Grid (3-4 Columns Responsive) */}
        {!isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => {
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
        {!isLoading && books.length === 0 && (
          <div className="py-16 text-center bg-cream-light rounded-3xl border border-oak/30 p-8 space-y-3">
            <BookOpen className="w-10 h-10 text-oak mx-auto" />
            <h4 className="text-lg font-bold font-serif text-charcoal">
              {searchTerm ? '검색 조건에 맞는 도서를 찾지 못했습니다.' : '등록된 큐레이션 도서가 없습니다.'}
            </h4>
            <p className="text-xs text-charcoal-muted">
              {searchTerm
                ? "검색어를 변경하거나 카테고리 필터를 '전체'로 재설정해 보세요."
                : "상단 메뉴의 [도서 큐레이션 관리자]를 통해 알라딘 추천 도서를 서가에 등록해 보세요."}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTag('전체');
                setSelectedLevel('all');
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
