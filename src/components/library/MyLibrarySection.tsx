import React, { useState, useEffect } from 'react';
import type { MyBookItem, ReadingStatus, Book, UserGamificationProfile } from '../../types';
import { MOCK_BOOKS } from '../../data/mockData';
import { Award, Star, Sparkles, CheckCircle2, Edit3, X, Zap, Trophy, Smile, MessageCircle, BarChart3 } from 'lucide-react';
import { BookCoverImage } from '../common/BookCoverImage';
import { ParentReportModal } from '../parent/ParentReportModal';
import {
  fetchMyLibraryFromDb,
  saveOrUpdateLibraryBook,
  updateLibraryBookStatus,
  updateLibraryBookReviewAndRating,
} from '../../services/supabaseService';

interface MyLibrarySectionProps {
  onSelectBook: (book: Book) => void;
  onOpenDiagnosis: () => void;
}

// Initial Mock User Library Items
const INITIAL_MY_BOOKS: MyBookItem[] = [
  {
    id: 'my_1',
    book: MOCK_BOOKS[0],
    status: 'completed',
    progressPercent: 100,
    userRating: 5,
    newWordsLearned: ['시치미', '용의주도'],
    oneLineReview: '만복이가 착한 말을 할 때 찹쌀떡 맛이 느껴지는 것 같았어요!',
    completedAt: '2026-07-20'
  },
  {
    id: 'my_2',
    book: MOCK_BOOKS[2],
    status: 'reading',
    progressPercent: 60,
    userRating: 4,
    newWordsLearned: ['뿌듯하다', '벅차다'],
    oneLineReview: '내 마음속 기분을 여러 가지 단어로 표현하니까 재밌어요.'
  },
  {
    id: 'my_3',
    book: MOCK_BOOKS[3],
    status: 'reading',
    progressPercent: 40,
  },
  {
    id: 'my_4',
    book: MOCK_BOOKS[1],
    status: 'wantToRead',
    progressPercent: 0,
  },
  {
    id: 'my_5',
    book: MOCK_BOOKS[5],
    status: 'wantToRead',
    progressPercent: 0,
  },
  {
    id: 'my_6',
    book: MOCK_BOOKS[4],
    status: 'completed',
    progressPercent: 100,
    userRating: 5,
    newWordsLearned: ['공리주의', '딜레마'],
    oneLineReview: '어렵지만 부모님과 이야기 나누니까 생각이 넓어졌어요!',
    completedAt: '2026-07-15'
  }
];

const INITIAL_PROFILE: UserGamificationProfile = {
  childName: '이지호',
  levelBadgeTitle: '어휘 Level 3 - 꼬마 탐정 🕵️‍♂️',
  currentExp: 470,
  nextLevelExp: 500,
  completedCountThisMonth: 8,
  earnedBadges: [
    { id: 'b1', icon: '🏆', name: '다독왕', description: '한 달 5권 이상 완독 달성' },
    { id: 'b2', icon: '📚', name: '어휘 수집가', description: '새로운 낱말 20개 습득' },
    { id: 'b3', icon: '💡', name: '사고력 대장', description: '추론 질문 10회 답변 완료' },
    { id: 'b4', icon: '⭐', name: '독서 탐정', description: '3-Step 큐레이션 서가 도서 완독' }
  ]
};

