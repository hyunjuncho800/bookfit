import React, { useState, useEffect } from 'react';
import { MOCK_BOOKS } from '../data/mockData';
import { RECOMMENDED_BOOKS_BY_AGE } from '../data/seedBooksData';
import type { Book } from '../types';
import { Library, Star, Filter, Info, Sparkles, Database, Trash2, Shield } from 'lucide-react';
import { BookCoverImage } from './common/BookCoverImage';
import { CurationManagerModal } from './admin/CurationManagerModal';
import { fetchCuratedBooksFromDb, deleteBookFromDb } from '../services/supabaseService';

const ALL_SEED_BOOKS = [
  ...RECOMMENDED_BOOKS_BY_AGE.preschool,
  ...RECOMMENDED_BOOKS_BY_AGE.elementary_low,
  ...RECOMMENDED_BOOKS_BY_AGE.elementary_mid,
  ...RECOMMENDED_BOOKS_BY_AGE.elementary_high,
];

export const getCoupangSearchLink = (title: string): string => {
  if (!title) return 'https://www.coupang.com';

  const cleanTitle = title
    .replace(/\[.*?\]|\(.*?\)|<.*?>/g, '')
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\'\"]/g, ' ')
    .trim();

  const encodedTitle = encodeURIComponent(cleanTitle);
  return `https://www.coupang.com/np/search?component=&q=${encodedTitle}&channel=user`;
};

interface BookshelfSectionProps {
  onSelectBook: (book: Book) => void;
  onOpenDiagnosis: () => void;
}

