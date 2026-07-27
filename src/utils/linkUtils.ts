/**
 * 쿠팡 파트너스 동적 도서 검색 URL 생성 유틸리티
 */
export const getCoupangSearchLink = (title: string): string => {
  if (!title) return 'https://www.coupang.com';

  // 책 제목에서 '[세트]', '(그림책)', '1권' 등 특수문자/괄호 및 덧붙은 설명 제거하여 검색 정확도 향상
  const cleanTitle = title
    .replace(/\[.*?\]|\(.*?\)|<.*?>/g, '') // 괄호와 안의 내용 제거
    .replace(/[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\'\"]/g, ' ') // 특수문자 공백 처리
    .trim();

  const encodedTitle = encodeURIComponent(cleanTitle);

  // 각 도서 제목 기반 쿠팡 검색 URL
  return `https://www.coupang.com/np/search?component=&q=${encodedTitle}&channel=user`;
};
