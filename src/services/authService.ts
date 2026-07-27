import { supabase } from './supabaseService';
import type { DiagnosticResultData, MyBookItem } from '../types';

const GUEST_DIAGNOSTIC_KEY = 'bookfit_guest_diagnostic_result';
const GUEST_LIBRARY_KEY = 'bookfit_guest_library_books';

/**
 * 게스트 진단 결과 localStorage 보관
 */
export const saveGuestDiagnosticResult = (result: DiagnosticResultData): void => {
  try {
    localStorage.setItem(GUEST_DIAGNOSTIC_KEY, JSON.stringify(result));
  } catch (e) {
    console.error('Failed to save guest diagnostic result to localStorage:', e);
  }
};

/**
 * 게스트 진단 결과 localStorage 조회
 */
export const getGuestDiagnosticResult = (): DiagnosticResultData | null => {
  try {
    const raw = localStorage.getItem(GUEST_DIAGNOSTIC_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to parse guest diagnostic result:', e);
    return null;
  }
};

/**
 * 게스트 내 서가 도서 localStorage 보관
 */
export const saveGuestLibraryBook = (item: MyBookItem): MyBookItem[] => {
  try {
    const current = getGuestLibraryBooks();
    const existingIdx = current.findIndex(b => b.book.id === item.book.id);
    let updated: MyBookItem[];
    if (existingIdx >= 0) {
      updated = [...current];
      updated[existingIdx] = item;
    } else {
      updated = [item, ...current];
    }
    localStorage.setItem(GUEST_LIBRARY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to save guest library book:', e);
    return [];
  }
};

/**
 * 게스트 내 서가 도서 localStorage 조회
 */
export const getGuestLibraryBooks = (): MyBookItem[] => {
  try {
    const raw = localStorage.getItem(GUEST_LIBRARY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get guest library books:', e);
    return [];
  }
};

/**
 * 게스트 ➔ Supabase DB 자동 이관 (Data Migration)
 */
export const migrateGuestDataToSupabase = async (userId: string): Promise<boolean> => {
  if (!userId) return false;

  try {
    let migratedCount = 0;

    // 1. 게스트 진단 데이터 이관
    const guestResult = getGuestDiagnosticResult();
    if (guestResult) {
      const payload = {
        user_id: userId,
        total_score: guestResult.totalScore,
        percentile_top: guestResult.percentileTop,
        grade_level_name: guestResult.gradeLevelName,
        domain_scores: guestResult.domainScores,
        strengths: guestResult.strengths,
        weaknesses: guestResult.weaknesses,
        action_advice: guestResult.actionAdvice,
        created_at: new Date().toISOString()
      };
      await supabase.from('diagnostic_results').insert(payload);
      localStorage.removeItem(GUEST_DIAGNOSTIC_KEY);
      migratedCount++;
    }

    // 2. 게스트 서가 도서 데이터 이관
    const guestBooks = getGuestLibraryBooks();
    if (guestBooks.length > 0) {
      for (const item of guestBooks) {
        const payload = {
          user_id: userId,
          book_id: item.book.id,
          title: item.book.title,
          author: item.book.author,
          cover_image: item.book.coverImage,
          status: item.status
        };
        await supabase.from('my_library').upsert(payload, { onConflict: 'user_id,book_id' as any });
      }
      localStorage.removeItem(GUEST_LIBRARY_KEY);
      migratedCount += guestBooks.length;
    }

    console.log(`[Guest Migration Success] Total ${migratedCount} items migrated to user ${userId}`);
    return true;
  } catch (e) {
    console.error('Guest data migration error:', e);
    return false;
  }
};
