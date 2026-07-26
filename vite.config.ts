import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/aladdin': {
        target: 'https://www.aladin.co.kr',
        changeOrigin: true,
        rewrite: (path) => {
          // Convert /api/aladdin?categoryId=51100&queryType=ItemNewAll...
          // to /ttb/api/ItemList.aspx?... or /ttb/api/ItemSearch.aspx?...
          const urlObj = new URL('http://localhost' + path);
          const params = urlObj.searchParams;
          const categoryId = params.get('categoryId') || '51100';
          const queryType = params.get('queryType') || 'ItemNewAll';
          const maxResults = params.get('maxResults') || '30';
          const query = params.get('query') || '';
          const ttbKey = process.env.VITE_ALADIN_TTB_KEY || process.env.NEXT_PUBLIC_ALADIN_TTB_KEY || 'ttbfrisjune1646001';

          if (query) {
            return `/ttb/api/ItemSearch.aspx?ttbkey=${ttbKey}&Query=${encodeURIComponent(query)}&QueryType=Keyword&CategoryId=${categoryId}&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101`;
          } else {
            return `/ttb/api/ItemList.aspx?ttbkey=${ttbKey}&QueryType=${queryType}&CategoryId=${categoryId}&MaxResults=${maxResults}&start=1&SearchTarget=Book&output=js&Version=20131101`;
          }
        },
      },
    },
  },
})
