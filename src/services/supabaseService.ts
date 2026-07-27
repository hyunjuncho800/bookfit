import { supabase } from '../lib/supabaseClient';
import type { DiagnosticResultData, MyBookItem, ReadingStatus, Book } from '../types';

export { supabase };

/**
 * Diagnostic Results Database Operations
 */
export async function saveDiagnosticResultToDb(data: DiagnosticResultData): Promise<{ success: boolean; data?: any; error?: any }> {
  try {
    const payload = {
      total_score: data.totalScore,
      percentile_top: data.percentileTop,
      grade_level_name: data.gradeLevelName,
      domain_scores: data.domainScores,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      action_advice: data.actionAdvice,
      prescribed_books: data.prescribedBooks,
      parent_guide: data.parentGuide,
      created_at: new Date().toISOString(),
    };

    const { data: insertedData, error } = await supabase
      .from('diagnostic_results')
      .insert([payload])
      .select();

    if (error) {
      console.warn('Supabase insert diagnostic_results error:', error);
      // Fallback try with camelCase in case table schema uses camelCase
      const fallbackPayload = {
        totalScore: data.totalScore,
        percentileTop: data.percentileTop,
        gradeLevelName: data.gradeLevelName,
        domainScores: data.domainScores,
        strengths: data.strengths,
        weaknesses: data.weaknesses,
        actionAdvice: data.actionAdvice,
        prescribedBooks: data.prescribedBooks,
        parentGuide: data.parentGuide,
        createdAt: new Date().toISOString(),
      };
      const { data: retryData, error: retryError } = await supabase
        .from('diagnostic_results')
        .insert([fallbackPayload])
        .select();

      if (retryError) {
        console.error('Failed to insert diagnostic_results:', retryError);
        return { success: false, error: retryError };
      }
      return { success: true, data: retryData };
    }

    return { success: true, data: insertedData };
  } catch (err) {
    console.error('Error saving diagnostic result:', err);
    return { success: false, error: err };
  }
}

export async function getLatestDiagnosticResultFromDb(): Promise<DiagnosticResultData | null> {
  try {
    const { data, error } = await supabase
      .from('diagnostic_results')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      // Fallback order by createdAt
      const { data: fallbackData } = await supabase
        .from('diagnostic_results')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(1);

      if (fallbackData && fallbackData.length > 0) {
        const item = fallbackData[0];
        return {
          totalScore: item.totalScore || item.total_score || 88,
          percentileTop: item.percentileTop || item.percentile_top || 12,
          gradeLevelName: item.gradeLevelName || item.grade_level_name || '어휘 수준 확장 트랙',
          domainScores: item.domainScores || item.domain_scores || { decoding: 90, vocabulary: 82, comprehension: 88, metacognition: 92 },
          strengths: item.strengths || [],
          weaknesses: item.weaknesses || [],
          actionAdvice: item.actionAdvice || item.action_advice || [],
          prescribedBooks: item.prescribedBooks || item.prescribed_books || [],
          parentGuide: item.parentGuide || item.parent_guide || { beforeReading: [], duringReading: [], afterReading: [], discussionQuestions: [] },
        };
      }
      return null;
    }

    const item = data[0];
    return {
      totalScore: item.total_score ?? item.totalScore ?? 88,
      percentileTop: item.percentile_top ?? item.percentileTop ?? 12,
      gradeLevelName: item.grade_level_name ?? item.gradeLevelName ?? '어휘 수준 확장 트랙',
      domainScores: item.domain_scores ?? item.domainScores ?? { decoding: 90, vocabulary: 82, comprehension: 88, metacognition: 92 },
      strengths: item.strengths ?? item.strengths ?? [],
      weaknesses: item.weaknesses ?? item.weaknesses ?? [],
      actionAdvice: item.action_advice ?? item.actionAdvice ?? [],
      prescribedBooks: item.prescribed_books ?? item.prescribedBooks ?? [],
      parentGuide: item.parent_guide ?? item.parentGuide ?? { beforeReading: [], duringReading: [], afterReading: [], discussionQuestions: [] },
    };
  } catch (err) {
    console.error('Error fetching diagnostic result:', err);
    return null;
  }
}

