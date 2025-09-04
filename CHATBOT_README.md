# Floating Chatbot with Gemini AI Integration

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### 2. Configure Environment Variables
1. Create a `.env.local` file in the project root
2. Add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Install Dependencies
Make sure you have all required dependencies:
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

## Features

### 🤖 AI-Powered Chat Assistant
- **Gemini AI Integration**: Powered by Google's Gemini Pro model
- **Contextual Responses**: AI assistant knows about Ryan's background, projects, and skills
- **Professional Persona**: Acts as Ryan's helpful assistant for portfolio visitors

### 🎨 Modern UI/UX
- **Floating Button**: Elegant floating chat button with AI indicator
- **Glassmorphism Design**: Matches the portfolio's design theme
- **Smooth Animations**: Slide-in animations and typing indicators
- **Responsive**: Works on both desktop and mobile devices

### 💬 Interactive Features
- **Quick Responses**: Predefined questions for easy interaction
- **Real-time Typing**: Shows when AI is generating a response
- **Message History**: Maintains conversation context
- **Error Handling**: Graceful fallbacks when API is unavailable

### 🛡️ Fallback System
- **Offline Mode**: Works with predefined responses if API fails
- **Error Recovery**: Automatic retry mechanisms
- **Graceful Degradation**: Still functional without API key

## Chatbot Capabilities

The AI assistant can help visitors with:

- **Portfolio Information**: Details about Ryan's projects and experience
- **Technical Skills**: Information about programming languages and technologies
- **Contact Information**: How to get in touch with Ryan
- **Career Background**: Professional experience and education
- **Availability**: Information about work opportunities

## Customization

### Modifying AI Context
Edit the context in `src/lib/gemini.ts` to update what the AI knows about Ryan:

```typescript
const context = `
You are Ryan Radityatama's AI assistant...
// Add or modify context here
`;
```

### Styling
The chatbot inherits the portfolio's glassmorphism theme. Customize in:
- `src/components/ChatBot.tsx` - Component styling
- `src/app/globals.css` - Global styles

### Quick Responses
Modify quick response options in `src/lib/gemini.ts`:

```typescript
export async function getQuickResponses(): Promise<string[]> {
  return [
    "Your custom question here",
    // Add more quick responses
  ];
}
```

## API Usage & Costs

- **Free Tier**: Gemini API offers generous free usage limits
- **Rate Limiting**: Built-in error handling for API limits
- **Cost Monitoring**: Monitor usage in Google AI Studio

## Security Considerations

- API key is stored server-side only (not exposed to client)
- Environment variables are properly secured
- No sensitive information is logged

## Troubleshooting

### Common Issues

1. **"API key not configured"**
   - Ensure `.env.local` file exists with correct `GEMINI_API_KEY`
   - Restart development server after adding environment variables

2. **API requests failing**
   - Check API key validity in Google AI Studio
   - Verify internet connection
   - Check API quota limits

3. **Chatbot not responding**
   - Check browser console for errors
   - Verify server is running
   - Check if fallback responses are working

### Debug Mode
Enable debug logging by adding to `.env.local`:
```
NODE_ENV=development
```

## Production Deployment

For production deployment:

1. Add environment variables to your hosting platform
2. Ensure HTTPS is enabled
3. Monitor API usage and costs
4. Set up error monitoring

---

**Note**: Remember to never commit your actual API key to version control. Always use environment variables!
