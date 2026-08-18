import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Send,
  RotateCcw,
  UserCheck,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

export interface QuestionDef {
  id: string;
  type: 'frequency' | 'yesno' | 'text';
  category: string;
  title: string;
  subtitle?: string;
}

export const QUESTIONS: QuestionDef[] = [
  // Q1 - Q5: Frequency (3 Choices: 1=ไม่เคย, 2=บางครั้ง, 3=เป็นประจำ)
  {
    id: 'q1',
    type: 'frequency',
    category: 'การสื่อสารและข้อเท็จจริง',
    title: 'เมื่อเกิดปัญหาในการทำงาน พนักงานสามารถให้ข้อมูลข้อเท็จจริงได้อย่างเปิดเผย',
    subtitle: 'เลือกความถี่ที่ตรงกับสภาพความเป็นจริงในการทำงานของคุณมากที่สุด',
  },
  {
    id: 'q2',
    type: 'frequency',
    category: 'การร่วมมือระหว่างหน่วยงาน',
    title: 'หน่วยงานต่างๆ ให้ความร่วมมือในการให้ข้อมูลครบถ้วนและถูกต้อง เมื่อมีการตรวจสอบหรือสอบถามข้อเท็จจริง',
    subtitle: 'การประสานงานและการส่งต่อข้อมูลเมื่อมีการขอตรวจสอบ',
  },
  {
    id: 'q3',
    type: 'frequency',
    category: 'บทบาทหัวหน้างาน',
    title: 'เมื่อเกิดข้อผิดพลาด หัวหน้างานมุ่งเน้นการแก้ปัญหา มากกว่าการหาคนผิด',
    subtitle: 'ทัศนคติและแนวทางการจัดการปัญหาของผู้นำทีม',
  },
  {
    id: 'q4',
    type: 'frequency',
    category: 'การแก้ไขปัญหาที่ยั่งยืน',
    title: 'ข้อผิดพลาดที่เกิดขึ้นได้รับการแก้ไขที่สาเหตุที่แท้จริง',
    subtitle: 'การป้องกันไม่ให้ปัญหาเดิมเกิดขึ้นซ้ำอีกในอนาคต',
  },
  {
    id: 'q5',
    type: 'frequency',
    category: 'ความกล้าแสดงออก',
    title: 'หากฉันพบความเสี่ยงหรือการปฏิบัติที่ไม่ถูกต้อง ฉันกล้าที่จะรายงาน',
    subtitle: 'ความรู้สึกปลอดภัยในการรายงานสิ่งที่ไม่ถูกต้องในองค์กร',
  },
  // Q6 - Q8: Yes/No
  {
    id: 'q6',
    type: 'yesno',
    category: 'ความปลอดภัยและความมั่นใจ',
    title: 'ฉันมั่นใจว่าการให้ข้อมูลตามข้อเท็จจริงจะไม่ส่งผลกระทบในทางลบต่อตัวฉัน',
    subtitle: 'ความมั่นใจในนโยบายการปกป้องผู้ให้ข้อมูล',
  },
  {
    id: 'q7',
    type: 'yesno',
    category: 'การสนับสนุนจากผู้นำ',
    title: 'หัวหน้างานของฉันสนับสนุนให้พนักงานรายงานปัญหาตามความเป็นจริง',
    subtitle: 'การส่งเสริมและเปิดรับฟังความคิดเห็นจากหัวหน้างาน',
  },
  {
    id: 'q8',
    type: 'yesno',
    category: 'ความเชื่อมั่นในผู้นำ',
    title: 'ฉันมีความเชื่อมั่นในตัวหัวหน้างานโดยตรง',
    subtitle: 'ระดับความไว้วางใจในการปฏิบัติงานและการเป็นผู้นำ',
  },
  // Q9: Free text
  {
    id: 'q9',
    type: 'text',
    category: 'ข้อเสนอแนะเพื่อการพัฒนา',
    title: 'ท่านคิดว่า องค์กรควรปรับปรุงเรื่องใดมากที่สุด เพื่อสร้างวัฒนธรรมการทำงานที่โปร่งใสและเปิดเผยข้อมูล',
    subtitle: 'ความคิดเห็นและข้อเสนอแนะเชิงสร้างสรรค์ของคุณมีคุณค่าอย่างยิ่ง',
  },
];

