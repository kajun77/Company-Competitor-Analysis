/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PresetScenario {
  id: string;
  title: string;
  category: string;
  ourNotes: string;
  competitorNotes: string;
  analysisSector: string;
  ourSvg: string;
  competitorSvg: string;
  explanation: string;
}

export const svgToBase64 = (svg: string): string => {
  return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
};

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "ecommerce-checkout",
    title: "🛒 이커머스 모바일 결제 랜딩 페이지",
    category: "랜딩 페이지 및 UI/UX",
    ourNotes: "미니멀리즘 기반의 1페이지 간편결제 레이아웃. 행동 촉구(CTA) 버튼을 단 하나로 단순화하고, 모바일 한 손 엄지손가락 터치 반경 내에 핵심 영역을 배치함. 신뢰도를 위한 보안 자격 증명 뱃지 노출.",
    competitorNotes: "전형적인 다단계 결제 구조. 화면 상단에 플래시 할인 타이머가 떠 있고, 제휴 카드 팝업 배너가 여러 개 노출되어 이탈률이 높은 상태. 붉은색의 자극적인 할인 강조 텍스트가 시선을 분산함.",
    analysisSector: "랜딩 페이지 및 UI/UX 구조",
    explanation: "미니멀 지향의 당사 플로우와 다단계 및 자극적 요소가 뒤섞인 경쟁사 랜딩페이지의 구조적 대조군입니다.",
    ourSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #0f172a; font-family: system-ui, sans-serif;">
      <!-- Background Grid -->
      <path d="M 0 50 L 400 50 M 0 100 L 400 100 M 0 200 L 400 200 M 0 300 L 400 300 M 0 400 L 400 400" stroke="#1e293b" stroke-width="1" />
      <path d="M 50 0 L 50 600 M 100 0 L 100 600 M 200 0 L 200 600 M 300 0 L 300 600" stroke="#1e293b" stroke-width="1" />

      <!-- Phone Notch / Bar -->
      <rect x="130" y="8" width="140" height="20" rx="10" fill="#1e293b" />
      <circle cx="150" cy="18" r="4" fill="#334155" />
      <rect x="230" y="16" width="20" height="4" rx="2" fill="#334155" />

      <!-- Header -->
      <text x="30" y="65" font-size="15" font-weight="bold" fill="#38bdf8">OURS</text>
      <text x="30" y="82" font-size="11" fill="#94a3b8">Eco-Pay Checkout (Clean Spec)</text>
      <line x1="30" y1="95" x2="370" y2="95" stroke="#334155" stroke-width="1" />

      <!-- Step Indicator -->
      <rect x="30" y="115" width="340" height="6" rx="3" fill="#1e293b" />
      <rect x="30" y="115" width="280" height="6" rx="3" fill="#10b981" />
      <text x="30" y="140" font-size="12" font-weight="600" fill="#f8fafc">결제 및 주문 확인 (최종 단계)</text>

      <!-- Main Product Card Summary -->
      <rect x="30" y="160" width="340" height="85" rx="12" fill="#1e293b" stroke="#334155" stroke-width="1.5" />
      <rect x="45" y="175" width="55" height="55" rx="8" fill="#334155" />
      <!-- Drawing a simple delivery box inside product thumbnail -->
      <path d="M 60 190 L 72 185 L 85 190 L 85 205 L 72 215 L 60 205 Z" fill="none" stroke="#38bdf8" stroke-width="1.5" />
      <text x="115" y="190" font-size="13" font-weight="bold" fill="#f8fafc">스마트 오가닉 텀블러 에디션</text>
      <text x="115" y="208" font-size="11" fill="#94a3b8">옵션: Forest Green | 수량: 1개</text>
      <text x="115" y="228" font-size="14" font-weight="bold" fill="#10b981">₩ 49,000</text>

      <!-- Payment Method Selection -->
      <text x="30" y="275" font-size="12" font-weight="bold" fill="#94a3b8">결제 수단</text>
      
      <!-- Option 1: Eco Tap (Selected) -->
      <rect x="30" y="290" width="160" height="50" rx="8" fill="#111827" stroke="#10b981" stroke-width="2" />
      <circle cx="50" cy="315" r="7" fill="#10b981" />
      <circle cx="50" cy="315" r="3" fill="#ffffff" />
      <text x="68" y="314" font-size="12" font-weight="bold" fill="#f8fafc">원클릭 에코페이</text>
      <text x="68" y="328" font-size="10" fill="#10b981">배송 1.5% 적립</text>

      <!-- Option 2: General Card -->
      <rect x="210" y="290" width="160" height="50" rx="8" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <circle cx="230" cy="315" r="7" fill="none" stroke="#64748b" stroke-width="1.5" />
      <text x="248" y="318" font-size="12" fill="#94a3b8">기타 신용카드</text>

      <!-- Security Trust Badges -->
      <rect x="30" y="355" width="340" height="40" rx="8" fill="#020617" opacity="0.6" />
      <path d="M 45 375 L 50 380 L 58 370" fill="none" stroke="#10b981" stroke-width="2" />
      <text x="65" y="379" font-size="11" fill="#94a3b8">256-bit SSL 암호화 안전 결제 구동 중</text>

      <!-- Final Pricing breakdown -->
      <text x="30" y="425" font-size="12" fill="#94a3b8">주문 금액</text>
      <text x="330" y="425" font-size="12" fill="#f8fafc" text-anchor="end">₩ 49,000</text>
      <text x="30" y="445" font-size="12" fill="#94a3b8">배송비</text>
      <text x="330" y="445" font-size="12" fill="#10b981" text-anchor="end">무료 배송</text>
      
      <line x1="30" y1="460" x2="370" y2="460" stroke="#334155" stroke-dasharray="3,3" />

      <text x="30" y="485" font-size="14" font-weight="bold" fill="#f8fafc">최종 결제 금액</text>
      <text x="330" y="485" font-size="18" font-weight="bold" fill="#10b981" text-anchor="end">₩ 49,000</text>

      <!-- Single Primary Action Button -->
      <rect x="30" y="515" width="340" height="52" rx="12" fill="#10b981" />
      <text x="200" y="547" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle">₩49,000 안전 결제하기</text>
    </svg>`,
    competitorSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #1c1c1e; font-family: system-ui, sans-serif;">
      <!-- Busy Top Bar Area -->
      <rect x="0" y="0" width="400" height="42" fill="#dc2626" />
      <text x="200" y="26" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">🚨 [특가 임박] 마감 04:12 전 결제시 전원 사은품 증정!</text>

      <!-- Sub Header with weird tabs -->
      <rect x="0" y="42" width="400" height="45" fill="#2c2c2e" />
      <text x="30" y="69" font-size="14" font-weight="bold" fill="#ef4444">COMPETITORS</text>
      <!-- Strange banner link -->
      <rect x="250" y="50" width="120" height="28" rx="14" fill="#eab308" />
      <text x="310" y="68" font-size="10" font-weight="bold" fill="#000000" text-anchor="middle">쿠폰 쿠폰존 입장 > </text>

      <!-- Massive Popup Banner (Intrusive overlay style mockup) -->
      <rect x="25" y="105" width="350" height="110" rx="8" fill="#eab308" stroke="#f59e0b" stroke-width="2" />
      <!-- Close button on popup -->
      <circle cx="360" cy="120" r="10" fill="#ef4444" />
      <text x="360" y="123" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">X</text>
      <!-- Popup content -->
      <text x="45" y="135" font-size="14" font-weight="black" fill="#1c1c1e">지금 생애 첫 간편 카드 등록 시</text>
      <text x="45" y="158" font-size="20" font-weight="black" fill="#ef4444">5,000원 즉시 중복 할인!</text>
      <text x="45" y="180" font-size="11" fill="#4b5563">전용 포인트 제휴 프로모션 (전월 실적 무관)</text>
      <rect x="45" y="188" width="160" height="18" rx="4" fill="#000000" />
      <text x="125" y="200" font-size="9" fill="#eab308" font-weight="bold" text-anchor="middle">지금 추천인 코드 적용받기</text>

      <!-- Order List (Cluttered) -->
      <text x="30" y="240" font-size="11" font-weight="bold" fill="#e5e5ea">선택하신 장바구니 상품 목록 (총 3개중 1개 자동 선택됨)</text>
      <rect x="30" y="250" width="340" height="115" rx="6" fill="#2c2c2e" stroke="#48484a" />
      
      <!-- item 1 -->
      <rect x="40" y="260" width="35" height="35" rx="4" fill="#48484a" />
      <text x="85" y="272" font-size="12" font-weight="bold" fill="#ffffff">프리미엄 보틀 세트 v2</text>
      <text x="85" y="288" font-size="10" fill="#aeaeb2">옵션설정: 노지 실버 (품절 임박)</text>
      <!-- aggressive badges -->
      <rect x="260" y="258" width="50" height="15" rx="2" fill="#ef4444" />
      <text x="285" y="269" font-size="8" font-weight="bold" fill="#fff" text-anchor="middle">품절우려</text>
      <text x="360" y="275" font-size="12" font-weight="bold" fill="#ef4444" text-anchor="end">₩ 62,900</text>
      <text x="360" y="290" font-size="9" fill="#8e8e93" text-decoration="line-through" text-anchor="end">₩ 89,000</text>

      <!-- Shipping selector tabs -->
      <text x="30" y="385" font-size="11" font-weight="bold" fill="#aeaeb2">배송 안내 선택</text>
      <rect x="30" y="395" width="105" height="35" rx="4" fill="#2c2c2e" stroke="#ef4444" stroke-width="1.5" />
      <text x="82" y="416" font-size="10" font-weight="bold" fill="#ef4444" text-anchor="middle">번개총알 배송 (+3,000)</text>
      
      <rect x="145" y="395" width="110" height="35" rx="4" fill="#2c2c2e" />
      <text x="200" y="416" font-size="10" fill="#aeaeb2" text-anchor="middle">일반 안심 우체국</text>

      <rect x="265" y="395" width="105" height="35" rx="4" fill="#2c2c2e" />
      <text x="317" y="416" font-size="10" fill="#aeaeb2" text-anchor="middle">친환경 종이포장 배송</text>

      <!-- Pricing section -->
      <rect x="30" y="440" width="340" height="75" rx="6" fill="#2c2c2e" />
      <text x="40" y="458" font-size="11" fill="#aeaeb2">정상 총액</text>
      <text x="360" y="458" font-size="11" fill="#ffffff" text-anchor="end">₩ 62,900</text>
      <text x="40" y="475" font-size="11" fill="#aeaeb2">전용 카드 청구할인 적용가</text>
      <text x="360" y="475" font-size="11" fill="#ef4444" text-anchor="end">-₩ 5,000</text>
      <text x="40" y="492" font-size="11" fill="#aeaeb2">배송 요금</text>
      <text x="360" y="492" font-size="11" fill="#ffffff" text-anchor="end">+₩ 3,000</text>
      <text x="40" y="508" font-size="11" fill="#eab308">네이버 N페이 마일리지 사용</text>
      <text x="360" y="508" font-size="11" fill="#aeaeb2" text-anchor="end">안함</text>

      <!-- Highly confusing multiple red CTAs with terms -->
      <rect x="30" y="525" width="180" height="40" rx="4" fill="#ef4444" />
      <text x="120" y="549" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">제휴 간편 카드 결제</text>

      <rect x="220" y="525" width="150" height="40" rx="4" fill="#4f46e5" />
      <text x="295" y="549" font-size="11" font-weight="bold" fill="#ffffff" text-anchor="middle">일반 결제 대행창 열기</text>

      <text x="200" y="582" font-size="9" fill="#8e8e93" text-anchor="middle">결제하기를 누르면 위 팝업 적용 약관에 개인정보 활용 동의하는 것으로 간주합니다.</text>
    </svg>`
  },
  {
    id: "beverage-packaging",
    title: "Eco 친환경 유기농 음료 미니멀 패키지 비교",
    category: "제품 패키지 디자인",
    ourNotes: "100% 생분해성 재생 종이 리사이클 드링크 드래프트. 자연의 차분한 허브 감성을 주는 파스텔 올리브 백그라운드. 잉크 소비를 줄이는 우아하고 가느다란 라인 일러스트 위주의 드로잉. 산세리프 서체를 극도로 절제하여 명품 오가닉 에센셜 강조.",
    competitorNotes: "원색 위주의 고농도 색소 탄산 에너지 드링크 캔 비주얼. 화려한 네온 보라-블루 원색 그라데이션에 번개 모양 라이트닝 및 폭발 효과를 투사하여 강렬하지만 피로도가 무척 높음. 굵고 공격적인 슬래브 세리프 영문 폰트 장식.",
    analysisSector: "패키지 그래픽 및 타이포그래피",
    explanation: "친환경/미니멀 올가 코어 제품 컨셉과 고자극 에너지 원색 그래픽의 브랜드 아이덴티티 시각 대조군입니다.",
    ourSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #f7f6f0; font-family: 'Times New Roman', serif;">
      <!-- Warm shadows -->
      <rect x="100" y="100" width="200" height="420" rx="24" fill="#fdfcf7" filter="drop-shadow(0 15px 30px rgba(100,90,70,0.08))" stroke="#e0decb" stroke-width="1.5" />
      
      <!-- Eco leaf visual motif -->
      <path d="M 200 130 C 180 180, 160 210, 200 250 C 240 210, 220 180, 200 130 Z" fill="none" stroke="#606c38" stroke-width="1.5" />
      <line x1="200" y1="130" x2="200" y2="250" stroke="#606c38" stroke-width="1" />
      <path d="M 200 170 C 190 180, 192 190, 190 195" fill="none" stroke="#606c38" stroke-width="1" />
      <path d="M 200 195 C 215 190, 212 180, 215 175" fill="none" stroke="#606c38" stroke-width="1" />

      <!-- Minimal Brand Typography -->
      <text x="200" y="295" font-size="22" font-weight="200" fill="#283618" letter-spacing="4" text-anchor="middle" style="font-family: inherit;">H E R B A L</text>
      <text x="200" y="320" font-size="12" font-style="italic" fill="#606c38" text-anchor="middle">Premium Botanical Brewing</text>

      <line x1="150" y1="345" x2="250" y2="345" stroke="#bc6c25" stroke-width="1" stroke-dasharray="1,2" />

      <!-- Description content -->
      <text x="200" y="375" font-size="10" fill="#6e6d5e" text-anchor="middle" style="font-family: sans-serif; letter-spacing: 0.5px;">100% 무농약 허브 카모마일 리프 추출액</text>
      <text x="200" y="392" font-size="10" fill="#6e6d5e" text-anchor="middle" style="font-family: sans-serif; letter-spacing: 0.5px;">인공 보존제 및 당류 0% 비건 블렌딩</text>

      <rect x="175" y="420" width="50" height="2" fill="#bc6c25" />

      <text x="200" y="445" font-size="16" fill="#283618" letter-spacing="2" text-anchor="middle">355 ml</text>
      
      <!-- Small environmental mark seal -->
      <circle cx="200" cy="485" r="14" fill="none" stroke="#283618" stroke-width="1" />
      <text x="200" y="489" font-size="8" font-family="sans-serif" font-weight="bold" fill="#283618" text-anchor="middle">ECO</text>
    </svg>`,
    competitorSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #03001e; font-family: 'Impact', sans-serif;">
      <!-- Saturated energetic background gradient simulated in SVG -->
      <defs>
        <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ec008c" />
          <stop offset="50%" stop-color="#fc6767" />
          <stop offset="100%" stop-color="#1fddff" />
        </linearGradient>
      </defs>

      <!-- Shadows -->
      <rect x="90" y="90" width="220" height="440" rx="40" fill="url(#neonGrad)" stroke="#ffffff" stroke-width="3" filter="drop-shadow(0 20px 40px rgba(236,0,140,0.4))" />
      
      <!-- Aggressive lightning paths overlay -->
      <path d="M 230 110 L 170 230 L 250 250 L 160 380 L 200 390 L 130 490" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
      <path d="M 230 110 L 170 230 L 250 250 L 160 380 L 200 390 L 130 490" fill="none" stroke="#ffeb3b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />

      <!-- Massive Aggressive typography -->
      <text x="200" y="270" font-size="54" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="2" text-anchor="middle" letter-spacing="1" transform="rotate(-6 200 270)">V O L T</text>
      <text x="200" y="315" font-size="34" font-weight="900" fill="#ffff00" stroke="#000000" stroke-width="1.5" text-anchor="middle" letter-spacing="0.5" transform="rotate(-6 200 315)">HYPER DRIVE</text>

      <!-- Glowing badges -->
      <rect x="140" y="350" width="120" height="25" rx="5" fill="#000000" />
      <text x="200" y="367" font-size="12" font-family="Arial, sans-serif" font-weight="bold" fill="#ff007f" text-anchor="middle">🚨 TAURINE 2000mg</text>

      <rect x="110" y="390" width="180" height="34" rx="17" fill="#ffffff" />
      <text x="200" y="413" font-size="16" font-family="Arial, sans-serif" font-weight="black" fill="#000000" text-anchor="middle">💥EXTREME SWEET</text>

      <!-- Nutritional chaos notes -->
      <text x="200" y="455" font-size="11" font-family="Arial, sans-serif" font-weight="bold" fill="#ffffff" text-anchor="middle" opacity="0.9">카페인 첨가 | 합성착향료(체리구아바향)</text>
      <text x="200" y="475" font-size="14" font-family="Arial, sans-serif" font-weight="bold" fill="#ffff00" text-anchor="middle">500ml 대용량 캔</text>
    </svg>`
  },
  {
    id: "saas-dashboard",
    title: "📊 SaaS 관리 콘솔 대시보드 구조 및 인포그래픽",
    category: "테크니컬 디자인 & 대시보드",
    ourNotes: "통계 지표 구분이 명확한 미니멀리즘 다크 대시보드. 핵심 지표 3가지를 최상단 카드에 깔끔한 글자와 미닫이 차트로 대폭 압축. 여백(Padding)을 24px 이상 두어 눈의 피로감을 차단하고, 그라데이션 보조 그래프로 부드러운 전조 감을 형성.",
    competitorNotes: "클라이언트에게 많은 정보를 한 번에 보여주려 설계된 고밀도 복합 레이아웃. 좌측, 우측, 파티션별로 온갖 알림, 경고 빨간색 뱃지, 실시간 데이터 로그 뷰어, 조밀한 표가 미로처럼 배치되어 시선의 집중력을 가로막음.",
    analysisSector: "데이터 인포그래픽 및 시각적 위계",
    explanation: "우아한 지표 정리 및 시각적 격리 구조와 초고밀도 주입식 정보 나열 형태의 SaaS 화면 비교입니다.",
    ourSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #090d16; font-family: system-ui, sans-serif;">
      <!-- Sidebar mini rail -->
      <rect x="0" y="0" width="60" height="600" fill="#030712" />
      <circle cx="30" cy="40" r="15" fill="#3b82f6" opacity="0.1" />
      <rect x="18" y="33" width="24" height="14" rx="4" fill="#3b82f6" />
      <rect x="22" y="80" width="16" height="16" rx="4" fill="#1f2937" />
      <rect x="22" y="120" width="16" height="16" rx="4" fill="#1f2937" />
      <rect x="22" y="160" width="16" height="16" rx="4" fill="#1f2937" />

      <!-- Header -->
      <text x="80" y="45" font-size="16" font-weight="700" fill="#f9fafb">자사 어낼리틱스 콘솔</text>
      <text x="80" y="62" font-size="10" fill="#9ca3af">보안 위기 감지 및 트래픽 현황</text>
      <line x1="80" y1="75" x2="380" y2="75" stroke="#1f2937" />

      <!-- KPI 1 Card -->
      <rect x="80" y="95" width="295" height="110" rx="12" fill="#0f172a" stroke="#1e293b" />
      <text x="100" y="125" font-size="11" font-weight="600" fill="#60a5fa">현재 활성 네트워크 트래픽</text>
      <text x="100" y="158" font-size="28" font-weight="800" fill="#f9fafb">429.5 <tspan font-size="14" font-weight="400" fill="#9ca3af">Gbps</tspan></text>
      <!-- clean little green indicator -->
      <rect x="100" y="172" width="55" height="18" rx="9" fill="#065f46" opacity="0.5" />
      <text x="127" y="185" font-size="9" font-weight="bold" fill="#34d399" text-anchor="middle">▲ 14.2%</text>

      <!-- Draw a nice crisp sparkline -->
      <path d="M 230 160 Q 250 120, 270 140 T 310 130 T 350 110" fill="none" stroke="#3b82f6" stroke-width="2.5" />
      <circle cx="350" cy="110" r="4" fill="#60a5fa" />

      <!-- KPI 2 Card (Server Status Indicator) -->
      <rect x="80" y="220" width="140" height="110" rx="12" fill="#0f172a" stroke="#1e293b" />
      <text x="96" y="245" font-size="11" fill="#9ca3af">클라우드 상태</text>
      <text x="96" y="278" font-size="22" font-weight="700" fill="#10b981">정상 작동</text>
      <text x="96" y="302" font-size="9" fill="#6b7280">지연 편차: 1.8ms</text>
      <!-- Pulse dot -->
      <circle cx="200" cy="242" r="5" fill="#10b981" />

      <!-- KPI 3 Card (Storage) -->
      <rect x="235" y="220" width="140" height="110" rx="12" fill="#0f172a" stroke="#1e293b" />
      <text x="250" y="245" font-size="11" fill="#9ca3af">스토리지 용량</text>
      <text x="250" y="278" font-size="22" font-weight="700" fill="#f9fafb">74%</text>
      <!-- Progress visual -->
      <rect x="250" y="292" width="110" height="6" rx="3" fill="#1e293b" />
      <rect x="250" y="292" width="81" height="6" rx="3" fill="#3b82f6" />

      <!-- Big clean chart area -->
      <rect x="80" y="345" width="295" height="225" rx="12" fill="#0f172a" stroke="#1e293b" />
      <text x="100" y="375" font-size="12" font-weight="bold" fill="#f9fafb">시간별 데이터 유입량 추이</text>
      <circle cx="350" cy="372" r="3" fill="#3b82f6" />
      <text x="340" y="375" font-size="9" fill="#9ca3af" text-anchor="end">실시간 자동 갱신</text>
      
      <!-- clean chart lines -->
      <path d="M 100 520 L 140 480 L 180 495 L 220 420 L 260 450 L 300 395 L 350 410" fill="none" stroke="#2563eb" stroke-width="3" />
      <path d="M 100 520 L 140 480 L 180 495 L 220 420 L 260 450 L 300 395 L 350 410 L 350 530 L 100 530 Z" fill="url(#neonGrad)" opacity="0.1" />
      
      <!-- chart grid lines -->
      <line x1="100" y1="530" x2="350" y2="530" stroke="#1e293b" />
      <line x1="100" y1="480" x2="350" y2="480" stroke="#1e293b" stroke-dasharray="2,2" />
      <line x1="100" y1="430" x2="350" y2="430" stroke="#1e293b" stroke-dasharray="2,2" />
    </svg>`,
    competitorSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="100%" height="100%" style="background-color: #111; font-family: 'Courier New', monospace;">
      <!-- Busy status alerts everywhere -->
      <rect x="0" y="0" width="400" height="30" fill="#b91c1c" />
      <text x="200" y="20" font-size="9" font-weight="bold" fill="#ffffff" text-anchor="middle">🚨 ALERT: 4 Server node nodes exhibiting buffer overflow! Debug immidiately.</text>

      <!-- Sidebar + main menu -->
      <rect x="0" y="30" width="90" height="570" fill="#222" />
      <text x="10" y="60" font-size="10" font-weight="bold" fill="#ff3333">❌ DB_FAIL</text>
      <text x="10" y="85" font-size="10" fill="#00ff00">● SYS_ONLINE</text>
      <text x="10" y="110" font-size="8" fill="#aaa">CPU: 96.8%</text>
      <text x="10" y="125" font-size="8" fill="#aaa">MEM: 82.5%</text>
      <text x="10" y="140" font-size="8" fill="#aaa">HDD: 91.2%</text>
      <text x="10" y="155" font-size="8" fill="#aaa">NET: ERROR</text>

      <!-- Menu links tiny -->
      <text x="10" y="190" font-size="8" fill="#fff" text-decoration="underline">SYSTEM VER></text>
      <text x="10" y="210" font-size="8" fill="#fff" text-decoration="underline">CRONJOB ></text>
      <text x="10" y="230" font-size="8" fill="#fff" text-decoration="underline">MYSQL SETTINGS</text>
      <text x="10" y="250" font-size="8" fill="#fff" text-decoration="underline">REDIS DUMP</text>
      <text x="10" y="270" font-size="8" fill="#fff" text-decoration="underline">LOGOUT API</text>

      <!-- Main Body Header (Cluttered) -->
      <text x="105" y="55" font-size="13" font-weight="900" fill="#fff">복합 통합 시스템 모니터링 관리포털 ver 9.4.1</text>
      <text x="105" y="70" font-size="9" fill="#00ff55">SYS_TIME: 2026-06-11 UTC (REFRESH SECONDS INDEX: 184)</text>

      <!-- Cluttered charts - drawing multiple nested rows -->
      <rect x="105" y="85" width="280" height="150" fill="#000" stroke="#333" />
      <text x="115" y="105" font-size="9" fill="#fff" font-weight="bold">트래픽, 핑, 커넥션, 큐, 로드에널라이저 (중첩 디스플레이)</text>
      
      <!-- Overlapping mess of charts lines -->
      <path d="M 115 220 L 140 180 L 170 210 L 200 130 L 230 190 L 260 120 L 290 200 L 320 110 L 350 190 L 380 95" fill="none" stroke="#ff0000" stroke-width="1.5" />
      <path d="M 115 190 L 140 210 L 170 140 L 200 180 L 230 110 L 260 190 L 290 125 L 320 185 L 350 145 L 380 130" fill="none" stroke="#00ff00" stroke-width="1.5" />
      <path d="M 115 150 L 140 160 L 170 170 L 200 150 L 230 160 L 260 145 L 290 155 L 320 140 L 350 150 L 380 125" fill="none" stroke="#00ffff" stroke-width="1.5" />
      
      <!-- Tiny cluttered numbers -->
      <rect x="115" y="120" width="80" height="40" fill="#1a1a1a" stroke="#ef4444" opacity="0.8" />
      <text x="120" y="132" font-size="8" fill="#ef4444">WARN COUNT</text>
      <text x="120" y="150" font-size="14" fill="#ef4444">9,418 EA</text>

      <rect x="200" y="120" width="80" height="40" fill="#1a1a1a" stroke="#00ff00" opacity="0.8" />
      <text x="205" y="132" font-size="8" fill="#00ff00">ACTIVE PKT</text>
      <text x="205" y="150" font-size="14" fill="#00ff00">12,492 /s</text>

      <!-- Massive dense Data Table -->
      <text x="105" y="255" font-size="10" font-weight="bold" fill="#fff">시스템 소켓 이벤트 커넥션 상세 이력 테이블</text>
      <rect x="105" y="265" width="280" height="215" fill="#1a1a1a" stroke="#333" />
      
      <text x="115" y="285" font-size="8" fill="#00ff00">SOCK_ID      IP_ADDRESS      PORT   STATE        MS</text>
      <line x1="110" y1="292" x2="380" y2="292" stroke="#444" />
      
      <text x="115" y="305" font-size="8" fill="#aaa">#17822-A     192.168.10.22   53921  TIME_WAIT    252</text>
      <text x="115" y="320" font-size="8" fill="#aaa">#17823-C     112.52.128.19   80     ESTABLISHED  18</text>
      <text x="115" y="335" font-size="8" fill="#aaa">#17824-H     10.5.21.3       3306   CLOSE_WAIT   1029</text>
      <text x="115" y="350" font-size="8" fill="#aaa">#17825-F     35.21.198.11    443    ESTABLISHED  12</text>
      <text x="115" y="365" font-size="8" fill="#aaa">#17826-K     14.88.22.1      9001   SYN_SENT     5000</text>
      <text x="115" y="380" font-size="8" fill="#aaa">#17827-M     192.168.1.1     22     CLOSED       0</text>
      <text x="115" y="395" font-size="8" fill="#ef4444">#17828-X     0.0.0.0         4444   LISTEN(FAIL) -</text>
      
      <!-- Bottom complex stats blocks -->
      <rect x="105" y="490" width="135" height="80" fill="#222" />
      <text x="115" y="508" font-size="9" fill="#00ffff">가용량 보정계수</text>
      <text x="115" y="528" font-size="11" fill="#fff">ALPHA_OFFSET: 0.28</text>
      <text x="115" y="544" font-size="11" fill="#fff">BETA_DIV: 1.0592</text>
      <rect x="115" y="552" width="115" height="10" fill="#b91c1c" />

      <rect x="250" y="490" width="135" height="80" fill="#222" />
      <text x="260" y="508" font-size="9" fill="#ffaa00">전역 세그먼트 인덱스</text>
      <text x="260" y="528" font-size="9" fill="#fff">INDEX_NODE: 5,429</text>
      <text x="260" y="544" font-size="9" fill="#fff">QUEUE_LAG: 824ms</text>
      <rect x="260" y="552" width="115" height="10" fill="#eab308" />
    </svg>`
  }
];
