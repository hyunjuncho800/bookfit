import React, { useEffect } from 'react';
import { X, Target, Layers, FileText, Sparkles, HelpCircle, Brain } from 'lucide-react';

export type FeatureModalType = 'structure' | 'ratio' | 'report' | null;

interface FeatureDetailModalProps {
  modalType: FeatureModalType;
  onClose: () => void;
  onOpenDiagnosis?: () => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({ modalType, onClose, onOpenDiagnosis }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (modalType) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalType, onClose]);

  if (!modalType) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-cream-light border-2 border-oak/40 rounded-3xl shadow-elevated overflow-hidden max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-forest text-white">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-oak text-forest flex items-center justify-center font-bold shadow-sm">
              {modalType === 'structure' && <Target className="w-4 h-4" />}
              {modalType === 'ratio' && <Layers className="w-4 h-4" />}
              {modalType === 'report' && <FileText className="w-4 h-4" />}
            </span>
            <h3 className="text-base font-bold font-serif">
              {modalType === 'structure' && '북핏 3차원 정밀 진단 시스템 구조'}
              {modalType === 'ratio' && '북핏 맞춤 큐레이션 황금 비율 (7:1:2)이란?'}
              {modalType === 'report' && '부모 전용 독후 대화 가이드 & 리포트 샘플'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-cream-card hover:text-white rounded-full hover:bg-forest-light transition-colors"
            title="닫기 (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Modal 1: 진단 구조 */}
          {modalType === 'structure' && (
            <div className="space-y-6">
              <p className="text-sm text-charcoal-light leading-relaxed">
                북핏의 3차원 정밀 진단은 단순 단어 암기 테스트를 넘어 어휘력, 독해 추론력, 메타인지 독서 태도를 다각도로 측정합니다.
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-forest text-oak flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                    1
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-charcoal font-serif">1단계 - 어휘력 측정</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      학년별 필수 교과 어휘 및 유의어·반의어, 문맥 속 어휘 이해도를 정확하게 진단합니다.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-oak text-forest-dark flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                    2
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-charcoal font-serif">2단계 - 사실적 / 추론적 이해력</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      지문 속 행간을 읽고 핵심 문장을 파악하는 능력과 숨겨진 맥락을 파악하는 문해력을 정밀 분석합니다.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 flex items-start gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-forest-dark text-cream-light flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                    3
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-charcoal font-serif">3단계 - 메타인지 & 독서 태도</h4>
                    <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
                      스스로 이해 여부를 점검하고 집중도를 유지하는 자기조절 독서 습관과 태도를 통합 측정합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal 2: 황금 비율 */}
          {modalType === 'ratio' && (
            <div className="space-y-6">
              <p className="text-sm text-charcoal-light leading-relaxed">
                아이의 독서 성장을 저해하는 지루하거나 너무 어려운 책 대신, 학습 심리학에 근거한 <strong className="text-forest">7:1:2 황금 비율</strong>로 맞춤 서가를 구성합니다.
              </p>

              <div className="grid gap-4">
                <div className="p-5 bg-forest/10 rounded-2xl border border-forest/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-forest font-serif">📖 적정 도서 (70%)</span>
                    <span className="text-xs font-bold text-forest bg-forest/20 px-2.5 py-0.5 rounded-full">스스로 읽는 성취감</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">
                    아이의 현재 어휘 레벨에 딱 맞아 스스로 부담 없이 읽으며 독서 흥미와 자신감을 느끼는 책입니다.
                  </p>
                </div>

                <div className="p-5 bg-oak/15 rounded-2xl border border-oak/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-oak-dark font-serif">🚀 도전 도서 (10%)</span>
                    <span className="text-xs font-bold text-oak-dark bg-oak/30 px-2.5 py-0.5 rounded-full">지적 호기심 확장</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">
                    한 단계 높은 수준의 어휘와 사고력을 요구하여 지적 호기심을 확장하고 어휘 성장을 유도하는 책입니다.
                  </p>
                </div>

                <div className="p-5 bg-charcoal/5 rounded-2xl border border-charcoal/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-charcoal font-serif">🎯 약점 보완 (20%)</span>
                    <span className="text-xs font-bold text-charcoal-dark bg-charcoal/10 px-2.5 py-0.5 rounded-full">집중 영역 케어</span>
                  </div>
                  <p className="text-xs text-charcoal leading-relaxed">
                    사실적 이해, 행간 추론, 비문학 독해 등 아이의 부족한 영역을 집중적으로 케어하는 책입니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Modal 3: 샘플 리포트 */}
          {modalType === 'report' && (
            <div className="space-y-6">
              <p className="text-sm text-charcoal-light leading-relaxed">
                "책 읽고 뭐 느꼈니?" 대신 아이의 깊은 생각을 끌어내는 <strong className="text-forest">3단계 맞춤 독후 질문지</strong>와 핵심 어휘 리포트를 매월 제공합니다.
              </p>

              <div className="space-y-4">
                <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-forest font-bold text-sm">
                    <HelpCircle className="w-4 h-4 text-oak" />
                    <span>AI 기반 맞춤형 독후 질문지 (3단계 발문)</span>
                  </div>
                  <div className="text-xs space-y-2 pl-4 text-charcoal border-l-2 border-forest/30">
                    <p>• <strong>읽기 전:</strong> "표지와 제목을 보고 어떤 스토리가 펼쳐질지 상상해볼까?"</p>
                    <p>• <strong>읽기 중:</strong> "주인공이 만약 그 행동을 하지 않았다면 결말은 어떻게 달라졌을까?"</p>
                    <p>• <strong>읽기 후:</strong> "이 책의 메시지를 나의 실제 삶이나 경험에 연결해본다면?"</p>
                  </div>
                </div>

                <div className="p-5 bg-cream-card rounded-2xl border border-oak/30 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-forest font-bold text-sm">
                    <Brain className="w-4 h-4 text-oak" />
                    <span>핵심 어휘 정리 & 확장 퀴즈 리포트 샘플</span>
                  </div>
                  <div className="p-3.5 bg-cream-light rounded-xl border border-oak/20 text-xs space-y-2">
                    <p className="font-bold text-oak-dark">💡 수집된 주요 교과 어휘 예시:</p>
                    <p className="text-charcoal-muted">✓ <strong>용의주도(周到):</strong> 준비가 세밀하고 철저하여 빈틈이 없음.</p>
                    <p className="text-charcoal-muted">✓ <strong>시치미:</strong> 자기가 하고도 안 한 척 능청을 떠는 태도.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-cream-dark bg-cream-card/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-cream-dark hover:bg-oak/20 text-charcoal text-xs font-bold rounded-xl transition-colors"
          >
            닫기
          </button>

          {onOpenDiagnosis && (
            <button
              onClick={() => {
                onClose();
                onOpenDiagnosis();
              }}
              className="px-5 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-oak" />
              <span>우리 아이 맞춤 정밀 진단하기</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