export const FREQUENCY_OPTIONS = [
  {
    value: 1,
    label: 'ไม่เคย',
    engLabel: 'Never',
    color: 'hover:border-rose-300 hover:bg-rose-50/70 text-slate-700',
    selectedBg: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-200 border-rose-600',
    icon: Clock,
  },
  {
    value: 2,
    label: 'บางครั้ง',
    engLabel: 'Sometimes',
    color: 'hover:border-amber-300 hover:bg-amber-50/70 text-slate-700',
    selectedBg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-200 border-amber-600',
    icon: Clock,
  },
  {
    value: 3,
    label: 'เป็นประจำ',
    engLabel: 'Always',
    color: 'hover:border-emerald-300 hover:bg-emerald-50/70 text-slate-700',
    selectedBg: 'bg-gradient-to-br from-emerald-600 to-[#00A651] text-white shadow-emerald-200 border-emerald-600',
    icon: Clock,
  },
];

export const YES_NO_OPTIONS = [
  {
    value: 1,
    label: 'ใช่ (Yes)',
    engLabel: 'ใช่ / เห็นด้วย',
    color: 'hover:border-emerald-300 hover:bg-emerald-50/70 text-slate-700',
    selectedBg: 'bg-gradient-to-br from-emerald-600 to-[#00A651] text-white shadow-emerald-200 border-emerald-600',
    icon: ThumbsUp,
  },
  {
    value: 0,
    label: 'ไม่ใช่ (No)',
    engLabel: 'ไม่ใช่ / ไม่เห็นด้วย',
    color: 'hover:border-rose-300 hover:bg-rose-50/70 text-slate-700',
    selectedBg: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-rose-200 border-rose-600',
    icon: ThumbsDown,
  },
];

