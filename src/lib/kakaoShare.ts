declare global {
  interface Window {
    Kakao: any;
  }
}

// Kakao JavaScript App Key
const KAKAO_JAVASCRIPT_KEY =
  (import.meta as any).env?.VITE_KAKAO_JS_KEY ||
  (import.meta as any).env?.NEXT_PUBLIC_KAKAO_JS_KEY ||
  '44413e33f1ff605280385b423a54f254';

/**
 * Initialize Kakao SDK dynamically if not already loaded
 */
export function initKakaoSDK(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Kakao) {
      if (!window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        } catch (e) {
          console.warn('Kakao init warning:', e);
        }
      }
      resolve(true);
      return;
    }

    // Load Kakao SDK script
    const script = document.createElement('script');
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js';
    script.integrity = 'sha384-TiGlAcgYsBxLtMHpMJUEd2Pz25oVGcZ58VnN6J2DqA1M+y/b1T4S5Y2w9p5q3k9';
    script.crossOrigin = 'anonymous';
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        try {
          window.Kakao.init(KAKAO_JAVASCRIPT_KEY);
        } catch (e) {
          console.warn('Kakao init warning:', e);
        }
      }
      resolve(true);
    };
    script.onerror = () => {
      console.warn('Failed to load Kakao SDK script.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
}

export interface ShareReportParams {
  childName?: string;
  totalScore?: number;
  levelName?: string;
  shareUrl?: string;
}

/**
 * Trigger KakaoTalk Share for Literacy Diagnostic & Growth Report
 */
export async function shareKakaoReport(params: ShareReportParams = {}): Promise<void> {
  const childName = params.childName || '우리 아이';
  const scoreText = params.totalScore ? ` (종합 점수: ${params.totalScore}점)` : '';
  const levelText = params.levelName ? ` - ${params.levelName}` : '';
  const targetUrl = params.shareUrl || window.location.href;

  const isSdkLoaded = await initKakaoSDK();

  if (isSdkLoaded && window.Kakao && window.Kakao.Share) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `[북핏] ${childName} 맞춤 문해력 진단 리포트 📚${scoreText}`,
          description: `아이의 현재 어휘 레벨${levelText}과 맞춤 3-Step 추천 도서를 확인해 보세요!`,
          imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
          link: {
            mobileWebUrl: targetUrl,
            webUrl: targetUrl,
          },
        },
        buttons: [
          {
            title: '내 아이 리포트 보러가기',
            link: {
              mobileWebUrl: targetUrl,
              webUrl: targetUrl,
            },
          },
        ],
      });
      return;
    } catch (err) {
      console.warn('Kakao Share API failed, using clipboard fallback:', err);
    }
  }

  // Fallback: Copy link to clipboard
  try {
    await navigator.clipboard.writeText(targetUrl);
    alert(`[북핏] 리포트 공유 링크가 복사되었습니다!\n카카오톡 대화창에 붙여넣어 공유하세요.\n\n링크: ${targetUrl}`);
  } catch (err) {
    alert(`[북핏] 공유 링크: ${targetUrl}`);
  }
}
