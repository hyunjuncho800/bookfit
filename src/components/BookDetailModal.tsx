import React, { useEffect, useState } from 'react';
import type { Book, AIGeneratedGuide } from '../types';
import { generateBookGuide } from '../services/aiGuideGenerator';
import { saveOrUpdateLibraryBook, fetchMyLibraryFromDb, deleteBookFromDb, updateLibraryBookStatus, isValidUUID, supabase } from '../services/supabaseService';
import { getGuestLibraryBooks, saveGuestLibraryBook, removeGuestLibraryBook } from '../services/authService';
import { X, Star, BookOpen, Heart, ExternalLink, HelpCircle, Sparkles, CheckCircle2, ShoppingBag, Brain, Loader2, Trash2 } from 'lucide-react';
import { BookCoverImage } from './common/BookCoverImage';
import { getCoupangSearchLink } from '../utils/linkUtils';
import { BookQuizModal } from './library/BookQuizModal';

interface BookDetailModalProps {
  book: Book & { partnerUrl?: string } | null;
  onClose: () => void;
  onOpenDiagnosis: () => void;
}

export const BookDetailModal: React.FC<BookDetailModalProps> = ({ book, onClose, onOpenDiagnosis: _onOpenDiagnosis }) => {
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [currentBookStatus, setCurrentBookStatus] = useState<'to_read' | 'reading' | 'completed' | 'none'>('none');
  const [activeGuideStage, setActiveGuideStage] = useState<'before' | 'during' | 'after'>('before');
  const [activeTab, setActiveTab] = useState<'questions' | 'quiz' | 'vocab'>('questions');
  const [aiGuide, setAiGuide] = useState<AIGeneratedGuide | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [showQuizModal, setShowQuizModal] = useState<boolean>(false);

  // Helper to normalize status
  const getNormalizedStatus = (rawStatus: string): 'to_read' | 'reading' | 'completed' => {
    const s = String(rawStatus).toLowerCase();
    if (s.includes('complete') || s.includes('완독')) return 'completed';
    if (s.includes('read') && !s.includes('to')) return 'reading';
    return 'to_read';
  };

  const handleCloseModal = () => {
    window.dispatchEvent(new CustomEvent('bookfit_library_updated'));
    onClose();
  };

  // 모달 내 상태 변경 및 서재 갱신 (Supabase DB UPDATE & 실시간 목록 재조회)
  const handleStatusChange = async (newStatus: 'to_read' | 'reading' | 'completed' | string) => {
    if (!book) return;
    const { data: { user } } = await supabase.auth.getUser();

    const dbStatus = newStatus === 'to_read' ? 'wantToRead' : newStatus;

    if (user) {
      if (isValidUUID(book.id)) {
        const { data, error } = await supabase
          .from('my_library')
          .update({ 
            status: dbStatus, 
            updated_at: new Date().toISOString() 
          })
          .or(`id.eq.${user.id},user_id.eq.${user.id}`)
          .eq('book_id', book.id)
          .select();

        console.log("UPDATE 시도 결과 데이터 (UUID):", data);
        console.log("UPDATE 시도 에러 (UUID):", error);
      } else {
        console.log(`[BookDetailModal] Non-UUID bookId: "${book.id}". Bypassing UUID eq filter.`);
        await updateLibraryBookStatus(book.id, dbStatus as any);
      }
    } else {
      await updateLibraryBookStatus(book.id, dbStatus as any);
    }

    const norm = getNormalizedStatus(dbStatus);
    setCurrentBookStatus(norm);
    if (norm === 'to_read') setActiveGuideStage('before');
    else if (norm === 'reading') setActiveGuideStage('during');
    else if (norm === 'completed') setActiveGuideStage('after');

    alert(`📖 '${book.title}' 도서가 [${norm === 'reading' ? '읽는 중' : norm === 'completed' ? '완독 완료' : '읽을 책'}] 탭으로 이동되었습니다!`);

    // 부모 서재 페이지 실시간 목록 재조회 이벤트 발송
    window.dispatchEvent(new CustomEvent('bookfit_library_updated', { detail: { book, status: dbStatus } }));
  };

  // 1. Dynamic Check if book is already in My Library (DB or localStorage)
  useEffect(() => {
    if (!book) return;

    let isMounted = true;
    setIsSaved(false);
    setCurrentBookStatus('none');

    fetchMyLibraryFromDb().then((userBooks) => {
      if (isMounted && userBooks && userBooks.length > 0) {
        const found = userBooks.find(
          (b) => String(b.book?.id || b.id) === String(book.id) || b.book?.title?.trim() === book.title?.trim()
        );
        if (found) {
          const norm = getNormalizedStatus(found.status);
          setIsSaved(true);
          setCurrentBookStatus(norm);

          // Set default guide stage according to status
          if (norm === 'to_read') setActiveGuideStage('before');
          else if (norm === 'reading') setActiveGuideStage('during');
          else if (norm === 'completed') setActiveGuideStage('after');
          return;
        }
      }
      const guestBooks = getGuestLibraryBooks();
      const guestFound = guestBooks.find(
        (g) => String(g.book?.id || g.id) === String(book.id) || g.book?.title?.trim() === book.title?.trim()
      );
      if (isMounted && guestFound) {
        const norm = getNormalizedStatus(guestFound.status);
        setIsSaved(true);
        setCurrentBookStatus(norm);
        if (norm === 'to_read') setActiveGuideStage('before');
        else if (norm === 'reading') setActiveGuideStage('during');
        else if (norm === 'completed') setActiveGuideStage('after');
      }
    });

    return () => {
      isMounted = false;
    };
  }, [book]);

  // 2. Fetch AI Generated Guide on Book Select
  useEffect(() => {
    if (!book) return;

    let isMounted = true;
    setIsLoadingAI(true);
    setAiGuide(null);
    setSelectedQuizAnswers({});

    generateBookGuide(
      book.title,
      book.summary || (book as any).description,
      book.gradeTag
    ).then((guide) => {
      if (isMounted) {
        setAiGuide(guide);
        setIsLoadingAI(false);
      }
    }).catch((err) => {
      console.error('Gemini API Error in modal:', err);
      if (isMounted) {
        setIsLoadingAI(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [book]);

  // ESC Key & Body Scroll Lock Effect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (book) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [book, onClose]);

  if (!book) return null;

  const trackBadgeColors = {
    comfort: 'bg-forest/15 text-forest border-forest/30',
    challenge: 'bg-oak/20 text-oak-dark border-oak/40',
    supplement: 'bg-charcoal/10 text-charcoal border-charcoal/30',
  };

  const trackNames = {
    comfort: 'Step 1. 적정 도서 (70%)',
    challenge: 'Step 2. 도전 도서 (10%)',
    supplement: 'Step 3. 약점 보완 (20%)',
  };

  const targetCoupangUrl = book.partnerUrl || getCoupangSearchLink(book.title);

  const handleCoupangBuy = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(targetCoupangUrl, '_blank', 'noopener,noreferrer');
  };

  const handleQuizSelect = (qIdx: number, optIdx: number) => {
    setSelectedQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  // Complete Quiz handler
  const handleQuizCompleteInModal = async (_score: number, exp: number) => {
    if (!book) return;
    const res = await updateLibraryBookStatus(book.id, 'completed', 100);
    if (res.success) {
      setCurrentBookStatus('completed');
      setActiveGuideStage('after');
      setShowQuizModal(false);
      alert(`🎉 완독 퀴즈 검사 완료! 경험치 +${exp}EXP를 획득하셨습니다!`);
      window.dispatchEvent(new CustomEvent('bookfit_library_updated', { detail: { book, status: 'completed' } }));
    } else {
      alert(`⚠️ 완독 저장 실패: ${res.errorMessage}`);
      setShowQuizModal(false);
    }
  };

  const handleToggleLibrary = async () => {
    if (!book) return;

    if (isSaved) {
      // 1. 이미 등록된 도서 ➔ 삭제 (DELETE) 처리
      await deleteBookFromDb(book.id);
      removeGuestLibraryBook(book.id);

      setIsSaved(false);
      alert(`🗑️ '${book.title}' 도서가 내 서재에서 등록 취소(삭제)되었습니다.`);
      window.dispatchEvent(new CustomEvent('bookfit_library_updated', { detail: { bookId: book.id, removed: true } }));
    } else {
      // 2. 미등록 도서 ➔ 등록 (INSERT/UPSERT) 처리
      const res = await saveOrUpdateLibraryBook(book, 'wantToRead');

      if (res.success) {
        setIsSaved(true);
        alert(`🎉 '${book.title}' 도서가 내 서재의 [읽을 책] 탭에 성공적으로 등록되었습니다!`);
        window.dispatchEvent(new CustomEvent('bookfit_library_updated', { detail: { book, status: 'wantToRead' } }));
      } else {
        saveGuestLibraryBook({
          id: `guest_${book.id}`,
          book,
          status: 'wantToRead',
          progressPercent: 0
        });
        setIsSaved(true);
        alert(`🔖 '${book.title}' 도서가 내 서재의 [읽을 책] 탭에 등록되었습니다!`);
        window.dispatchEvent(new CustomEvent('bookfit_library_updated', { detail: { book, status: 'wantToRead' } }));
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fadeIn"
      onClick={handleCloseModal}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-3xl bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden max-h-[92vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark bg-forest text-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-oak text-forest flex items-center justify-center font-bold">
              <BookOpen className="w-4 h-4 stroke-[2.2]" />
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif">
                북핏(BookFit) AI 맞춤 독후 가이드 & 어휘 퀴즈
              </h3>
              <p className="text-[11px] text-cream-card/80">
                18년 차 전문가 AI 기반 독서 대화 & 어휘 퀴즈 생성
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleLibrary}
              className="p-2 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
              title="내 서재에 담기/등록 취소"
            >
              <Heart className={`w-5 h-5 ${isSaved ? 'fill-red-400 text-red-400' : ''}`} />
            </button>
            <button
              onClick={handleCloseModal}
              className="p-2 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
              title="닫기 (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content Area */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Section 1: Book Info Top Grid */}
          <div className="grid sm:grid-cols-12 gap-6 items-start">
            
            {/* Book Cover Box */}
            <div className="sm:col-span-4 relative group mx-auto sm:mx-0 max-w-[200px] sm:max-w-none">
              <BookCoverImage
                src={book.coverImage}
                alt={book.title}
                className="w-full h-60 object-cover rounded-2xl shadow-elevated border-2 border-oak/30 group-hover:scale-102 transition-transform duration-300"
              />
              <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-oak-dark font-bold bg-cream-card py-1.5 rounded-xl border border-oak/20">
                <Star className="w-4 h-4 fill-oak text-oak" />
                <span>북핏 평점 {book.rating}</span>
                <span className="text-charcoal-muted font-normal">/ 5.0</span>
              </div>
            </div>

            {/* Book Meta Details */}
            <div className="sm:col-span-8 space-y-3">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${trackBadgeColors[book.trackType]}`}>
                  {trackNames[book.trackType]}
                </span>
                <span className="text-xs font-bold text-oak-dark bg-oak/15 border border-oak/30 px-3 py-1 rounded-full">
                  {book.lexileLevel}
                </span>
                <span className="text-xs font-semibold text-charcoal-muted bg-cream-dark px-2.5 py-1 rounded-md">
                  {book.gradeTag}
                </span>
              </div>

              {/* Title & Author */}
              <div>
                <h2 className="text-2xl font-bold font-serif text-charcoal leading-snug">
                  {book.title}
                </h2>
                <p className="text-xs text-charcoal-muted font-medium mt-1">
                  저자: {book.author} | 출판사: {book.publisher}
                </p>
              </div>

              {/* Summary Box */}
              <div className="p-4 bg-cream-card/70 rounded-2xl border border-oak/20 space-y-1">
                <span className="text-[10px] font-bold text-forest uppercase tracking-wider block">
                  [줄거리 & 서평 요약]
                </span>
                <p className="text-xs sm:text-sm text-charcoal leading-relaxed whitespace-pre-line">
                  {aiGuide?.summary || book.summary || (book as any).description || `${book.title}은(는) 아동의 어휘 확장과 사고력 향상을 돕는 북핏 맞춤 추천 도서입니다.`}
                </p>
              </div>

              {/* Recommend Reason */}
              <div className="p-3 bg-forest/5 rounded-xl border border-forest/15 space-y-1">
                <p className="text-xs font-bold text-forest flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-oak" />
                  북핏 AI 연구소 큐레이션 추천 사유
                </p>
                <p className="text-xs text-charcoal font-medium italic">
                  "{aiGuide?.recommendationReason || aiGuide?.recommendReason || book.recommendReason || `${book.title}은(는) ${book.gradeTag || '해당 학년'} 학생의 문해 지수와 독해력 확장을 위해 엄선된 맞춤 추천 도서입니다.`}"
                </p>
              </div>

            </div>

          </div>

          {/* Section 2: Tabbed AI Section (Parents Guide, Quiz, Vocab) */}
          <div className="space-y-4 pt-4 border-t border-cream-dark">
            
            {/* Tab Controls */}
            <div className="flex border-b border-oak/30 text-xs font-bold">
              <button
                onClick={() => setActiveTab('questions')}
                className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'questions'
                    ? 'border-forest text-forest bg-forest/5'
                    : 'border-transparent text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-oak-dark" />
                AI 부모 독후 대화 가이드 (3단계)
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'quiz'
                    ? 'border-forest text-forest bg-forest/5'
                    : 'border-transparent text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <Brain className="w-4 h-4 text-forest" />
                아이용 어휘 퀴즈
              </button>
              <button
                onClick={() => setActiveTab('vocab')}
                className={`px-4 py-2.5 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'vocab'
                    ? 'border-forest text-forest bg-forest/5'
                    : 'border-transparent text-charcoal-muted hover:text-charcoal'
                }`}
              >
                <BookOpen className="w-4 h-4 text-forest" />
                핵심 어휘 리포트
              </button>
            </div>

            {/* AI Loading State with Skeleton */}
            {isLoadingAI && (
              <div className="py-8 px-6 space-y-4 bg-cream-card rounded-2xl border border-oak/20 animate-pulse">
                <div className="flex items-center justify-center gap-2 text-forest">
                  <Loader2 className="w-6 h-6 animate-spin text-forest" />
                  <span className="text-xs font-bold">
                    AI 전문가가 맞춤 독후 가이드를 생성 중입니다...
                  </span>
                </div>
                <div className="grid sm:grid-cols-3 gap-3 pt-2">
                  <div className="h-24 bg-cream-dark/50 rounded-xl"></div>
                  <div className="h-24 bg-cream-dark/50 rounded-xl"></div>
                  <div className="h-24 bg-cream-dark/50 rounded-xl"></div>
                </div>
              </div>
            )}

            {/* Tab 1: AI 3-Stage Parent Discussion Guide Cards */}
            {!isLoadingAI && activeTab === 'questions' && aiGuide && (
              <div className="space-y-3 pt-1">
                <div className="p-3 bg-oak/10 rounded-xl text-xs text-charcoal-dark font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-oak-dark shrink-0" />
                  <span>이 책을 읽기 전·중·후 세 단계로 나누어 아이의 사고력을 자연스럽게 이끌어주세요.</span>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  {/* Before */}
                  <div
                    onClick={() => handleStatusChange('wantToRead')}
                    className={`p-4 rounded-2xl transition-all space-y-2 border-2 cursor-pointer ${
                      activeGuideStage === 'before'
                        ? 'bg-forest/10 border-forest shadow-md scale-102 ring-2 ring-forest/30'
                        : 'bg-[#FAF5EB] border-oak/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-forest bg-forest/20 px-2.5 py-0.5 rounded-full inline-block">
                        1. 읽기 전 (Before)
                      </span>
                      {activeGuideStage === 'before' && (
                        <span className="text-[10px] font-extrabold text-forest animate-pulse">● 현재 단계</span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal font-medium leading-relaxed italic">
                      "{aiGuide.dialogueGuide?.before || aiGuide.beforeReading?.[0] || `표지와 제목 "${book.title}"을 보았을 때, 어떤 이야기가 펼쳐질지 생각해보자.`}"
                    </p>
                  </div>

                  {/* During */}
                  <div
                    onClick={() => handleStatusChange('reading')}
                    className={`p-4 rounded-2xl transition-all space-y-2 border-2 cursor-pointer ${
                      activeGuideStage === 'during'
                        ? 'bg-oak/20 border-oak-dark shadow-md scale-102 ring-2 ring-oak/40'
                        : 'bg-[#FAF5EB] border-oak/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-oak-dark bg-oak/30 px-2.5 py-0.5 rounded-full inline-block">
                        2. 읽는 중 (During)
                      </span>
                      {activeGuideStage === 'during' && (
                        <span className="text-[10px] font-extrabold text-oak-dark animate-pulse">● 현재 단계</span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal font-medium leading-relaxed italic">
                      "{aiGuide.dialogueGuide?.during || aiGuide.duringReading?.[0] || `주인공이 결정적인 순간에 어떤 선택을 할지 추론해볼까?`}"
                    </p>
                  </div>

                  {/* After */}
                  <div
                    onClick={() => handleStatusChange('completed')}
                    className={`p-4 rounded-2xl transition-all space-y-2 border-2 cursor-pointer ${
                      activeGuideStage === 'after'
                        ? 'bg-charcoal/10 border-charcoal shadow-md scale-102 ring-2 ring-charcoal/20'
                        : 'bg-[#FAF5EB] border-oak/30 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-charcoal bg-charcoal/20 px-2.5 py-0.5 rounded-full inline-block">
                        3. 읽은 후 (After)
                      </span>
                      {activeGuideStage === 'after' && (
                        <span className="text-[10px] font-extrabold text-charcoal animate-pulse">● 현재 단계</span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal font-medium leading-relaxed italic">
                      "{aiGuide.dialogueGuide?.after || aiGuide.afterReading?.[0] || `책을 다 읽고 난 후 기억에 남는 장면이나 내 생각은 무엇이니?`}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: AI Vocabulary Quiz */}
            {!isLoadingAI && activeTab === 'quiz' && aiGuide && (
              <div className="space-y-4 pt-1">
                <div className="p-3 bg-forest/10 rounded-xl text-xs text-forest font-semibold flex items-center gap-2">
                  <Brain className="w-4 h-4 text-forest shrink-0" />
                  <span>이 책에서 추출된 맞춤 어휘 퀴즈 3문항을 풀어보세요!</span>
                </div>

                <div className="space-y-3">
                  {aiGuide.vocabularyQuiz.map((quiz, qIdx) => (
                    <div key={qIdx} className="p-4 bg-cream-card rounded-2xl border border-oak/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-forest bg-forest/15 px-2.5 py-0.5 rounded">
                          어휘 {qIdx + 1}: {quiz.word}
                        </span>
                        <span className="text-[11px] text-charcoal-muted font-medium">{quiz.meaning}</span>
                      </div>
                      <p className="text-xs font-bold text-charcoal mt-1">
                        Q{qIdx + 1}. {quiz.question}
                      </p>

                      {quiz.options && (
                        <div className="grid sm:grid-cols-3 gap-2 pt-2">
                          {quiz.options.map((opt, oIdx) => {
                            const isSelected = selectedQuizAnswers[qIdx] === oIdx;
                            const isCorrect = quiz.answerIndex === oIdx;
                            return (
                              <button
                                key={oIdx}
                                onClick={() => handleQuizSelect(qIdx, oIdx)}
                                className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-left flex items-center justify-between ${
                                  isSelected
                                    ? isCorrect
                                      ? 'bg-forest/20 border-forest text-forest font-bold ring-2 ring-forest/30'
                                      : 'bg-red-100 border-red-400 text-red-600 font-bold'
                                    : 'bg-cream-light border-oak/30 hover:bg-cream'
                                }`}
                              >
                                <span>{oIdx + 1}. {opt}</span>
                                {isSelected && (
                                  <span className="text-[11px] ml-1">
                                    {isCorrect ? '⭕ 정답!' : '❌ 오답'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Vocabulary Key Points */}
            {!isLoadingAI && activeTab === 'vocab' && (
              <div className="space-y-4 pt-1">
                <div className="p-5 bg-cream-card rounded-2xl border border-oak/20 space-y-3">
                  <h4 className="text-xs font-bold text-forest uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-oak" />
                    "{book.title}" 핵심 어휘 지도 리포트
                  </h4>
                  <p className="text-xs text-charcoal leading-relaxed bg-forest/5 p-3.5 rounded-xl border border-forest/10">
                    💡 {aiGuide?.vocabularyReport || `이 책을 통해 문맥 속 핵심 어휘를 파악하고 사고력을 균형 있게 확장할 수 있습니다.`}
                  </p>

                  <div className="grid sm:grid-cols-3 gap-3 pt-2">
                    {aiGuide?.vocabularyQuiz?.map((vItem, vIdx) => (
                      <div key={vIdx} className="p-3.5 bg-cream-light rounded-xl border border-oak/30 space-y-1.5">
                        <span className="text-xs font-bold text-forest bg-forest/15 px-2.5 py-0.5 rounded inline-block">
                          # {vItem.word}
                        </span>
                        <p className="text-xs text-charcoal font-medium leading-normal">
                          {vItem.meaning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-5 bg-cream-card border-t border-cream-dark space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Coupang Partners Base URL Link Button */}
            <button
              onClick={handleCoupangBuy}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#D62828] hover:bg-[#B71C1C] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>쿠팡에서 최저가 구매하기</span>
              <ExternalLink className="w-3.5 h-3.5 text-white/80" />
            </button>

            {/* Right Main Actions by Reading Status */}
            <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
              {isSaved ? (
                <>
                  {currentBookStatus === 'to_read' && (
                    <button
                      onClick={() => handleStatusChange('reading')}
                      className="px-4 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-oak" />
                      <span>📖 읽는 중으로 변경</span>
                    </button>
                  )}

                  {currentBookStatus === 'reading' && (
                    <button
                      onClick={() => setShowQuizModal(true)}
                      className="px-4 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4 text-oak" />
                      <span>🥳 완독 처리 & 퀴즈 검사 받기</span>
                    </button>
                  )}

                  {currentBookStatus === 'completed' && (
                    <button
                      onClick={() => setShowQuizModal(true)}
                      className="px-4 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-oak" />
                      <span>✨ 완독 형성평가 퀴즈 재검사</span>
                    </button>
                  )}

                  <button
                    onClick={handleToggleLibrary}
                    className="px-3.5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
                    title="내 서재에서 제거하기"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-white" />
                    <span>등록 취소</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleToggleLibrary}
                  className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-oak" />
                  <span>🔖 내 서재에 읽을 책으로 등록</span>
                </button>
              )}
            </div>

          </div>

          {/* Mandatory Disclosure Notice */}
          <p className="text-[11px] text-charcoal-muted leading-tight text-center sm:text-left font-light pt-1">
            ※ 이 링크를 통해 구매 시 쿠팡 파트너스 활동의 일환으로 일정액의 수수료를 제공받습니다.
          </p>
        </div>

      </div>

      {/* Mini Quiz Modal for Completion Verification */}
      {showQuizModal && book && (
        <BookQuizModal
          book={book}
          onClose={() => setShowQuizModal(false)}
          onComplete={handleQuizCompleteInModal}
        />
      )}
    </div>
  );
};
