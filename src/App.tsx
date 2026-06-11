/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  PRESET_SCENARIOS, 
  svgToBase64, 
  PresetScenario 
} from "./presets";
import { 
  MOCK_REPORTS, 
  AnalysisResponse 
} from "./mockData";
import { 
  Sparkles, 
  Layers, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Plus, 
  Trash2, 
  FileText, 
  Share2, 
  Printer, 
  AlertCircle, 
  ArrowRight, 
  BarChart3, 
  TrendingUp, 
  HelpCircle, 
  Eye, 
  Sliders, 
  RefreshCw, 
  MapPin, 
  FileCheck,
  Maximize2,
  Copy,
  Info,
  Globe
} from "lucide-react";

const COLOR_MAPPING = {
  indigo: { border: "border-indigo-600", bg: "bg-indigo-600", text: "text-indigo-600", fill: "bg-indigo-50/75" },
  emerald: { border: "border-emerald-600", bg: "bg-emerald-600", text: "text-emerald-600", fill: "bg-emerald-50/75" },
  rose: { border: "border-rose-600", bg: "bg-rose-600", text: "text-rose-600", fill: "bg-rose-50/75" },
  amber: { border: "border-amber-600", bg: "bg-amber-600", text: "text-amber-600", fill: "bg-amber-50/75" },
  violet: { border: "border-violet-600", bg: "bg-violet-600", text: "text-violet-600", fill: "bg-violet-50/75" },
};

