export default async function handler(req, res) {
  // Extract Query Parameters
  const {
    categoryId = '1108',
    queryType = 'Bestseller',
    maxResults = '30',
    query = '',
    start = '1'
  } = req.query || {};

  const ttbKey =
    process.env.NEXT_PUBLIC_ALADIN_TTB_KEY ||
    process.env.VITE_ALADIN_TTB_KEY ||
    'ttbfrisjune1646001';

  let aladinUrl = '';
  if (query && query.trim() !== '') {
    aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(
      query
    )}&QueryType=Keyword&CategoryId=${categoryId}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
  } else {
    aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&CategoryId=${categoryId}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&output=js&Version=20131101`;
  }

  // CORS Header helper
  const setCorsHeaders = () => {
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    res.setHeader('Content-Type', 'application/json');
  };

  try {
    const response = await fetch(aladinUrl);
    setCorsHeaders();

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Aladin API HTTP Error: ${response.status}`,
        ttbKeyPresent: Boolean(ttbKey),
        ttbKeyPrefix: ttbKey ? ttbKey.substring(0, 7) + '...' : 'Missing',
        url: aladinUrl
      });
    }

    const data = await response.json();

    // Check if Aladin API returned an explicit error object
    if (data && (data.errorCode !== undefined || data.errorMessage)) {
      return res.status(200).json({
        isAladinError: true,
        errorCode: data.errorCode,
        errorMessage: data.errorMessage || '알라딘 API 에러가 발생했습니다.',
        errorCodeName: data.errorCodeName || 'UNKNOWN_ERROR',
        ttbKeyPresent: Boolean(ttbKey),
        ttbKeyPrefix: ttbKey ? ttbKey.substring(0, 7) + '...' : 'Missing',
        url: aladinUrl
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless Aladin API Fetch Error:', error);
    setCorsHeaders();
    return res.status(500).json({
      isAladinError: true,
      error: '도서를 불러오는 중 오류가 발생했습니다.',
      details: error.message || String(error),
      ttbKeyPresent: Boolean(ttbKey),
      ttbKeyPrefix: ttbKey ? ttbKey.substring(0, 7) + '...' : 'Missing',
      url: aladinUrl
    });
  }
}
