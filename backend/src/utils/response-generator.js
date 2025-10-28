import openai from "../config/openai.js";

const systemPrompt = `
You are an assistant that answers questions based on context from a PDF.
If the context doesn't contain the answer, say you don't know.
Be concise and accurate.
`;

export const generateResponseFromContext = async (question, context) => {
  const userPrompt = `Context: ${context} Question: ${question}`;
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });
  const answer = chatResponse.choices[0].message.content;
  return answer;
};
