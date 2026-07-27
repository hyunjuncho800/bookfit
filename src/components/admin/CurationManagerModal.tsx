import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  PlusCircle,
  CheckCircle2,
  Sparkles,
  Loader2,
  Database,
  ShieldCheck,
  CheckSquare,
  Square,
  Layers
} from 'lucide-react';
import type { Book } from '../../types';
import { searchAladinBooks, fetchAladinCategoryBooksWithDebug } from '../../services/aladinApi';
import { saveCuratedBookToDb, saveBatchCuratedBooksToDb, fetchCuratedBooksFromDb } from '../../services/supabaseService';
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
  const [activeTab, setActiveTab] = useState<'single' | 'batch'>('batch');
  const [query, setQuery] = useState<string>('만복이네');
  const [selectedCategory, setSelectedCategory] = useState<'low' | 'mid' | 'high' | 'bestseller'>('low');
  
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
  const [searchTrack, setSearchTrack] = useState<Record<string, 'comfort' | 'challenge' | 'supplement'>>({});
  const [batchTrack, setBatchTrack] = useState<'comfort' | 'challenge' | 'supplement'>('comfort');
  const [existingDbTitles, setExistingDbTitles] = useState<string[]>([]);
  const [apiErrorInfo, setApiErrorInfo] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isBatchSaving, setIsBatchSaving] = useState<boolean>(false);
  const [savedBookIds, setSavedBookIds] = useState<string[]>([]);
  const [savingBookId, setSavingBookId] = useState<string | null>(null);

  // Load existing DB books to check for duplicates
  const loadExistingDbBooks = async () => {
    try {
      const dbBooks = await fetchCuratedBooksFromDb();
      const titles = dbBooks.map((b) => b.title.trim().toLowerCase());
      setExistingDbTitles(titles);
    } catch (err) {
      console.warn('Failed to load existing DB titles:', err);
    }
  };

  // Single Search trigger
  const handleSingleSearch = async (searchQuery?: string) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q.trim()) return;

    setIsLoading(true);
    setApiErrorInfo(null);
    await loadExistingDbBooks();
    try {
      const results = await searchAladinBooks(q);
      setSearchResults(results);
      setSelectedBookIds([]);
    } catch (err) {
      console.error('Single search failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Batch 30-Book Category Fetch trigger
  const handleBatchFetch = async (cat: 'low' | 'mid' | 'high' | 'bestseller') => {
    setSelectedCategory(cat);
    setIsLoading(true);
    setApiErrorInfo(null);
    await loadExistingDbBooks();
    try {
      const result = await fetchAladinCategoryBooksWithDebug(cat);
      setSearchResults(result.books);
      if (result.errorInfo) {
        setApiErrorInfo(result.errorInfo);
      }
      // Auto-select unregistered books only by default
      const unregisteredIds = result.books
        .filter((b) => !existingDbTitles.includes(b.title.trim().toLowerCase()))
        .map((b) => b.id);
      setSelectedBookIds(unregisteredIds);
    } catch (err) {
      console.error('Batch fetch failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (activeTab === 'single') {
        handleSingleSearch('만복이네');
      } else {
        handleBatchFetch('low');
      }
    }
  }, [isOpen, activeTab]);

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

  // Toggle single book selection checkbox
  const handleToggleSelect = (bookId: string) => {
    setSelectedBookIds((prev) =>
      prev.includes(bookId) ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    );
  };

  // Select all or deselect all
  const handleToggleSelectAll = () => {
    if (selectedBookIds.length === searchResults.length) {
      setSelectedBookIds([]);
    } else {
      setSelectedBookIds(searchResults.map((b) => b.id));
    }
  };

  const handleTrackChange = (bookId: string, track: 'comfort' | 'challenge' | 'supplement') => {
    setSearchTrack((prev) => ({ ...prev, [bookId]: track }));
  };

  // Single Book DB Insert
  const handleAddBookToDb = async (book: Book) => {
    setSavingBookId(book.id);
    const selectedTrack = searchTrack[book.id] || book.trackType || batchTrack;

    const result = await saveCuratedBookToDb(book, selectedTrack);

    setSavingBookId(null);
    if (result.success) {
      setSavedBookIds((prev) => [...prev, book.id]);
      if (onBookAdded) onBookAdded();
    } else {
      console.error('[Single Book Insert Error]:', result.errorMessage);
      alert(`⚠️ ${result.errorMessage || '저장 실패 원인: 알 수 없는 에러가 발생했습니다.'}`);
    }
  };

  // Batch Insert Selected Books into Supabase DB
  const handleBatchInsert = async () => {
    const selectedBooks = searchResults.filter((b) => selectedBookIds.includes(b.id));
    if (selectedBooks.length === 0) {
      alert('서가에 추가할 도서를 최소 1권 이상 선택해 주세요.');
      return;
    }

    setIsBatchSaving(true);
    // Assign individual tracks or batchTrack to books
    const preparedBooks = selectedBooks.map((b) => ({
      ...b,
      trackType: searchTrack[b.id] || batchTrack,
    }));

    const result = await saveBatchCuratedBooksToDb(preparedBooks, batchTrack);
    setIsBatchSaving(false);

    if (result.success) {
      setSavedBookIds((prev) => [...prev, ...selectedBookIds]);
      const warnNotice = result.errorMessage ? `\n\n[실패 내역 상세]\n${result.errorMessage}` : '';
      alert(`🎉 총 ${result.count}권의 도서가 큐레이션 서가 DB에 성공적으로 저장되었습니다!${warnNotice}`);
      if (onBookAdded) onBookAdded();
    } else {
      console.error('[Batch Insert Error]:', result.errorMessage);
      alert(`⚠️ ${result.errorMessage || '저장 실패 원인: 알 수 없는 에러가 발생했습니다.'}`);
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
                  Admin System
                </span>
              </h2>
              <p className="text-xs text-cream-card/80">
                학년별 추천도서 30권 대량 불러오기 및 체크박스 일괄 DB 저장(Batch Insert)을 지원합니다.
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

        {/* Modal Top Nav Tabs */}
        <div className="flex border-b border-oak/30 bg-cream-card/60 px-6 pt-3 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('batch')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'batch'
                ? 'bg-cream-light text-forest border-t-2 border-x border-forest shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Layers className="w-4 h-4 text-oak-dark" />
            <span>📚 학년별 30권 대량 불러오기 (Batch)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`px-4 py-2.5 rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'single'
                ? 'bg-cream-light text-forest border-t-2 border-x border-forest shadow-sm'
                : 'text-charcoal-muted hover:text-charcoal'
            }`}
          >
            <Search className="w-4 h-4 text-forest" />
            <span>🔍 제목 / ISBN 개별 검색</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Batch 30-Book Fetch */}
          {activeTab === 'batch' && (
            <div className="space-y-4 bg-cream-card/70 p-4 rounded-2xl border border-oak/30 shadow-sm">
              <div className="flex justify-between items-center text-xs font-bold text-charcoal">
                <span>카테고리 선택 (한 번에 30권 자동 대량 조회):</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'low', label: '🐥 초등 저학년 (1~2학년) 30권' },
                  { id: 'mid', label: '🐥 초등 중학년 (3~4학년) 30권' },
                  { id: 'high', label: '🦅 초등 고학년 (5~6학년) 30권' },
                  { id: 'bestseller', label: '🏆 아동 베스트셀러 30권' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleBatchFetch(cat.id as any)}
                    disabled={isLoading}
                    className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedCategory === cat.id
                        ? 'bg-forest text-white border-forest shadow-sm'
                        : 'bg-cream-light text-charcoal hover:bg-cream border-oak/30'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Single Search Bar */}
          {activeTab === 'single' && (
            <div className="flex flex-col sm:flex-row items-center gap-3 bg-cream-card p-4 rounded-2xl border border-oak/30 shadow-sm">
              <div className="relative flex-1 w-full">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSingleSearch()}
                  placeholder="도서 제목, 키워드, 저자 또는 ISBN을 입력하세요..."
                  className="w-full pl-11 pr-4 py-3 bg-cream-light border border-oak/30 rounded-xl text-xs sm:text-sm font-medium text-charcoal focus:outline-none focus:border-forest shadow-inner"
                />
                <Search className="w-5 h-5 text-charcoal-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              </div>

              <button
                onClick={() => handleSingleSearch()}
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
          )}

          {/* Batch Controls Bar (Checkboxes & Global Track Selector & Batch Insert Button) */}
          <div className="bg-forest/5 p-4 rounded-2xl border border-forest/20 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button
                onClick={handleToggleSelectAll}
                className="px-3 py-1.5 bg-cream-light border border-oak/30 hover:bg-cream text-charcoal text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
              >
                {selectedBookIds.length === searchResults.length && searchResults.length > 0 ? (
                  <>
                    <CheckSquare className="w-4 h-4 text-forest" />
                    <span>전체 해제</span>
                  </>
                ) : (
                  <>
                    <Square className="w-4 h-4 text-charcoal-muted" />
                    <span>전체 선택 ({searchResults.length}권)</span>
                  </>
                )}
              </button>

              <span className="text-xs font-bold text-forest bg-forest/10 px-3 py-1.5 rounded-lg border border-forest/20">
                선택됨: <strong className="text-oak-dark font-serif text-sm">{selectedBookIds.length}</strong> / {searchResults.length}권
              </span>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-charcoal-muted font-bold whitespace-nowrap">일괄 레벨 지정:</span>
                <select
                  value={batchTrack}
                  onChange={(e) => setBatchTrack(e.target.value as any)}
                  className="p-2 bg-cream-light border border-oak/30 rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-forest"
                >
                  <option value="comfort">Step 1. 적정 도서 (70%)</option>
                  <option value="challenge">Step 2. 도전 도서 (10%)</option>
                  <option value="supplement">Step 3. 약점 보완 (20%)</option>
                </select>
              </div>

              <button
                onClick={handleBatchInsert}
                disabled={isBatchSaving || selectedBookIds.length === 0}
                className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
              >
                {isBatchSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-oak" />
                    <span>일괄 저장 중...</span>
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 text-oak" />
                    <span>선택 도서 ({selectedBookIds.length}권) 서가 DB에 한 번에 추가</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Grid with Checkboxes */}
          {isLoading ? (
            <div className="py-16 text-center space-y-3 bg-cream-card/40 rounded-2xl border border-oak/20">
              <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
              <p className="text-xs text-charcoal font-bold font-serif">
                알라딘 Open API에서 {selectedCategory === 'low' ? '초등 저학년' : selectedCategory === 'mid' ? '초등 중학년' : selectedCategory === 'high' ? '초등 고학년' : '베스트셀러'} 30권을 조회하고 있습니다...
              </p>
            </div>
          ) : searchResults.length === 0 || apiErrorInfo ? (
            <div className="p-6 bg-red-50/90 border-2 border-red-500/80 rounded-2xl space-y-4 shadow-sm text-left animate-fadeIn">
              <div className="flex items-center gap-2 text-red-700 font-bold font-serif text-sm border-b border-red-200 pb-3">
                <span className="w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs font-sans">
                  !
                </span>
                <span>[Aladin Error Response] 알라딘 API 호출 오류 디버그 리포트</span>
              </div>

              <div className="space-y-2 text-xs font-mono text-red-800 leading-relaxed bg-white/80 p-4 rounded-xl border border-red-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-red-900 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                    {apiErrorInfo?.errorCode !== undefined ? `[ErrorCode ${apiErrorInfo.errorCode}]` : '[Error] TTBKey / Proxy Issue'}
                  </span>
                  {apiErrorInfo?.errorCodeName && (
                    <span className="font-semibold text-red-700">
                      ({apiErrorInfo.errorCodeName})
                    </span>
                  )}
                </div>

                <p className="font-bold text-red-900 text-sm pt-1">
                  🚨 {apiErrorInfo?.errorMessage || '알라딘 API 응답 실패 또는 데이터 없음'}
                </p>

                <div className="pt-2 text-[11px] text-red-700 space-y-1 border-t border-red-100">
                  <p>
                    • <strong>TTBKey Status:</strong>{' '}
                    <span className="text-forest font-bold">
                      {apiErrorInfo?.ttbKeyPresent !== false ? `Loaded (${apiErrorInfo?.ttbKeyPrefix || 'ttbfris...'})` : 'Missing (undefined)'}
                    </span>
                  </p>
                  <p className="break-all font-sans text-[10px] text-gray-600">
                    • <strong>Failed Endpoint:</strong> {apiErrorInfo?.url || 'https://www.aladin.co.kr/ttb/api/ItemList.aspx'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-red-600 font-medium">
                Tip: 브라우저 개발자 도구 (Network / Console) 탭에서 호출 상세 응답을 추가로 확인하실 수 있습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchResults.map((book) => {
                const isAlreadyInDb = existingDbTitles.includes(book.title.trim().toLowerCase());
                const isChecked = selectedBookIds.includes(book.id);
                const isSaved = savedBookIds.includes(book.id) || isAlreadyInDb;
                const isSaving = savingBookId === book.id;
                const currentTrack = searchTrack[book.id] || book.trackType || batchTrack;

                return (
                  <div
                    key={book.id}
                    onClick={() => {
                      if (!isAlreadyInDb) handleToggleSelect(book.id);
                    }}
                    className={`relative border rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between space-y-3 ${
                      isAlreadyInDb
                        ? 'bg-cream-dark/40 border-oak/20 opacity-80 cursor-default'
                        : isChecked
                        ? 'bg-forest/5 border-forest-light border-2 cursor-pointer'
                        : 'bg-cream-light border-oak/30 cursor-pointer hover:shadow-md'
                    }`}
                  >
                    {/* Top Select Checkbox Indicator & Duplicate Badge */}
                    <div className="flex items-center justify-between pb-2 border-b border-cream-dark">
                      <div className="flex items-center gap-2">
                        {isAlreadyInDb ? (
                          <span className="text-[10px] font-bold text-forest bg-forest/15 px-2.5 py-0.5 rounded-full border border-forest/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest" />
                            <span>이미 서가 DB에 등록됨 🔒</span>
                          </span>
                        ) : isChecked ? (
                          <div className="flex items-center gap-1 text-xs font-bold text-forest">
                            <CheckSquare className="w-5 h-5 text-forest shrink-0" />
                            <span>선택됨</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs font-semibold text-charcoal-muted">
                            <Square className="w-5 h-5 text-charcoal-muted shrink-0" />
                            <span>선택 가능</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2 py-0.5 rounded border border-oak/30">
                          {book.lexileLevel}
                        </span>
                        <span className="text-[10px] font-semibold text-charcoal-muted bg-cream-dark px-2 py-0.5 rounded">
                          {book.gradeTag}
                        </span>
                      </div>
                    </div>

                    {/* Book Card Body */}
                    <div className="flex gap-4">
                      <BookCoverImage
                        src={book.coverImage}
                        alt={book.title}
                        className="w-24 h-32 object-cover rounded-xl border border-oak/20 shadow-sm shrink-0"
                      />

                      <div className="space-y-1.5 flex-1 min-w-0">
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

                    {/* Individual Track Select & Single Save Button */}
                    <div
                      className="pt-3 border-t border-cream-dark flex flex-col sm:flex-row items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="w-full sm:w-1/2">
                        <select
                          value={currentTrack}
                          disabled={isAlreadyInDb}
                          onChange={(e) =>
                            handleTrackChange(
                              book.id,
                              e.target.value as 'comfort' | 'challenge' | 'supplement'
                            )
                          }
                          className="w-full p-2 bg-cream border border-oak/30 rounded-lg text-xs font-bold text-charcoal focus:outline-none focus:border-forest disabled:opacity-50"
                        >
                          <option value="comfort">Step 1. 적정 도서 (70%)</option>
                          <option value="challenge">Step 2. 도전 도서 (10%)</option>
                          <option value="supplement">Step 3. 약점 보완 (20%)</option>
                        </select>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAlreadyInDb) handleAddBookToDb(book);
                        }}
                        disabled={isSaved || isSaving}
                        className={`w-full sm:w-1/2 py-2 px-3 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 ${
                          isAlreadyInDb
                            ? 'bg-cream-dark text-charcoal-muted border border-oak/20 cursor-default opacity-70'
                            : isSaved
                            ? 'bg-forest/15 text-forest border border-forest/30 cursor-default'
                            : 'bg-forest hover:bg-forest-dark text-white'
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-oak" />
                            <span>저장 중...</span>
                          </>
                        ) : isAlreadyInDb ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-forest" />
                            <span>서가에 수록됨</span>
                          </>
                        ) : isSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-forest" />
                            <span>저장 완료</span>
                          </>
                        ) : (
                          <>
                            <PlusCircle className="w-4 h-4 text-oak" />
                            <span>개별 DB 등록</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-cream-dark bg-cream-card/50 flex items-center justify-between text-xs text-charcoal-muted">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-forest" />
            <span>Supabase `books` 큐레이션 서가 테이블 Batch Insert 연동 완료</span>
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
