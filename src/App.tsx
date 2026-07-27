import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { FeatureSection } from './components/FeatureSection';
import { TrackCalculator } from './components/TrackCalculator';
import { BookshelfSection } from './components/BookshelfSection';
import { BookSearchSection } from './components/search/BookSearchSection';
import { MyLibrarySection } from './components/library/MyLibrarySection';
import { Footer } from './components/Footer';
import { DiagnosisFlow } from './components/diagnosis/DiagnosisFlow';
import { BookDetailModal } from './components/BookDetailModal';
import { AuthModal } from './components/AuthModal';
import type { Book } from './types';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'diagnosis'>('landing');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleNavigate = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const elem = document.getElementById(sectionId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const elem = document.getElementById(sectionId);
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans selection:bg-oak/30 selection:text-forest">
      {/* Header Bar */}
      <Header
        onOpenDiagnosis={() => setCurrentView('diagnosis')}
        onNavigate={handleNavigate}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Conditional View Rendering */}
      {currentView === 'landing' ? (
        <main>
          {/* Hero Section */}
          <HeroSection
            onOpenDiagnosis={() => setCurrentView('diagnosis')}
          />

          {/* Feature Section (3 Features) */}
          <FeatureSection onOpenDiagnosis={() => setCurrentView('diagnosis')} />

          {/* 3-Step Golden Ratio Visualizer */}
          <TrackCalculator />

          {/* Aladin Open API Children Book Search Console */}
          <BookSearchSection
            onSelectBook={(book) => setSelectedBook(book)}
            onOpenDiagnosis={() => setCurrentView('diagnosis')}
          />

          {/* My Library & Gamification Section */}
          <MyLibrarySection
            onSelectBook={(book) => setSelectedBook(book)}
            onOpenDiagnosis={() => setCurrentView('diagnosis')}
          />

          {/* Preview Bookshelf Section */}
          <BookshelfSection
            onSelectBook={(book) => setSelectedBook(book)}
            onOpenDiagnosis={() => setCurrentView('diagnosis')}
          />

          {/* Footer */}
          <Footer />
        </main>
      ) : (
        /* Full Diagnostic Test & Report Dashboard Flow */
        <DiagnosisFlow
          onCancel={() => setCurrentView('landing')}
          onSelectBook={(book) => setSelectedBook(book)}
        />
      )}

      {/* Book Detail Modal */}
      <BookDetailModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onOpenDiagnosis={() => setCurrentView('diagnosis')}
      />

      {/* Auth Modal for Guest Conversion */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}

export default App;
