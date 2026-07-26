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
  book: Book,
  status: ReadingStatus,
  progressPercent: number = 0,
  oneLineReview?: string,
  rating?: number
): Promise<boolean> {
  try {
    const payload = {
      id: book.id,
      book_id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cover_image: book.coverImage,
      grade_tag: book.gradeTag,
      lexile_level: book.lexileLevel,
      track_type: book.trackType,
      status: status,
      progress_percent: progressPercent,
      one_line_review: oneLineReview || '',
      rating: rating !== undefined ? rating : book.rating || 5,
      book: book,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('my_library')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Upsert snake_case failed, trying fallback:', error);
      const fallbackPayload = {
        id: book.id,
        bookId: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        coverImage: book.coverImage,
        status: status,
        progressPercent: progressPercent,
        oneLineReview: oneLineReview || '',
        rating: rating !== undefined ? rating : book.rating || 5,
        book: book,
        updatedAt: new Date().toISOString(),
      };
      const { error: fallbackError } = await supabase
        .from('my_library')
        .upsert(fallbackPayload, { onConflict: 'id' });

      if (fallbackError) {
        console.error('Failed to upsert my_library:', fallbackError);
        return false;
      }
    }

    return true;
  } catch (err) {
    console.error('Error saving library book:', err);
    return false;
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
 * Curation Bookshelf Database Operations (`books` table)
 */
export async function saveCuratedBookToDb(
  book: Book,
  selectedTrack?: 'comfort' | 'challenge' | 'supplement'
): Promise<boolean> {
  try {
    const trackType = selectedTrack || book.trackType || 'comfort';
    const payload = {
      id: book.id,
      title: book.title,
      author: book.author,
      publisher: book.publisher,
      cover_image: book.coverImage,
      grade_tag: book.gradeTag,
      lexile_level: book.lexileLevel,
      track_type: trackType,
      recommend_reason: book.recommendReason,
      summary: book.summary,
      vocabulary_points: book.vocabularyPoints,
      parent_questions: book.parentQuestions,
      rating: book.rating || 4.9,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('books').upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Upsert to books table failed, trying fallback payload:', error);
      const fallbackPayload = {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        coverImage: book.coverImage,
        gradeTag: book.gradeTag,
        lexileLevel: book.lexileLevel,
        trackType: trackType,
        recommendReason: book.recommendReason,
        summary: book.summary,
        vocabularyPoints: book.vocabularyPoints,
        parentQuestions: book.parentQuestions,
        rating: book.rating || 4.9,
        updatedAt: new Date().toISOString(),
      };
      const { error: fallbackError } = await supabase.from('books').upsert(fallbackPayload, { onConflict: 'id' });
      if (fallbackError) {
        console.error('Failed to save curated book to DB:', fallbackError);
        return false;
      }
    }

    // Also auto-add to my_library as curated catalog fallback
    await saveOrUpdateLibraryBook(
      { ...book, trackType },
      'wantToRead'
    );

    return true;
  } catch (err) {
    console.error('Error saving curated book to DB:', err);
    return false;
  }
}

export async function fetchCuratedBooksFromDb(): Promise<Book[]> {
  try {
    const { data, error } = await supabase.from('books').select('*').order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }

    return data.map((item: any) => ({
      id: String(item.id),
      title: item.title || '제목 없음',
      author: item.author || '저자 미상',
      publisher: item.publisher || '출판사',
      coverImage: item.cover_image || item.coverImage || 'https://image.aladin.co.kr/product/572/93/cover500/8949161358_1.jpg',
      gradeTag: item.grade_tag || item.gradeTag || '전 학년',
      lexileLevel: item.lexile_level || item.lexileLevel || '어휘 L3 (맞춤)',
      trackType: (item.track_type || item.trackType || 'comfort') as 'comfort' | 'challenge' | 'supplement',
      recommendReason: item.recommend_reason || item.recommendReason || '북핏 연구소 큐레이션 추천 도서',
      summary: item.summary || '어린이 문해력 성장에 도움을 주는 도서입니다.',
      vocabularyPoints: item.vocabulary_points || item.vocabularyPoints || ['어휘력', '독해력'],
      parentQuestions: item.parent_questions || item.parentQuestions || ['이 책을 읽고 어떤 느낌이 들었나요?'],
      rating: Number(item.rating) || 4.9,
    }));
  } catch (err) {
    console.error('Error fetching curated books from DB:', err);
    return [];
  }
}

/**
 * Batch Insert Curated Books into Supabase `books` DB
 */
export async function saveBatchCuratedBooksToDb(
  books: Book[],
  defaultTrack: 'comfort' | 'challenge' | 'supplement' = 'comfort'
): Promise<{ success: boolean; count: number }> {
  if (!books || books.length === 0) {
    return { success: true, count: 0 };
  }

  try {
    const payloads = books.map((book) => {
      const trackType = book.trackType || defaultTrack;
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        cover_image: book.coverImage,
        grade_tag: book.gradeTag,
        lexile_level: book.lexileLevel,
        track_type: trackType,
        recommend_reason: book.recommendReason,
        summary: book.summary,
        vocabulary_points: book.vocabularyPoints,
        parent_questions: book.parentQuestions,
        rating: book.rating || 4.9,
        updated_at: new Date().toISOString(),
      };
    });

    const { error } = await supabase.from('books').upsert(payloads, { onConflict: 'id' });

    if (error) {
      console.warn('Batch upsert snake_case failed, trying fallback:', error);
      const fallbackPayloads = books.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        coverImage: book.coverImage,
        gradeTag: book.gradeTag,
        lexileLevel: book.lexileLevel,
        trackType: book.trackType || defaultTrack,
        recommendReason: book.recommendReason,
        summary: book.summary,
        vocabularyPoints: book.vocabularyPoints,
        parentQuestions: book.parentQuestions,
        rating: book.rating || 4.9,
        updatedAt: new Date().toISOString(),
      }));

      const { error: fallbackError } = await supabase.from('books').upsert(fallbackPayloads, { onConflict: 'id' });
      if (fallbackError) {
        console.error('Batch insert failed:', fallbackError);
        return { success: false, count: 0 };
      }
    }

    // Auto seed my_library for catalog lookup
    for (const book of books) {
      await saveOrUpdateLibraryBook(
        { ...book, trackType: book.trackType || defaultTrack },
        'wantToRead'
      );
    }

    return { success: true, count: books.length };
  } catch (err) {
    console.error('Error batch inserting books to DB:', err);
    return { success: false, count: 0 };
  }
}
