require("dotenv").config();

const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

if (!process.env.OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY not found in .env");
  process.exit(1);
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const topics = [
  "Why systems thinking beats framework expertise",
  "The rise of AI-native engineers",
  "Backend engineering in the AI era",
  "Building AI agents in production",
  "Observability as a competitive advantage",
  "What fintech teaches about scale",
  "The future of software engineering",
  "Why product thinking matters for engineers",
  "AI will not replace engineers who understand systems",
  "How great backend engineers think"
];

async function generatePost() {
  try {

    const topic =
      topics[Math.floor(Math.random() * topics.length)];

    console.log(`📝 Topic: ${topic}`);

    const prompt = `
You are an experienced CTO and engineering leader.

Write a LinkedIn post.

Topic:
${topic}

Rules:
- Strong hook
- Thought leadership
- Engineering audience
- No motivational content
- No hustle culture
- Maximum 250 words
- Use clean LinkedIn formatting
- End with a thoughtful question
- Sound like a senior engineer or CTO

Return only the post.
`;

    const response =
      await client.chat.completions.create({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a world-class engineering leader."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8
      });

    const content =
      response.choices[0].message.content;

    if (!fs.existsSync("generated")) {
      fs.mkdirSync("generated");
    }

    const timestamp =
      new Date()
        .toISOString()
        .replace(/:/g, "-");

    const filename =
      path.join(
        "generated",
        `${timestamp}.md`
      );

    fs.writeFileSync(
      filename,
      content,
      "utf8"
    );

    console.log(
      `✅ Generated successfully`
    );

    console.log(
      `📁 File: ${filename}`
    );

  } catch (error) {

    console.error(
      "\n❌ Generation Failed"
    );

    console.error(error);
  }
}

generatePost();