export const BookshelfSection: React.FC<BookshelfSectionProps> = ({ onSelectBook, onOpenDiagnosis }) => {
  const [activeGradeFilter, setActiveGradeFilter] = useState<string>('all');
  const [activeTrackFilter, setActiveTrackFilter] = useState<string>('all');
  const [dbBooks, setDbBooks] = useState<Book[]>([]);
  const [isManagerOpen, setIsManagerOpen] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const loadBookshelfData = () => {
    fetchCuratedBooksFromDb().then((fetched) => {
      console.log('[Fetched DB Books Result]:', fetched);
      if (fetched && fetched.length > 0) {
        setDbBooks(fetched);
      }
    });
  };

  useEffect(() => {
    loadBookshelfData();
  }, []);

  const handleDeleteBook = async (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAdmin) {
      alert('🔒 삭제 권한이 없습니다. 관리자 모드(Admin)를 활성화해 주세요.');
      return;
    }

    const confirmDelete = window.confirm(
      `🗑️ [도서 등록 취소]\n\n'${book.title}' 도서를 서가에서 삭제하시겠습니까?`
    );

    if (!confirmDelete) return;

    const res = await deleteBookFromDb(book.id, isAdmin);

    if (res.success) {
      alert(`✅ '${book.title}' 도서가 서가에서 삭제되었습니다.`);
      loadBookshelfData();
      window.dispatchEvent(new CustomEvent('bookfit_library_updated'));
    } else {
      console.error('[Delete Error]:', res.errorMessage);
      alert(`⚠️ 삭제 실패: ${res.errorMessage}`);
    }
  };

  // Merge Seed books, DB books and MOCK_BOOKS prioritizing 29 Educational Seed Books
  const allAvailableBooks: Book[] = [...ALL_SEED_BOOKS];
  dbBooks.forEach((dbItem) => {
    if (!allAvailableBooks.some((b) => b.id === dbItem.id || b.title.trim().toLowerCase() === dbItem.title.trim().toLowerCase())) {
      allAvailableBooks.push(dbItem);
    }
  });
  MOCK_BOOKS.forEach((mockItem) => {
    if (!allAvailableBooks.some((b) => b.id === mockItem.id || b.title.trim().toLowerCase() === mockItem.title.trim().toLowerCase())) {
      allAvailableBooks.push(mockItem);
    }
  });

  const checkGradeMatch = (bookGrade: string, filter: string) => {
    if (filter === 'all') return true;
    if (!bookGrade) return true;
    const lower = bookGrade.toLowerCase();

    if (filter === '1-2') {
      return (
        lower.includes('1-2') ||
        lower.includes('1~2') ||
        lower.includes('1학년') ||
        lower.includes('2학년') ||
        lower.includes('저학년')
      );
    }
    if (filter === '3-4') {
      return (
        lower.includes('3-4') ||
        lower.includes('3~4') ||
        lower.includes('3학년') ||
        lower.includes('4학년') ||
        lower.includes('중학년')
      );
    }
    if (filter === '5-6') {
      return (
        lower.includes('5-6') ||
        lower.includes('5~6') ||
        lower.includes('5학년') ||
        lower.includes('6학년') ||
        lower.includes('고학년')
      );
    }
    return lower.includes(filter.toLowerCase());
  };

  const filteredBooks = allAvailableBooks.filter((book) => {
    const matchGrade = checkGradeMatch(book.gradeTag, activeGradeFilter);
    const matchTrack =
      activeTrackFilter === 'all' || book.trackType === activeTrackFilter;
    return matchGrade && matchTrack;
  });

  const getTrackBadgeStyle = (track: 'comfort' | 'challenge' | 'supplement') => {
    switch (track) {
      case 'comfort':
        return 'bg-forest/15 text-forest border-forest/30';
      case 'challenge':
        return 'bg-oak/20 text-oak-dark border-oak/40';
      case 'supplement':
        return 'bg-charcoal/10 text-charcoal border-charcoal/30';
    }
  };

  const getTrackName = (track: 'comfort' | 'challenge' | 'supplement') => {
    switch (track) {
      case 'comfort':
        return 'Step 1. 적정 70%';
      case 'challenge':
        return 'Step 2. 도전 10%';
      case 'supplement':
        return 'Step 3. 보완 20%';
    }
  };

  return (
    <section id="bookshelf" className="py-20 bg-cream-card/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-oak/15 text-oak-dark text-xs font-bold">
              <Library className="w-4 h-4 text-oak-dark" />
              BookFit Curated Bookshelf
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-tight">
              맞춤 큐레이션 서가 미리보기
            </h2>
            <p className="text-sm text-charcoal-light max-w-xl">
              어휘 레벨 뱃지와 3-Step 분류를 갖춘 엄선 도서를 확인해보세요.{' '}
              <br className="hidden sm:inline" />
              도서를 클릭하면 부모용 독후 대화 가이드와 핵심 어휘를 볼 수 있습니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Admin Permission Toggle Button */}
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-3.5 py-2.5 rounded-xl font-bold text-xs border transition-all flex items-center gap-1.5 ${
                isAdmin
                  ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
                  : 'bg-cream-light text-charcoal-muted border-oak/20 hover:text-charcoal'
              }`}
              title="관리자 권한 토글 (도서 삭제/등록 취소 조작 가능)"
            >
              <Shield className={`w-4 h-4 ${isAdmin ? 'text-amber-700 fill-amber-300' : ''}`} />
              <span>{isAdmin ? '관리자(Admin): ON' : '관리자: OFF'}</span>
            </button>

            <button
              onClick={() => setIsManagerOpen(true)}
              className="px-4 py-2.5 bg-oak/20 text-forest-dark hover:bg-oak/30 font-bold text-xs rounded-xl border border-oak/40 shadow-sm transition-all flex items-center gap-1.5"
            >
              <Database className="w-4 h-4 text-oak-dark" />
              <span>알라딘 도서 서가 DB 등록 🛠️</span>
            </button>

            <button
              onClick={onOpenDiagnosis}
              className="px-5 py-2.5 bg-forest text-white hover:bg-forest-dark font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-oak" />
              <span>우리 아이 맞춤 서가 전체 받기</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-cream-light p-4 rounded-2xl border border-oak/30 shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Grade Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
              <span className="text-charcoal-muted font-bold mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> 연령/학년:
              </span>
              {[
                { id: 'all', label: '전체 학년' },
                { id: '1~2', label: '초등 1~2학년' },
                { id: '3~4', label: '초등 3~4학년' },
                { id: '5~6', label: '초등 5~6학년' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveGradeFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeGradeFilter === tab.id
                      ? 'bg-forest text-white font-bold shadow-sm'
                      : 'bg-cream text-charcoal hover:bg-cream-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Track Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
              <span className="text-charcoal-muted font-bold mr-2">3-Step:</span>
              {[
                { id: 'all', label: '전체 Step' },
                { id: 'comfort', label: '적정도서 (70%)' },
                { id: 'challenge', label: '도전도서 (10%)' },
                { id: 'supplement', label: '보완도서 (20%)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTrackFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    activeTrackFilter === tab.id
                      ? 'bg-oak text-forest-dark font-bold shadow-sm'
                      : 'bg-cream text-charcoal hover:bg-cream-dark'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Library Shelf Grid Container */}
        <div className="relative pt-4 pb-8 space-y-12">
          
          {/* Books Shelf Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => onSelectBook(book)}
                className="group relative bg-cream-light border border-oak/30 hover:border-forest/60 rounded-2xl p-5 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-charcoal-muted bg-cream-dark px-2.5 py-0.5 rounded-md">
                      {book.gradeTag}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md border ${getTrackBadgeStyle(book.trackType)}`}>
                      {getTrackName(book.trackType)}
                    </span>
                  </div>

                  {/* Book Image & Details Wrapper */}
                  <div className="grid grid-cols-12 gap-4 items-start">
                    
                    {/* Cover Image */}
                    <div className="col-span-5 relative">
                      <BookCoverImage
                        src={book.coverImage}
                        alt={book.title}
                        className="w-full h-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300 border border-oak/20"
                      />
                    </div>

                    {/* Book Text Info */}
                    <div className="col-span-7 space-y-1.5">
                      {/* Lexile Badge */}
                      <span className="inline-block text-[10px] font-bold text-oak-dark bg-oak/15 px-2 py-0.5 rounded">
                        {book.lexileLevel}
                      </span>

                      <h3 className="text-base font-bold font-serif text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                        {book.title}
                      </h3>

                      <p className="text-[11px] text-charcoal-muted">
                        {book.author} 저
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-oak-dark font-bold pt-1">
                        <Star className="w-3.5 h-3.5 fill-oak text-oak" />
                        <span>{book.rating}</span>
                      </div>
                    </div>

                  </div>

                  {/* Recommendation Reason */}
                  <div className="p-3 bg-cream-card rounded-xl border border-oak/20">
                    <p className="text-xs text-charcoal leading-snug line-clamp-2 italic">
                      "{book.recommendReason}"
                    </p>
                  </div>

                </div>

                {/* Bottom Action */}
                <div className="mt-4 pt-3 border-t border-cream-dark flex items-center justify-between text-xs font-semibold text-forest">
                  <span className="flex items-center gap-1">
                    <Info className="w-3.5 h-3.5 text-oak" />
                    독후 질문 가이드 보기
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Admin Only Delete/Cancel Registration Button */}
                    {isAdmin && (
                      <button
                        onClick={(e) => handleDeleteBook(book, e)}
                        className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 shadow-sm"
                        title="관리자 전용: 서가 도서 삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>등록 취소</span>
                      </button>
                    )}

                    <a
                      href={getCoupangSearchLink(book.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-2.5 py-1 bg-[#D62828] hover:bg-[#B71C1C] text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                      title={`${book.title} 쿠팡 최저가 검색하기`}
                    >
                      <span>쿠팡 최저가</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Wooden Shelf Bar Visual */}
          <div className="w-full h-4 wood-shelf rounded-xl shadow-md" />

        </div>

      </div>

      {/* Curation Shelf Manager Admin Modal */}
      <CurationManagerModal
        isOpen={isManagerOpen}
        onClose={() => {
          setIsManagerOpen(false);
          loadBookshelfData();
        }}
        onBookAdded={loadBookshelfData}
      />
    </section>
  );
};