export const MyLibrarySection: React.FC<MyLibrarySectionProps> = ({ onSelectBook, onOpenDiagnosis }) => {
  const [activeTab, setActiveTab] = useState<ReadingStatus>('reading');
  const [myBooks, setMyBooks] = useState<MyBookItem[]>(INITIAL_MY_BOOKS);
  const [profile, setProfile] = useState<UserGamificationProfile>(INITIAL_PROFILE);
  const [editingBookItem, setEditingBookItem] = useState<MyBookItem | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isParentReportOpen, setIsParentReportOpen] = useState<boolean>(false);

  // Load My Library from Supabase DB on mount
  useEffect(() => {
    fetchMyLibraryFromDb().then((dbBooks) => {
      if (dbBooks && dbBooks.length > 0) {
        setMyBooks(dbBooks);
      } else {
        // Seed initial books to DB if empty
        INITIAL_MY_BOOKS.forEach((item) => {
          saveOrUpdateLibraryBook(
            item.book,
            item.status,
            item.progressPercent,
            item.oneLineReview,
            item.userRating
          );
        });
      }
    });
  }, []);

  // Filter books by active status tab
  const filteredMyBooks = myBooks.filter((item) => item.status === activeTab);

  // Handle Complete Book Action with Celebration
  const handleCompleteBook = async (item: MyBookItem, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Optimistic UI Update
    setMyBooks((prev) =>
      prev.map((b) =>
        b.id === item.id
          ? { ...b, status: 'completed', progressPercent: 100, completedAt: new Date().toISOString().split('T')[0] }
          : b
      )
    );

    // Save/Update in Supabase DB
    await updateLibraryBookStatus(item.book.id || item.id, 'completed', 100);

    // Update Profile EXP
    setProfile((prev) => ({
      ...prev,
      currentExp: Math.min(prev.nextLevelExp, prev.currentExp + 30),
      completedCountThisMonth: prev.completedCountThisMonth + 1,
    }));

    // Trigger Celebration Banner
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3500);
  };

  // Save Review Modal Form & Sync to Supabase
  const handleSaveReview = async (rating: number, review: string, words: string[]) => {
    if (!editingBookItem) return;

    const targetBookId = editingBookItem.book.id || editingBookItem.id;

    // Optimistic UI Update
    setMyBooks((prev) =>
      prev.map((b) =>
        b.id === editingBookItem.id
          ? {
              ...b,
              userRating: rating,
              oneLineReview: review,
              newWordsLearned: words,
              status: 'completed',
              progressPercent: 100,
            }
          : b
      )
    );

    // Update rating and one_line_review in Supabase DB
    await updateLibraryBookReviewAndRating(targetBookId, rating, review);
    await saveOrUpdateLibraryBook(editingBookItem.book, 'completed', 100, review, rating);

    setEditingBookItem(null);
  };

  return (
    <section id="my-library" className="py-16 bg-cream border-y border-[#EAE3D2] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Celebration Toast Modal Banner */}
        {showCelebration && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-forest text-white px-6 py-4 rounded-2xl shadow-elevated border-2 border-oak flex items-center gap-3 animate-bounce">
            <Trophy className="w-8 h-8 text-oak" />
            <div>
              <p className="font-bold text-sm font-serif">🎉 완독을 축하합니다!</p>
              <p className="text-xs text-cream-card/90">어휘 경험치 +30 EXP 획득! 레벨업이 얼마 남지 않았어요.</p>
            </div>
          </div>
        )}

        {/* 1. Child Literacy Profile & Gamification Banner */}
        <div className="bg-forest text-white rounded-3xl p-6 sm:p-8 shadow-elevated border border-oak/30 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-oak/10 rounded-full blur-2xl pointer-events-none" />

          <div className="grid md:grid-cols-12 gap-6 items-center relative z-10">
            
            {/* Profile Left */}
            <div className="md:col-span-6 flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-oak text-forest flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-cream-light">
                  지호
                </div>
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-forest-light border-2 border-white flex items-center justify-center text-xs">
                  ✨
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-oak/20 border border-oak/40 text-oak text-xs font-bold">
                  <Award className="w-3.5 h-3.5" />
                  {profile.levelBadgeTitle}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                  {profile.childName}의 비밀 서재
                </h2>
                <p className="text-xs text-cream-card/80">
                  북핏 정밀 맞춤 서가에서 차곡차곡 쌓여가는 독서 성장의 기록입니다.
                </p>
              </div>
            </div>

            {/* Profile Right: Gamification Progress & Badges */}
            <div className="md:col-span-6 bg-forest-dark/80 rounded-2xl p-5 border border-oak/20 space-y-3">
              <div className="flex justify-between items-baseline text-xs font-semibold">
                <span className="text-cream-light flex items-center gap-1">
                  <Zap className="w-4 h-4 text-oak" />
                  이번 달 독서 성취도
                </span>
                <span className="text-oak font-bold text-sm">
                  {profile.completedCountThisMonth}권 완독 완료! 📖
                </span>
              </div>

              {/* Exp Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-cream-card/80">
                  <span>어휘 경험치 ({profile.currentExp} / {profile.nextLevelExp} EXP)</span>
                  <span className="text-oak font-bold">
                    다음 레벨까지 {profile.nextLevelExp - profile.currentExp}개 남음!
                  </span>
                </div>
                <div className="w-full bg-forest h-2.5 rounded-full overflow-hidden border border-oak/20">
                  <div
                    className="bg-gradient-to-r from-oak-light to-oak h-full rounded-full transition-all duration-500"
                    style={{ width: `${(profile.currentExp / profile.nextLevelExp) * 100}%` }}
                  />
                </div>
              </div>

              {/* Earned Badges Mini List */}
              <div className="pt-1 flex items-center justify-between gap-2 border-t border-forest-light/30 text-xs">
                <span className="text-cream-card/70 text-[11px]">획득한 뱃지:</span>
                <div className="flex items-center gap-2">
                  {profile.earnedBadges.map((badge) => (
                    <div
                      key={badge.id}
                      title={`${badge.name}: ${badge.description}`}
                      className="px-2 py-1 bg-forest/40 rounded-lg border border-oak/30 flex items-center gap-1 text-[11px] font-bold text-cream-light hover:scale-105 transition-transform cursor-pointer"
                    >
                      <span>{badge.icon}</span>
                      <span>{badge.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* 2. Library Shelf Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream-dark pb-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
            <button
              onClick={() => setActiveTab('reading')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'reading'
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-cream-light text-charcoal hover:bg-cream-card border border-oak/20'
              }`}
            >
              📖 읽는 중 ({myBooks.filter((b) => b.status === 'reading').length})
            </button>
            <button
              onClick={() => setActiveTab('wantToRead')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'wantToRead'
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-cream-light text-charcoal hover:bg-cream-card border border-oak/20'
              }`}
            >
              📌 읽을 책 ({myBooks.filter((b) => b.status === 'wantToRead').length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2.5 rounded-xl transition-all ${
                activeTab === 'completed'
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-cream-light text-charcoal hover:bg-cream-card border border-oak/20'
              }`}
            >
              🎉 완독한 책 ({myBooks.filter((b) => b.status === 'completed').length})
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsParentReportOpen(true)}
              className="px-4 py-2 bg-forest text-white hover:bg-forest-dark text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 border border-oak/30"
            >
              <BarChart3 className="w-4 h-4 text-oak" />
              <span>부모 전용 성장 리포트 📊</span>
            </button>

            <button
              onClick={onOpenDiagnosis}
              className="self-start sm:self-auto px-4 py-2 bg-oak/20 text-forest-dark hover:bg-oak/30 text-xs font-bold rounded-xl border border-oak/30 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-oak-dark" />
              <span>새 맞춤 도서 서가에 추가하기</span>
            </button>
          </div>
        </div>

        {/* 3. Wood Shelf Book Grid */}
        <div className="relative pt-4 pb-8 space-y-12">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {filteredMyBooks.map((item) => {
              const book = item.book;
              return (
                <div
                  key={item.id}
                  onClick={() => onSelectBook(book)}
                  className="group relative bg-cream-light border border-oak/30 hover:border-forest/60 rounded-2xl p-5 shadow-book hover:shadow-elevated transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    
                    {/* Top Status Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-oak-dark bg-oak/15 px-2.5 py-0.5 rounded">
                        {book.lexileLevel}
                      </span>

                      {item.status === 'completed' && (
                        <span className="text-[10px] font-bold text-forest bg-forest/15 px-2.5 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-forest" />
                          완독 100%
                        </span>
                      )}

                      {item.status === 'reading' && (
                        <span className="text-[10px] font-bold text-oak-dark bg-oak/20 px-2.5 py-0.5 rounded">
                          읽는 중 ({item.progressPercent}%)
                        </span>
                      )}

                      {item.status === 'wantToRead' && (
                        <span className="text-[10px] font-bold text-charcoal-muted bg-cream-dark px-2.5 py-0.5 rounded">
                          읽을 책
                        </span>
                      )}
                    </div>

                    {/* Book Cover Image & Meta */}
                    <div className="grid grid-cols-12 gap-4 items-start">
                      <div className="col-span-5 relative">
                        <BookCoverImage
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-36 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300 border border-oak/20"
                        />
                      </div>

                      <div className="col-span-7 space-y-1.5">
                        <h3 className="text-base font-bold font-serif text-charcoal group-hover:text-forest transition-colors line-clamp-1">
                          {book.title}
                        </h3>
                        <p className="text-[11px] text-charcoal-muted">
                          {book.author} 저
                        </p>

                        {/* Rating if completed */}
                        {item.userRating && (
                          <div className="flex items-center gap-1 text-xs text-oak-dark font-bold">
                            <div className="flex text-oak">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < (item.userRating || 0)
                                      ? 'fill-oak text-oak'
                                      : 'text-cream-dark fill-cream-dark'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Review Snippet or New Words */}
                    {item.oneLineReview && (
                      <div className="p-3 bg-cream-card rounded-xl border border-oak/20 space-y-1">
                        <p className="text-[11px] font-bold text-forest flex items-center gap-1">
                          <MessageCircle className="w-3.5 h-3.5 text-oak" />
                          아이가 남긴 한 줄 독후감
                        </p>
                        <p className="text-xs text-charcoal italic leading-snug line-clamp-2">
                          "{item.oneLineReview}"
                        </p>
                      </div>
                    )}

                  </div>

                  {/* Bottom Actions */}
                  <div className="mt-4 pt-3 border-t border-cream-dark flex items-center justify-between text-xs">
                    {item.status !== 'completed' ? (
                      <button
                        onClick={(e) => handleCompleteBook(item, e)}
                        className="w-full py-2 bg-forest hover:bg-forest-dark text-white font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-oak" />
                        <span>완독 처리 & 경험치 받기</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingBookItem(item);
                        }}
                        className="w-full py-2 bg-cream-card hover:bg-cream-dark text-forest font-bold rounded-xl border border-oak/30 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-oak-dark" />
                        <span>한 줄 독후감 작성 / 수정</span>
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

          {/* Wooden Shelf Bar Visual */}
          <div className="w-full h-4 wood-shelf rounded-xl shadow-md" />

        </div>

      </div>

      {/* 4. Child Review & Rating Mini Modal */}
      {editingBookItem && (
        <ReviewModal
          item={editingBookItem}
          onClose={() => setEditingBookItem(null)}
          onSave={handleSaveReview}
        />
      )}

      {/* 5. Parent Literacy Growth Report Modal */}
      <ParentReportModal
        isOpen={isParentReportOpen}
        onClose={() => setIsParentReportOpen(false)}
        childName={profile.childName}
        levelBadgeTitle={profile.levelBadgeTitle}
      />

    </section>
  );
};

// Child Review Form Modal Sub-component
interface ReviewModalProps {
  item: MyBookItem;
  onClose: () => void;
  onSave: (rating: number, review: string, words: string[]) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ item, onClose, onSave }) => {
  const [rating, setRating] = useState<number>(item.userRating || 5);
  const [review, setReview] = useState<string>(item.oneLineReview || '');
  const [wordInput, setWordInput] = useState<string>('');
  const [words, setWords] = useState<string[]>(item.newWordsLearned || item.book.vocabularyPoints || []);

  const handleAddWord = () => {
    if (wordInput.trim() && !words.includes(wordInput.trim())) {
      setWords([...words, wordInput.trim()]);
      setWordInput('');
    }
  };

  const handleRemoveWord = (w: string) => {
    setWords(words.filter((item) => item !== w));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated p-6 space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-cream-dark pb-3">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-forest text-oak flex items-center justify-center font-bold">
              <Smile className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-base font-bold font-serif text-charcoal">
                아동 한 줄 독후감 & 별점 작성
              </h3>
              <p className="text-xs text-charcoal-muted">[{item.book.title}] 독서 기록</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-charcoal-muted hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Star Rating Select */}
        <div className="space-y-2 text-center py-2 bg-cream-card rounded-2xl border border-oak/20">
          <span className="text-xs font-bold text-charcoal">이 책은 얼마나 재미있었나요?</span>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="p-1 transition-transform hover:scale-125"
              >
                <Star
                  className={`w-7 h-7 ${
                    star <= rating ? 'fill-oak text-oak' : 'text-cream-dark fill-cream-dark'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* New Vocabulary Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-forest block">
            이 책에서 새로 배운 낱말 (새로운 어휘 획득!)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={wordInput}
              onChange={(e) => setWordInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddWord())}
              placeholder="단어를 입력 후 추가를 눌러보세요..."
              className="flex-1 px-3 py-2 bg-cream border border-oak/30 rounded-xl text-xs text-charcoal focus:outline-none focus:border-forest"
            />
            <button
              type="button"
              onClick={handleAddWord}
              className="px-4 py-2 bg-forest text-white text-xs font-bold rounded-xl"
            >
              추가
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {words.map((w) => (
              <span
                key={w}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-forest/15 text-forest border border-forest/30 rounded-lg text-xs font-semibold"
              >
                #{w}
                <button type="button" onClick={() => handleRemoveWord(w)}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* One Line Review Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-charcoal block">
            가장 기억에 남는 장면이나 느낌 (한 줄 독후감)
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            rows={3}
            placeholder="예: 주인공이 용기를 내서 문제를 해결하는 장면이 가장 멋졌어요!"
            className="w-full p-3 bg-cream border border-oak/30 rounded-xl text-xs text-charcoal focus:outline-none focus:border-forest resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-cream-dark">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-charcoal-muted hover:text-charcoal"
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => onSave(rating, review, words)}
            className="px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md"
          >
            기록 저장하기
          </button>
        </div>

      </div>
    </div>
  );
};