/**
 * My Library Database Operations
 */
export async function fetchMyLibraryFromDb(): Promise<MyBookItem[]> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    let query = supabase.from('my_library').select('*');
    if (userId) {
      query = query.eq('user_id', userId);
    }

    let { data, error } = await query;

    if (error || !data || data.length === 0) {
      // Fallback query without user_id filter if empty
      const fallback = await supabase.from('my_library').select('*');
      data = fallback.data || [];
    }

    if (!data || data.length === 0) return [];

    return data.map((item: any) => {
      const bookData: Book = item.book || {
        id: item.book_id || item.id || String(Math.random()),
        title: item.title || '제목 없음',
        author: item.author || '저자 미상',
        publisher: item.publisher || '출판사',
        coverImage: item.cover_image || item.cover_url || item.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
        gradeTag: item.grade_tag || item.gradeTag || '전 학년',
        lexileLevel: item.lexile_level || item.lexileLevel || 'Level 1',
        trackType: item.track_type || item.trackType || 'comfort',
        recommendReason: item.recommend_reason || item.recommendReason || '',
        summary: item.summary || '',
        vocabularyPoints: item.vocabulary_points || item.vocabularyPoints || [],
        parentQuestions: item.parent_questions || item.parentQuestions || [],
        rating: item.book_rating || item.rating || 5,
      };

      const rawStatus = String(item.status || 'reading').toLowerCase();
      let normStatus: ReadingStatus = 'reading';
      if (rawStatus.includes('to_read') || rawStatus.includes('wanttoread') || rawStatus.includes('unread')) {
        normStatus = 'wantToRead';
      } else if (rawStatus.includes('complete')) {
        normStatus = 'completed';
      } else {
        normStatus = 'reading';
      }

      return {
        id: String(item.id || item.book_id),
        book: bookData,
        status: normStatus,
        progressPercent: item.progress_percent ?? item.progressPercent ?? (normStatus === 'completed' ? 100 : normStatus === 'reading' ? 50 : 0),
        userRating: item.rating ?? item.user_rating ?? item.userRating ?? 5,
        oneLineReview: item.one_line_review ?? item.oneLineReview ?? '',
        completedAt: item.completed_at ?? item.completedAt,
        newWordsLearned: item.new_words_learned ?? item.newWordsLearned ?? [],
      };
    });
  } catch (err) {
    console.error('Error in fetchMyLibraryFromDb:', err);
    return [];
  }
}

