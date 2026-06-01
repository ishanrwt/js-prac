const fs = require('fs');
const path = require('path');

const mdPath = path.join(__dirname, 'JavaScript_Interview_Questions_JTG_Placement.md');
const md = fs.readFileSync(mdPath, 'utf8');

function extractSection(content, header) {
  const regex = new RegExp(`\\*\\*${header}:\\*\\*\\s*\\n([\\s\\S]*?)(?=\\n\\*\\*[A-Z]|\\n---\\s*\\n|$)`, 'i');
  const match = content.match(regex);
  if (!match) return '';
  return match[1].trim();
}

function extractCodeBlock(content, afterLabel) {
  const labelRegex = new RegExp(`\\*\\*${afterLabel}:\\*\\*\\s*\\n`, 'i');
  const labelMatch = content.match(labelRegex);
  if (!labelMatch) return '';

  const start = labelMatch.index + labelMatch[0].length;
  const rest = content.slice(start);
  const codeMatch = rest.match(/^```(?:javascript|js)?\s*\n([\s\S]*?)```/);
  if (codeMatch) return codeMatch[1].trim();
  return rest.split('\n\n')[0].trim();
}

function extractFirstCodeBlock(content) {
  const match = content.match(/```(?:javascript|js)?\s*\n([\s\S]*?)```/);
  return match ? match[1].trim() : '';
}

function parseOptions(content) {
  const optionsSection = extractSection(content, 'Options');
  if (!optionsSection) {
    const altMatch = content.match(/\*\*Options:\*\*\s*\n([\s\S]*?)(?=\n\*\*|\n---)/i);
    if (!altMatch) return null;
  }

  const lines = (optionsSection || content).split('\n');
  const options = [];
  const optionRegex = /^[-*]?\s*([A-Da-d])[.)]\s*(.+)$/;

  for (const line of lines) {
    const m = line.match(optionRegex);
    if (m) {
      options.push({ label: m[1].toUpperCase(), text: m[2].trim() });
    }
  }

  if (options.length >= 2) return options;

  const inlineOptions = content.match(/\*\*([A-D])\)\*\*\s*(.+)/g);
  if (inlineOptions && inlineOptions.length >= 2) {
    return inlineOptions.map((line) => {
      const m = line.match(/\*\*([A-D])\)\*\*\s*(.+)/);
      return { label: m[1], text: m[2].trim() };
    });
  }

  return null;
}

function parseCorrectAnswer(content, options) {
  const answerSection =
    extractSection(content, 'Correct Answer') ||
    extractSection(content, 'Answer') ||
    '';

  if (options) {
    const letterMatch = answerSection.match(/^([A-D])/i);
    if (letterMatch) return letterMatch[1].toUpperCase();
    const found = options.find((o) =>
      answerSection.toLowerCase().includes(o.text.toLowerCase())
    );
    if (found) return found.label;
  }

  return answerSection || null;
}

const sections = md.split(/^## /m).slice(1);
const questions = [];
let currentCategory = '';

for (const section of sections) {
  const lines = section.split('\n');
  const sectionTitle = lines[0].trim();

  if (sectionTitle.startsWith('TABLE OF') ||
      sectionTitle.startsWith('QUICK REFERENCE') ||
      sectionTitle.startsWith('TIPS FOR') ||
      sectionTitle.startsWith('PRACTICE SCHEDULE') ||
      sectionTitle.startsWith('RESOURCES')) {
    continue;
  }

  currentCategory = sectionTitle.replace(/\s*\([^)]*\)\s*$/, '').trim();

  const questionBlocks = section.split(/^### Question /m).slice(1);

  for (const block of questionBlocks) {
    const headerMatch = block.match(/^([\d.]+):\s*(.+?)(?:\n|$)/);
    if (!headerMatch) continue;

    const id = headerMatch[1].trim();
    const title = headerMatch[2].trim();
    const body = block.slice(headerMatch[0].length);

    const code = extractFirstCodeBlock(body);
    const expectedOutput = extractCodeBlock(body, 'Expected Output') ||
      extractSection(body, 'Expected Output').replace(/^```[\s\S]*?```/m, '').trim();
    const explanation = extractSection(body, 'Explanation');
    const keyConcepts = extractSection(body, 'Key Concepts');
    const howToFix = extractSection(body, 'How to Fix');
    const options = parseOptions(body);
    const correctAnswer = parseCorrectAnswer(body, options);

    const type = options ? 'mcq' : 'output';

    questions.push({
      id,
      title,
      category: currentCategory,
      type,
      code,
      expectedOutput: type === 'output' ? expectedOutput : undefined,
      options: options || undefined,
      correctAnswer: type === 'mcq' ? correctAnswer : undefined,
      explanation,
      keyConcepts: keyConcepts || undefined,
      howToFix: howToFix || undefined,
    });
  }
}

const outPath = path.join(__dirname, 'questions.json');
fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));

const dataJsPath = path.join(__dirname, 'questions-data.js');
fs.writeFileSync(dataJsPath, `const QUESTIONS = ${JSON.stringify(questions, null, 2)};\n`);

console.log(`Parsed ${questions.length} questions → ${outPath}, ${dataJsPath}`);
