export default async function handler(req, res) {
  // Extract Query Parameters
  const {
    categoryId = '51100',
    queryType = 'ItemNewAll',
    maxResults = '30',
    query = '',
    start = '1'
  } = req.query || {};

  const ttbKey =
    process.env.NEXT_PUBLIC_ALADIN_TTB_KEY ||
    process.env.VITE_ALADIN_TTB_KEY ||
    'ttbhyunjuncho8001648001';

  let aladinUrl = '';
  if (query && query.trim() !== '') {
    aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(
      query
    )}&QueryType=Keyword&CategoryId=${categoryId}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&SubSearchTarget=Children&output=js&Version=20131101`;
  } else {
    aladinUrl = `https://www.aladin.co.kr/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&CategoryId=${categoryId}&MaxResults=${maxResults}&start=${start}&SearchTarget=Book&SubSearchTarget=Children&output=js&Version=20131101`;
  }

  try {
    const response = await fetch(aladinUrl);
    if (!response.ok) {
      throw new Error(`Aladin API HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // Set CORS headers for safe browser access
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    res.setHeader('Content-Type', 'application/json');

    return res.status(200).json(data);
  } catch (error) {
    console.error('Serverless Aladin API Fetch Error:', error);
    return res.status(500).json({
      error: '도서를 불러오는 중 오류가 발생했습니다.',
      details: error.message || String(error)
    });
  }
}
