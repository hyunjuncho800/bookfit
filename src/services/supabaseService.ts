import { supabase } from '../lib/supabaseClient';
import type { DiagnosticResultData, MyBookItem, ReadingStatus, Book } from '../types';

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
    const { data, error } = await supabase
      .from('my_library')
      .select('*');

    if (error) {
      console.error('Error fetching my_library:', error);
      return [];
    }

    if (!data) return [];

    return data.map((item: any) => {
      const bookData: Book = item.book || {
        id: item.book_id || item.id || String(Math.random()),
        title: item.title || '제목 없음',
        author: item.author || '저자 미상',
        publisher: item.publisher || '출판사',
        coverImage: item.cover_image || item.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400',
        gradeTag: item.grade_tag || item.gradeTag || '전 학년',
        lexileLevel: item.lexile_level || item.lexileLevel || 'Level 1',
        trackType: item.track_type || item.trackType || 'comfort',
        recommendReason: item.recommend_reason || item.recommendReason || '',
        summary: item.summary || '',
        vocabularyPoints: item.vocabulary_points || item.vocabularyPoints || [],
        parentQuestions: item.parent_questions || item.parentQuestions || [],
        rating: item.book_rating || item.rating || 5,
      };

      return {
        id: String(item.id),
        book: bookData,
        status: (item.status as ReadingStatus) || 'wantToRead',
        progressPercent: item.progress_percent ?? item.progressPercent ?? 0,
        userRating: item.rating ?? item.user_rating ?? item.userRating ?? 0,
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
  book: Book | any,
  status: ReadingStatus = 'wantToRead',
  progressPercent: number = 0,
  oneLineReview?: string,
  rating?: number
): Promise<{ success: boolean; errorMessage?: string; errorDetails?: any }> {
  try {
    // 1:1 데이터 매핑 및 Sanitization (알라딘 응답 객체 대응)
    const bookIdStr = String(book.isbn13 || book.isbn || book.book_id || book.itemId || book.id || Date.now());
    const titleStr = String(book.title || '제목 없음');
    const authorStr = String(book.author || '저자 미상');
    const publisherStr = String(book.publisher || '');
    const coverUrlStr = String(book.coverImage || book.cover_url || book.cover_image || book.cover || book.fullPathCover || '');
    const summaryStr = String(book.summary || book.description || '');
    const gradeTagStr = String(book.gradeTag || book.grade_tag || '전 학년');
    const lexileLevelStr = String(book.lexileLevel || book.lexile_level || '어휘 L3 (맞춤)');
    const trackTypeStr = String(book.trackType || book.track_type || 'comfort');

    const payload: any = {
      id: bookIdStr,
      book_id: bookIdStr,
      title: titleStr,
      author: authorStr,
      publisher: publisherStr,
      cover_url: coverUrlStr,
      cover_image: coverUrlStr,
      summary: summaryStr,
      grade_tag: gradeTagStr,
      lexile_level: lexileLevelStr,
      track_type: trackTypeStr,
      status: status,
      progress_percent: progressPercent,
      one_line_review: oneLineReview || '',
      rating: rating !== undefined ? rating : Number(book.rating) || 5,
      updated_at: new Date().toISOString(),
    };

    // 1차 Upsert 시도: onConflict 'book_id'
    let { error } = await supabase
      .from('my_library')
      .upsert([payload], { onConflict: 'book_id', ignoreDuplicates: false });

    if (error) {
      console.warn('Upsert with onConflict: book_id failed, trying onConflict: id:', error);
      // 2차 Upsert 시도: onConflict 'id'
      const { error: idError } = await supabase
        .from('my_library')
        .upsert([payload], { onConflict: 'id', ignoreDuplicates: false });

      if (idError) {
        console.warn('Upsert with onConflict: id failed, trying minimal payload:', idError);
        // 3차 Minimal Payload 시도 (필수 컬럼만)
        const minimalPayload = {
          book_id: bookIdStr,
          title: titleStr,
          author: authorStr,
          cover_url: coverUrlStr,
          updated_at: new Date().toISOString(),
        };

        const { error: minError } = await supabase
          .from('my_library')
          .upsert([minimalPayload]);

        if (minError) {
          const detailMsg = `[DB Error] ${minError.message} (Code: ${minError.code || 'N/A'}, Details: ${minError.details || minError.hint || 'N/A'})`;
          console.error('Final my_library insert failed:', detailMsg, minError);
          return {
            success: false,
            errorMessage: detailMsg,
            errorDetails: minError,
          };
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    const detailMsg = `[Exception] ${err?.message || String(err)}`;
    console.error('Error saving library book:', err);
    return {
      success: false,
      errorMessage: detailMsg,
      errorDetails: err,
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
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookId);

    if (error) {
      console.warn('Update snake_case failed, trying camelCase:', error);
      const { error: fallbackError } = await supabase
        .from('my_library')
        .update({
          rating: rating,
          oneLineReview: oneLineReview,
          updatedAt: new Date().toISOString(),
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
  status: ReadingStatus,
  progressPercent?: number
): Promise<boolean> {
  try {
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (progressPercent !== undefined) {
      updateData.progress_percent = progressPercent;
    }
    if (status === 'completed') {
      updateData.progress_percent = 100;
      updateData.completed_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from('my_library')
      .update(updateData)
      .eq('id', bookId);

    if (error) {
      const fallbackData: any = {
        status,
        updatedAt: new Date().toISOString(),
      };
      if (progressPercent !== undefined) fallbackData.progressPercent = progressPercent;
      if (status === 'completed') {
        fallbackData.progressPercent = 100;
        fallbackData.completedAt = new Date().toISOString();
      }
      await supabase.from('my_library').update(fallbackData).eq('id', bookId);
    }

    return true;
  } catch (err) {
    console.error('Error updating book status:', err);
    return false;
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
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
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
