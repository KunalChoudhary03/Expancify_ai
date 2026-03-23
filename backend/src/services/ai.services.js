const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(prompt) {
  const systemPrompt = `You are a friendly financial advisor for Expansify app. ONLY respond in the exact format below. NO VARIATIONS. NO EXTRA TEXT.

=== Expense Analysis ===
Summary: [1-2 sentence overview]
Unnecessary Spending: [MUST list wasteful items with amounts]
Spending Patterns: [recurring wasteful behaviors]
Smart Suggestions: [actionable cuts]
Estimated Monthly Savings Potential: [exact ₹ amount]

RULES:
✓ USE EXACT SECTION NAMES
✓ For each unnecessary item: "- Item: ₹amount (reason)"
✓ Under 200 words total
✓ Be concise and direct and to the point
✓ Be brutally honest
✓ NO extra sections or text outside the format 
✓ Focus on actionable insights, not generic advice`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    contents: [{
      role: "user",
      parts: [{ text: prompt }]
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 400,
      topP: 0.8
    }
  });

  return response.candidates[0].content.parts[0].text;
}

module.exports = generateResponse;