export default function App() {
  // --- STATE ---
  const [activePresetId, setActivePresetId] = useState<string>("ecommerce-checkout");
  const [category, setCategory] = useState<string>("랜딩 페이지 및 UI/UX");
  const [customCategory, setCustomCategory] = useState<string>("");
  const [ourImage, setOurImage] = useState<string>("");
  const [competitorImage, setCompetitorImage] = useState<string>("");
  const [ourUrl, setOurUrl] = useState<string>("");
  const [competitorUrl, setCompetitorUrl] = useState<string>("");

  // Tracking human uploads vs preset
  const [isOurCustom, setIsOurCustom] = useState<boolean>(false);
  const [isCompetitorCustom, setIsCompetitorCustom] = useState<boolean>(false);

  // Notes
  const [ourNotes, setOurNotes] = useState<string>("");
  const [competitorNotes, setCompetitorNotes] = useState<string>("");
  const [customPrompt, setCustomPrompt] = useState<string>("");

  // PIN annotations and shapes
  const [ourPins, setOurPins] = useState<Array<{ id: number; x: number; y: number; text: string; type?: "pin" | "rect" | "circle"; size?: number; color?: "indigo" | "emerald" | "rose" | "amber" | "violet" }>>([]);
  const [competitorPins, setCompetitorPins] = useState<Array<{ id: number; x: number; y: number; text: string; type?: "pin" | "rect" | "circle"; size?: number; color?: "indigo" | "emerald" | "rose" | "amber" | "violet" }>>([]);
  const [pinMode, setPinMode] = useState<"none" | "our" | "competitor">("none");
  const [activePinText, setActivePinText] = useState<string>("");
  const [pendingPinCoords, setPendingPinCoords] = useState<{ x: number; y: number } | null>(null);
  
  // New shape settings
  const [pendingPinType, setPendingPinType] = useState<"pin" | "rect" | "circle">("pin");
  const [pendingPinSize, setPendingPinSize] = useState<number>(15);
  const [pendingPinColor, setPendingPinColor] = useState<"indigo" | "emerald" | "rose" | "amber" | "violet">("indigo");

  // Drag-and-drop drag over states
  const [ourDragging, setOurDragging] = useState<boolean>(false);
  const [competitorDragging, setCompetitorDragging] = useState<boolean>(false);

  // Display Mode / UI preferences
  const [compareMode, setCompareMode] = useState<"side-by-side" | "slider">("side-by-side");
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage 0-100
  const [activeSwotView, setActiveSwotView] = useState<"our" | "competitor" | "compare">("compare");

  // AI Analysis Results
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<AnalysisResponse | null>(null);

  // Success messages / toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File upload refs
  const ourFileRef = useRef<HTMLInputElement>(null);
  const competitorFileRef = useRef<HTMLInputElement>(null);

  // --- LOADING STEPS SIMULATION ---
  const loadingSteps = [
    "🔍 자사 시각 레이아웃 프랙탈 스캔 중...",
    "📐 경쟁사 타이포그래피 및 서체 위계 추출 중...",
    "🎨 컬러 팔레트 세밀 조화 지표 연산 중...",
    "💡 여백 및 행동 유도(CTA) 버튼 반응성 체크 중...",
    "🧠 Gemini AI 기반 원천 대조 및 SWOT 보고서 취합 중..."
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // --- INITIAL LOAD & PRESET SYNCHRONIZATION ---
  useEffect(() => {
    // Load default preset scenario
    const preset = PRESET_SCENARIOS.find(p => p.id === activePresetId);
    if (preset) {
      // Sync parameters
      if (!isOurCustom) {
        setOurImage(svgToBase64(preset.ourSvg));
        setOurNotes(preset.ourNotes);
        setOurPins([
          { id: 1, x: 25, y: 35, text: "핵심 결제 요약 카드 배치 (시선의 안식처)" },
          { id: 2, x: 50, y: 88, text: "단 하나의 명확한 최우선 CTA 버튼" }
        ]);
        if (activePresetId === "ecommerce-checkout") {
          setOurUrl("https://brand.coupang.com");
        } else if (activePresetId === "beverage-packaging") {
          setOurUrl("https://www.nespresso.com");
        } else if (activePresetId === "saas-dashboard") {
          setOurUrl("https://www.notion.so");
        } else {
          setOurUrl("");
        }
      }
      if (!isCompetitorCustom) {
        setCompetitorImage(svgToBase64(preset.competitorSvg));
        setCompetitorNotes(preset.competitorNotes);
        setCompetitorPins([
          { id: 1, x: 50, y: 15, text: "사용자 시선을 분산시키는 고자극 할인 배너 팝업" },
          { id: 2, x: 60, y: 90, text: "경쟁 관계의 붉은 버튼과 파란 버튼 복수 배치" }
        ]);
        if (activePresetId === "ecommerce-checkout") {
          setCompetitorUrl("https://gmarket.co.kr");
        } else if (activePresetId === "beverage-packaging") {
          setCompetitorUrl("https://www.illy.com");
        } else if (activePresetId === "saas-dashboard") {
          setCompetitorUrl("https://asana.com");
        } else {
          setCompetitorUrl("");
        }
      }
      setCategory(preset.category);
      
      // Load precomputed report
      const precomputed = MOCK_REPORTS[activePresetId];
      if (precomputed) {
        setAnalysisReport(precomputed);
      }
    }
  }, [activePresetId]);

  // Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- FILE HANDLERS ---
  const handleOurImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setOurImage(event.target.result as string);
          setIsOurCustom(true);
          setOurPins([]); // reset pins for new image
          triggerToast("자사 이미지가 업로드 되었습니다.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompetitorImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompetitorImage(event.target.result as string);
          setIsCompetitorCustom(true);
          setCompetitorPins([]); // reset pins for new image
          triggerToast("경쟁사 이미지가 업로드 되었습니다.");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset custom images back to current preset
  const resetToPreset = (side: "our" | "competitor" | "all") => {
    const preset = PRESET_SCENARIOS.find(p => p.id === activePresetId);
    if (!preset) return;

    if (side === "our" || side === "all") {
      setOurImage(svgToBase64(preset.ourSvg));
      setOurNotes(preset.ourNotes);
      setIsOurCustom(false);
      setOurPins([
        { id: 1, x: 25, y: 35, text: "핵심 결제 요약 카드 배치 (시선의 안식처)" },
        { id: 2, x: 50, y: 88, text: "단 하나의 명확한 최우선 CTA 버튼" }
      ]);
    }
    if (side === "competitor" || side === "all") {
      setCompetitorImage(svgToBase64(preset.competitorSvg));
      setCompetitorNotes(preset.competitorNotes);
      setIsCompetitorCustom(false);
      setCompetitorPins([
        { id: 1, x: 50, y: 15, text: "사용자 시선을 분산시키는 고자극 할인 배너 팝업" },
        { id: 2, x: 60, y: 90, text: "경쟁 관계의 붉은 버튼과 파란 버튼 복수 배치" }
      ]);
    }
    
    // reset to precomputed report
    const precomputed = MOCK_REPORTS[activePresetId];
    if (precomputed) {
      setAnalysisReport(precomputed);
    }

    triggerToast("프리셋 기본 상태로 복원되었습니다.");
  };

  // --- DRAG AND DROP HANDLERS ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (side: "our" | "competitor") => {
    if (side === "our") setOurDragging(true);
    else setCompetitorDragging(true);
  };

  const handleDragLeave = (side: "our" | "competitor") => {
    if (side === "our") setOurDragging(false);
    else setCompetitorDragging(false);
  };

  const handleDrop = (e: React.DragEvent, side: "our" | "competitor") => {
    e.preventDefault();
    if (side === "our") setOurDragging(false);
    else setCompetitorDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          if (side === "our") {
            setOurImage(event.target.result as string);
            setIsOurCustom(true);
            setOurPins([]); // reset annotations
            triggerToast("자사 이미지가 드롭 업로드 되었습니다.");
          } else {
            setCompetitorImage(event.target.result as string);
            setIsCompetitorCustom(true);
            setCompetitorPins([]); // reset annotations
            triggerToast("경쟁사 이미지가 드롭 업로드 되었습니다.");
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // --- PIN & SHAPE MANAGEMENT INTERACTIONS ---
  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>, side: "our" | "competitor") => {
    if (pinMode !== side) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    setPendingPinCoords({ x, y });
    setActivePinText("");
    // Give default shape options when launching
    setPendingPinType("pin");
    setPendingPinSize(15);
    setPendingPinColor(side === "our" ? "indigo" : "rose");
  };

  const savePendingPin = () => {
    if (!pendingPinCoords || !pinMode) return;

    const typeDesc = pendingPinType === "pin" ? "핀" : pendingPinType === "rect" ? "사각형" : "원";
    const textToSave = activePinText.trim() || `${typeDesc} 영역 (#${(pinMode === "our" ? ourPins : competitorPins).length + 1})`;
    const newPin = {
      id: Date.now(),
      x: pendingPinCoords.x,
      y: pendingPinCoords.y,
      text: textToSave,
      type: pendingPinType,
      size: pendingPinType === "pin" ? undefined : pendingPinSize,
      color: pendingPinColor
    };

    if (pinMode === "our") {
      setOurPins([...ourPins, newPin]);
    } else {
      setCompetitorPins([...competitorPins, newPin]);
    }

    setPendingPinCoords(null);
    setPinMode("none");
    triggerToast(`비주얼 ${typeDesc} 어노테이션이 생성되었습니다.`);
  };

  const deletePin = (id: number, side: "our" | "competitor") => {
    if (side === "our") {
      setOurPins(ourPins.filter(p => p.id !== id));
    } else {
      setCompetitorPins(competitorPins.filter(p => p.id !== id));
    }
    triggerToast("어노테이션이 제거되었습니다.");
  };

  // --- TRIGGER ACTION: API ANALYZE ---
  const handleStartAnalysis = async () => {
    setLoading(true);
    setApiError(null);

    const targetCategory = category === "기타 (직접 작성)" ? customCategory : category;

    // Build descriptions of user-drawn shapes to guide Gemini
    const ourAnnotationsPrompt = ourPins.length > 0 
      ? ` [자사 어노테이션 정보]: ` + ourPins.map((p, idx) => `#${idx+1}(위치:${p.x}%,${p.y}%, 모양:${p.type || "pin"}, 크기:${p.size || "기본"}, 메모:${p.text})`).join(", ")
      : "";
    const competitorAnnotationsPrompt = competitorPins.length > 0 
      ? ` [경쟁사 어노테이션 정보]: ` + competitorPins.map((p, idx) => `#${idx+1}(위치:${p.x}%,${p.y}%, 모양:${p.type || "pin"}, 크기:${p.size || "기본"}, 메모:${p.text})`).join(", ")
      : "";

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ourImage,
          competitorImage,
          ourUrl,
          competitorUrl,
          category: targetCategory,
          ourNotes: `${ourNotes}${ourAnnotationsPrompt}`,
          competitorNotes: `${competitorNotes}${competitorAnnotationsPrompt}`,
          customPrompt
        })
      });

      if (!response.ok) {
        throw new Error(await response.text() || "서버와 연결을 시도하는 중에 장애가 발생했습니다.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAnalysisReport(data);
      triggerToast("✨ Gemini AI 심층 비교 분석이 완료되었습니다!");
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "분석 결과를 받아오지 못했습니다.");
      
      // Fallback in case of server failures / lack of key - user gets a professional diagnostic warning
      if (!analysisReport) {
        const fall = MOCK_REPORTS[activePresetId] || MOCK_REPORTS["ecommerce-checkout"];
        setAnalysisReport(fall);
      }
    } finally {
      setLoading(false);
    }
  };

  // --- ACTIONS ---
  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    triggerToast("🔗 공유 가능한 분석 링크가 클립보드에 복사되었습니다!");
  };

  // Export to simple text report
  const exportToTxt = () => {
    if (!analysisReport) return;
    const notesStr = `[자사·경쟁사 비주얼 분석 스포트라이트]\n\n` +
      `● 카테고리: ${category}\n` +
      `● 자사 컨셉 개요: ${analysisReport.overview.ourBrief}\n` +
      `● 경쟁사 컨셉 개요: ${analysisReport.overview.competitorBrief}\n\n` +
      `[정량 디자인 스코어]\n` +
      `- 자사: 레이아웃(${analysisReport.designComparison.ourScores.layout}), 서체(${analysisReport.designComparison.ourScores.typography}), 색조(${analysisReport.designComparison.ourScores.colors}), CTA(${analysisReport.designComparison.ourScores.cta})\n` +
      `- 경쟁사: 레이아웃(${analysisReport.designComparison.competitorScores.layout}), 서체(${analysisReport.designComparison.competitorScores.typography}), 색조(${analysisReport.designComparison.competitorScores.colors}), CTA(${analysisReport.designComparison.competitorScores.cta})\n\n` +
      `[정성 종합 리뷰]\n${analysisReport.designComparison.qualitativeReview}\n` +
      `추천 실행 과제:\n` +
      analysisReport.recommendations.map((r, i) => `${i + 1}. [우선순위: ${r.priority}] ${r.title}\n - ${r.description}`).join("\n");
    
    navigator.clipboard.writeText(notesStr);
    triggerToast("📋 텍스트 리포트 전체가 클립보드에 복사되었습니다!");
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20">
      
      {/* Toast Alert popups */}
      {toastMessage && (
        <div id="toast" className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 backdrop-blur text-white px-5 py-3 rounded-full shadow-2xl text-xs font-semibold flex items-center gap-2 border border-slate-700/50 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER Component (Aligned to Sleek Interface mandate) */}
      <header id="header-bar" className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black tracking-tighter shadow-md shadow-indigo-200">
            C
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-slate-800">
                COMPARE<span className="text-indigo-600">INSIGHT</span>
              </h1>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-widest">
                AI Pro
              </span>
            </div>
            <p className="text-[10px] font-medium text-slate-500">자사 및 경쟁사 실시간 비주얼 인텔리전트 허브</p>
          </div>
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center space-x-2">
          <button 
            id="btn-print"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.8 h-9 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PDF 저장 / 인쇄</span>
          </button>
          
          <button 
            id="btn-share"
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.8 h-9 bg-indigo-600 rounded-lg text-xs font-bold text-white hover:bg-indigo-700 transition active:scale-95 shadow-md shadow-indigo-100"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>공유하기</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-[1400px] mx-auto px-4 mt-6 space-y-6">
        
        {/* TOP: PREMIUM PRESET SCENARIOS PICKER */}
        <section id="preset-selector-pane" className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs print:hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-600 mb-1">
                <Layers className="w-4 h-4" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-600">시뮬레이션 분석 프리셋</h3>
              </div>
              <h2 className="text-lg font-bold text-slate-800">준비된 시나리오로 즉시 비교해 보세요</h2>
              <p className="text-xs text-slate-500 mt-0.5">상단 시나리오를 선택하면 정밀 비교용 SVG 그래픽 모델 및 예시 분석 리포트가 즉각 세팅됩니다.</p>
            </div>
            <div className="text-xs text-slate-500 font-medium bg-slate-100 border border-slate-200 rounded-lg p-2.5 max-w-sm">
              <span className="font-extrabold text-indigo-600">💡 나만의 분석:</span> 자사/경쟁사 칸의 업로드 버튼을 사용해 실제 캡처한 이미지(PNG, JPG)를 자유롭게 업로드하여 진짜 비즈니스 자료를 비교 진단하세요.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {PRESET_SCENARIOS.map((preset) => {
              const isActive = activePresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  id={`preset-btn-${preset.id}`}
                  onClick={() => {
                    setActivePresetId(preset.id);
                    setIsOurCustom(false);
                    setIsCompetitorCustom(false);
                  }}
                  className={`relative p-4 rounded-xl border text-left transition ${
                    isActive
                      ? "bg-indigo-50/75 border-indigo-300 ring-2 ring-indigo-600/15"
                      : "bg-slate-50 hover:bg-slate-100/70 border-slate-200"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                      isActive ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600"
                    }`}>
                      {preset.category}
                    </span>
                    {isActive && <Check className="w-4 h-4 text-indigo-600 font-extrabold" />}
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">{preset.title}</h4>
                  <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 h-7">{preset.explanation}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* MIDDLE: COMPARATOR CONTROLLER */}
        <section id="comparison-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* 1. LEFT PANE - OUR COMPANY */}
          <div className={`col-span-1 lg:col-span-12 xl:col-span-5 flex flex-col space-y-4 ${compareMode === "slider" ? "hidden xl:flex" : ""}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative">
              
              {/* Header inside pane */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping"></span>
                  <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full absolute"></div>
                  <h3 className="font-bold text-sm text-slate-800">자사 (Our Company)</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 border text-slate-600 font-mono px-2 py-0.5 rounded-md font-semibold">
                    {isOurCustom ? "유저 업로드 파일" : "프리셋 기본 팩"}
                  </span>
                  {isOurCustom && (
                    <button 
                      id="reset-our-btn"
                      onClick={() => resetToPreset("our")}
                      className="text-[10px] text-rose-500 underline hover:text-rose-700 transition"
                    >
                      기본 복원
                    </button>
                  )}
                </div>
              </div>

              {/* Homepage Link URL */}
              <div className="mb-4">
                <label className="block text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                  <span>자사 홈페이지 주소 (자동 텍스트 분석 및 크롤링)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={ourUrl}
                    onChange={(e) => {
                      setOurUrl(e.target.value);
                      if (e.target.value && !isOurCustom) {
                        setIsOurCustom(true);
                      }
                    }}
                    placeholder="예: https://www.oursite.com (실시간 텍스트 크롤링 대상)"
                    className="w-full bg-slate-50 text-xs px-3 py-2 pl-8 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder-slate-400 font-mono text-indigo-600 transition-all animate-fade-in"
                  />
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Image viewport */}
              <div 
                id="our-image-container"
                onClick={(e) => handleImageClick(e, "our")}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter("our")}
                onDragLeave={() => handleDragLeave("our")}
                onDrop={(e) => handleDrop(e, "our")}
                className={`relative h-[480px] bg-slate-900 rounded-xl overflow-hidden border transition-all duration-200 flex items-center justify-center group ${
                  pinMode === "our" ? "cursor-crosshair ring-2 ring-indigo-500" : ""
                } ${ourDragging ? "ring-4 ring-dashed ring-indigo-500 bg-slate-800 scale-[1.01]" : "border-slate-200"}`}
              >
                {ourImage ? (
                  <>
                    <img 
                      src={ourImage} 
                      alt="Our Design Layout" 
                      className="w-full h-full object-contain pointer-events-none selective-img" 
                    />
                    
                    {/* Floating Pins & Shapes Layer */}
                    {ourPins.map((pin, i) => {
                      const shapeType = pin.type || "pin";
                      const sizeVal = pin.size || 15;
                      const clrKey = pin.color || "indigo";
                      const colorSet = COLOR_MAPPING[clrKey] || COLOR_MAPPING.indigo;

                      return (
                        <div
                          key={pin.id}
                          id={`our-pin-${pin.id}`}
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                          onClick={(e) => {
                            e.stopPropagation(); // don't trigger parent click
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group/pin"
                        >
                          {shapeType === "pin" ? (
                            <div className={`w-7 h-7 ${colorSet.bg} text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center font-black text-xs cursor-pointer hover:scale-110 active:scale-95 transition-all`}>
                              {i + 1}
                            </div>
                          ) : shapeType === "rect" ? (
                            <div 
                              style={{ width: `${sizeVal * 3}px`, height: `${sizeVal * 2}px` }}
                              className={`-translate-x-1/2 -translate-y-1/2 border-2 border-dashed ${colorSet.border} ${colorSet.fill} rounded-lg flex items-center justify-center cursor-pointer transition-all hover:brightness-110`}
                            >
                              <span className={`px-1.5 py-0.5 rounded bg-white text-[10px] font-black border ${colorSet.border} ${colorSet.text} shadow-xs`}>
                                {i + 1}
                              </span>
                            </div>
                          ) : (
                            <div 
                              style={{ width: `${sizeVal * 2.5}px`, height: `${sizeVal * 2.5}px` }}
                              className={`-translate-x-1/2 -translate-y-1/2 border-2 border-dashed ${colorSet.border} ${colorSet.fill} rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-110`}
                            >
                              <span className={`px-1.5 py-0.5 rounded bg-white text-[10px] font-black border ${colorSet.border} ${colorSet.text} shadow-xs`}>
                                {i + 1}
                              </span>
                            </div>
                          )}

                          {/* Pin Tooltip text on hover */}
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 backdrop-blur text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 group-hover/pin:opacity-100 transition duration-200 pointer-events-none z-20 border border-slate-700">
                            <p className={`font-bold ${colorSet.text} mb-0.5`}>포인트 #{i + 1} ({shapeType === "pin" ? "핀" : shapeType === "rect" ? "사각형" : "원"})</p>
                            {pin.text}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs">자사 이미지가 등록되지 않았습니다.</p>
                    <p className="text-[10px] text-slate-500 mt-1">파일을 이 영역에 드래그 앤 드롭해서 업로드 하세요.</p>
                  </div>
                )}

                {/* Crop or dark overlay for pinMode instructions */}
                {pinMode === "our" && (
                  <div className="absolute inset-0 bg-indigo-900/20 pointer-events-none flex items-start justify-center pt-4">
                    <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg animate-pulse flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      비주얼을 클릭하여 핀/도형 영역을 마킹하세요
                    </span>
                  </div>
                )}
              </div>

              {/* Pin Annotator action trigger bar */}
              <div className="mt-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    id="toggle-pin-our"
                    onClick={() => setPinMode(pinMode === "our" ? "none" : "our")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      pinMode === "our" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/50"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{pinMode === "our" ? "선택 중..." : "새 도형 및 주석 추가"}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">특정 부분을 마킹하고 텍스트 코멘트를 달아 분석에 연동합니다.</span>
                </div>
                
                {/* Upload Custom Image button */}
                <button
                  id="btn-upload-our-img"
                  onClick={() => ourFileRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-bold transition active:scale-95"
                >
                  <Upload className="w-3 h-3 text-slate-500" />
                  <span>내 사진 업로드</span>
                </button>
                <input 
                  type="file" 
                  ref={ourFileRef} 
                  onChange={handleOurImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Pending pin dialog inside layout */}
              {pendingPinCoords && pinMode === "our" && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-4">
                  <div className="flex items-center gap-1 text-indigo-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-extrabold">좌표 ({pendingPinCoords.x}%, {pendingPinCoords.y}%) 에 어노테이션 마킹</span>
                  </div>

                  {/* Config options */}
                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-indigo-100">
                    {/* Shape Selector */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">어노테이션 형태 선택</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-0.5 rounded-lg">
                        {(["pin", "rect", "circle"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setPendingPinType(t)}
                            className={`py-1 rounded text-[10px] font-bold transition ${
                              pendingPinType === t ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-800"
                            }`}
                          >
                            {t === "pin" ? "핀" : t === "rect" ? "사각형" : "원"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">마킹 테두리 색상</label>
                      <div className="flex gap-1.5 items-center h-7">
                        {(["indigo", "emerald", "rose", "amber", "violet"] as const).map((c) => {
                          const cl = COLOR_MAPPING[c];
                          return (
                            <button
                              key={c}
                              onClick={() => setPendingPinColor(c)}
                              className={`w-4 h-4 rounded-full ${cl.bg} transition-all ${
                                pendingPinColor === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : "opacity-80"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Size slide for shapes */}
                  {pendingPinType !== "pin" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                        <span>도형 상대 크기 조절 (Percentage Size)</span>
                        <span>{pendingPinSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="40" 
                        value={pendingPinSize} 
                        onChange={(e) => setPendingPinSize(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-500">주석 핵심 설명글 (Text Comment)</label>
                    <textarea
                      rows={2}
                      value={activePinText}
                      onChange={(e) => setActivePinText(e.target.value)}
                      placeholder="예: '레이아웃 여백이 넓어 눈이 한결 편안함' 또는 '동작 버튼 크기가 큼'"
                      className="w-full bg-white text-xs p-2.5 border border-indigo-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setPendingPinCoords(null)}
                      className="px-3 py-1.5 bg-white text-slate-600 rounded-md text-[10px] font-bold border border-slate-200 hover:bg-slate-50"
                    >
                      취소
                    </button>
                    <button 
                      onClick={savePendingPin}
                      className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold shadow-md shadow-indigo-100"
                    >
                      확인 후 마킹 저장
                    </button>
                  </div>
                </div>
              )}

              {/* List of active Pins */}
              {ourPins.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">내가 지정한 핵심 비주얼 분석 포인트 ({ourPins.length})</p>
                  <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                    {ourPins.map((pin, idx) => {
                      const mapping = COLOR_MAPPING[pin.color || "indigo"] || COLOR_MAPPING.indigo;
                      return (
                        <div key={pin.id} className="flex items-start justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg text-[11px] gap-2">
                          <div className="flex gap-2">
                            <span className={`w-5 h-5 shrink-0 text-white rounded-md flex items-center justify-center font-bold ${mapping.bg} text-[10px]`}>
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-slate-600 leading-relaxed font-semibold">
                                {pin.text} 
                              </span>
                              <span className="text-[9px] bg-slate-200 border text-slate-600 font-bold px-1 py-0 rounded ml-1 uppercase">
                                {pin.type || "pin"}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => deletePin(pin.id, "our")}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 shrink-0"
                            title="핀 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text notes */}
              <div className="mt-4">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">자사 참고 기재안 (AI 프롬프트 반영)</label>
                <textarea
                  rows={2}
                  value={ourNotes}
                  onChange={(e) => setOurNotes(e.target.value)}
                  placeholder="자료 분석 시 반영할 세부 제품 컨셉이나 타겟 소비자층, 제약 조건 등을 적으세요."
                  className="w-full bg-slate-50/75 text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

            </div>
          </div>

          {/* 2. CENTER PANEL OR FLOATING SLIDER / RUN ACTION COLUMN */}
          <div className="col-span-1 lg:col-span-12 xl:col-span-2 flex flex-col space-y-4 items-stretch justify-center h-full self-start">
            
            {/* Split view or Slider toggle selector */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2.5">화면 비교 모드</span>
              
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  id="tab-mode-side"
                  onClick={() => setCompareMode("side-by-side")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-md transition ${
                    compareMode === "side-by-side"
                      ? "bg-white text-indigo-600 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Eye className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">나란히 보기</span>
                </button>

                <button
                  id="tab-mode-slider"
                  onClick={() => setCompareMode("slider")}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-md transition ${
                    compareMode === "slider"
                      ? "bg-white text-indigo-600 shadow-xs font-bold"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Sliders className="w-4 h-4 mb-1" />
                  <span className="text-[10px]">겹쳐서 비교</span>
                </button>
              </div>

              {compareMode === "slider" && (
                <div id="slider-calibration" className="mt-3 bg-indigo-50/50 rounded-lg p-2 text-[10px] text-indigo-700 font-medium">
                  스윕(Sweep) 슬라이더가 켜졌습니다. 이미지 위에 마우스를 대고 가로로 이동하거나 슬라이더를 당겨보세요.
                </div>
              )}
            </div>

            {/* Core configuration parameters for the comparative engine */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b pb-1">핵심 진단 정보 설정</span>
              
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">분석 도메인 카테고리</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="랜딩 페이지 및 UI/UX">랜딩 페이지 및 UI/UX 구조</option>
                  <option value="제품 패키지 디자인">제품 패키지 디자인</option>
                  <option value="광고 배너 및 마케팅 소재">광고 배너 및 마케팅 소재</option>
                  <option value="테크니컬 디자인 & 대시보드">테크니컬 대시보드 및 지표</option>
                  <option value="기타 (직접 작성)">기타 (직접 작성 법)</option>
                </select>
              </div>

              {category === "기타 (직접 작성)" && (
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">카테고리 직접 기상</label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="예: 모바일 전용 인앱 위젯"
                    className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">스페셜 포커스 가이드 (옵션)</label>
                <textarea
                  rows={3}
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="예: '레이아웃 직관성과 최우선 CTA 버튼 가시성 비교에 특별히 신경 써줘' 등"
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-lg p-2 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Run Analysis Trigger Button */}
            <div className="bg-white/90 backdrop-blur rounded-2xl border border-slate-200 p-4 shadow-sm text-center space-y-2">
              <button
                id="btn-trigger-analyze"
                onClick={handleStartAnalysis}
                disabled={loading}
                className="w-full py-4.5 rounded-xl text-xs font-bold text-white transition flex flex-col items-center justify-center gap-1.5 shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse fill-yellow-300" />
                )}
                <span className="text-sm font-black tracking-tight">{loading ? "비교 정밀 스캔 중..." : "Gemini AI 원클릭 분석"}</span>
              </button>
              
              <p className="text-[10px] text-slate-400">
                기본 프리셋 분석 결과는 서버 호출 없이 즉시 완성도 높게 표출되고 있습니다. 원하는 이미지를 추가한 뒤 AI 버튼을 눌러보세요.
              </p>
            </div>

          </div>

          {/* 3. RIGHT PANE - COMPETITOR */}
          <div className={`col-span-1 lg:col-span-12 xl:col-span-5 flex flex-col space-y-4 ${compareMode === "slider" ? "hidden xl:flex" : ""}`}>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs relative">
              
              {/* Header inside pane */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                  <h3 className="font-bold text-sm text-slate-800">경쟁사 (Competitor)</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-slate-100 border text-slate-600 font-mono px-2 py-0.5 rounded-md font-semibold">
                    {isCompetitorCustom ? "유저 업로드 파일" : "프리셋 기본 팩"}
                  </span>
                  {isCompetitorCustom && (
                    <button 
                      id="reset-competitor-btn"
                      onClick={() => resetToPreset("competitor")}
                      className="text-[10px] text-rose-500 underline hover:text-rose-700 transition"
                    >
                      기본 복원
                    </button>
                  )}
                </div>
              </div>

              {/* Homepage Link URL */}
              <div className="mb-4">
                <label className="block text-[10px] font-extrabold text-rose-600 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span>경쟁사 홈페이지 주소 (자동 텍스트 분석 및 크롤링)</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={competitorUrl}
                    onChange={(e) => {
                      setCompetitorUrl(e.target.value);
                      if (e.target.value && !isCompetitorCustom) {
                        setIsCompetitorCustom(true);
                      }
                    }}
                    placeholder="예: https://gmarket.co.kr (실시간 텍스트 크롤링 대상)"
                    className="w-full bg-slate-50 text-xs px-3 py-2 pl-8 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-rose-500 placeholder-slate-400 font-mono text-rose-600 transition-all animate-fade-in"
                  />
                  <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              {/* Image viewport */}
              <div 
                id="competitor-image-container"
                onClick={(e) => handleImageClick(e, "competitor")}
                onDragOver={handleDragOver}
                onDragEnter={() => handleDragEnter("competitor")}
                onDragLeave={() => handleDragLeave("competitor")}
                onDrop={(e) => handleDrop(e, "competitor")}
                className={`relative h-[480px] bg-slate-900 rounded-xl overflow-hidden border transition-all duration-200 flex items-center justify-center group ${
                  pinMode === "competitor" ? "cursor-crosshair ring-2 ring-indigo-500" : ""
                } ${competitorDragging ? "ring-4 ring-dashed ring-rose-500 bg-slate-800 scale-[1.01]" : "border-slate-200"}`}
              >
                {competitorImage ? (
                  <>
                    <img 
                      src={competitorImage} 
                      alt="Competitor Design Layout" 
                      className="w-full h-full object-contain pointer-events-none selective-img" 
                    />
                    
                    {/* Floating Pins & Shapes Layer */}
                    {competitorPins.map((pin, i) => {
                      const shapeType = pin.type || "pin";
                      const sizeVal = pin.size || 15;
                      const clrKey = pin.color || "rose";
                      const colorSet = COLOR_MAPPING[clrKey] || COLOR_MAPPING.rose;

                      return (
                        <div
                          key={pin.id}
                          id={`competitor-pin-${pin.id}`}
                          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                          onClick={(e) => {
                            e.stopPropagation(); // don't trigger parent click
                          }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group/pin"
                        >
                          {shapeType === "pin" ? (
                            <div className={`w-7 h-7 ${colorSet.bg} text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center font-black text-xs cursor-pointer hover:scale-110 active:scale-95 transition-all`}>
                              {i + 1}
                            </div>
                          ) : shapeType === "rect" ? (
                            <div 
                              style={{ width: `${sizeVal * 3}px`, height: `${sizeVal * 2}px` }}
                              className={`-translate-x-1/2 -translate-y-1/2 border-2 border-dashed ${colorSet.border} ${colorSet.fill} rounded-lg flex items-center justify-center cursor-pointer transition-all hover:brightness-110`}
                            >
                              <span className={`px-1.5 py-0.5 rounded bg-white text-[10px] font-black border ${colorSet.border} ${colorSet.text} shadow-xs`}>
                                {i + 1}
                              </span>
                            </div>
                          ) : (
                            <div 
                              style={{ width: `${sizeVal * 2.5}px`, height: `${sizeVal * 2.5}px` }}
                              className={`-translate-x-1/2 -translate-y-1/2 border-2 border-dashed ${colorSet.border} ${colorSet.fill} rounded-full flex items-center justify-center cursor-pointer transition-all hover:brightness-110`}
                            >
                              <span className={`px-1.5 py-0.5 rounded bg-white text-[10px] font-black border ${colorSet.border} ${colorSet.text} shadow-xs`}>
                                {i + 1}
                              </span>
                            </div>
                          )}

                          {/* Pin Tooltip text on hover */}
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 w-48 bg-slate-900/95 backdrop-blur text-white text-[10px] p-2 rounded-lg shadow-xl opacity-0 hover:opacity-100 group-hover/pin:opacity-100 transition duration-200 pointer-events-none z-20 border border-slate-700">
                            <p className={`font-bold ${colorSet.text} mb-0.5`}>포인트 #{i + 1} ({shapeType === "pin" ? "핀" : shapeType === "rect" ? "사각형" : "원"})</p>
                            {pin.text}
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="text-center p-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 stroke-1 mx-auto mb-2 text-slate-500" />
                    <p className="text-xs">경쟁사 이미지가 등록되지 않았습니다.</p>
                    <p className="text-[10px] text-slate-500 mt-1">파일을 이 영역에 드래그 앤 드롭해서 업로드 하세요.</p>
                  </div>
                )}

                {/* pinMode instructions overlay */}
                {pinMode === "competitor" && (
                  <div className="absolute inset-0 bg-indigo-900/20 pointer-events-none flex items-start justify-center pt-4">
                    <span className="bg-indigo-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg animate-pulse flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      비주얼을 클릭하여 핀/도형 영역을 마킹하세요
                    </span>
                  </div>
                )}
              </div>

              {/* Pin Annotator action trigger bar */}
              <div className="mt-3 flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                <div className="flex items-center gap-2">
                  <button
                    id="toggle-pin-competitor"
                    onClick={() => setPinMode(pinMode === "competitor" ? "none" : "competitor")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition ${
                      pinMode === "competitor" 
                        ? "bg-indigo-600 text-white" 
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100/50"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{pinMode === "competitor" ? "선택 중..." : "새 도형 및 주석 추가"}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 hidden sm:inline">특정 부분을 마킹하고 텍스트 코멘트를 달아 분석에 연동합니다.</span>
                </div>
                
                {/* Upload Custom Image button */}
                <button
                  id="btn-upload-competitor-img"
                  onClick={() => competitorFileRef.current?.click()}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-md text-xs font-bold transition active:scale-95"
                >
                  <Upload className="w-3 h-3 text-slate-500" />
                  <span>내 사진 업로드</span>
                </button>
                <input 
                  type="file" 
                  ref={competitorFileRef} 
                  onChange={handleCompetitorImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              {/* Pending pin dialog inside layout */}
              {pendingPinCoords && pinMode === "competitor" && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-4">
                  <div className="flex items-center gap-1 text-indigo-800">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-extrabold">좌표 ({pendingPinCoords.x}%, {pendingPinCoords.y}%) 에 어노테이션 마킹</span>
                  </div>

                  {/* Config options */}
                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-indigo-100">
                    {/* Shape Selector */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">어노테이션 형태 선택</label>
                      <div className="grid grid-cols-3 gap-1 bg-slate-200/60 p-0.5 rounded-lg">
                        {(["pin", "rect", "circle"] as const).map((t) => (
                          <button
                            key={t}
                            onClick={() => setPendingPinType(t)}
                            className={`py-1 rounded text-[10px] font-bold transition ${
                              pendingPinType === t ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-800"
                            }`}
                          >
                            {t === "pin" ? "핀" : t === "rect" ? "사각형" : "원"}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selector */}
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1">마킹 테두리 색상</label>
                      <div className="flex gap-1.5 items-center h-7">
                        {(["indigo", "emerald", "rose", "amber", "violet"] as const).map((c) => {
                          const cl = COLOR_MAPPING[c];
                          return (
                            <button
                              key={c}
                              onClick={() => setPendingPinColor(c)}
                              className={`w-4 h-4 rounded-full ${cl.bg} transition-all ${
                                pendingPinColor === c ? "ring-2 ring-offset-2 ring-indigo-600 scale-110" : "opacity-80"
                              }`}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Size slide for shapes */}
                  {pendingPinType !== "pin" && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-500">
                        <span>도형 상대 크기 조절 (Percentage Size)</span>
                        <span>{pendingPinSize}px</span>
                      </div>
                      <input 
                        type="range" 
                        min="5" 
                        max="40" 
                        value={pendingPinSize} 
                        onChange={(e) => setPendingPinSize(Number(e.target.value))}
                        className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="block text-[10px] font-black text-slate-500">주석 핵심 설명글 (Text Comment)</label>
                    <textarea
                      rows={2}
                      value={activePinText}
                      onChange={(e) => setActivePinText(e.target.value)}
                      placeholder="예: '과도한 장식용 타이포그래피로 중요 문자가 보령화됨' 등"
                      className="w-full bg-white text-xs p-2.5 border border-indigo-200 rounded-lg focus:outline-hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setPendingPinCoords(null)}
                      className="px-3 py-1.5 bg-white text-slate-600 rounded-md text-[10px] font-bold border border-slate-200 hover:bg-slate-50"
                    >
                      취소
                    </button>
                    <button 
                      onClick={savePendingPin}
                      className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-md text-[10px] font-bold shadow-md shadow-indigo-100"
                    >
                      확인 후 마킹 저장
                    </button>
                  </div>
                </div>
              )}

              {/* List of active Pins */}
              {competitorPins.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">내가 지정한 핵심 비주얼 분석 포인트 ({competitorPins.length})</p>
                  <div className="grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                    {competitorPins.map((pin, idx) => {
                      const mapping = COLOR_MAPPING[pin.color || "rose"] || COLOR_MAPPING.rose;
                      return (
                        <div key={pin.id} className="flex items-start justify-between bg-slate-50 border border-slate-100 p-2 rounded-lg text-[11px] gap-2">
                          <div className="flex gap-2">
                            <span className={`w-5 h-5 shrink-0 text-white rounded-md flex items-center justify-center font-bold ${mapping.bg} text-[10px]`}>
                              {idx + 1}
                            </span>
                            <div>
                              <span className="text-slate-600 leading-relaxed font-semibold">
                                {pin.text} 
                              </span>
                              <span className="text-[9px] bg-slate-200 border text-slate-600 font-bold px-1 py-0 rounded ml-1 uppercase">
                                {pin.type || "pin"}
                              </span>
                            </div>
                          </div>
                          <button 
                            onClick={() => deletePin(pin.id, "competitor")}
                            className="text-slate-400 hover:text-rose-500 transition-colors p-1 shrink-0"
                            title="핀 삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Text notes */}
              <div className="mt-4">
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">경쟁사 참고 기재안 (AI 프롬프트 반영)</label>
                <textarea
                  rows={2}
                  value={competitorNotes}
                  onChange={(e) => setCompetitorNotes(e.target.value)}
                  placeholder="경쟁사 디자인 제품의 취약점이나 전사적 소문 등을 기록해 프롬프트에 자동 주입시키세요."
                  className="w-full bg-slate-50/75 text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-hidden"
                />
              </div>

            </div>
          </div>

          {/* 4. OVERLAY SWEEP SLIDER WORKSPACE (FULL WIDTH REPLACEMENT WHEN ACTIVE ON LARGE SCREENS) */}
          {compareMode === "slider" && (
            <div id="sweep-slider-workspace" className="col-span-1 lg:col-span-12 xl:col-span-10 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    인터랙티브 겹쳐서 비교 프레임 (Interactive Sweep Overlay)
                  </h3>
                  <p className="text-xs text-slate-500">슬라이더를 좌우로 드래그하여 자사 디자인(좌)과 경쟁사 디자인(우)의 픽셀 균형, 여백감을 직관적으로 교차 비교해 보세요.</p>
                </div>
                <button
                  onClick={() => setCompareMode("side-by-side")}
                  className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                >
                  기본 나란히 보기로 가기
                </button>
              </div>

              {/* Interactive Slide Viewer Canvas */}
              <div className="relative h-[550px] bg-slate-900 rounded-2xl overflow-hidden border border-slate-300 shadow-inner flex items-center justify-center">
                
                {/* Background Image: Competitor (Right Side basically) */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                  <img src={competitorImage} alt="Competitor" className="w-full h-full object-contain select-none" />
                  <div className="absolute top-4 right-4 bg-rose-600/90 text-white backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg">경쟁사 영역 (Right Side)</div>
                </div>

                {/* Foreground Image: Ours (Left side with clipping width) */}
                <div 
                  className="absolute inset-y-0 left-0 h-full overflow-hidden flex items-center"
                  style={{ width: `${sliderPosition}%`, borderRight: "2.5px solid #4f46e5" }}
                >
                  <div className="absolute inset-0 w-full h-[550px] flex items-center justify-center" style={{ width: "100%" }}>
                    <div className="absolute inset-0 w-[550px] md:w-[1000px] lg:w-[1240px] xl:w-[1400px] h-full flex items-center justify-center left-1/2 -translate-x-1/2">
                      <img src={ourImage} alt="Ours" className="w-full h-full object-contain select-none" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-indigo-600/90 text-white backdrop-blur text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg z-20">자사 영역 (Left Side)</div>
                </div>

                {/* Sweep handle Indicator */}
                <div 
                  className="absolute inset-y-0 z-20 w-1 pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                    <Sliders className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Invisible slider input for desktop cursor interaction covering the container */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
                />

              </div>

              {/* Slider Controller Manual bar */}
              <div className="flex items-center space-x-4 bg-slate-50 border border-slate-200.5 rounded-xl p-3">
                <span className="text-xs font-extrabold text-slate-500 whitespace-nowrap">자사 비주얼 투사비율</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="w-full accent-indigo-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <span className="text-xs font-mono font-bold text-indigo-600 w-12 text-right">{sliderPosition}%</span>
              </div>
            </div>
          )}

        </section>

        {/* LOADING SHIMMERING EFFECT & PROD LOGS PANEL */}
        {loading && (
          <section id="analyzer-loading-screen" className="bg-white rounded-2xl border border-indigo-200 p-8 shadow-md text-center max-w-2xl mx-auto space-y-4 animate-pulse">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 relative">
              <Sparkles className="w-8 h-8 animate-spin" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>
            
            <h3 className="text-lg font-extrabold text-slate-800">Gemini AI가 두 시각 디자인을 정 밀 대조 중입니다</h3>
            <p className="text-slate-500 text-xs">잠시만 기다려 주시면 픽셀 분석, 컬러 조화 분석, SWOT 스키마 도출을 수행합니다.</p>
            
            {/* Dynamic log tracer line */}
            <div className="bg-slate-900 text-emerald-400 font-mono text-[11px] p-3 rounded-lg max-w-md mx-auto text-left shadow-inner border border-slate-700">
              <span className="text-slate-400 mr-2">&gt;</span> 
              <span>{loadingSteps[loadingStep]}</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 max-w-md mx-auto overflow-hidden">
              <div 
                className="bg-indigo-600 h-full transition-all duration-1000" 
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              ></div>
            </div>
          </section>
        )}

        {/* API Warning block if apiError holds custom issues */}
        {apiError && (
          <section id="api-error-banner" className="bg-rose-50 border border-rose-200 p-4 rounded-xl max-w-4xl mx-auto flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800">
              <p className="font-extrabold">AI 실시간 진단 API 주의 알림</p>
              <p className="mt-1 font-medium">{apiError}</p>
              <p className="mt-2 text-slate-600">
                ※ 클라이언트 단독 구동 모드로 전환하여, 선택된 프리셋에 매칭된 고품격 벤치마크 데이터를 화면 하단에 안전하게 우선 채워두었습니다. AI Studio 우측 비밀번호 설정 패널에 <span className="font-mono bg-white px-1 py-0.5 border rounded">GEMINI_API_KEY</span>를 등록하시면 완전히 새로운 커스텀 업로드 스크린샷 비교 진단이 가능해집니다.
              </p>
            </div>
          </section>
        )}

        {/* BOTTOM: ANALYTICAL RESULTS REVEAL PANEL */}
        {analysisReport && !loading && (
          <section id="analysis-report-dashboard" className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm animate-fade-in print:border-none print:shadow-none">
            
            {/* Report Accent Ribbon header */}
            <div className="bg-slate-900 text-white px-6 md:px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-indigo-400 text-xs font-extrabold uppercase tracking-widest block mb-1">PRO REPORT DASHBOARD</span>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                    <FileCheck className="w-5 h-5 text-emerald-400" />
                    디자인 정밀 분석 및 대안 전략 리포트
                  </h2>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                    인공지능 진단 완료
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">자사와 경쟁사의 제품 시각적 유도 강도를 다각 분석한 결과입니다.</p>
              </div>

              {/* Report specific mini-actions */}
              <div className="flex items-center gap-2">
                <button
                  id="btn-copy-brief"
                  onClick={exportToTxt}
                  className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-lg text-[11px] font-bold transition active:scale-95"
                  title="전체 리포트를 텍스트 형식으로 복사"
                >
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>리포트 복사</span>
                </button>
              </div>
            </div>

            {/* Content Modules split */}
            <div className="p-6 md:p-8 space-y-8">
              
              {/* SECTION 1: OVERVIEW COMPACT CARDS */}
              <div id="module-overview">
                <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-1.5 pb-2 border-b">
                  <Info className="w-4 h-4 text-slate-400" />
                  1. 비교 대상 컨셉 개요 (Overview)
                </h4>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Our side */}
                  <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span>
                        <h5 className="font-extrabold text-xs text-indigo-950 uppercase">자사 컨셉 스코프</h5>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {analysisReport.overview.ourBrief}
                      </p>
                    </div>
                    {ourPins.length > 0 && (
                      <div className="mt-3 text-[10px] text-indigo-700 font-semibold bg-white p-2 rounded-lg border border-indigo-100 inline-block">
                        📍 유저 체크 포인트 {ourPins.length}곳 매핑 참여 중
                      </div>
                    )}
                  </div>

                  {/* Competitor side */}
                  <div className="bg-rose-50/50 rounded-2xl p-5 border border-rose-100 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span>
                        <h5 className="font-extrabold text-xs text-rose-950 uppercase">경쟁사 컨셉 스코프</h5>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        {analysisReport.overview.competitorBrief}
                      </p>
                    </div>
                    {competitorPins.length > 0 && (
                      <div className="mt-3 text-[10px] text-rose-700 font-semibold bg-white p-2 rounded-lg border border-rose-100 inline-block">
                        📍 경쟁사 특이 영역 {competitorPins.length}곳 매핑 참여 중
                      </div>
                    )}
                  </div>

                  {/* Key Difference Comparison */}
                  <div className="bg-slate-100 rounded-2xl p-5 border border-slate-200.5">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <ArrowRight className="w-4 h-4 text-slate-700" />
                      <h5 className="font-extrabold text-xs text-slate-900 uppercase">비주얼 및 비즈니스적 대조점</h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                      {analysisReport.overview.keyDifferenceSummary}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 1.5: VISUAL CHARACTERISTICS AUTOMATED ANALYSIS */}
              {analysisReport.visualCharacteristics && (
                <div id="module-visual-characteristics">
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-1.5 pb-2 border-b">
                    <Layers className="w-4 h-4 text-slate-400" />
                    2. 비주얼 주요 특징 분석 (Visual Characteristics)
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Grid: Palettes and Styles */}
                    <div className="space-y-6">
                      
                      {/* Color Palette Panel */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                        <h5 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full"></span>
                          색상 팔레트 및 배색 조합 (Color Palette)
                        </h5>
                        
                        <div className="grid grid-cols-2 gap-4">
                          {/* Ours */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-indigo-600 uppercase">자사 브랜드 배색</span>
                            <div className="flex gap-2">
                              {analysisReport.visualCharacteristics.colorPalette.ourColors.map((color, idx) => (
                                <div key={idx} className="group relative">
                                  <div 
                                    className="w-11 h-11 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
                                    style={{ backgroundColor: color.hex }}
                                  >
                                    <span className="text-[8px] font-black mix-blend-difference text-white uppercase">{color.hex}</span>
                                  </div>
                                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                                    <p className="font-bold text-indigo-400">{color.name}</p>
                                    <p className="text-[9px] text-slate-300">{color.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1 pt-1 bg-white p-2 rounded-lg border border-slate-100">
                              {analysisReport.visualCharacteristics.colorPalette.ourColors.map((color, idx) => (
                                <div key={idx} className="text-[10px] text-slate-600 leading-normal">
                                  <b>{color.name}</b>: {color.desc}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Competitor */}
                          <div className="space-y-3">
                            <span className="text-[10px] font-bold text-rose-600 uppercase">경쟁사 브랜드 배색</span>
                            <div className="flex gap-2">
                              {analysisReport.visualCharacteristics.colorPalette.competitorColors.map((color, idx) => (
                                <div key={idx} className="group relative">
                                  <div 
                                    className="w-11 h-11 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center cursor-pointer hover:scale-105 transition-all" 
                                    style={{ backgroundColor: color.hex }}
                                  >
                                    <span className="text-[8px] font-black mix-blend-difference text-white uppercase">{color.hex}</span>
                                  </div>
                                  <div className="absolute top-12 left-1/2 -translate-x-1/2 w-48 bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition pointer-events-none z-30">
                                    <p className="font-bold text-rose-400">{color.name}</p>
                                    <p className="text-[9px] text-slate-300">{color.desc}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="space-y-1 pt-1 bg-white p-2 rounded-lg border border-slate-100">
                              {analysisReport.visualCharacteristics.colorPalette.competitorColors.map((color, idx) => (
                                <div key={idx} className="text-[10px] text-slate-600 leading-normal">
                                  <b>{color.name}</b>: {color.desc}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Objects & Elements Detector */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                        <h5 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full"></span>
                          감지된 그래픽 객체 및 오브젝트 (Objects Detected)
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">자사 식별 요소</span>
                            <div className="flex flex-wrap gap-1.5">
                              {analysisReport.visualCharacteristics.objectsAndElements.ourObjects.map((obj, idx) => (
                                <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-[10px] font-semibold px-2.5 py-1 rounded-md">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">경쟁사 식별 요소</span>
                            <div className="flex flex-wrap gap-1.5">
                              {analysisReport.visualCharacteristics.objectsAndElements.competitorObjects.map((obj, idx) => (
                                <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-semibold px-2.5 py-1 rounded-md">
                                  {obj}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Right Grid: Styles/Textures and Similarities/Differences Summary */}
                    <div className="space-y-6">
                      
                      {/* Textures and Styles Aspect */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                        <h5 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full"></span>
                          표면 재질감 및 양식 비교 (Styles & Textures)
                        </h5>
                        <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-indigo-600 block border-b pb-1 mb-1">자사 기법</span>
                            {analysisReport.visualCharacteristics.texturesAndStyles.ourStyles.map((style, idx) => (
                              <p key={idx} className="text-slate-700 leading-relaxed font-semibold">• {style}</p>
                            ))}
                          </div>
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-bold text-rose-600 block border-b pb-1 mb-1">경쟁사 기법</span>
                            {analysisReport.visualCharacteristics.texturesAndStyles.competitorStyles.map((style, idx) => (
                              <p key={idx} className="text-slate-700 leading-relaxed font-semibold">• {style}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Visual Similarities & Differences */}
                      <div className="bg-indigo-50/25 border border-indigo-100/70 rounded-2xl p-5 space-y-3">
                        <h5 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full"></span>
                          시각적 상호 대조 분석 (Comparison Summary)
                        </h5>
                        <div className="space-y-3">
                          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block mb-1">상호 유사점 (Similarities)</span>
                            {analysisReport.visualCharacteristics.comparisonSummary.similarities.map((item, idx) => (
                              <p key={idx} className="text-xs text-slate-700 font-semibold leading-relaxed">• {item}</p>
                            ))}
                          </div>
                          <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-100">
                            <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider block mb-1">대치되는 차이점 (Differences)</span>
                            {analysisReport.visualCharacteristics.comparisonSummary.differences.map((item, idx) => (
                              <p key={idx} className="text-xs text-slate-700 font-semibold leading-relaxed">• {item}</p>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* SECTION 3: GRAPHICAL METRICS COMPARISON (Design Comparison Scores) */}
              <div id="module-design-comparison">
                <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-1.5 pb-2 border-b">
                  <BarChart3 className="w-4 h-4 text-slate-400" />
                  3. 비주얼 구성 핵심 지표 정량 대조 (Design Scores)
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Left part: Metric progression meters */}
                  <div className="lg:col-span-7 bg-slate-50 border rounded-2xl p-6 space-y-5">
                    <h5 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-2">지표 대조군 바 차트</h5>
                    
                    {/* Layout Index */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>레이아웃 분산도 및 직관성 (Layout Intuitive)</span>
                        <span className="font-mono text-[11px]">자사: <b className="text-indigo-600">{analysisReport.designComparison.ourScores.layout}</b> vs 경쟁사: <b className="text-rose-600">{analysisReport.designComparison.competitorScores.layout}</b></span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex relative">
                        {/* Our share in bar */}
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.ourScores.layout / (analysisReport.designComparison.ourScores.layout + analysisReport.designComparison.competitorScores.layout)) * 100}%` }}
                        >
                          {analysisReport.designComparison.ourScores.layout}
                        </div>
                        {/* Competitor share in bar */}
                        <div 
                          className="bg-rose-500 h-full transition-all duration-1000 flex items-center justify-start pl-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.competitorScores.layout / (analysisReport.designComparison.ourScores.layout + analysisReport.designComparison.competitorScores.layout)) * 100}%` }}
                        >
                          {analysisReport.designComparison.competitorScores.layout}
                        </div>
                      </div>
                    </div>

                    {/* Typography Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>서체 크기 위계 및 타이포 가독성 (Typography Clarity)</span>
                        <span className="font-mono text-[11px]">자사: <b className="text-indigo-600">{analysisReport.designComparison.ourScores.typography}</b> vs 경쟁사: <b className="text-rose-600">{analysisReport.designComparison.competitorScores.typography}</b></span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex relative">
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.ourScores.typography / (analysisReport.designComparison.ourScores.typography + analysisReport.designComparison.competitorScores.typography)) * 100}%` }}
                        >
                          {analysisReport.designComparison.ourScores.typography}
                        </div>
                        <div 
                          className="bg-rose-500 h-full transition-all duration-1000 flex items-center justify-start pl-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.competitorScores.typography / (analysisReport.designComparison.ourScores.typography + analysisReport.designComparison.competitorScores.typography)) * 100}%` }}
                        >
                          {analysisReport.designComparison.competitorScores.typography}
                        </div>
                      </div>
                    </div>

                    {/* Colors Harmony Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>컬러 브랜드 조화 및 감정 연상 (Color Sensation)</span>
                        <span className="font-mono text-[11px]">자사: <b className="text-indigo-600">{analysisReport.designComparison.ourScores.colors}</b> vs 경쟁사: <b className="text-rose-600">{analysisReport.designComparison.competitorScores.colors}</b></span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex relative">
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.ourScores.colors / (analysisReport.designComparison.ourScores.colors + analysisReport.designComparison.competitorScores.colors)) * 100}%` }}
                        >
                          {analysisReport.designComparison.ourScores.colors}
                        </div>
                        <div 
                          className="bg-rose-500 h-full transition-all duration-1000 flex items-center justify-start pl-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.competitorScores.colors / (analysisReport.designComparison.ourScores.colors + analysisReport.designComparison.competitorScores.colors)) * 100}%` }}
                        >
                          {analysisReport.designComparison.competitorScores.colors}
                        </div>
                      </div>
                    </div>

                    {/* CTA Attraction Score */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>행동 유도성 및 CTA 버튼 강력성 (CTA Attraction)</span>
                        <span className="font-mono text-[11px]">자사: <b className="text-indigo-600">{analysisReport.designComparison.ourScores.cta}</b> vs 경쟁사: <b className="text-rose-600">{analysisReport.designComparison.competitorScores.cta}</b></span>
                      </div>
                      <div className="h-4 bg-slate-200 rounded-full overflow-hidden flex relative">
                        <div 
                          className="bg-indigo-600 h-full transition-all duration-1000 flex items-center justify-end pr-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.ourScores.cta / (analysisReport.designComparison.ourScores.cta + analysisReport.designComparison.competitorScores.cta)) * 100}%` }}
                        >
                          {analysisReport.designComparison.ourScores.cta}
                        </div>
                        <div 
                          className="bg-rose-500 h-full transition-all duration-1000 flex items-center justify-start pl-2 text-[9px] font-bold text-white" 
                          style={{ width: `${(analysisReport.designComparison.competitorScores.cta / (analysisReport.designComparison.ourScores.cta + analysisReport.designComparison.competitorScores.cta)) * 100}%` }}
                        >
                          {analysisReport.designComparison.competitorScores.cta}
                        </div>
                      </div>
                    </div>

                    {/* Legend explanatory */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-t">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-indigo-600 rounded"></span>
                        <span>자사 비주얼 우위 비중</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 bg-rose-500 rounded"></span>
                        <span>경쟁사 비주얼 우위 비중</span>
                      </div>
                    </div>

                  </div>

                  {/* Right part: Qualitative review quote summary */}
                  <div className="lg:col-span-5 bg-indigo-50/40 rounded-2xl p-6 border border-indigo-100 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">주요 정성 종합 리뷰</span>
                      <p className="mt-3 text-xs text-indigo-950 font-semibold leading-relaxed whitespace-pre-line italic">
                        "{analysisReport.designComparison.qualitativeReview}"
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                      <span>진단 기준: 시선 동선 일관성</span>
                      <span>심사 등급: AAA-</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 4: COMPREHENSIVE SWOT MATRIX GRID PROGRESSION */}
              <div id="module-swot" className="scroll-mt-20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-2 border-b">
                  <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-slate-400" />
                    4. 자사 vs 경쟁사 세밀 구조화 SWOT 분석 (SWOT Analysis)
                  </h4>
                  
                  {/* SWOT View Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-lg self-start">
                    <button
                      id="swot-tab-compare"
                      onClick={() => setActiveSwotView("compare")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                        activeSwotView === "compare" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      두 진영 SWOT 동시 비교
                    </button>
                    <button
                      id="swot-tab-our"
                      onClick={() => setActiveSwotView("our")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                        activeSwotView === "our" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      자사 SWOT 전용
                    </button>
                    <button
                      id="swot-tab-comp"
                      onClick={() => setActiveSwotView("competitor")}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition ${
                        activeSwotView === "competitor" ? "bg-white text-rose-600 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      경쟁사 SWOT 전용
                    </button>
                  </div>
                </div>

                {/* SWOT 4-QUADRANT VIEW RENDER */}
                {(activeSwotView === "compare" || activeSwotView === "our") && (
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 bg-indigo-600 rounded-full"></span>
                      <h5 className="text-xs font-black text-indigo-950 uppercase tracking-widest">[자사 진영] SWOT 매트릭스</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* Strengths */}
                      <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>S (강점)</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">내부 우월</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.ourSWOT.strengths.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-1">
                              <span className="text-emerald-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-rose-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>W (약점)</span>
                          <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">내부 취약</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.ourSWOT.weaknesses.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-1">
                              <span className="text-rose-400 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Opportunities */}
                      <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-blue-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>O (기회)</span>
                          <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">외부 호재</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.ourSWOT.opportunities.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-1">
                              <span className="text-blue-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Threats */}
                      <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>T (위협)</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">외부 돌발</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.ourSWOT.threats.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-700 leading-relaxed font-semibold flex items-start gap-1">
                              <span className="text-amber-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}

                {(activeSwotView === "compare" || activeSwotView === "competitor") && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-full"></span>
                      <h5 className="text-xs font-black text-rose-950 uppercase tracking-widest">[경쟁사 진영] SWOT 매트릭스</h5>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      
                      {/* Competitor Strengths */}
                      <div className="bg-emerald-50/40 border border-slate-200.5 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>S (강점)</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">시장 우월</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.competitorSWOT.strengths.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-1">
                              <span className="text-emerald-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Competitor Weaknesses */}
                      <div className="bg-rose-50/40 border border-slate-200.5 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>W (약점)</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">지점 취약</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.competitorSWOT.weaknesses.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-1">
                              <span className="text-rose-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Competitor Opportunities */}
                      <div className="bg-blue-50/40 border border-slate-200.5 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>O (기회)</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">기회 확보</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.competitorSWOT.opportunities.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-1">
                              <span className="text-blue-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Competitor Threats */}
                      <div className="bg-amber-50/40 border border-slate-200.5 rounded-2xl p-4.5">
                        <div className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 flex items-center justify-between">
                          <span>T (위협)</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">도발 요인</span>
                        </div>
                        <ul className="space-y-2">
                          {analysisReport.swot.competitorSWOT.threats.map((str, idx) => (
                            <li key={idx} className="text-xs text-slate-600 leading-relaxed font-medium flex items-start gap-1">
                              <span className="text-amber-500 shrink-0 select-none">•</span>
                              {str}
                            </li>
                          ))}
                        </ul>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* SECTION 5: ACTIONABLE RECOMMENDATIONS ORDERED LIST */}
              <div id="module-recommendations">
                <h4 className="text-xs font-black tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-1.5 pb-2 border-b">
                  <FileText className="w-4 h-4 text-slate-400" />
                  5. 자사를 위한 우선 전략 실행 권장 사항 (Strategic Actions)
                </h4>

                <div className="space-y-4">
                  {analysisReport.recommendations.map((rec, idx) => {
                    const isHigh = rec.priority === "상";
                    const isMed = rec.priority === "중";
                    
                    return (
                      <div 
                        key={idx}
                        id={`rec-item-${idx}`} 
                        className={`flex flex-col md:flex-row md:items-start gap-4 p-5 rounded-2xl border transition ${
                          isHigh 
                            ? "bg-rose-50/50 border-rose-200/65" 
                            : isMed 
                              ? "bg-slate-50 border-slate-200" 
                              : "bg-slate-50/50 border-slate-200/50"
                        }`}
                      >
                        {/* Bullet / numeric with priority badge */}
                        <div className="flex items-center md:flex-col gap-2 shrink-0 md:w-24">
                          <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm ${
                            isHigh ? "bg-rose-600 text-white" : "bg-slate-800 text-white"
                          }`}>
                            0{idx + 1}
                          </span>
                          
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider block ${
                            isHigh 
                              ? "bg-rose-100 text-rose-700" 
                              : isMed 
                                ? "bg-indigo-100 text-indigo-700" 
                                : "bg-slate-200 text-slate-600"
                          }`}>
                            우선순위: {rec.priority}
                          </span>
                        </div>

                        {/* Content text block */}
                        <div className="space-y-1">
                          <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">{rec.title}</h5>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium">{rec.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer warning or credits inside dashboard */}
            <div className="bg-slate-50 border-t px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-slate-500">
              <p className="font-medium">CompareInsight Visual Engine • Built securely in Client Sandbox</p>
              <p className="font-mono mt-1 sm:mt-0 font-semibold">{new Date().toISOString().substring(0, 10)} 08:00 UTC</p>
            </div>

          </section>
        )}

      </main>

      {/* PRINT STYLING INJECTED VIA HEAD */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        
        /* High compatibility images resolution */
        .selective-img {
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
        }

        /* Printable Media Queries CSS */
        @media print {
          body {
            background-color: white !important;
            color: black !important;
          }
          #app-container {
            padding-bottom: 0 !important;
          }
          #preset-selector-pane, #header-bar, #btn-trigger-analyze, .print\\:hidden, #toast, #toggle-pin-our, #toggle-pin-competitor, #btn-upload-our-img, #btn-upload-competitor-img, #slider-calibration, #sweep-slider-workspace {
            display: none !important;
          }
          #comparison-workspace {
            grid-template-cols: 1fr 1fr !important;
            gap: 20px !important;
          }
          #our-image-container, #competitor-image-container {
            height: 380px !important;
          }
          #analysis-report-dashboard {
            border: none !important;
            box-shadow: none !important;
            margin-top: 40px !important;
          }
        }
      `}</style>

    </div>
  );
}