export default function SurveyPage() {
  // Navigation & User State
  const [individualCode, setIndividualCode] = useState('');
  const [validatedUser, setValidatedUser] = useState<{
    id: string;
    employeeName: string;
    employeeId: string;
    roleName: string;
  } | null>(null);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Survey Form Step: 0 to 8 = Q1 to Q9, 9 = Preview, 10 = Success
  const [currentStep, setCurrentStep] = useState(0);

  // Form Answers
  const [answers, setAnswers] = useState<Record<string, number | string>>({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    q8: '',
    q9: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Verify Individual Code (Mocked for UI preview)
  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!individualCode.trim()) {
      setAuthError('กรุณากรอกรหัสประจำตัว (Individual Code)');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    // Simulate API lookup
    setTimeout(() => {
      setIsVerifying(false);
      // Valid simulation
      setValidatedUser({
        id: individualCode.trim(),
        employeeName: 'คุณพนักงานทดสอบ ระบบสำรวจ',
        employeeId: 'BJC-98721',
        roleName: 'พนักงานทั่วไป (Staff)',
      });
      setCurrentStep(0);
    }, 600);
  };

  const handleSelectOption = (qId: string, val: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const handleNext = () => {
    if (currentStep < 9) {
      setCurrentStep((prev) => prev + 1);
    } else if (currentStep === 9) {
      // Submit
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCurrentStep(10); // Success Step
      }, 900);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleJumpToStep = (step: number) => {
    setCurrentStep(step);
  };

  const resetForm = () => {
    setValidatedUser(null);
    setIndividualCode('');
    setCurrentStep(0);
    setAnswers({
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: '',
      q8: '',
      q9: '',
    });
  };

  // Check if current question is answered
  const isCurrentStepValid = () => {
    if (currentStep < 9) {
      const q = QUESTIONS[currentStep];
      if (q.type === 'text') {
        return true;
      }
      return answers[q.id] !== '' && answers[q.id] !== undefined;
    }
    return true;
  };

  // -------------------------------------------------------------
  // 1. LOGIN / ENTER INDIVIDUAL CODE VIEW
  // -------------------------------------------------------------
  if (!validatedUser) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] relative overflow-hidden flex flex-col justify-between">
        {/* Soft Background Gradients */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#00A651]/10 blur-3xl animate-pulse-glow" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#0B3C5D]/10 blur-3xl" />
        </div>

        {/* Top Header */}
        <header className="relative z-10 w-full px-6 py-6 max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00A651] to-emerald-400 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-emerald-600/20">
              BJF
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[#0B3C5D] block">
                BJF Survey
              </span>
              <span className="text-xs text-[#0B3C5D]/60 font-medium">ระบบสำรวจความคิดเห็นพนักงาน</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/80 text-xs font-semibold text-[#0B3C5D]">
            <ShieldCheck className="w-4 h-4 text-[#00A651]" />
            ปลอดภัย & เก็บข้อมูลเป็นความลับ
          </div>
        </header>

        {/* Main Entry Card */}
        <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-8 sm:p-10 animate-fade-slide-up">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#00A651] flex items-center justify-center mx-auto mb-4 border border-emerald-100 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D] tracking-tight">
                แบบสำรวจความโปร่งใส
              </h1>
              <p className="text-sm text-[#0B3C5D]/70 mt-2 leading-relaxed">
                กรุณากรอก <span className="font-bold text-[#00A651]">Individual Code (UUID)</span>{' '}
                ที่ท่านได้รับ เพื่อเข้าทำแบบสอบถาม
              </p>
            </div>

            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-[#0B3C5D] uppercase tracking-wider mb-2">
                  Individual Code / รหัสประจำตัว
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={individualCode}
                    onChange={(e) => {
                      setIndividualCode(e.target.value);
                      setAuthError('');
                    }}
                    placeholder="เช่น e9b1c73a-4a2e-4e6f-..."
                    className="w-full pl-4 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-mono text-[#0B3C5D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A651]/30 focus:border-[#00A651] focus:bg-white transition-all shadow-inner"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                {authError && (
                  <p className="text-xs text-rose-500 font-semibold mt-2 pl-1 animate-fade-slide-up">
                    {authError}
                  </p>
                )}
              </div>

              {/* Quick sample button for test preview */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/70 text-xs text-slate-600 flex items-center justify-between">
                <span>กดเพื่อใส่รหัสตัวอย่าง:</span>
                <button
                  type="button"
                  onClick={() => setIndividualCode('550e8400-e29b-41d4-a716-446655440000')}
                  className="text-xs font-bold text-[#00A651] hover:underline"
                >
                  ใช้รหัส Demo
                </button>
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#00A651] to-[#008f45] hover:from-[#008f45] hover:to-[#007a3b] text-white font-extrabold rounded-full transition-all duration-300 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2 text-base cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    เข้าสู่แบบสำรวจ
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400">
                ข้อมูลการตอบของท่านจะถูกนำไปใช้เพื่อการพัฒนาวัฒนธรรมองค์กรเท่านั้น
              </p>
            </div>
          </div>
        </main>

        <footer className="relative z-10 py-4 text-center text-xs text-[#0B3C5D]/50 font-medium">
          © 2026 BJC & Big C Survey Management System
        </footer>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. SUCCESS VIEW (Step 10)
  // -------------------------------------------------------------
  if (currentStep === 10) {
    return (
      <div className="min-h-screen bg-[#F4F7F6] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-[#00A651]/15 blur-3xl animate-pulse-glow" />
        </div>

        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl border border-white rounded-3xl shadow-2xl p-8 sm:p-10 text-center relative z-10 animate-fade-slide-up">
          <div className="w-20 h-20 bg-emerald-50 text-[#00A651] rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D] mb-2">
            ส่งคำตอบเรียบร้อยแล้ว
          </h2>
          <p className="text-sm font-semibold text-[#00A651] mb-4">
            ขอขอบคุณสำหรับความคิดเห็นอันมีค่ายิ่ง
          </p>

          <p className="text-sm text-[#0B3C5D]/70 leading-relaxed mb-8">
            ความคิดเห็นของท่าน ({validatedUser.employeeName}) ได้รับการบันทึกเข้าสู่ระบบอย่างปลอดภัย
            เพื่อนำไปปรับปรุงและพัฒนาวัฒนธรรมองค์กรให้โปร่งใสต่อไป
          </p>

          <button
            onClick={resetForm}
            className="w-full py-3.5 px-6 rounded-full bg-[#0B3C5D] hover:bg-[#082a42] text-white font-extrabold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            กลับสู่หน้าหลัก
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. SURVEY QUESTIONS & PREVIEW VIEW (Step 0 to 9)
  // -------------------------------------------------------------
  const totalSteps = QUESTIONS.length + 1; // 9 Questions + 1 Preview = 10 steps total
  const isPreview = currentStep === 9;
  const currentQ = !isPreview ? QUESTIONS[currentStep] : null;
  const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-[#F4F7F6] flex flex-col justify-between relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#00A651]/5 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] rounded-full bg-[#0B3C5D]/5 blur-3xl" />
      </div>

      {/* Top App Bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/60 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="p-2 rounded-full hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-[#0B3C5D]"
              title="ย้อนกลับ"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-[#0B3C5D]">
                  BJF Survey
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {validatedUser.roleName}
                </span>
              </div>
              <p className="text-xs text-[#0B3C5D]/60 truncate max-w-[200px] sm:max-w-xs">
                ผู้ตอบ: {validatedUser.employeeName} ({validatedUser.employeeId})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs font-bold text-[#0B3C5D] block">
                {isPreview ? 'ขั้นตอนสุดท้าย' : `ข้อที่ ${currentStep + 1} / ${QUESTIONS.length}`}
              </span>
              <span className="text-[11px] font-semibold text-[#00A651]">
                {progressPercent}% เสร็จสิ้น
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Segmented Progress Bar */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-3 pt-1">
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, stepIdx) => {
              const isFilled = currentStep >= stepIdx;
              const isCurrent = currentStep === stepIdx;
              return (
                <div
                  key={stepIdx}
                  onClick={() => handleJumpToStep(stepIdx)}
                  role="button"
                  title={`ไปยัง ${stepIdx === 9 ? 'สรุปผล' : `ข้อ ${stepIdx + 1}`}`}
                  className={`h-2 flex-1 rounded-full cursor-pointer transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#00A651] ring-2 ring-emerald-300 ring-offset-1 scale-y-125'
                      : isFilled
                      ? 'bg-[#00A651] shadow-xs'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="relative z-10 flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col justify-center">
        {/* -------------------- QUESTIONS STEP -------------------- */}
        {!isPreview && currentQ && (
          <div key={currentQ.id} className="animate-fade-slide-up">
            {/* Category Tag & Badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#00A651] border border-emerald-200/70 text-xs font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {currentQ.category}
              </span>
              <span className="text-xs font-bold text-slate-400">
                คำถาม {currentStep + 1} จาก {QUESTIONS.length}
              </span>
            </div>

            {/* Question Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B3C5D] leading-snug mb-3 drop-shadow-xs">
              {currentQ.title}
            </h2>
            {currentQ.subtitle && (
              <p className="text-sm sm:text-base text-[#0B3C5D]/70 mb-8 font-medium">
                {currentQ.subtitle}
              </p>
            )}

            {/* Choices rendering */}
            {/* 1. FREQUENCY CHOICES (Q1 - Q5: 3 Choices) */}
            {currentQ.type === 'frequency' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FREQUENCY_OPTIONS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.value)}
                      className={`group relative p-6 rounded-3xl border-2 text-left sm:text-center transition-all duration-300 cursor-pointer flex sm:flex-col items-center justify-between sm:justify-center gap-3 ${
                        isSelected
                          ? `${opt.selectedBg} shadow-xl scale-[1.02]`
                          : `bg-white/90 border-slate-200/90 shadow-sm ${opt.color} hover:scale-[1.01]`
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-[#0B3C5D] group-hover:bg-white'
                        }`}
                      >
                        <span className="font-extrabold text-lg">{opt.value}</span>
                      </div>
                      <div>
                        <div
                          className={`font-extrabold text-lg ${
                            isSelected ? 'text-white' : 'text-[#0B3C5D]'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {opt.engLabel}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="sm:hidden text-white">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. YES/NO CHOICES (Q6 - Q8) */}
            {currentQ.type === 'yesno' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {YES_NO_OPTIONS.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt.value)}
                      className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer flex items-center justify-between sm:justify-center gap-4 ${
                        isSelected
                          ? `${opt.selectedBg} shadow-xl scale-[1.02]`
                          : `bg-white/90 border-slate-200/90 shadow-sm ${opt.color} hover:scale-[1.01]`
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-white/20 text-white'
                            : 'bg-slate-100 text-[#0B3C5D] group-hover:bg-white'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="text-left sm:text-center flex-1 sm:flex-none">
                        <div
                          className={`font-extrabold text-xl ${
                            isSelected ? 'text-white' : 'text-[#0B3C5D]'
                          }`}
                        >
                          {opt.label}
                        </div>
                        <div
                          className={`text-xs font-semibold ${
                            isSelected ? 'text-white/80' : 'text-slate-400'
                          }`}
                        >
                          {opt.engLabel}
                        </div>
                      </div>
                      {isSelected && (
                        <div className="text-white">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* 3. FREE TEXT (Q9) */}
            {currentQ.type === 'text' && (
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
                <textarea
                  rows={6}
                  value={answers[currentQ.id] as string}
                  onChange={(e) =>
                    setAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                  }
                  placeholder="พิมพ์ความคิดเห็น ข้อเสนอแนะ หรือสิ่งที่องค์กรสามารถปรับปรุงได้ที่นี่..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm sm:text-base text-[#0B3C5D] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00A651]/30 focus:border-[#00A651] focus:bg-white transition-all resize-none shadow-inner"
                />
                <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
                  <span>* สามารถพิมพ์ข้อเสนอแนะได้อย่างอิสระ</span>
                  <span>{(answers[currentQ.id] as string).length} ตัวอักษร</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* -------------------- PREVIEW STEP (Step 9) -------------------- */}
        {isPreview && (
          <div className="animate-fade-slide-up space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#00A651] border border-emerald-200 text-xs font-extrabold uppercase mb-2">
                <FileCheck2 className="w-4 h-4" />
                สรุปและตรวจสอบข้อมูล
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3C5D]">
                ตรวจสอบคำตอบก่อนส่ง
              </h2>
              <p className="text-sm text-[#0B3C5D]/70">
                โปรดตรวจสอบความถูกต้องของข้อมูลและคำตอบของท่านก่อนกดยืนยันการส่งแบบสำรวจ
              </p>
            </div>

            {/* Respondent Card */}
            <div className="bg-white/95 rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#0B3C5D] flex items-center justify-center font-bold">
                  <UserCheck className="w-6 h-6 text-[#00A651]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">ข้อมูลผู้ตอบ</span>
                  <div className="font-extrabold text-base text-[#0B3C5D]">
                    {validatedUser.employeeName}
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    รหัส: {validatedUser.employeeId} • บทบาท: {validatedUser.roleName}
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 truncate max-w-full">
                UUID: {validatedUser.id}
              </div>
            </div>

            {/* Answers Summary Section */}
            <div className="bg-white/95 rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md space-y-5">
              <h3 className="font-extrabold text-lg text-[#0B3C5D] border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>คำตอบของคุณ (9 ข้อ)</span>
                <span className="text-xs font-semibold text-emerald-600">กรอกครบถ้วน</span>
              </h3>

              <div className="divide-y divide-slate-100">
                {QUESTIONS.map((q, idx) => {
                  const val = answers[q.id];
                  let displayVal = '-';
                  let badgeColor = 'bg-slate-100 text-slate-700';

                  if (q.type === 'frequency') {
                    const opt = FREQUENCY_OPTIONS.find((o) => o.value === val);
                    displayVal = opt ? `${opt.value}. ${opt.label} (${opt.engLabel})` : 'ยังไม่ได้ตอบ';
                    if (val === 3) badgeColor = 'bg-emerald-100 text-emerald-800 font-bold';
                    else if (val === 2) badgeColor = 'bg-amber-100 text-amber-800 font-bold';
                    else if (val === 1) badgeColor = 'bg-rose-100 text-rose-800 font-bold';
                  } else if (q.type === 'yesno') {
                    const opt = YES_NO_OPTIONS.find((o) => o.value === val);
                    displayVal = opt ? opt.label : 'ยังไม่ได้ตอบ';
                    if (val === 1) badgeColor = 'bg-emerald-100 text-emerald-800 font-bold';
                    else if (val === 0) badgeColor = 'bg-rose-100 text-rose-800 font-bold';
                  } else if (q.type === 'text') {
                    displayVal = (val as string) || '(ไม่ได้ระบุข้อเสนอแนะ)';
                  }

                  return (
                    <div
                      key={q.id}
                      className="py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-extrabold text-[#00A651] bg-emerald-50 px-2 py-0.5 rounded-md">
                            Q{idx + 1}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">{q.category}</span>
                        </div>
                        <p className="text-sm font-bold text-[#0B3C5D]">{q.title}</p>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        {q.type === 'text' ? (
                          <div className="text-sm text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 w-full sm:max-w-xs break-words">
                            {displayVal}
                          </div>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-xs ${badgeColor}`}>
                            {displayVal}
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleJumpToStep(idx)}
                          className="text-xs font-bold text-[#00A651] hover:underline cursor-pointer flex-shrink-0"
                        >
                          แก้ไข
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <footer className="sticky bottom-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200/80 p-4 sm:p-5">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="px-5 py-3 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-[#0B3C5D] font-extrabold text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!isCurrentStepValid() || isSubmitting}
            className={`flex-1 sm:flex-none sm:min-w-[220px] px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
              isPreview
                ? 'bg-gradient-to-r from-[#00A651] to-[#008f45] shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5'
                : 'bg-[#00A651] hover:bg-[#008f45] shadow-emerald-600/25 hover:-translate-y-0.5'
            } disabled:opacity-40 disabled:hover:translate-y-0 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                กำลังส่งข้อมูล...
              </>
            ) : isPreview ? (
              <>
                <Send className="w-5 h-5" />
                ยืนยันและส่งคำตอบ
              </>
            ) : (
              <>
                ข้อถัดไป
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}