export async function saveOrUpdateLibraryBook(
  item: Book | any,
  status: ReadingStatus = 'wantToRead',
  progressPercent: number = 0,
  oneLineReview?: string,
  rating?: number
): Promise<{ success: boolean; errorMessage?: string; rawError?: any }> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id;

    const bookId = String(item.isbn13 || item.isbn || item.itemId || item.book_id || item.id || Date.now());
    const title = String(item.title || '제목 없음');
    const author = String(item.author || '저자 미상');
    const coverUrl = String(item.cover || item.coverImage || item.cover_url || item.cover_image || item.fullPathCover || '');
    const publisher = String(item.publisher || '');
    const summary = String(item.description || item.summary || '');
    const gradeTag = String(item.gradeTag || item.grade_tag || '');
    const lexileLevel = String(item.lexileLevel || item.lexile_level || '');
    const trackType = String(item.trackType || item.track_type || 'comfort');

    const bookPayload: any = {
      book_id: bookId,
      title: title,
      author: author,
      cover_url: coverUrl,
      cover_image: coverUrl,
      publisher: publisher,
      summary: summary,
      grade_tag: gradeTag,
      lexile_level: lexileLevel,
      track_type: trackType,
      status: status,
      progress_percent: progressPercent,
      one_line_review: oneLineReview || '',
      rating: rating !== undefined ? rating : Number(item.rating) || 5,
    };

    if (userId) {
      bookPayload.user_id = userId;
    }

    // 1차 Upsert 시도: user_id,book_id 우선
    let { error } = await supabase
      .from('my_library')
      .upsert([bookPayload], { onConflict: userId ? 'user_id,book_id' : 'book_id' });

    if (error) {
      console.warn('Primary upsert failed, retrying book_id upsert:', error.message);

      // 2차 시도: book_id 단일 upsert
      const retryUpsert = await supabase
        .from('my_library')
        .upsert([bookPayload], { onConflict: 'book_id' });

      if (retryUpsert.error) {
        console.warn('Secondary upsert failed, retrying direct insert:', retryUpsert.error.message);

        // 3차 시도: direct insert
        const retryInsert = await supabase
          .from('my_library')
          .insert([bookPayload]);

        if (retryInsert.error) {
          console.error('All DB insert/upsert attempts failed:', retryInsert.error.message);
          return {
            success: false,
            errorMessage: `저장 실패 원인: ${retryInsert.error.message}`,
            rawError: retryInsert.error,
          };
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('saveOrUpdateLibraryBook exception:', err);
    return {
      success: false,
      errorMessage: `[Exception] ${err?.message || String(err)}`,
    };
  }
}

export async function updateLibraryBookReviewAndRating(
  bookId: string,
  rating: number,
  oneLineReview: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('my_library')
      .update({
        rating: rating,
        one_line_review: oneLineReview,
      })
      .eq('id', bookId);

    if (error) {
      console.warn('Update snake_case failed, trying camelCase:', error);
      const { error: fallbackError } = await supabase
        .from('my_library')
        .update({
          rating: rating,
          oneLineReview: oneLineReview,
        })
        .eq('id', bookId);

      if (fallbackError) {
        console.error('Failed to update review/rating:', fallbackError);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Error updating review and rating:', err);
    return false;
  }
}

export async function updateLibraryBookStatus(
  bookId: string,
  status: ReadingStatus | string,
  _progressPercent?: number
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    // 오직 status 컬럼만 안전하게 update 전송
    const updatePayload = {
      status,
    };

    // 1차: book_id 및 id 이중 or 조건으로 비동기(await) Update 전송
    let { error } = await supabase
      .from('my_library')
      .update(updatePayload)
      .or(`book_id.eq.${bookId},id.eq.${bookId}`);

    if (error) {
      console.warn('Update with or() failed, trying individual eq():', error);

      // 2차: book_id 개별 Update
      const { error: errBookId } = await supabase
        .from('my_library')
        .update(updatePayload)
        .eq('book_id', bookId);

      if (errBookId) {
        // 3차: id 개별 Update
        const { error: errId } = await supabase
          .from('my_library')
          .update(updatePayload)
          .eq('id', bookId);

        if (errId) {
          const rawMsg = errId.message || errBookId.message || error.message;
          console.error('Failed to update my_library status:', rawMsg);
          return { success: false, errorMessage: `[DB Update Error] ${rawMsg}` };
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Exception in updateLibraryBookStatus:', err);
    return { success: false, errorMessage: `[Exception] ${err?.message || String(err)}` };
  }
}

export async function removeFromMyLibraryDb(bookId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('my_library')
      .delete()
      .eq('id', bookId);

    if (error) {
      console.error('Error deleting from my_library:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error deleting from my_library:', err);
    return false;
  }
}

/**
 * Helper to sanitize book payload strictly according to Supabase DB column types
 */
export const sanitizeBookPayload = (book: any, defaultTrack: string = 'comfort') => {
  const track = String(book.trackType || defaultTrack || 'comfort').trim();
  const stepLevelStr = track === 'comfort' ? 'Step 1. 적정' : track === 'challenge' ? 'Step 2. 도전' : 'Step 3. 보완';
  const isbnStr = String(book.isbn13 || book.isbn || book.id || Date.now()).trim();
  const titleStr = String(book.title || '제목 없음').trim();
  const authorStr = String(book.author || '저자 미상').trim();
  const publisherStr = String(book.publisher || '출판사 미상').trim();
  const coverUrl = String(book.coverImage || book.cover || book.fullPathCover || '').trim();
  const descStr = String(book.summary || book.description || book.title || '').trim();
  const priceNum = Number(book.priceSales || book.price) || 0;
  const pubDateStr = String(book.pubDate || new Date().toISOString());

  return {
    id: String(book.id || isbnStr || Math.random().toString()).trim(),
    isbn: isbnStr,
    title: titleStr,
    author: authorStr,
    publisher: publisherStr,
    cover_image: coverUrl,
    cover_url: coverUrl,
    image_url: coverUrl,
    description: descStr,
    summary: descStr,
    price: priceNum,
    pub_date: pubDateStr,
    grade_tag: String(book.gradeTag || '초등 전학년').trim(),
    lexile_level: String(book.lexileLevel || '어휘 L3 (맞춤)').trim(),
    track_type: track,
    level: track,
    step_type: track,
    step_level: stepLevelStr,
    recommend_reason: String(book.recommendReason || '북핏 추천 도서').trim(),
    vocabulary_points: Array.isArray(book.vocabularyPoints) ? book.vocabularyPoints : ['어휘력', '독해력'],
    parent_questions: Array.isArray(book.parentQuestions) ? book.parentQuestions : ['책의 핵심 내용을 나눠보세요.'],
    rating: Number(book.rating) || 4.9,
  };
};


/**
 * Curation Bookshelf Database Operations (`my_library` table)
 */
export async function saveCuratedBookToDb(
  book: Book,
  selectedTrack?: 'comfort' | 'challenge' | 'supplement'
): Promise<{ success: boolean; errorMessage?: string }> {
  try {
    const trackType = selectedTrack || book.trackType || 'comfort';

    // Save to my_library
    const res = await saveOrUpdateLibraryBook(
      { ...book, trackType },
      'wantToRead'
    );

    if (!res.success) {
      return {
        success: false,
        errorMessage: res.errorMessage || 'my_library 테이블 저장 실패'
      };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving curated book to my_library DB:', err);
    return {
      success: false,
      errorMessage: `[Exception] ${err?.message || String(err)}`
    };
  }
}

export async function fetchCuratedBooksFromDb(): Promise<Book[]> {
  const mergedBooks: Book[] = [];

  // Fetch from `my_library` table
  try {
    const { data: libraryData, error } = await supabase
      .from('my_library')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Querying public.my_library with created_at order failed, retrying without order:', error);
      const retry = await supabase.from('my_library').select('*');
      if (retry.data) {
        return parseLibraryDataToBooks(retry.data);
      }
    }

    if (libraryData && Array.isArray(libraryData)) {
      return parseLibraryDataToBooks(libraryData);
    }
  } catch (err) {
    console.warn('Querying public.my_library table failed:', err);
  }

  return mergedBooks;
}

function parseLibraryDataToBooks(libraryData: any[]): Book[] {
  return libraryData.map((item: any) => {
    const nested = item.book || {};
    const track = (item.track_type || item.trackType || item.level || item.step_type || nested.trackType || 'comfort') as
      | 'comfort'
      | 'challenge'
      | 'supplement';

    return {
      id: String(item.id || item.book_id || item.isbn || nested.id || Math.random().toString()),
      title: item.title || nested.title || '제목 없음',
      author: item.author || nested.author || '저자 미상',
      publisher: item.publisher || nested.publisher || '출판사',
      coverImage:
        item.cover_url ||
        item.cover_image ||
        item.image_url ||
        item.coverImage ||
        nested.coverImage ||
        'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg',
      gradeTag: item.grade_tag || item.gradeTag || item.theme_keyword || nested.gradeTag || '전 학년',
      lexileLevel: item.lexile_level || item.lexileLevel || item.step_level || nested.lexileLevel || '어휘 L3 (맞춤)',
      trackType: track,
      recommendReason: item.recommend_reason || item.recommendReason || nested.recommendReason || '북핏 연구소 큐레이션 추천 도서',
      summary: item.summary || item.description || nested.summary || '어린이 문해력 성장에 도움을 주는 도서입니다.',
      vocabularyPoints: item.vocabulary_points || item.vocabularyPoints || nested.vocabularyPoints || ['어휘력', '독해력'],
      parentQuestions: item.parent_questions || item.parentQuestions || nested.parentQuestions || ['이 책을 읽고 어떤 느낌이 들었나요?'],
      rating: Number(item.rating || item.user_rating || nested.rating) || 4.9,
    };
  });
}

/**
 * Batch Insert Curated Books into Supabase `my_library` DB
 */
export async function saveBatchCuratedBooksToDb(
  books: Book[],
  defaultTrack: 'comfort' | 'challenge' | 'supplement' = 'comfort'
): Promise<{ success: boolean; count: number; errorMessage?: string }> {
  if (!books || books.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    let successCount = 0;
    const errorLogs: string[] = [];

    for (const book of books) {
      const res = await saveOrUpdateLibraryBook(
        { ...book, trackType: book.trackType || defaultTrack },
        'wantToRead'
      );
      if (res.success) {
        successCount++;
      } else if (res.errorMessage) {
        errorLogs.push(`[${book.title}] ${res.errorMessage}`);
      }
    }

    if (successCount === 0 && errorLogs.length > 0) {
      return {
        success: false,
        count: 0,
        errorMessage: `총 ${books.length}권 전체 저장 실패:\n` + errorLogs.slice(0, 3).join('\n')
      };
    }

    return {
      success: true,
      count: successCount,
      errorMessage: errorLogs.length > 0 ? `일부 도서 저장 실패:\n` + errorLogs.slice(0, 2).join('\n') : undefined
    };
  } catch (err: any) {
    console.error('Exception during batch inserting books to my_library DB:', err);
    return {
      success: false,
      count: 0,
      errorMessage: `[Exception] ${err?.message || String(err)}`
    };
  }
}

/**
 * Delete Curated Book from Supabase `my_library` DB (Admin Only)
 */
export async function deleteBookFromDb(
  bookId: string,
  isAdmin: boolean = true
): Promise<{ success: boolean; errorMessage?: string }> {
  // RLS / API 삭제 권한 안전장치: 일반 유저인 경우 실행하지 않고 즉시 차단
  if (!isAdmin) {
    return {
      success: false,
      errorMessage: '삭제 권한이 없습니다. 관리자(Admin) 권한이 필요합니다.',
    };
  }

  try {
    // 1차: book_id 및 id 이중 or 조건으로 비동기(await) Delete 전송
    let { error } = await supabase
      .from('my_library')
      .delete()
      .or(`book_id.eq.${bookId},id.eq.${bookId}`);

    if (error) {
      console.warn('Delete with or() failed, trying individual eq():', error);

      // 2차: book_id 개별 Delete
      const { error: errBookId } = await supabase
        .from('my_library')
        .delete()
        .eq('book_id', bookId);

      if (errBookId) {
        // 3차: id 개별 Delete
        const { error: errId } = await supabase
          .from('my_library')
          .delete()
          .eq('id', bookId);

        if (errId) {
          const rawMsg = errId.message || errBookId.message || error.message;
          console.error('Failed to delete book from my_library:', rawMsg);
          return { success: false, errorMessage: `[Supabase Delete Error] ${rawMsg}` };
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    const rawMsg = err?.message || JSON.stringify(err);
    return {
      success: false,
      errorMessage: `[Exception] ${rawMsg}`,
    };
  }
}

/**
 * Save / Update User Profile Information
 */
export async function saveUserProfile(
  userId: string,
  profile: { parent_name: string; child_name: string; child_grade: string }
): Promise<boolean> {
  try {
    const payload = {
      id: userId,
      user_id: userId,
      parent_name: profile.parent_name,
      child_name: profile.child_name,
      child_grade: profile.child_grade,
      updated_at: new Date().toISOString(),
    };
    const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' as any });
    if (error) {
      console.warn('Profiles upsert warning:', error.message);
    }
    return true;
  } catch (e) {
    console.error('saveUserProfile exception:', e);
    return false;
  }
}

/**
 * Check if the logged-in user has 'admin' role
 */
export async function checkIsAdmin(): Promise<boolean> {
  try {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData?.user;
    if (!user) return false;

    // 1. Check user metadata or app metadata
    if (user.app_metadata?.role === 'admin' || user.user_metadata?.role === 'admin') {
      return true;
    }

    // 2. Admin email whitelist
    if (user.email && (user.email.includes('admin') || user.email.includes('hyunjuncho800'))) {
      return true;
    }

    // 3. Query profiles table for role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    return profile?.role === 'admin';
  } catch (e) {
    console.error('Error in checkIsAdmin:', e);
    return false;
  }
}
