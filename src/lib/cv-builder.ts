'use server';

import { callGemini, extractText } from '@/lib/gemini-client';

export interface Experience {
  company: string;
  role: string;
  period: string;
  bullets: string;
  type?: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  cityCountry: string;
  gpa?: string;
  awards?: string;
  thesis?: string;
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  link?: string;
}

export interface CVData {
  name: string;
  title: string;
  email: string;
  location?: string;
  phone?: string;
  linkedin?: string;
  portfolio?: string;
  summary: string;
  experiences: Experience[];
  education?: Education[];
  hardSkills?: string;
  softSkills?: string;
  languages?: Language[];
  certifications?: Certification[];
}

export async function improveSummaryAction(summary: string, targetRole: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  const prompt = `You are a professional executive resume writer and career strategist.
Rewrite and improve the following professional summary to make it highly impactful, concise, and optimized for ATS systems targeting the role of: "${targetRole}".

Original Summary:
"${summary}"

Instructions:
1. Focus on action verbs, clear outcomes, and technical expertise.
2. The summary MUST have a minimum of 3 sentences and a maximum of 4 sentences to provide a balanced overview.
3. Keep the tone premium, confident, and professional.
4. Return ONLY the rewritten summary. Do not include introductory notes, quotes, or markdown wrappers.`;

  const data = await callGemini(
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
    },
    apiKey
  );
  return extractText(data).trim();
}

export async function improveExperienceAction(bullet: string, role: string, mode: 'polish' | 'expand' | 'condense' = 'polish'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  let prompt = `You are a professional resume editor.
Rewrite the following job responsibilities bullet points to make them more impactful, achievement-oriented, and tailored to the target role of "${role}".

Original Responsibilities:
"${bullet}"

Instructions:
1. Use the STAR methodology (Situation, Task, Action, Result) where possible.
2. Use strong action verbs (e.g., Designed, Spearheaded, Optimized).
3. Do not invent completely unrelated details, but expand professionally on implied tasks.
4. Format as a clean, compact bulleted list with a maximum of 4 to 5 points.
5. Ensure each point is highly descriptive and avoids excessively long, wordy sentences that drift off-topic.
6. Return ONLY the polished text. Do not include introductory notes, quotes, or markdown wrappers.`;

  if (mode === 'expand') {
    prompt = `You are a professional resume editor.
Your task is to ADD EXACTLY ONE NEW bullet point to the following job responsibilities. 
DO NOT modify, edit, or remove ANY of the original bullet points. Keep them exactly as they are.
Simply append one new highly professional bullet point that highlights implied skills for the target role of "${role}".

Original Responsibilities:
"${bullet}"

Instructions:
1. The output MUST contain all the original points EXACTLY as they are written above.
2. Add exactly one new bullet point at the end.
3. The new point should use strong action verbs and the STAR methodology where possible.
4. Return ONLY the final text. Do not include introductory notes, quotes, or markdown wrappers.`;
  } else if (mode === 'condense') {
    prompt = `You are a professional resume editor.
Your task is to CONDENSE the following job responsibilities for the target role of "${role}".

Original Responsibilities:
"${bullet}"

Instructions:
1. Use the STAR methodology (Situation, Task, Action, Result) where possible.
2. Use strong action verbs (e.g., Designed, Spearheaded, Optimized).
3. Remove the least impactful bullet point. The total number of bullets in your output MUST be exactly one less than the original.
4. Ensure each remaining point is highly descriptive and avoids excessively long, wordy sentences.
5. Return ONLY the final text. Do not include introductory notes, quotes, or markdown wrappers.`;
  }

  const data = await callGemini(
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 },
    },
    apiKey
  );
  return extractText(data).trim();
}

export async function generateCoverLetterAction(cv: CVData, targetCompany: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  const experienceText = cv.experiences
    .map(exp => `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.bullets}`)
    .join('\n');

  const prompt = `You are a premium career strategist.
Write a highly compelling, personalized cover letter for the candidate applying to "${targetCompany}" for the position of "${cv.title}".

Candidate Information:
Name: ${cv.name}
Email: ${cv.email}
Target Role: ${cv.title}
Professional Summary: ${cv.summary}

Work History:
${experienceText}

Instructions:
1. Keep the cover letter modern, elegant, and punchy (around 3 paragraphs).
2. Connect their specific background to the target company.
3. Maintain a warm, premium, and professional tone.
4. Return ONLY the body text of the cover letter. Do not add date, placeholders, addresses, or greeting/sign-off headers/footers (like [Your Name] or [Today's Date]) as these will be placed dynamically by the UI template.`;

  const data = await callGemini(
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    },
    apiKey
  );
  return extractText(data).trim();
}

export async function improveSkillsAction(skills: string, targetRole: string, type: 'hard' | 'soft'): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('API key not configured');

  const prompt = `You are a professional resume writer and ATS optimization specialist.
Improve the following comma-separated list of ${type} skills to make them highly professional, clean, standardized, and tailored to the target role of: "${targetRole}".

Original ${type} Skills:
"${skills}"

Instructions:
1. Standardize naming conventions (e.g., "reactjs" to "React", "communication" to "Effective Communication").
2. Remove duplicates or generic, fluff entries.
3. Organize them cleanly as a single comma-separated list.
4. Keep it concise. Do not add explanations, parentheticals, or extra text.
5. Return ONLY the polished comma-separated list. Do not include introductory notes, quotes, or markdown wrappers.`;

  const data = await callGemini(
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 256 },
    },
    apiKey
  );
  return extractText(data).trim();
}
