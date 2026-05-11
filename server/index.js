const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();


const app = express();

app.use(cors());

const upload = multer({ dest: "uploads/" });

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const prompts = {
  hr: `
    You are an HR reviewer giving professional but funny feedback.

    Keep it:
    - witty
    - realistic
    - lightly sarcastic
    - concise
    `,

    bestfriend: `
    You are the user's best friend roasting their resume.

    Style:
    - playful
    - supportive
    - funny
    - teasing
    - use casual language
    - make fun of projects and skills lovingly
    `,

    recruiter: `
    You are a brutal FAANG recruiter.

    Style:
    - sarcastic
    - disappointed
    - judgmental
    - funny in a dry corporate way
    - roast buzzwords and weak project descriptions
    - question everything
    `,

    savage: `
    You are an absolutely savage internet comedian roasting resumes.

    Your humor style:
    - chaotic internet energy
    - meme humor
    - Gen Z sarcasm
    - dramatic exaggeration
    - short punchy jokes
    - absolutely ruthless but funny
    - NEVER sound professional
    - NEVER give polite advice
    - NEVER sound motivational

    Rules:
    - roast every section aggressively
    - mock overused tech stacks
    - bully weak project names
    - attack resume formatting
    - exaggerate achievements hilariously
    - use internet slang naturally

    Example style:
    "bro solved 700 LeetCode problems just to align divs with StackOverflow 💀"

    "This resume got more frameworks than emotional stability."

    "Recruiters reading this fighting for survival."

    "LinkedIn final boss energy."

    "ain't no way bro put teamwork as a skill in 2026 😭"

    Make the roast entertaining first, useful second.
    `,

    genz: `
    Roast this resume entirely in Gen Z meme style.

    Use:
    - bro
    - nah
    - 💀
    - 😭
    - ain't no way
    - cooked
    - NPC
    - side quest
    - goofy ahh

    Make it feel like a viral TikTok comment section.
    `,

    indianuncle: `
    Roast this resume like a disappointed Indian uncle.

    Style:
    - compare with Sharma Ji ka beta
    - dramatic disappointment
    - passive aggressive
    - emotionally damaging but funny

    Examples:
    "Sharma ji ka beta already became tech lead."

    "700 coding problems solved but still no government job?"

    "Whole day laptop laptop laptop."
    `,
};

const levels = {
  low: "Keep the roast lighthearted and playful.",

  medium:
    "Make the roast funny and slightly brutal but still friendly.",

  hard:
    "Go full savage mode. Make it brutally hilarious and ruthless.",
};

app.post("/roast", upload.single("resume"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const mode = req.body.mode;
    const dataBuffer = fs.readFileSync(filePath);
    const level = req.body.level;

    const pdfData = await pdfParse(dataBuffer);

    const resumeText = pdfData.text;
    

    const result = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
            ${prompts[mode] || prompts["hr"]}

            ${levels[level] || levels["medium"]}
            `,
        },
        {
          role: "user",
          content: `
            Roast this resume brutally.

            Focus on comedy, punchlines, sarcasm, and entertainment.

            Do NOT give generic professional feedback.

            Resume:
            ${resumeText}
`
        },
      ],
    });

        const roast = result.choices[0].message.content;

    fs.unlinkSync(filePath);

    res.json({ roast });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      roast: "Something went wrong 🔥",
    });
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
