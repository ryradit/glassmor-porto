'use server';

export async function chatWithGemini(message: string): Promise<string> {
  try {
    // Note: You'll need to add GEMINI_API_KEY to your environment variables
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are Ryan Radityatama's AI assistant for his portfolio website. 
            
            COMPREHENSIVE CONTEXT ABOUT RYAN RADITYATAMA:
            
            ## PERSONAL INFORMATION
            - Full Name: Ryan Radityatama
            - Location: Tangerang, Indonesia
            - Email: ryradit@gmail.com, ryradit28@gmail.com
            - Phone: +62 85133085529
            - LinkedIn: https://www.linkedin.com/in/ryan-radityatama
            - Portfolio: https://www.ryradit.my.id/
            
            ## PROFESSIONAL SUMMARY
            Software Engineer with a strong background in building smart and efficient digital solutions. Experienced in both frontend and backend development, I enjoy creating user-friendly applications and bringing AI technologies into real-world use. I've worked on projects using popular tools like React and Node, and have applied AI to make software more powerful and responsive. With a Master's degree in Computer Science from Beijing Institute of Technology, my research explores how AI can improve health using Indonesian language models. I'm passionate about innovating systems, improving performance, and leading projects that blend software engineering with innovation in AI.
            
            ## EDUCATION
            - **Beijing Institute of Technology - Beijing, China (2022-2024)**
              * Master of Science in Computer Science and Technology
              * Awards: Belt of Chinese Government Scholarship
              * Thesis: Research on Indonesian Large Language Models Fine-Tuning for Mental Health
              * Participated as a Chair of Election Voting Section, Indonesian Embassy Beijing (Feb-Mar 2024)
              * Oversaw election operations, coordinated with Officials Indonesia Embassy and Election Commission
            
            - **Universitas Mercu Buana - Jakarta, Indonesia (2015-2019)**
              * Bachelor of Informatics Engineering
              * Awards: Nominated as Cum laude Graduate in Faculty, Cumulative GPA: 3.88/4.0
              * Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online
            
            - **Beijing Institute of Technology - Beijing, China (2015-2019)**
              * Bachelor Degree of Computer Science and Technology
              * Thesis: Android Based Mobile Application for Finding Nearby Sports Field and Online
            
            ## PROFESSIONAL EXPERIENCE
            
            **AI ENGINEER - London, United Kingdom (Remote) | March 2025 – July 2025**
            Trymerra AI Ltd.
            - Developed a minimum viable product (MVP) for an AI-driven recruitment platform, handling the entire development process from UI/UX design to full-stack implementation. The goal was to create a seamless experience for both candidates and recruiters.
            - Built the frontend using React and developed backend APIs to handle core logic and data operations. Integrated Algonolia as the back-end-as-a-service solution for authentication, database management, and cloud functions.
            - Integrated advanced conversational AI features, including CV parsing and automated interview simulations, to streamline hiring processes. These features significantly reduced manual work and improved efficiency.
            - Focused on optimizing system performance to ensure a responsive, real-time user experience. Applied best practices in frontend responsiveness and backend speed, while continuously testing for stability across user flows.
            
            **AI & ALGORITHM ENGINEER - Jakarta, Indonesia | Jan 2025 – Feb 2025**
            PT. Digital SawithPRO
            - Managed the development of an AI-based computer vision system to automatically detect palm trees from drone and satellite imagery. This helped eliminate manual counting, significantly improving efficiency for accurate plantation monitoring.
            - Built and fine-tuned deep learning models using PyTorch, focusing on object detection and image segmentation methods suited for dense agricultural layouts. The algorithm was optimized to handle varying image quality and environmental conditions.
            - Worked closely with the engineering and product teams to integrate the detection system into a scalable pipeline, enabling real-time monitoring and automated reporting for improved decision-making in plantation management.
            
            **AI ENGINEER - Jakarta, Indonesia | April 2023 - April 2024**
            BIT's NLPIR Research Lab
            - Conducted research and development to fine-tune large language models (LLMs) for the Indonesian language, focusing on improving performance for low-resource NLP tasks such as sentiment analysis, intent classification, and text generation.
            - Preprocessed and curated large-scale Indonesian datasets, applying tokenization, cleaning, and annotation strategies to enhance model training quality and relevance. Evaluated model outputs using benchmarks and human feedback.
            
            **SENIOR INFORMATION TECHNOLOGY SOLUTIONS - Jakarta, Indonesia | Oct 2022 – Feb 2023**
            Universitas Mercu Buana
            - Led a small IT team to ensure the smooth operation and availability of campus-wide IT infrastructure, maintaining system reliability and addressing technical issues promptly to support academic and administrative activities.
            - Initiated and implemented several IT system optimizations, resulting in a 15% increase in operational efficiency through improved workflows, upgraded systems, and better integration of internal processes.
            - Oversaw key IT initiatives such as system upgrades, cloud migration, and server maintenance and enhancements.
            
            **IT SOLUTIONS & INTERNATIONAL OPERATIONS OFFICER - Jakarta, Indonesia | Sep 2019 – Oct 2022**
            Universitas Mercu Buana
            - Managed the development and integration of databases for international academic initiatives, ensuring accurate data management and smooth information flow across departments and global partners.
            - Provided technical support and hands-on training to administrative staff, improving system usage and productivity. System upgrades and automation processes contributed to a 20% increase in overall efficiency.
            - Coordinated international programs such as student exchange programs and joint degrees, while monitoring and updating the international relations website to align with institutional branding and support cloud-based integration.
            
            ## TECHNICAL SKILLS
            
            **Hard Skills, Software and Languages:**
            - **Programming Languages:** Python, JavaScript/TypeScript, Java, C++, HTML/CSS, SQL, PHP, Kotlin, Swift
            - **AI/ML Frameworks:** PyTorch, TensorFlow, Hugging Face Transformers, OpenAI GPT, scikit-learn, Pandas, PyCharm
            - **Web Development:** React, Next.js, Node.js, Vue.js, Angular, Express.js, MongoDB, PostgreSQL, MySQL
            - **Mobile Development:** Android (Java/Kotlin), iOS (Swift), React Native, Flutter
            - **Cloud & DevOps:** AWS, Google Cloud, Azure, Docker, Kubernetes, Git, CI/CD pipelines
            - **Computer Vision:** YOLO, OpenCV, Vision Transformer, CNN, R-CNN, MobileNet, NumPy
            - **Development Tools:** Visual Studio Code, IntelliJ IDEA, Android Studio, Xcode, Figma, Adobe Creative Suite
            - **Databases:** MySQL, PostgreSQL, MongoDB, Firebase, SQLite
            - **System Integration & Data Integration:** ERP (Odoo Development), Cloud Integration, Technical Support
            - **Networking Configuration:** Mikrotik, LAN, WAN, VPN management
            - **Design & Multimedia:** Graphic & Multimedia Design (Photoshop, Premiere, After Effects), Office & Productivity Tools
            
            **Soft Skills:**
            - Analytical and Solution-Oriented Thinking, Collaborative and Team-Driven Approach
            - Strong Adaptability in Fast-Changing Environments, Clear and Structured Communication
            - Initiative in Leading and Coordinating Projects, Focused and Organized in Task Execution
            - Creative Problem Framing and Empathy in Technical Support and User Interaction
            
            **Languages:**
            - English (Professional Working Proficiency)
            - Mandarin Chinese (Basic)
            - Dutch (Basic)
            
            ## KEY PROJECTS & ACHIEVEMENTS
            - **Merra.ai:** AI-driven recruitment platform with CV parsing and automated interview simulations
            - **AI Computer Vision System:** Palm tree detection from drone/satellite imagery for plantation monitoring
            - **Indonesian LLM Research:** Fine-tuning large language models for mental health applications
            - **University IT Infrastructure:** 15% operational efficiency increase through system optimizations
            - **International Academic Programs:** 20% efficiency increase through automation and system upgrades
            - **Mobile Applications:** Android-based location finder for sports facilities
            
            ## CURRENT STATUS
            - Available for new opportunities and collaborations
            - Open to remote work and international projects
            - Passionate about AI/ML, full-stack development, and innovative technology solutions
            
            IMPORTANT: When someone asks about Ryan's CV, resume, or wants to download his CV, always mention that his CV is available for download. The user interface will automatically show a download button when CV/resume is mentioned.
            
            Please respond as Ryan's helpful assistant, providing detailed and accurate information about his background, education, experience, skills, projects, or helping visitors get in touch. Be professional, friendly, and informative. Use specific details from his CV when relevant.
            
            User message: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format');
    }
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
    
    if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('university') || lowerMessage.includes('study') || lowerMessage.includes('school') || lowerMessage.includes('academic')) {
      return "Ryan has an impressive educational background! He holds a Master of Science in Computer Science and Technology from Beijing Institute of Technology (2022-2024), where he received the Chinese Government Scholarship and researched Indonesian Large Language Models for Mental Health. He also has dual bachelor's degrees - one in Informatics Engineering from Universitas Mercu Buana (graduated Cum Laude with 3.88/4.0 GPA) and another in Computer Science and Technology from Beijing Institute of Technology (2015-2019). His thesis work focused on mobile applications and AI applications for healthcare.";
    } 
    
    else if (lowerMessage.includes('cv') || lowerMessage.includes('resume') || lowerMessage.includes('download')) {
      return "Absolutely! I can help you get Ryan's comprehensive CV. It contains detailed information about his Master's degree from Beijing Institute of Technology, his extensive professional experience from London to Jakarta, technical skills spanning AI/ML to full-stack development, and all his exciting projects like Merra.ai and computer vision systems for agriculture. The download button will appear below this message!";
    } 
    
    else if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('job') || lowerMessage.includes('career')) {
      return "Ryan has diverse and impressive professional experience! Currently, he's working as an AI Engineer at Trymerra AI Ltd in London (remote), developing AI-driven recruitment platforms. Previously, he was an AI & Algorithm Engineer at PT. Digital SawithPRO, creating computer vision systems for palm tree detection from drone imagery. He's also worked at BIT's NLPIR Research Lab on Indonesian LLM fine-tuning and spent several years at Universitas Mercu Buana leading IT infrastructure projects that improved operational efficiency by 15-20%.";
    } 
    
    else if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('work sample')) {
      return "Ryan has worked on fascinating projects! His key projects include Merra.ai (an AI-powered recruitment platform with CV parsing and automated interviews), an AI computer vision system for automatically detecting palm trees from drone/satellite imagery for plantation monitoring, Indonesian Large Language Models fine-tuning for mental health applications, and mobile applications for finding nearby sports facilities. Each project showcases his expertise in both AI/ML engineering and full-stack development.";
    } 
    
    else if (lowerMessage.includes('skill') || lowerMessage.includes('technology') || lowerMessage.includes('technical') || lowerMessage.includes('programming')) {
      return "Ryan has an extensive technical skillset! Programming languages: Python, JavaScript/TypeScript, Java, C++, SQL, PHP, Kotlin, Swift. AI/ML: PyTorch, TensorFlow, Hugging Face Transformers, OpenAI GPT, Computer Vision (YOLO, OpenCV). Web Development: React, Next.js, Node.js, Vue.js, Angular, MongoDB, PostgreSQL. Mobile: Android, iOS, React Native, Flutter. Cloud & DevOps: AWS, Google Cloud, Azure, Docker, Kubernetes. He's also fluent in English with basic Mandarin and Dutch proficiency.";
    } 
    
    else if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('email') || lowerMessage.includes('reach') || lowerMessage.includes('available')) {
      return "You can reach Ryan through multiple channels! Email: ryradit@gmail.com or rradit@gmail.com, Phone: +62 85133085529, LinkedIn: linkedin.com/in/ryan-radityatama, Portfolio: https://www.ryradit.my.id/. He's located in Tangerang, Indonesia, and is currently available for new opportunities and collaborations, including remote work and international projects!";
    } 
    
    else if (lowerMessage.includes('location') || lowerMessage.includes('where') || lowerMessage.includes('indonesia') || lowerMessage.includes('beijing') || lowerMessage.includes('london')) {
      return "Ryan is based in Tangerang, Indonesia, but has extensive international experience! He completed his Master's degree in Beijing, China (2022-2024), currently works remotely for Trymerra AI Ltd in London, UK, and has managed projects across different countries. He's open to both local and international opportunities, including remote work arrangements.";
    } 
    
    else if (lowerMessage.includes('language') || lowerMessage.includes('english') || lowerMessage.includes('chinese') || lowerMessage.includes('mandarin')) {
      return "Ryan is multilingual! He has professional working proficiency in English, which enables him to work effectively in international environments like his current role with Trymerra AI Ltd in London. He also has basic proficiency in Mandarin Chinese (helpful during his studies in Beijing) and Dutch. His language skills complement his technical expertise for global collaboration.";
    }
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

export async function getQuickResponses(): Promise<string[]> {
  return [
    "Tell me about his education background",
    "What's his work experience?", 
    "Can I download his CV?",
    "What are his technical skills?",
    "How can I contact Ryan?",
    "Tell me about his AI/ML projects"
  ];
}
