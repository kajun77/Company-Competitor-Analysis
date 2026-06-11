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
  return ai;
};

// API Endpoint for Competitor Visual Analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { 
      ourImage, 
      competitorImage, 
      category = "General Design", 
      ourNotes = "", 
      competitorNotes = "",
      customPrompt = "" 
    } = req.body;

    if (!ourImage || !competitorImage) {
      return res.status(400).json({ error: "자사 이미지와 경쟁사 이미지 모두 업로드되어야 합니다." });
    }

    const client = initGemini();
    if (!client) {
      return res.status(500).json({ 
        error: "Gemini API 키가 준비되지 않았습니다. AI 세션을 시작하려면 AI Studio 설정에서 GEMINI_API_KEY를 비밀 암호로 등록해 주세요." 
      });
    }

    // Helper to separate MIME type and Base64 content
    const parseBase64Image = (base64Str: string) => {
      const match = base64Str.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        return { mimeType: match[1], data: match[2] };
      }
      return { mimeType: "image/png", data: base64Str };
    };

    const ourParsed = parseBase64Image(ourImage);
    const competitorParsed = parseBase64Image(competitorImage);

    const ourImagePart = {
      inlineData: {
        mimeType: ourParsed.mimeType,
        data: ourParsed.data
      }
    };

    const competitorImagePart = {
      inlineData: {
        mimeType: competitorParsed.mimeType,
        data: competitorParsed.data
      }
    };

    // Construct precise prompt
    const promptText = `
자사(Our Company) 및 경쟁사(Competitor)의 시각 자료(예: 랜딩 페이지, 광고, 제품 디자인, 가격표 등) 2장을 업로드했습니다.
이 시각 자료들을 기반으로 전문적이고 깊이 있는 '경쟁 및 시각 분석 보고서'를 한국어로 작성해 주세요.

분석 대상 분야(카테고리): ${category}
자사 관련 추가 참고사항: ${ourNotes || "없음"}
경쟁사 관련 추가 참고사항: ${competitorNotes || "없음"}
사용자 요구사항/초점: ${customPrompt || "시각적 우위 요소, 클릭 유도(CTA) 효율성, 레이아웃 직관성 비교 분석"}

두 이미지를 심층 비교하여 구조화된 JSON 데이터로 출력해야 합니다.
보고서는 다음 영역을 포함해야 합니다:
1. 개요 (Overview): 두 시각 자료의 디자인 컨셉 비교 및 핵심 차이점 요점 요약
2. 디자인 품질 점수비교 (Design Comparison): 자사와 경쟁사의 비주얼 요소(레이아웃, 타이포그래피, 컬러 조합, CTA 강력함)를 각각 1에서 10점 사이의 점수로 정량 분석하고 설명 제공
3. 자사 vs 경쟁사 종합 SWOT 분석 (SWOT Analysis): 강점(Strengths), 약점(Weaknesses), 기회(Opportunities), 위협(Threats) 도출
4. 실행 가능한 핵심 개선 제안 (Actionable Recommendations): 자사가 경쟁사를 비주얼, 사용자 정의, CTA 레이아웃 측면에서 확실하게 앞지르기 위해 당장 실행 가능한 3~4가지 구체적 전략적 대안 제시

반드시 제공된 JSON 스키마를 100% 준수하여 응답하십시오. 모든 텍스트 값은 자연스럽고 격식 있는 비즈니스 한국어 톤앤매너로 작성하세요.
`;

    const textPart = { text: promptText };

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      // contents supports an array of parts
      contents: { parts: [ourImagePart, competitorImagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["overview", "designComparison", "swot", "recommendations"],
          properties: {
            overview: {
              type: Type.OBJECT,
              required: ["ourBrief", "competitorBrief", "keyDifferenceSummary"],
              properties: {
                ourBrief: { type: Type.STRING, description: "자사 이미지의 구조 및 컨셉 요약" },
                competitorBrief: { type: Type.STRING, description: "경쟁사 이미지의 구조 및 컨셉 요약" },
                keyDifferenceSummary: { type: Type.STRING, description: "자사 대 경쟁사의 비주얼/비즈니스적 핵심 대조점 요약" }
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
                  description: "각 비주얼 핵심 요소 비교에 대한 심사위원단 관점의 전문적 정성 평가 글"
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
        }
      }
    });

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
