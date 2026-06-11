/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VisualCharacteristics {
  colorPalette: {
    ourColors: Array<{ name: string; hex: string; desc: string }>;
    competitorColors: Array<{ name: string; hex: string; desc: string }>;
  };
  objectsAndElements: {
    ourObjects: string[];
    competitorObjects: string[];
  };
  texturesAndStyles: {
    ourStyles: string[];
    competitorStyles: string[];
  };
  comparisonSummary: {
    similarities: string[];
    differences: string[];
  };
}

export interface AnalysisResponse {
  overview: {
    ourBrief: string;
    competitorBrief: string;
    keyDifferenceSummary: string;
  };
  visualCharacteristics?: VisualCharacteristics;
  designComparison: {
    ourScores: {
      layout: number;
      typography: number;
      colors: number;
      cta: number;
    };
    competitorScores: {
      layout: number;
      typography: number;
      colors: number;
      cta: number;
    };
    qualitativeReview: string;
  };
  swot: {
    ourSWOT: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
    competitorSWOT: {
      strengths: string[];
      weaknesses: string[];
      opportunities: string[];
      threats: string[];
    };
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "상" | "중" | "하" | string;
  }>;
}

export const MOCK_REPORTS: Record<string, AnalysisResponse> = {
  "ecommerce-checkout": {
    visualCharacteristics: {
      colorPalette: {
        ourColors: [
          { name: "Deep Navy (배경)", hex: "#0f172a", desc: "고급스럽고 안정된 핀테크 무드 제공" },
          { name: "Eco Green (CTA)", hex: "#10b981", desc: "친환경적 세련미와 고대비 마킹" },
          { name: "Info Slate (보조)", hex: "#94a3b8", desc: "가시 편안함과 영역 격리를 돕는 폰트" }
        ],
        competitorColors: [
          { name: "Alert Red (배너)", hex: "#dc2626", desc: "극심한 시각 압박 및 조바심 유도" },
          { name: "Caution Yellow (팝업)", hex: "#eab308", desc: "중복 할인을 유입시키는 고채도 영역" },
          { name: "Dark Carbon (메인배경)", hex: "#1c1c1e", desc: "어두운 UI 톤이나 조화가 투박함" }
        ]
      },
      objectsAndElements: {
        ourObjects: [
          "스마트 오가닉 텀블러 에디션 카드 상품 요약",
          "원클릭 에코페이 단일 우선 라디오 초커",
          "256-bit SSL 보안 신뢰 뱃지",
          "무료배송 라벨링 및 심플한 단일 결제 버튼"
        ],
        competitorObjects: [
          "상단 긴박감 자극 타이웃 타이머 전면 배너",
          "중복 가입 혜택을 유도하는 거대한 노란 팝업",
          "품절 가속 및 수량 한정 촉진용 빨간 뱃지",
          "하단 병렬 구조의 혼동 버튼 세션"
        ]
      },
      texturesAndStyles: {
        ourStyles: [
          "납작하고 깨끗한 모던 플랫 벡터 레이아웃",
          "넓은 격리형 카드 공간 분할과 시선 집중형 CTA 전개"
        ],
        competitorStyles: [
          "주입 유도 및 복잡계 기반의 배너 오버레이 연합",
          "경계가 불분명한 보색 위주의 고밀도 스프린트"
        ]
      },
      comparisonSummary: {
        similarities: [
          "두 디자인 모두 모바일 기기 비주얼 시뮬레이션을 위한 포트레이트 종이형 비율 규격 채택",
          "다크 테마(어둠 배경)를 주요 도화지로 삼아 요소 간 고대비 추출 조건 만족"
        ],
        differences: [
          "자사는 단일 CTA로 의사 결정을 대폭 단축하는 한편, 경쟁사는 두 종류 버튼과 팝업으로 시선을 갈기갈기 분할",
          "자사는 녹색과 에코 브랜딩의 차분함이 극대화된 반면, 경쟁사는 인위적인 경고색 장치가 무분별하게 혼재"
        ]
      }
    },
    overview: {
      ourBrief: "자사의 '스마트 에코 결제창'은 절제된 정보와 구조화된 네거티브 스페이스(여백)를 활용한 1페이지 포맷입니다. 모바일 한 손 터치를 적극 배려하여, 불필요한 배너나 부가 정보를 원천 배제하고 사용자가 온전히 결제 금액과 결제 수단 선택에 집중할 수 있도록 구성되었습니다.",
      competitorBrief: "경쟁사 결제 레이아웃은 전형적인 '구매 유도형 다단계 레이아웃'입니다. 화면 상단의 붉은색 타임아웃 타이머, 눈길을 돌리기 위해 배치된 노란색 고강도 카드 할인 팝업, 다단계 요율 정보 및 제휴 마케팅 링크들이 화면 전체를 복잡하게 채우고 있어 이탈률 증가가 우려됩니다.",
      keyDifferenceSummary: "자사가 '미니멀리즘과 심리스한 이탈 방지'에 주력한다면, 경쟁사는 '초단기 고압박 프로모션과 정보의 과밀 주입' 전략을 택하고 있습니다. 자사는 긴 결제 시간 동안 심리적 편안함을 부여하는 반면, 경쟁사는 긴박감을 주어 빠른 결제를 유도하나 피로도와 이탈률이 대단히 높습니다."
    },
    designComparison: {
      ourScores: {
        layout: 9,
        typography: 8,
        colors: 9,
        cta: 9
      },
      competitorScores: {
        layout: 5,
        typography: 6,
        colors: 4,
        cta: 6
      },
      qualitativeReview: "전반적으로 자사의 비주얼 컴포넌트 간 아이덴티티와 간격 설정이 극도로 정밀합니다. 자사는 짙은 네이비 캔버스를 주조로 삼고 민트-그린을 CTA 포인트 컬러로 설정해 세련된 프리미엄 핀테크 무드를 연상시킵니다. 서체 크기 위계도 3수준 이내로 정리해 스캔 기능이 뛰어납니다. 반면, 경쟁사는 강렬한 빨간색 배너, 노란색 팝업, 남색 카드, 오렌지색 뱃지가 혼재하여 시각적 불협화음을 유발합니다. 특히, 하단에 똑같은 시각적 가중치를 지닌 버튼 두 개(제휴결제 vs 일반대행결제)를 둠으로써 사용자의 마지막 결제 인지 부하를 지나치게 증가시키는 치명적인 UX 실책을 저지르고 있습니다."
    },
    swot: {
      ourSWOT: {
        strengths: [
          "단 하나의 압도적 CTA(안전 결제하기)로 의사결정 경로를 극도로 단축함",
          "깔끔한 자격인증 뱃지 노출로 이커머스에서 신뢰도를 보장함",
          "부드러운 다크 테마 일관성으로 야간 결제 시 눈의 피로도를 대폭 완화함"
        ],
        weaknesses: [
          "기존 제휴 채널 및 부속 할인 수단의 선택폭이 너무 가려져 보여 범용성 부족 가능성",
          "프로모션 혜택을 명시적으로 자랑하는 시각적 하이라이트가 심심함"
        ],
        opportunities: [
          "최근 대세인 '원클릭 간편결제' 마켓 트렌드와 가장 부합하는 심리스한 전개",
          "불필요한 배너가 없어 쇼핑몰 브랜드의 고급스러운 프리미엄 고가 라인 구축에 제격"
        ],
        threats: [
          "다양한 중소 제휴사들의 즉시 할인 혜택을 원하는 극가치 소비자들의 이탈",
          "포인트 할인이나 쿠폰 적용 화면을 세분화하여 볼 수 있는 탐색형 유저 지원 부족"
        ]
      },
      competitorSWOT: {
        strengths: [
          "강렬한 기간 한정 세일 타이머 배치로 심리적 충동구매를 극대화하는 촉각 장치 구축",
          "등록 시 즉석 할인 쿠폰 정보를 가득 기입하여 단기 포인트 혜택을 전면 강조함"
        ],
        weaknesses: [
          "시각 정보 과밀화로 인해 복잡한 모바일 화면 속에서 주요 결제 금액 오인 유도",
          "화면 내부의 서로 다른 고대비 포인트 컬러가 4가지 이상 존재하여 시선이 제 갈 길을 잃음",
          "하단에 버튼 2개가 나란히 병렬 배치되어 액션 우선순위 설정 누락"
        ],
        opportunities: [
          "초저가 대량 판매 플랫폼 또는 한정판 드롭형 쇼핑 시스템에 높은 매출 전환 효과 기대"
        ],
        threats: [
          "피드가 복잡하여 오류가 있거나 숨겨진 추가 청구금이 있는지 의구심을 품은 유저 신뢰 이탈",
          "느린 체감 속도 및 복잡함으로 인한 장바구니 최종 포기율 상승 직면"
        ]
      }
    },
    recommendations: [
      {
        title: "혜택 정보의 미니멀한 요약 노출",
        description: "현재 자사 화면은 너무 심플하여 유저가 '내가 할인 혜택을 잘 받았는가'에 대해 안심하기 어렵습니다. 결제 수단 하단 또는 청구 가격표에 경쟁사가 전면에 기입한 'N페이 적립'이나 '쿠폰가 적용완료' 상태를 미니멀한 라인 아이콘 형태로 심리스하게 보완해 주어야 합니다.",
        priority: "상"
      },
      {
        title: "보안 자격 뱃지의 인터랙션 유실 개선",
        description: "256-bit SSL 암호화 안내 부분에 마크뿐만 아니라 클릭 또는 호버 시 작은 툴팁으로 '국내 공인 카드 보안 심사 승인 획득' 안내를 주어, 경쟁사보다 우월한 시스템적 안전 신뢰성을 공고히 구축합시다.",
        priority: "중"
      },
      {
        title: "배달 옵션 셀렉터의 위계 수정",
        description: "경쟁사처럼 지저분한 번개배송 탭 대신, 당사는 무료 배송 배너를 텍스트가 아닌 '친환경 수목 수송 뱃지' 느낌으로 승화해 시각적 퀄리티를 유지하면서 혜택 인지도를 올려야 합니다.",
        priority: "하"
      }
    ]
  },
  "beverage-packaging": {
    visualCharacteristics: {
      colorPalette: {
        ourColors: [
          { name: "Powder Green (메인)", hex: "#606c38", desc: "차분하고 건강한 보태니컬 무드의 자연주의" },
          { name: "Off-White (기본배경)", hex: "#f7f6f0", desc: "천연 무가공 재생 재질 감각의 웜그레이 샌드 배경" },
          { name: "Clay Brown (경계)", hex: "#bc6c25", desc: "식물 줄기나 가을 단풍을 상징하는 따스한 유기농 포인트" }
        ],
        competitorColors: [
          { name: "Hyper Fuchsia (그라디언트 1)", hex: "#ec008c", desc: "뇌를 자극하며 맥박을 고양하는 마젠타 체리" },
          { name: "Pure Yellow (메인 텍스트)", hex: "#ffff00", desc: "시각 수용체 전면에 꽂히는 고대비 라이트닝" },
          { name: "Cyan Spark (보조 그라디언트)", hex: "#1fddff" , desc: "인공적 전해질 및 스페셜 타우린을 연상시키는 네온 스파크" }
        ]
      },
      objectsAndElements: {
        ourObjects: [
          "보태니컬 미니멀 낙엽 수공예 일러스트",
          "우아한 타임즈 뉴 로먼 세리프 로고 엠블럼",
          "ECO 인디케이터 유기농 인증 실 테두리 데칼"
        ],
        competitorObjects: [
          "지그재그형 번개 라이트닝 굵은 전압 드로잉",
          "기울임꼴 파괴 타이포 데칼 2단 배치",
          "타우린 극량 수치 표기 블랙 에너지 뱃지"
        ]
      },
      texturesAndStyles: {
        ourStyles: [
          "재생 섬유와 수채 질감을 살린 오가닉 미니멀 패키징",
          "여백률 75%의 극단적 시선 환류 여과 장치"
        ],
        competitorStyles: [
          "고자극 네온 그라디언트 캔 스프레이 일체형",
          "강도 무제한 고밀도 일렉트로 펑크 임팩트 트렌드"
        ]
      },
      comparisonSummary: {
        similarities: [
          "서로 정중앙 지점에 핵심 브랜드명(HERBAL, VOLT)을 중심 위계로 삼아 좌우 균형 레이아웃 탑재",
          "하단 축에 수량 및 세부 인디케이션 사양 정보를 수직으로 정렬함"
        ],
        differences: [
          "자사는 영양 성분이나 브랜딩을 최대한 감추고 감성을 파고드는 미를 발휘하나, 경쟁사는 기능과 화학 성분을 과시하는 위협 구도",
          "자사는 세리프와 명조로 평화와 럭셔리를 말하나, 경쟁사는 강철 느낌의 산세리프와 볼드로 빠름을 지시"
        ]
      }
    },
    overview: {
      ourBrief: "자사의 '허벌(HERBAL) 보태니컬 드링크' 패키지는 자연 유래 감성을 나타내는 부드러운 오프화이트 및 파우더 그린 배경에, 가는 리프 일러스트레이션을 정중앙에 배치했습니다. 올가 코어 미적 취향에 최적화된 명조 기조의 우아한 로고와 충분한 여백이 특징입니다.",
      competitorBrief: "경쟁사 'VOLT 하이퍼 드라이브'는 고자극 에너지 드링크의 아이덴티티를 그대로 담은 캔 음료입니다. 핑크-오렌지-네온블루로 이어지는 과격한 네온 그라데이션에 흰색의 굵은 번개 이펙트와 볼드한 틸티드(기울어진) 임팩트 폰트가 투사되어 가치 전도가 매우 강렬합니다.",
      keyDifferenceSummary: "자사가 '내적 치유, 비건, 유기농 웰빙, 차분한 자연주의'를 타겟으로 디자인 레이아웃을 극도로 완제했다면, 경쟁사는 '아드레날린 분출, 스릴, 고카페인, 원초적 활력'을 상징화합니다. 비주얼 정반대 극단에서 각자의 페르소나 고객층을 명확하게 타겟팅하고 있습니다."
    },
    designComparison: {
      ourScores: {
        layout: 10,
        typography: 9,
        colors: 10,
        cta: 7
      },
      competitorScores: {
        layout: 7,
        typography: 8,
        colors: 6,
        cta: 8
      },
      qualitativeReview: "자사의 패키지는 하나의 정밀하게 수놓아진 수작업 유기농 제품을 소장하는 듯한 격조 있는 감정을 선물합니다. 여백이 70%가 넘어감에도 전혀 비어 보이지 않으며, 차분한 계열의 갈색 라인과 세리프 로고의 조화가 이끎을 유지합니다. 경쟁사는 대비감이 무척 높아 어디서나 눈에 잘 띄지만 장시간 보았을 때 시신경 피로에 치명적이며, 캔 전면에 타이포 세그먼트와 고자극 뱃지가 마구 우후죽순 붙어있어 중저가 가공 탄산의 뉘앙스를 탈피하기 어렵습니다."
    },
    swot: {
      ourSWOT: {
        strengths: [
          "인스타그램 및 소셜 아우라에 완벽히 부응하는 트렌디한 감성 미니멀 인스타그래머블 비주얼",
          "유제품 및 천연 화장품 라인으로 브랜드 패밀리룩을 확장하기 용이한 가죽형 패턴 스타일",
          "친환경 종이 팩 질감을 직관적으로 대변하는 친자연적 웜 톤의 컬러파레트 사용"
        ],
        weaknesses: [
          "대형 대중 마트의 수많은 형광등 조명 매대 사이에서 묻히거나 눈에 잘 뜨지 않는 약한 보호색 무드",
          "영양 성분 표기가 너무 미려하게 들어가 정보전달 가독성 자체는 저하됨"
        ],
        opportunities: [
          "현재 트렌드인 헬시플레저(Healthy Pleasure) 및 완전 무당/비건 럭셔리 소매 시장에서의 선점 가치 상승",
          "고급 오프라인 편집숍 및 호텔 어메니티 패키지로 입점 러브콜을 받기에 뛰어난 품격"
        ],
        threats: [
          "시선 집중 시간 비중 조사 시 경쟁사의 고대비 그라데이션에 최초 유인력이 크게 뒤처질 리스크"
        ]
      },
      competitorSWOT: {
        strengths: [
          "눈길을 사로잡는 보라색-핑크 3중 네온 파트로 무차별적인 시선 포획력 확보",
          "번개를 형상화하여 파워풀하고 남성적인 고에너지 충족 가치를 극대화"
        ],
        weaknesses: [
          "화학 합성 색소가 가득 첨가된 제품이라는 부정적인 인공 인상을 컬러감에서 풍김",
          "조잡하게 엉킨 영문 서체 레이어로 세련미 및 하이엔드 이미지가 현저하게 저조함"
        ],
        opportunities: [
          "e스포츠 게이머 콜라보, 클럽 주류 조합 음료 제휴 마케팅에 즉각적인 비주얼 합치를 이룸"
        ],
        threats: [
          "젊은 세대마저 탈-고자극 식음료로 트렌드가 돌아설 시, 브랜드 리브랜딩이 매우 고비용일 리스크"
        ]
      }
    },
    recommendations: [
      {
        title: "중심 잎(Leaf) 그래픽의 엠보싱 또는 질감 가공",
        description: "현재 자사 드로잉은 너무 평면적이어서 멀리서 볼 때 가시성이 불리합니다. 오프라인 패키지 구성 시 리프 일러스트 테두리에 은은한 입체 형압(데보싱) 가공 또는 은박 하이라이트를 한 포인트 추가하는 기법을 비주얼에 적극 제안합니다.",
        priority: "상"
      },
      {
        title: "가독성 확보를 위한 영양 뱃지 고해상도 재배치",
        description: "하단 원형 에코 실(Seal) 바로 옆에 작지만 정밀하게 획정된 볼드한 박스 형태로 '0% SUGAR / VEGAN CERTIFIED' 타이틀을 뚜렷이 수직 표기해, 디자인을 깨지 않으면서 핵심 비즈니스 셀링 포인트를 강조해 줍니다.",
        priority: "중"
      },
      {
        title: "브랜드 서체 자간 확장",
        description: "'HERBAL' 메인 문구의 Letter Spacing을 현행보다 20%가량 더 확장하여, 웅장하고 숨 쉴 수 있는 명품 에센셜 무드로 완전히 정착시키길 제안합니다.",
        priority: "하"
      }
    ]
  },
  "saas-dashboard": {
    visualCharacteristics: {
      colorPalette: {
        ourColors: [
          { name: "Cosmic Dark (메인배경)", hex: "#090d16", desc: "고대비 컴포넌트를 받쳐주는 공학적 딥 다크" },
          { name: "Neon Blue (주요트랙)", hex: "#3b82f6", desc: "실시간 패킷 흐름 데이터의 긍정 가시 정보" },
          { name: "Carbon Slate (카드컴프)", hex: "#0f172a", desc: "그림자 및 백라이트 입체를 완성하는 구획 배경" }
        ],
        competitorColors: [
          { name: "Pure Red (전방위 경고)", hex: "#b91c1c", desc: "시각적 스트레스를 최고조로 견인하는 알람 바" },
          { name: "Acid Green (소켓 표기)", hex: "#00ff00", desc: "형광색 터미널 폰트로 레트로성 피로를 유발" },
          { name: "Dark Pitch (구형배경)", hex: "#111111", desc: "디자인 깊이 구획이 누락되어 가독을 방해하는 평면 블랙" }
        ]
      },
      objectsAndElements: {
        ourObjects: [
          "실시간 트래픽 스플라인 보간 부드러운 스파크라인 곡선",
          "클라우드 상태 연출을 위한 초록색 발광 맥박 실린더",
          "스토리지 원형 백분률 이중 대조 가이드 카드"
        ],
        competitorObjects: [
          "상단 거대한 서버 오버플로우 빨간 긴급 경고 띠",
          "붉은색, 초록색, 청색이 서로 뒤엉킨 3종 스크래치 트래픽 라인",
          "SOCK_ID 소켓 원천 이벤트를 날것으로 노출한 로우 그리드 테이블"
        ]
      },
      texturesAndStyles: {
        ourStyles: [
          "백라이트(Glow Blur) 및 입체 카드 셰도우를 함축한 SaaS 네오모피즘 스타일",
          "24px 패딩 마진 규칙에 근거한 완전 스캔 중심 하이테크 레이아웃"
        ],
        competitorStyles: [
          "90년대 무가공 리눅스 터미널 포털 텍스트 레거시 스타일",
          "여백 없이 원초 정보를 한 캔버스에 수집 밀어넣기한 데이터 조밀형"
        ]
      },
      comparisonSummary: {
        similarities: [
          "두 화면 모두 IT 관제/로그 대시보드 시스템을 지지하기 위한 어두운 테마 규격을 가짐",
          "실시간 상태 점검을 위한 인디케이터(정상/에러) 마크와 네트워크 데이터 전대역 차트를 핵심으로 삼음"
        ],
        differences: [
          "자사는 정량화되고 예쁘게 분할된 차트로 고급스러움을 주지만 경쟁사는 날것의 텍스트가 시야를 가득 방해함",
          "자사는 시간별 트래픽을 필터링된 영역 그라데이션 차트로 보여 부드러운 가독성을 제공하는 한편 경쟁사는 난잡한 선들이 겹쳐서 구분이 아예 불가능함"
        ]
      }
    },
    overview: {
      ourBrief: "자사의 '어낼리틱스 콘솔'은 테크 인덱스가 풍부하지만 시선 분산이 안 되도록 검증된 위계에 근거한 다크 무드 대시보드입니다. 심도를 조절해 가장 큰 통합 트래픽 모니터를 위쪽에, 보조 스탯 카드는 균등한 톤으로 아래에 격리하여 중요 지표의 크기 대조가 입체적으로 살아납니다.",
      competitorBrief: "경쟁사 SaaS 대시보드는 모니터링 만능주의를 내세운 주입식 원초 레이아웃입니다. 정돈되지 않은 윈도우 창, 매 줄마다 시뻘건 에러 알람, 의미가 겹치는 세 가지의 붉은/초록/파란 선 그래프가 얽혀 있고, 리눅스 터미널 느낌의 포트 번호 테이블이 엄청난 공간을 장식해 개발 및 관제 피로를 가중시킵니다.",
      keyDifferenceSummary: "자사가 '데이터 가치가 한눈에 정돈되어 이해되는 큐레이팅 리포트' 형태라면, 경쟁사는 '해석되지 않은 로우 데이터(Raw XML Event)의 무조건적 나열'입니다. 자사는 제품 인지에 심적 여유를 주는 격조가 높으나, 경쟁사는 일일이 파싱해야 하는 가공되지 않은 뷰포트를 제공합니다."
    },
    designComparison: {
      ourScores: {
        layout: 9,
        typography: 9,
        colors: 9,
        cta: 8
      },
      competitorScores: {
        layout: 4,
        typography: 5,
        colors: 4,
        cta: 3
      },
      qualitativeReview: "자사는 백라이트 효과(블러와 그라데이션 광원 배치)를 효율적으로 활용하여 깊이감(Isometric Depth)을 우아하게 재현했습니다. 차트 선은 굵고 부드러운 스플라인 보간법 곡선이며, 하단 그라데이션 필을 통해 면 영역 차트의 볼륨감을 살렸습니다. 한편競爭사는 90년대 유행하던 완전 플랫 코딩 그리드와 하이퍼텍스트 스타일링에 갇혀 있습니다. 빨간색 경고들이 마구 번쩍여서 정작 어떤 서버 노드를 먼저 긴급 수리해야 하는지 시각적 우선순위 구조(Visual Hierarchy)가 전형적으로 파괴된 최악의 사태를 보이고 있습니다."
    },
    swot: {
      ourSWOT: {
        strengths: [
          "데이터 시각화 영역의 스펙 분석이 세밀하고 컬러 광원 그라데이션이 세련되며 미려함",
          "화면의 소유감을 드높이는 고급 엔터프라이즈 하이테크 그래픽 테마 적용",
          "왼쪽 사이드 미니 레일 배치로 더 넓은 핵심 데이터 가시 영역을 확보함"
        ],
        weaknesses: [
          "실제 터미널 CLI형 날 것 그대로의 로그 모니터에 길든 레거시 엔지니어층은 '조금 더 빽빽했으면 좋겠다'고 느낄 여백"
        ],
        opportunities: [
          "테크 리포트를 임원진/의사결정권자 대시보드로 브리핑할 때 고품격 가독성을 제공해 B2B 계약 전환율 극대화"
        ],
        threats: [
          "네트워크 장애 상황 속 극대 지표 테이블을 한 화면에 500개씩 뿌릴 때의 반응형 압축 디자인 처리 장치 누락"
        ]
      },
      competitorSWOT: {
        strengths: [
          "정보 조밀도가 비정상적으로 높아 레거시 인프라 하드코어 엔지니어들이 단번에 화면 한 장에서 수백 가지 포트를 볼 수 있음",
          "데이터 테이블이 매우 디테일하여 가공 없는 원천 추적이 즉시 가능"
        ],
        weaknesses: [
          "인지적 카오스로 인해 가벼운 알림과 크리티컬 에러의 분류가 무의미함",
          "테마가 투박하여 타 소프트웨어 및 타 솔루션 세일즈 프레젠테이션 시 올드하고 불편한 인상 발산"
        ],
        opportunities: [
          "특정 폐쇄망 전용 레거시 콘솔 이식 시 기교 없이 빠르게 렌더링 가능한 가벼운 단독 구동 테이블 라이브러리"
        ],
        threats: [
          "경쟁 대시보드들이 대부분 맥 북 스튜디오나 피그마 컴포넌트 형태의 모던 룩으로 전체 이주함에 따라, 미적인 낙후로 인한 솔루션 공급 계약 해지 리스크"
        ]
      }
    },
    recommendations: [
      {
        title: "미니 셸(Shell) 터미널 로그 위젯 추가",
        description: "모던 다크 대시보드의 유려함을 깨지 않으면서 하드코어 엔지니어들의 신뢰감을 높이기 위해, 대시보드 우측 구석에 작고 깨끗한 아코디언 컴포넌트를 열면 흰색 코딩 폰트로 '실시간 보안 소켓 유효성 모니터' 로그가 우아하게 흐르는 프리미엄 커스텀 터미널 패널을 덧대어 줍니다.",
        priority: "상"
      },
      {
        title: "지표 상향/하향 뱃지 시각화 확장",
        description: "현재 당사의 지표 뱃지는 삼각형과 간소한 수치로만 표기되어 있습니다. 시간별 데이터 유동 폭 위에 은은한 마이크로 파티클 애니메이션을 적용하거나 작은 원형 경고 링을 도입하여 액션성을 더 올립니다.",
        priority: "중"
      },
      {
        title: "사이드 미니메뉴 가관성 강화",
        description: "왼쪽 사이드바 아이콘들이 현재 단순한 회색 사각형들로 매겨져 있습니다. 이를 루시드 아이콘 조합 및 액티브 탭 이동 시 섀도 영역이 파랗게 발광하는 링커 효과를 더해 주면, 더욱 우아한 하이엔드 오라를 완성할 수 있습니다.",
        priority: "하"
      }
    ]
  }
};
