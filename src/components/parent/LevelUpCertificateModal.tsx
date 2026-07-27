import React from 'react';
import { Award, Sparkles, X, ShieldCheck } from 'lucide-react';

interface LevelUpCertificateModalProps {
  childName: string;
  previousLevel: string;
  newLevel: string;
  score: number;
  onClose: () => void;
}

export const LevelUpCertificateModal: React.FC<LevelUpCertificateModalProps> = ({
  childName,
  previousLevel,
  newLevel,
  score,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#FAF5EB] border-4 border-oak rounded-3xl shadow-elevated overflow-hidden p-8 space-y-6 text-center">
        
        {/* Top Decorative Header */}
        <div className="flex justify-between items-center">
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-forest bg-forest/10 px-3 py-1 rounded-full border border-forest/20">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span>북핏 학술 문해력 승급 검증 인증서</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-charcoal hover:bg-oak/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Title */}
        <div className="space-y-2">
          <div className="w-16 h-16 bg-oak/20 rounded-full flex items-center justify-center mx-auto text-forest text-3xl shadow-sm border border-oak/30">
            🥇
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-serif text-charcoal">
            문해력 승급 인증서
          </h2>
          <p className="text-xs text-oak-dark font-bold tracking-wide">
            CERTIFICATE OF LITERACY LEVEL UP
          </p>
        </div>

        {/* Certificate Body Content */}
        <div className="p-6 bg-cream-card rounded-2xl border-2 border-oak/30 space-y-4 shadow-inner">
          <p className="text-sm font-serif text-charcoal leading-relaxed">
            위 어린이 <span className="font-bold text-forest text-base">[{childName || '우리 아이'}]</span>는 꾸준한 맞춤 독서와 3-Step 형성평가를 통해 문해 진단 점수 <span className="font-bold text-oak-dark text-base">{score}점</span>을 달성하고 승급 미션을 훌륭히 완수하였으므로 이 인증서를 수여합니다.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-oak/20 text-xs">
            <div className="p-2.5 bg-cream rounded-xl border border-oak/15">
              <span className="text-charcoal-muted block text-[11px]">이전 레벨</span>
              <span className="font-bold text-charcoal line-through">{previousLevel}</span>
            </div>
            <div className="p-2.5 bg-forest/15 rounded-xl border border-forest/30">
              <span className="text-forest block text-[11px]">승급 달성 레벨</span>
              <span className="font-bold text-forest text-sm">{newLevel} 🚀</span>
            </div>
          </div>
        </div>

        {/* Footer Authority Stamp */}
        <div className="flex items-center justify-between text-xs text-charcoal-muted pt-2 border-t border-oak/20">
          <span>발급 기관: 북핏(BookFit) 언어발달 연구소</span>
          <span className="font-bold text-forest flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-oak" />
            BookFit Verified
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
        >
          <Award className="w-4 h-4 text-oak" />
          <span>승급 결과 내 서재에 반영하기</span>
        </button>

      </div>
    </div>
  );
};
