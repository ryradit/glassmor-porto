'use server';

import { callGemini, extractText } from '@/lib/gemini-client';

interface ChatHistoryItem {
  text: string;
  isUser: boolean;
}

export async function chatWithGemini(message: string, history: ChatHistoryItem[] = []): Promise<string> {
  try {
    // Note: You'll need to add GEMINI_API_KEY to your environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const systemPrompt = `You are Ryan Radityatama's AI assistant for his portfolio website. 
            
            COMPREHENSIVE CONTEXT ABOUT RYAN RADITYATAMA:
            
            ## PERSONAL INFORMATION
            - Full Name: Ryan Radityatama
            - Location: Tangerang, Indonesia
            - Email: ryradit@gmail.com
            - Phone: +62813-8764-3604, +62 85133085529
            - LinkedIn: https://www.linkedin.com/in/ryan-radityatama/
            - Portfolio: https://www.ryradit.my.id/
            
            ## PROFESSIONAL SUMMARY
            Software Engineer with a strong background in building smart and efficient digital solutions. Experienced in both frontend and backend development, I enjoy creating user-friendly applications and bringing AI technologies into real-world use. I've worked on projects using popular tools like React and Node, and have applied AI to make software more powerful and responsive. With a Master's degree in Computer Science from Beijing Institute of Technology, my research explored how AI can support mental health using Indonesian language models. I'm passionate about building reliable systems, improving performance, and leading projects that blend software engineering with innovation in AI.
            
            ## EDUCATION
            - **Beijing Institute of Technology - Beijing, China (2022 - 2024)**
              * Master Degree of Computer Science and Technology
              * Awards: Recipient of Chinese Government Scholarship
              * Thesis: Research on Indonesian Large Language Models Fine-Tuning for Mental Health
              * Leadership: Participated as a Chair of Election Voting Section, Indonesian Embassy Beijing (Feb–Mar 2024), overseeing overseas election operations and coordinating with officials from the Indonesian Embassy and the Election Commission.
            
            - **Universitas Mercu Buana - Jakarta, Indonesia (2015 - 2019)**
              * Bachelor of Informatics Engineering
              * Awards: Nominated as Cum-laude Graduate in Faculty, Cumulative GPA: 3.88/4.0
              * Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online
            
            - **Beijing Institute of Technology - Beijing, China (2015 - 2019)**
              * Bachelor Degree of Computer Science and Technology
              * Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online
            
            ## PROFESSIONAL EXPERIENCE
            
            **WEBSITE SUCCESS ASSOCIATE - Brea, California, United States | Dec 2025 – Now**
            DreamHost
            - Designed and launched responsive, user-focused websites, managing end-to-end development from concept, planning, and design through testing, deployment, and post-launch support.
            - Advised clients on suitable development approaches, customized websites to business needs, integrated APIs and backend services, and delivered scalable, high-performing digital solutions.
            - Improved website performance and reliability through caching, CDN integration, lazy loading, image optimization, SEO best practices, plus DNS configuration, SSL setup, and hosting deployment.
            - Collaborated with cross-functional teams to resolve technical issues, streamline customer workflows, and educate users through documentation, reusable resources, and modern website development best practices.
            
            **MACHINE LEARNING ENGINEER - Jakarta, Indonesia | Aug 2025 – Dec 2025**
            AME Research
            - Developed custom scraping and parsing scripts to extract and structure critical datasets from non-standardized structured PDFs for the Mining Industry.
            - Upgraded forecasting architectures by implementing advanced AI algorithms, increasing system efficiency and reducing computational overhead.
            - Implemented sentiment analysis models tailored to mining sector terminology to automate the detection of market shifts and anomalies.
            - Designed end-to-end data workflows that link document extraction, predictive modeling, and analytics for seamless reporting.
            
            **AI ENGINEER - London, United Kingdom (Remote) | March 2025 – July 2025**
            Trymerra AI Ltd.
            - Developed a minimum viable product (MVP) for an AI-driven recruitment platform, handling the entire development process from UI/UX design to full-stack implementation. The goal was to create a seamless experience for both candidates and recruiters.
            - Built the frontend using React and developed backend APIs to handle core logic and data operations. Integrated Appwrite as the backend-as-a-service solution for authentication, database management, and cloud functions.
            - Integrated advanced conversational AI features, including CV parsing and automated interview simulations, to automate and personalize the candidate screening process. These features significantly reduced manual workload and improved efficiency.
            - Focused on optimizing system performance to ensure a responsive, real-time user experience. Applied best practices in frontend responsiveness and backend speed, while continuously testing for stability across user flows.
            
            **AI & ALGORITHM ENGINEER - Jakarta, Indonesia | Jan 2025 – Feb 2025**
            PT. Digital SawitPRO
            - Managed the development of an AI-based computer vision system to automatically detect palm trees from drone and satellite imagery. This helped eliminate manual counting, significantly increasing efficiency and accuracy in plantation monitoring.
            - Built and fine-tuned deep learning models using PyTorch, focusing on object detection and image segmentation methods suited for dense agricultural layouts. The algorithm was optimized to handle varying image quality and environmental conditions.
            - Worked closely with the engineering and product teams to integrate the detection system into a scalable pipeline, enabling real-time analysis and supporting decision-making in palm plantation management.
            
            **AI ENGINEER - Beijing, China | April 2023 – April 2024**
            BIT's NLPIR Research Lab
            - Conducted research and development to fine-tune large language models (LLMs) for the Indonesian language, focusing on improving performance for low-resource NLP tasks such as sentiment analysis, intent classification, and text generation.
            - Preprocessed and curated large-scale Indonesian datasets, applying tokenization, cleaning, and annotation strategies to enhance model training quality and relevance. Evaluated model outputs using benchmarks and human feedback.
            
            **SENIOR INFORMATION TECHNOLOGY SOLUTIONS - Jakarta, Indonesia | Oct 2022 – Feb 2023**
            Universitas Mercu Buana
            - Led a small IT team to ensure the smooth operation and availability of campus-wide IT infrastructure, maintaining system reliability and addressing technical issues promptly to support academic and administrative activities.
            - Initiated and implemented several IT system optimizations, resulting in a 15% increase in operational efficiency through improved workflows, upgraded systems, and better integration of internal processes.
            - Oversaw key IT projects including system upgrades, cloud migration, and security protocol enhancements.
            
            **IT SOLUTIONS & INTERNATIONAL OPERATIONS OFFICER - Jakarta, Indonesia | Sep 2019 – Oct 2022**
            Universitas Mercu Buana
            - Managed the development and integration of databases for international academic initiatives, ensuring accurate data management and smooth information flow across departments and global partners.
            - Provided technical support and hands-on training to administrative staff, improving system usage and productivity. System upgrades and automation processes contributed to a 20% increase in overall efficiency.
            - Coordinated international programs such as student exchanges and joint degrees, while maintaining and updating the international relations website to align with institutional branding and support cloud-based integration.
            
            ## HARD SKILLS, SOFT SKILLS AND LANGUAGES
            
            - **Hard Skills:** AI & NLP (PyTorch, TensorFlow, Hugging Face Transformers, GPT, scikit-learn, Pandas, PyCharm), Computer Vision (YOLO, OpenCV, Vision Transformer, CNN, R-CNN, Matplotlib, NumPy), Full-Stack Development (React, Next.js, Node.js, NoSQL, PHP, JavaScript, HTML/CSS), Mobile Development (Java & Kotlin for Android), System Optimization & Data Integration, ERP (Odoo Development), Cloud Integration, Technical Support, Networking Configuration (Mikrotik, LAN, WAN), Graphic & Multimedia Design (Photoshop, Premiere, After Effects), Office & Productivity Tools (Microsoft Word, Excel, Access, PowerPoint, Google Apps Script)
            - **Soft Skills:** Analytical and Solution-Oriented Thinking, Collaborative and Team-Driven Approach, Strong Adaptability in Fast-Changing Environments, Clear and Structured Communication, Initiative in Leading and Coordinating Projects, Focused and Organized in Task Execution, Creative Problem Framing, and Empathy in Technical Support and User Interaction
            - **Languages:** English (Professional Working Proficiency), Mandarin Chinese (Basic), Dutch (Basic)
            
            ## KEY PROJECTS & ACHIEVEMENTS
            - **DreamHost Web Deployments:** Designed and launched responsive, user-focused web platforms.
            - **Mining Industry Parsing Scripts (AME Research):** Built data extraction workflows and forecasting algorithms.
            - **Merra.ai MVP (Trymerra AI Ltd.):** Created an AI-driven recruitment platform using React, Node.js, and Appwrite.
            - **AI Computer Vision System (PT. Digital SawitPRO):** Auto palm tree detection from drone/satellite images using PyTorch.
            - **Indonesian LLM Research (BIT NLPIR Lab):** Fine-tuning large language models for Bahasa Indonesia low-resource tasks and mental health support.
            - **University IT Infrastructure (Universitas Mercu Buana):** Upgraded workflows and system integrations to boost efficiency by 15-20%.
            - **Sports Booking Mobile App Startup:** Built an Android mobile network in Kotlin for venue calendar booking and location searches.
            
            ## CURRENT STATUS
            - Available for new opportunities and collaborations
            - Open to remote work and international projects
            - Passionate about AI/ML, full-stack development, and innovative technology solutions
            
            ## MAIN PURPOSE OF THIS WEBSITE
            This website is the "Earth-X AI Playground", which acts as Ryan's personal creative playground to pour his active creativity and experiment with cutting-edge artificial intelligence, computer vision models, NLP tools, and custom MLOps pipelines. While it showcases his professional portfolio, its primary purpose is a playground to showcase his innovative playground projects. Always invite visitors to explore these sandboxed deployments and talk about both his professional portfolio and his creative playground experiments.
            
            ## CONVERSATIONAL STYLE & BEHAVIOR
            1. Act like a helpful, empathetic, conversational human assistant, not a rigid robot. Keep the tone warm, welcoming, and reciprocal.
            2. If the visitor greets you with a simple greeting (e.g. "hello", "hi", "hey"), DO NOT dump a huge wall of text about Ryan's background immediately. Instead, greet them back warmly, ask how they are doing, explain the dual purpose of the website (professional portfolio + creative AI playground sandbox), and invite them to explore his sandboxed experiments, resume, or contact details based on what they are interested in.
            3. Answer questions naturally and carry on a friendly back-and-forth dialogue. Keep responses relatively concise, structured, and engaging.
            
            IMPORTANT: When someone asks about Ryan's CV, resume, or wants to access/download his CV, always mention that his CV is available in his shared Drive folder. The user interface will automatically show an "Open Ryan's CV Folder" button when CV/resume is mentioned.`;

    interface GeminiContent {
      role: 'user' | 'model';
      parts: { text: string }[];
    }
    const contents: GeminiContent[] = [];
    
    if (history && history.length > 0) {
      // Keep history size reasonable (last 10 turns) to avoid exceeding context token limits
      const recentHistory = history.slice(-10);
      recentHistory.forEach(item => {
        contents.push({
          role: item.isUser ? 'user' : 'model',
          parts: [{ text: item.text }]
        });
      });
    }
    
    // Add the current message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const data = await callGemini(
      {
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents,
        generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 1024 },
      },
      apiKey
    );

    return extractText(data);
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Enhanced fallback responses with detailed CV information
    const fallbackResponses = [
      "Hi! I'm Ryan's AI assistant. Ryan is an AI & Software Engineer with a Master's degree from Beijing Institute of Technology. He specializes in AI/ML engineering, full-stack development, and has worked on exciting projects like Merra.ai and Indonesian LLM research. What would you like to know about his background?",
      "Hello! Ryan has extensive experience spanning from London (Trymerra AI) to Jakarta, with expertise in AI/ML engineering and full-stack development. He's worked with cutting-edge technologies like PyTorch, React, and computer vision systems. How can I help you learn more about his work?",
      "Great to meet you! Ryan holds both Master's and Bachelor's degrees in Computer Science and has professional experience across multiple countries. He's passionate about AI innovations and creating intelligent solutions. What aspect of his background interests you most?",
      "Welcome! Ryan is currently available for new opportunities and collaborations. With his strong background in AI/ML engineering, full-stack development, and research experience, he brings both academic depth and practical industry experience. Feel free to ask about his projects or how to connect!"
    ];

    // Check for specific topics in the message for detailed CV-based responses
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage === 'hello' || lowerMessage === 'hi' || lowerMessage === 'hey' || lowerMessage.includes('hello ') || lowerMessage.includes('hi ') || lowerMessage.includes('hey ')) {
      return "Hello there! 🌟 A warm welcome to you! How is your day going?\n\nI'm Ryan's AI assistant. Beside showcasing his professional background, this website acts as the 'Earth-X AI Playground'—a creative sandbox where Ryan pours his passion for artificial intelligence, computer vision, and high-performance engineering experiments.\n\nWhat are you curious to explore today? I'd be happy to chat about his professional background, show you around his creative playground experiments, or help you get in touch!";
    }
    
    else if (lowerMessage.includes('playground') || lowerMessage.includes('purpose') || lowerMessage.includes('website') || lowerMessage.includes('earth-x') || lowerMessage.includes('sandbox')) {
      return "The main purpose of this website is to serve as Ryan's personal 'Earth-X AI Playground'! 🚀 While it acts as a premium portfolio of his professional accomplishments, it is primarily a creative sandbox where he builds, tests, and deploys experimental AI features. These include custom Large Language Model fine-tunes, agricultural Computer Vision models (like palm tree detection systems), and server-side edge-compute tools. It's a space where technology meets creativity!";
    }

    else if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('university') || lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('academic')) {
      return "Ryan has an impressive educational background! He holds a Master of Science in Computer Science and Technology from Beijing Institute of Technology (2022-2024), where he received the Chinese Government Scholarship and researched Indonesian Large Language Models for Mental Health. He also has dual bachelor's degrees - one in Informatics Engineering from Universitas Mercu Buana (graduated Cum Laude with 3.88/4.0 GPA) and another in Computer Science and Technology from Beijing Institute of Technology (2015-2019). His thesis work focused on mobile applications and AI applications for healthcare.";
    } 
    
    else if (lowerMessage.includes('cv') || lowerMessage.includes('resume') || lowerMessage.includes('download')) {
      return "Absolutely! Ryan's comprehensive CV and credentials folder is shared publicly. It contains detailed information about his Master's degree from Beijing Institute of Technology, his extensive professional experience from London to Jakarta, technical skills spanning AI/ML to full-stack development, and all his exciting projects. The button to open his CV folder will appear directly below this message!";
    } 
    
    else if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "Ryan has diverse and impressive professional experience! Currently, he's working as a Website Success Associate at DreamHost (Dec 2025 – Now). Previously, he was a Machine Learning Engineer at AME Research, an AI Engineer at Trymerra AI Ltd in London, an AI & Algorithm Engineer at PT. Digital SawitPRO, an AI Engineer at BIT NLPIR Research Lab in Beijing, and spent several years at Universitas Mercu Buana as a Senior IT Solutions Engineer. His experience covers web scaling, predictive algorithms, ML, and computer vision systems.";
    } 
    
    else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work sample')) {
      return "Ryan has worked on fascinating projects! His key projects include scaling and launching custom websites for DreamHost, data scraping and predictive mining workflows for AME Research, Merra.ai (an AI recruitment platform with Appwrite), an AI computer vision system for PT. Digital SawitPRO to detect palm trees from satellite/drone images using PyTorch, and fine-tuning Indonesian LLMs for mental health at BIT NLPIR Research Lab. Each project showcases his expertise in AI/ML and full-stack development.";
    } 
    
    else if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('technical') || lowerMessage.includes('programming')) {
      return "Ryan has an extensive technical skillset! Programming: Python, JS/TS, Java, C++, SQL, PHP, Kotlin, Swift. AI/ML & Computer Vision: PyTorch, TensorFlow, YOLO, OpenCV, Hugging Face, scikit-learn, Pandas, NumPy, Vision Transformers. Web & Database: React, Next.js, Node.js, NoSQL, Appwrite, PostgreSQL, MySQL. Cloud & DevOps: AWS, GCP, Docker, Mikrotik networking. He is fluent in English with basic Mandarin and Dutch.";
    } 
    
    else if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('available')) {
      return "You can reach Ryan through multiple channels! Email: ryradit@gmail.com, Phone: +62813-8764-3604 or +62 85133085529, LinkedIn: linkedin.com/in/ryan-radityatama/, Portfolio: https://www.ryradit.my.id/. He is located in Tangerang, Indonesia, and is available for new opportunities including international remote roles!";
    } 
    
    else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('indonesia') || lowerMessage.includes('beijing') || lowerMessage.includes('london')) {
      return "Ryan is based in Tangerang, Indonesia, but has extensive international experience! He completed his Master's degree in Beijing, China (2022-2024), works remotely for DreamHost in California, and worked remotely for Trymerra AI Ltd in London, UK. He is open to local and international opportunities, including remote work arrangements.";
    } 
    
    else if (lowerMessage.includes('language') || lowerMessage.includes('english') || lowerMessage.includes('chinese') || lowerMessage.includes('mandarin')) {
      return "Ryan is multilingual! He has professional working proficiency in English, which enables him to work effectively with international teams like DreamHost in California and Trymerra AI in London. He also has basic proficiency in Mandarin Chinese (helpful during his studies in Beijing) and Dutch. His language skills complement his technical expertise for global collaboration.";
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

export async function getQuickResponses(): Promise<string[]> {
  return [
    "What is the Earth-X AI Playground?",
    "Tell me about Ryan's work experience",
    "Show me his creative AI projects",
    "Open Ryan's CV folder",
    "How can I contact Ryan?"
  ];
}

export interface CareerResult {
  persona: {
    title: string;
    description: string;
    auraColor: string;
  };
  careers: {
    title: string;
    matchPercentage: number;
    whyFit: string;
  }[];
  skills: {
    name: string;
    level: number;
  }[];
  roadmap: {
    step: number;
    title: string;
    description: string;
    actionItem: string;
  }[];
}

export async function analyzeCareerPath(answers: Record<string, string>): Promise<CareerResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  const prompt = `You are a sequential Multi-Agent Career Orchestrator operating within the "Earth-X AI Playground". 
Your goal is to synthesize user diagnostic scanner answers into a personalized futuristic career blueprint.

Represent four distinct specialized virtual agents executing in sequence:
1. **Agent 1: Psychometric & Persona Analyst**: Evaluates character drivers and problem-solving preferences to formulate a customized, highly empowering futuristic professional "Persona Title" (e.g., "Sleek Systems Alchemist", "Autonomous Intelligence Pioneer", "Pixel-Perfect Solution Pathfinder") and description.
2. **Agent 2: Industry & Market Trend Navigator**: Maps the persona to 2 highly matching real-world modern tech career paths with match percentages and explicit explanations of why it fits.
3. **Agent 3: Practical Roadmap Architect**: Constructs 3 sequential action steps and key skills needed to start this career trajectory.
4. **Agent 4: Telemetry Orchestrator**: Harmonizes and packages the outputs of Agents 1, 2, and 3 into a strict, minified JSON object matching the exact schema below.

### User Scan Input:
- Core Problem Style: ${answers.q1 || 'Logical'}
- Energy Driver: ${answers.q2 || 'Building'}
- Work Cosmos: ${answers.q3 || 'Startup'}
- Struggle Point: ${answers.q4 || 'Stuck in Stack'}
- Interest Radar: ${answers.q5 || 'AI & Aesthetics'}

### Strict JSON Output Format:
Return ONLY a valid minified JSON object matching this TypeScript interface. Do NOT wrap it in markdown code blocks like \`\`\`json. Return only the raw JSON string:
{
  "persona": {
    "title": "...",
    "description": "...",
    "auraColor": "purple" | "pink" | "cyan" | "green"
  },
  "careers": [
    {
      "title": "...",
      "matchPercentage": 95,
      "whyFit": "..."
    },
    {
      "title": "...",
      "matchPercentage": 88,
      "whyFit": "..."
    }
  ],
  "skills": [
    {"name": "...", "level": 90},
    {"name": "...", "level": 85},
    {"name": "...", "level": 80},
    {"name": "...", "level": 75}
  ],
  "roadmap": [
    {
      "step": 1,
      "title": "Explore & Learn",
      "description": "...",
      "actionItem": "..."
    },
    {
      "step": 2,
      "title": "Engage & Connect",
      "description": "...",
      "actionItem": "..."
    },
    {
      "step": 3,
      "title": "Build & Scale",
      "description": "...",
      "actionItem": "..."
    }
  ]
}`;

  try {
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const data = await callGemini(
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      },
      apiKey
    );

    const text = extractText(data);
    return JSON.parse(text.trim()) as CareerResult;
  } catch (error) {
    console.error("Pathfinder AI Error, running high-fidelity fallback:", error);
    // Dynamic, high-quality personalized mock data based on user answers
    const style = answers.q1 || 'Logical';
    const driver = answers.q2 || 'Building';
    const interest = answers.q5 || 'Generative AI';
    
    let personaTitle = "Aura Systems Architect";
    let auraColor = "purple";
    let desc = "You are a master of engineering harmony, blending structured logical telemetry with modular scalability.";
    let careers = [
      { title: "AI & ML Operations Specialist", matchPercentage: 96, whyFit: `Your passion for ${driver} and interest in ${interest} makes you a natural fit for scaling deep learning pipelines.` },
      { title: "Full-Stack Software Engineer", matchPercentage: 89, whyFit: "Your preferred style matches complex data orchestration, mapping frontend UI flows directly to relational databases." }
    ];
    
    if (style.toLowerCase().includes('design') || interest.toLowerCase().includes('aesthetics')) {
      personaTitle = "Sleek Aesthetics Architect";
      auraColor = "pink";
      desc = "You blend rich visual harmonies with complex digital logic, creating wowed-at-first-glance user portals.";
      careers = [
        { title: "Design Engineer / UIUX Architect", matchPercentage: 94, whyFit: `You thrive in merging visual psychology with standard React component systems, perfectly fitting the ${interest} index.` },
        { title: "Creative Technologist", matchPercentage: 87, whyFit: "You bridge the gap between AI generation and artistic user-facing interfaces." }
      ];
    } else if (style.toLowerCase().includes('chaotic') || driver.toLowerCase().includes('users')) {
      personaTitle = "Empathy Solutions Pathfinder";
      auraColor = "cyan";
      desc = "You excel at solving highly human problems, designing products that prioritize user satisfaction and workflow efficiency.";
      careers = [
        { title: "Product Solutions Owner", matchPercentage: 95, whyFit: "Your core focus on client empathy and system mapping makes you an excellent product lead." },
        { title: "Developer Experience Engineer", matchPercentage: 88, whyFit: "You bridge the gap between core backend APIs and user developer onboarding." }
      ];
    }
    
    return {
      persona: {
        title: personaTitle,
        description: desc,
        auraColor: auraColor
      },
      careers: careers,
      skills: [
        { name: interest.split('&')[0].trim() || "TypeScript", level: 92 },
        { name: "Next.js & React", level: 88 },
        { name: "Data Scraping & APIs", level: 85 },
        { name: "MLOps Pipelines", level: 78 }
      ],
      roadmap: [
        {
          step: 1,
          title: "Explore & Foundation",
          description: `Research deep-dives into modern ${interest} frameworks and setup local workspace environments.`,
          actionItem: "Build 3 modular prototype widgets inside a personal playground repository."
        },
        {
          step: 2,
          title: "Engage & Collaborate",
          description: "Connect with global builders and professional tech collectives.",
          actionItem: "Join communities like DLOB Community to discuss systems scaling and design trends."
        },
        {
          step: 3,
          title: "Accelerate & Deploy",
          description: "Integrate server-side cloud operations and publish live production solutions.",
          actionItem: "Deploy a production-ready portfolio sandbox using Vercel or custom VPS nodes."
        }
      ]
    };
  }
}
