import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large base64 uploads for screenshots
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Shared Gemini Client
let ai: GoogleGenAI | null = null;
const initGemini = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ Warning: GEMINI_API_KEY environment variable is not defined.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return };

// Helper function to extract visible HTML text, title, description, and potential CTA button text
async function fetchUrlContent(url: string): Promise<string> {
  if (!url || url.trim() === "") return "";
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second request timeout
    
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "ko,en-US;q=0.7,en;q=0.3"
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      return `[URL 연결 실패: HTTP 상태 코드 ${res.status}]`;
    }
    
    const html = await res.text();
    
    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "제목 없음";
    
    // Extract Meta Description
    let description = "";
    const metaMatches = html.matchAll(/<meta\s+([^>]*?)>/gi);
    for (const match of metaMatches) {
      const contentAttr = match[1].match(/content=["']([\s\S]*?)["']/i);
      const nameAttr = match[1].match(/name=["']description["']/i);
      const propertyAttr = match[1].match(/property=["']og:description["']/i);
      if (contentAttr && (nameAttr || propertyAttr)) {
        description = contentAttr[1].trim();
        break;
      }
    }

    // Try to extract some major CTA elements
    const ctaButtons: string[] = [];
    const btnRegex = /<button[^>]*>([\s\S]*?)<\/button>|<a\s+[^>]*class=["'][^"']*btn[^"']*["'][^>]*>([\s\S]*?)<\/a>/gi;
    let btnMatch;
    let count = 0;
    while ((btnMatch = btnRegex.exec(html)) !== null && count < 6) {
      const btnText = (btnMatch[1] || btnMatch[2] || "").replace(/<[^>]+>/g, "").trim();
      if (btnText && btnText.length > 1 && btnText.length < 30 && !ctaButtons.includes(btnText)) {
        ctaButtons.push(btnText);
        count++;
      }
    }

    // Get body content text
    let bodyText = html;
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
      bodyText = bodyMatch[1];
    }
    
    // Clean up HTML tags to get pure visible text
    bodyText = bodyText.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    bodyText = bodyText.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    bodyText = bodyText.replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, "");
    bodyText = bodyText.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
    bodyText = bodyText.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
    bodyText = bodyText.replace(/<[^>]+>/g, " ");
    bodyText = bodyText.replace(/\s+/g, " ").trim();
    
    let summary = `\n--- URL 분석 정보 [${targetUrl}] ---\n`;
    summary += `* 메인 타이틀(Title): ${title}\n`;
    if (description) summary += `* 검색 메타 설명(Description): ${description}\n`;
    if (ctaButtons.length > 0) summary += `* 감지된 잠재적 행동유도(CTA) 문구: ${ctaButtons.join(", ")}\n`;
    summary += `* 홈페이지 본문 주요 문자 발췌 (텍스트 패턴):\n${bodyText.substring(0, 3200)}\n----------------------------------------\n`;
    
    return summary;
  } catch (err: any) {
    return `\n--- URL 분석 정보 [${targetUrl}] ---\n* 분석 중 오류 발생: ${err.message || err}\n----------------------------------------\n`;
  }
}

// API Endpoint for Competitor Visual Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { 
      ourImage, 
      competitorImage, 
      ourUrl = "",
      competitorUrl = "",
      category = "General Design", 
      ourNotes = "", 
      competitorNotes = "",
      customPrompt = "" 
    } = req.body;

    // Must have either an uploaded image OR a website URL for each party
    if (!ourImage && !ourUrl) {
      return res.status(400).json({ error: "자사 분석을 진행하기 위해 캡처 이미지를 업로드하거나 홈페이지 링크(URL)를 기입해 주십시오." });
    }
    if (!competitorImage && !competitorUrl) {
      return res.status(400).json({ error: "경쟁사 분석을 진행하기 위해 캡처 이미지를 업로드하거나 홈페이지 링크(URL)를 기입해 주십시오." });
    }

    const client = initGemini();
    if (!client) {
      return res.status(500).json({ 
        error: "Gemini API 키가 준비되지 않았습니다. AI 세션을 시작하려면 AI Studio 설정에서 GEMINI_API_KEY를 비밀 암호로 등록해 주세요." 
      });
    }

    // Crawl URLs concurrently if provided
    const ourUrlStr = ourUrl ? ourUrl.trim() : "";
    const competitorUrlStr = competitorUrl ? competitorUrl.trim() : "";

    const [ourWebData, competitorWebData] = await Promise.all([
      ourUrlStr ? fetchUrlContent(ourUrlStr) : Promise.resolve(""),
      competitorUrlStr ? fetchUrlContent(competitorUrlStr) : Promise.resolve("")
    ]);

    // Helper to separate MIME type and Base64 content
    const parseBase64Image = (base64Str: string) => {
      const match = base64Str.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      return { mimeType: "image/png", data: base64Str };
    };

    const parts: any[] = [];

    if (ourImage) {
      const ourParsed = parseBase64Image(ourImage);
      parts.push({
        inlineData: {
          mimeType: ourParsed.mimeType,
          data: ourParsed.data
        }
      });
    }

    if (competitorImage) {
      const competitorParsed = parseBase64Image(competitorImage);
      parts.push({
        inlineData: {
          mimeType: competitorParsed.mimeType,
          data: competitorParsed.data
        }
      });
    }

    // Construct precise prompt with both visual files & scraped HTML text elements
    const promptText = `
자사(Our Company) 및 경쟁사(Competitor)의 홈페이지 비교 자동화 분석 제안입니다.
제공된 홈 페이지 캡처 이미지 또는 크롤링된 실시간 HTML 원문 텍스트 분석에 기반해 신뢰성 있고 구체적인 '경쟁사 대조 비주얼 & 콘텐츠 마케팅 분석 보고서'를 한국어로 성실히 작성하세요.

${ourUrlStr ? `[자사 홈페이지 링크]: ${ourUrlStr}` : ""}
${competitorUrlStr ? `[경쟁사 홈페이지 링크]: ${competitorUrlStr}` : ""}

${ourWebData ? `[자사 실시간 웹사이트 텍스트 정보 스크래핑 데이터]:\n${ourWebData}\n` : ""}
${competitorWebData ? `[경쟁사 실시간 웹사이트 텍스트 정보 스크래핑 데이터]:\n${competitorWebData}\n` : ""}

분석 대상 분야(카테고리): ${category}
자사 관련 추가 참고사항 및 수동 어노테이션 핀 정보: ${ourNotes || "없음"}
경쟁사 관련 추가 참고사항 및 수동 어노테이션 핀 정보: ${competitorNotes || "없음"}
사용자 요구사항/초점: ${customPrompt || "시각적 우위 요소, 클릭 유도(CTA) 효율성, 레이아웃 직관성 비교 분석"}

두 이미지(존재 시)와 크롤링 텍스트를 상호보완적으로 심층 비교하여 구조화된 JSON 데이터로 출력해야 합니다.
보고서는 다음 영역을 포함해야 합니다:
1. 개요 (Overview): 두 시각 자료의 디자인 컨셉 비교, 크롤링된 홈페이지 내용 요약 및 양사 브랜드 가치 제안 핵심 차이점 요약
2. 비주얼 주요 특징 분석(Visual Characteristics): 양사의 주조 색상 팔레트 및 배색 조합(정확한 HEX 스케일 추출 필수, 3가지 색상씩), 감지된 주요 형태/객체/콘텐츠 요소 리스트, 적용된 디자인 양식/질감/스타일 특성, 그리고 양사 간의 시각적 및 유용성 측면 유사점과 차이점 요약 리스트
3. 디자인 품질 점수비교 (Design Comparison): 자사와 경쟁사의 비주얼 요소(레이아웃, 타이포그래피, 컬러 조합, CTA 강력함)를 각각 1에서 10점 사이의 점수로 정량 분석하고 설명 제공
4. 자사 vs 경쟁사 종합 SWOT 분석 (SWOT Analysis): 강점(Strengths), 약점(Weaknesses), 기회(Opportunities), 위협(Threats) 도출
5. 실행 가능한 핵심 개선 제안 (Actionable Recommendations): 자사가 경쟁사를 비주얼, 사용자 정의, CTA 레이아웃 측면에서 확실하게 앞지르기 위해 당장 실행 가능한 3~4가지 구체적 전략적 대안 제시

반드시 제공된 JSON 스키마를 100% 준수하여 응답하십시오. 모든 텍스트 값은 자연스럽고 격식 있는 비즈니스 한국어 톤앤매너로 작성하세요.
`;

    parts.push({ text: promptText });

    const responseSchemaDef = {
      type: Type.OBJECT,
      required: ["overview", "visualCharacteristics", "designComparison", "swot", "recommendations"],
      properties: {
        overview: {
          type: Type.OBJECT,
          required: ["ourBrief", "competitorBrief", "keyDifferenceSummary"],
          properties: {
            ourBrief: { type: Type.STRING, description: "자사 이미지 및 홈페이지의 구조, 컨셉, 가치제안 요약" },
            competitorBrief: { type: Type.STRING, description: "경쟁사 이미지 및 홈페이지의 구조, 컨셉, 가치제안 요약" },
            keyDifferenceSummary: { type: Type.STRING, description: "자사 대 경쟁사의 비주얼/비즈니스적 핵심 대조점 요약" }
          }
        },
        visualCharacteristics: {
          type: Type.OBJECT,
          required: ["colorPalette", "objectsAndElements", "texturesAndStyles", "comparisonSummary"],
          properties: {
            colorPalette: {
              type: Type.OBJECT,
              required: ["ourColors", "competitorColors"],
              properties: {
                ourColors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "hex", "desc"],
                    properties: {
                      name: { type: Type.STRING, description: "색상 분류명 (예: 메인 배경, 타이틀 컬러)" },
                      hex: { type: Type.STRING, description: "HEX 포맷 문자열 (예: #111111)" },
                      desc: { type: Type.STRING, description: "사용 의도 분석 내용" }
                    }
                  }
                },
                competitorColors: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    required: ["name", "hex", "desc"],
                    properties: {
                      name: { type: Type.STRING },
                      hex: { type: Type.STRING },
                      desc: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            objectsAndElements: {
              type: Type.OBJECT,
              required: ["ourObjects", "competitorObjects"],
              properties: {
                ourObjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사 이미지 혹은 홈페이지 텍스트 내에서 판독된 주요 컴포넌트나 그래픽 오브젝트 리스트" },
                competitorObjects: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사 이미지 혹은 홈페이지 텍스트 내에서 판독된 주요 컴포넌트나 그래픽 오브젝트 리스트" }
              }
            },
            texturesAndStyles: {
              type: Type.OBJECT,
              required: ["ourStyles", "competitorStyles"],
              properties: {
                ourStyles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사 디자인이 지닌 스타일 양식 혹은 텍스처 특징" },
                competitorStyles: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사 디자인이 지닌 스타일 양식 혹은 텍스처 특징" }
              }
            },
            comparisonSummary: {
              type: Type.OBJECT,
              required: ["similarities", "differences"],
              properties: {
                similarities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "양 비주얼 및 홈페이지 콘텐츠 간 발견되는 구조적 공통 분모 리스트" },
                differences: { type: Type.ARRAY, items: { type: Type.STRING }, description: "양 비주얼 및 홈페이지 콘텐츠 간 대치되거나 명확한 차이점을 드러내는 요소 리스트" }
              }
            }
          }
        },
        designComparison: {
          type: Type.OBJECT,
          required: ["ourScores", "competitorScores", "qualitativeReview"],
          properties: {
            ourScores: {
              type: Type.OBJECT,
              required: ["layout", "typography", "colors", "cta"],
              properties: {
                layout: { type: Type.INTEGER, description: "레이아웃 완성도 및 구조 점수 (1-10)" },
                typography: { type: Type.INTEGER, description: "서체 가독성 & 이미지 점수 (1-10)" },
                colors: { type: Type.INTEGER, description: "컬러 조화 및 감정 유도 점수 (1-10)" },
                cta: { type: Type.INTEGER, description: "행동유도 요소(Button 등) 명확성 점수 (1-10)" }
              }
            },
            competitorScores: {
              type: Type.OBJECT,
              required: ["layout", "typography", "colors", "cta"],
              properties: {
                layout: { type: Type.INTEGER, description: "경쟁사 레이아웃 점수 (1-10)" },
                typography: { type: Type.INTEGER, description: "경쟁사 타이포그래피 점수 (1-10)" },
                colors: { type: Type.INTEGER, description: "경쟁사 컬러 조화 점수 (1-10)" },
                cta: { type: Type.INTEGER, description: "경쟁사 CTA 요소 점수 (1-10)" }
              }
            },
            qualitativeReview: {
              type: Type.STRING,
              description: "각 비주얼 및 콘텐츠 핵심 요소 비교에 대한 심사위원단 관점의 전문적 정성 평가 글"
            }
          }
        },
        swot: {
          type: Type.OBJECT,
          required: ["ourSWOT", "competitorSWOT"],
          properties: {
            ourSWOT: {
              type: Type.OBJECT,
              required: ["strengths", "weaknesses", "opportunities", "threats"],
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사의 강점 요인들" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사의 약점 요인들" },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사의 기회 요인들" },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "자사의 위협 요인들" }
              }
            },
            competitorSWOT: {
              type: Type.OBJECT,
              required: ["strengths", "weaknesses", "opportunities", "threats"],
              properties: {
                strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사의 강점 요인들" },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사의 약점 요인들" },
                opportunities: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사의 기회 요인들" },
                threats: { type: Type.ARRAY, items: { type: Type.STRING }, description: "경쟁사의 위협 요인들" }
              }
            }
          }
        },
        recommendations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["title", "description", "priority"],
            properties: {
              title: { type: Type.STRING, description: "개선 권장 조치 항목 제목" },
              description: { type: Type.STRING, description: "구체적 적용 방법 및 이유" },
              priority: { type: Type.STRING, description: "우선순위 (상 / 중 / 하)" }
            }
          }
        }
      }
    };

    let response;
    try {
      // 1. Try to invoke with real-time Google Search grounding
      response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchemaDef,
          tools: [{ googleSearch: {} }] // inject search grounding if the models supports
        }
      });
    } catch (searchError: any) {
      console.warn("⚠️ Grounding Search Tool is unavailable or throwing errors. Falling back to default content generation:", searchError);
      // 2. Fallback to standard content generation
      response = await client.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchemaDef
        }
      });
    }

    const textResult = response.text;
    if (!textResult) {
      throw new Error("AI가 빈 응답을 반환했습니다.");
    }

    try {
      const parsedData = JSON.parse(textResult.trim());
      return res.json(parsedData);
    } catch (parseErr) {
      console.error("JSON 파싱 에러:", textResult);
      return res.status(500).json({ 
        error: "AI 분석 결과를 가공하는데 에러가 발생했습니다. 아래 원문 데이터를 참조하십시오.",
        rawText: textResult 
      });
    }

  } catch (err: any) {
    console.error("분석 중 전반적 치명적 에러:", err);
    return res.status(500).json({ error: err.message || "분석 프로세스 도중 장애가 발생했습니다." });
  }
});

// Vite & Static file configurations
const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development server loaded as Express middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("Serving static files in production from dist/");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
