# Mystic Ink Tarot

## 🔮 Sketch/Demo Link
[Add your deployed project link here]

---

## One-Sentence Description
**Mystic Ink Tarot is an AI-powered interactive tarot reading experience where users draw abstract art that gets interpreted by Gemini AI to reveal personalized tarot card readings and mystical guidance.**

---

## Project Summary (250-500 words)

Mystic Ink Tarot reimagines the ancient practice of tarot reading for the digital age by combining intuitive drawing with artificial intelligence. Unlike traditional tarot apps that simply shuffle digital cards, this application asks users to channel their energy through freeform drawing—creating an intimate, personal connection between the seeker and their reading.

The experience begins with a question. Users select from five question categories (Love, Career, Wealth, Health, or General) and choose a spread type ranging from a simple one-card Yes/No reading to the complex six-card Celtic Cross. The app then generates metaphorical drawing prompts using Gemini AI—for example, instead of simply asking "draw the past," it might prompt "Draw the chains that once bound you" for a question about moving on from a relationship.

As users draw on the canvas using various brush styles (Solid, Glow, or Ethereal) and mystical colors, the application captures their "energy imprint." This drawing is then analyzed by Google's Gemini 2.5 Flash model, which interprets the visual elements—the chaos, order, lines, and shapes—to select and assign a tarot card that resonates with the user's drawn energy. Each card can appear upright or reversed, adding depth to the reading with shadow meanings.

The visual experience is central to Mystic Ink. Cards are revealed through beautiful 3D flip animations with particle burst effects. The interface features a dark, mystical aesthetic with gold accents, animated star backgrounds, and floating elements that create an immersive atmosphere. Sound effects accompany key interactions, and users can choose from four distinct visual themes.

Beyond single readings, the app offers a Daily Oracle feature that provides a card for each day based on numerological calculations. Users can track their reading history, add personal notes for reflection, ask follow-up questions to the AI oracle, and export their spiritual journal. The Tarot Library provides education about all 78 cards, while the Insights feature analyzes patterns across readings over time.

Mystic Ink Tarot transforms tarot from passive card shuffling into an active, creative, and deeply personal experience—bridging ancient mystical practices with modern AI technology.

---

## Inspiration

My inspiration for Mystic Ink Tarot came from several sources:

**Personal Interest in Tarot**: I've always been fascinated by tarot as a tool for self-reflection rather than fortune-telling. The cards serve as mirrors that help us examine our thoughts, feelings, and situations from new perspectives.

**The Limitation of Existing Apps**: Most tarot apps feel impersonal—you tap a button, cards shuffle digitally, and you get a generic reading. There's no sense of personal investment or energy exchange that's central to traditional tarot practice.

**The Promise of Generative AI**: When exploring Gemini's vision capabilities, I realized it could "read" abstract drawings and interpret their emotional and visual qualities. This sparked the core idea: what if your drawing could become the bridge between you and the cards?

**Creative Expression as Meditation**: The act of drawing, even abstractly, requires focus and presence. I wanted to create a space where the process of creating art becomes part of the divination ritual itself—making the user an active participant rather than passive observer.

**Aesthetic Inspiration**: I drew visual inspiration from vintage tarot decks, particularly the Rider-Waite-Smith imagery, combined with modern digital aesthetics like glass-morphism, particle effects, and neon glows. The color palette was influenced by the deep purples and golds associated with mysticism and royalty.

---

## Process

### What I Built
The application was built using:
- **React + TypeScript** for the frontend framework
- **Vite** for fast development and building
- **Tailwind CSS** for styling with custom mystical color palette
- **Framer Motion** for smooth animations and transitions
- **Google Gemini AI (2.5 Flash)** for drawing interpretation and content generation
- **html2canvas** for shareable reading images

### What Was Easy
- **Basic Canvas Implementation**: The HTML5 Canvas API is well-documented, and implementing basic drawing with mouse/touch events was straightforward.
- **Tailwind Styling**: Creating the mystical aesthetic was enjoyable with Tailwind's utility classes. Custom animations like `animate-float-subtle` and gradient overlays came together quickly.
- **Gemini API Integration**: The Google GenAI SDK made it simple to send images and receive structured JSON responses using response schemas.

### What Was Challenging

- **Drawing-to-Meaning Pipeline** — Designing prompts that help Gemini interpret abstract drawings meaningfully; iterated extensively on prompt engineering to include question context, temporal position, and metaphorical drawing prompts
- **Card Image Mapping** — Matching Gemini's varied card name outputs (e.g., "The Fool" vs "0 - The Fool") to actual image files; built a robust mapping utility with multiple lookup strategies
- **3D Card Flip Animation** — Getting CSS 3D transforms to work correctly with backface-visibility across browsers, especially with reversed cards needing additional 180° rotation
- **Reversed Card Logic** — Implementing visually upside-down cards while maintaining readable text overlays; required creative CSS solutions with strategic rotation layering
- **State Management Complexity** — Managing open/close states and data flow across many modal panels (History, Library, Calendar, Themes, etc.); future iteration could benefit from Zustand or Redux

---

## Audience/Context

### Who Is This For?
- **Tarot Enthusiasts** seeking a more personal, interactive digital reading experience
- **Creative Individuals** who enjoy art and self-expression as part of spiritual practice
- **Self-Reflection Seekers** using tarot as a journaling or meditation tool
- **Curious Beginners** interested in exploring tarot in an accessible, non-intimidating way
- **Tech-Art Enthusiasts** interested in the intersection of AI and creative expression

### How Will People Experience It?
Users experience Mystic Ink through a web browser, ideally on tablet or desktop for the best drawing experience (though it's mobile-responsive). The flow is:

1. **Ask a Question** → Select category and spread type
2. **Draw** → Respond to metaphorical prompts on the canvas
3. **Reveal** → Watch cards flip with animations
4. **Reflect** → Read interpretations and final synthesis
5. **Engage** → Ask follow-up questions, add notes, share, or explore the library

### Is It Interactive?
Extremely. Every reading requires active drawing participation. Users choose colors, brush styles, and backgrounds. They can interact with the AI oracle for follow-up questions, add personal notes, and build a history of readings over time.

### Is It Practical? Fun? Emotional?
It sits at the intersection of all three:
- **Practical**: Offers genuine prompts for self-reflection and journaling
- **Fun**: Beautiful animations, mystical aesthetics, and the creative drawing aspect make it enjoyable
- **Emotional**: The personalized interpretations often resonate deeply, especially when users invest emotionally in their drawings

---

## User Testing

### Testing Sessions
I conducted informal user testing with 5 participants ranging from tarot skeptics to regular practitioners.

### Key Findings

**Positive Feedback:**
- Users loved the drawing aspect—it felt "more personal" than random shuffling
- The metaphorical prompts were praised for being evocative and thought-provoking
- Visual aesthetics received strong positive reactions ("It feels like actual magic")
- The flip card animations created satisfying reveal moments

**Issues Discovered:**
- **Prompt Confusion**: Some users didn't understand they should draw abstractly, not literally. → Added clearer instructions in onboarding
- **Button Discoverability**: The "Hold to Reveal" mechanic wasn't immediately obvious. → Added pulsing hint text and visual feedback
- **Information Overload**: The final summary screen had too much text initially. → Reorganized into expandable sections
- **Canvas on Mobile**: Drawing felt cramped on small screens. → Adjusted layout for better mobile experience

### Changes Made Based on Feedback
- Created an onboarding tutorial explaining the drawing-to-reading flow
- Added "ink style" previews so users understand brush differences
- Implemented theme selection for users who found the default too dark
- Added ESC key shortcuts and click-outside-to-close for all modals
- Reduced synthesis length for smaller spreads

---

## Source Code

**GitHub Repository**: [Add your GitHub link here]

### Key Files:
- `App.tsx` - Main application state and flow management
- `components/DrawingCanvas.tsx` - Canvas implementation with brush styles
- `services/geminiService.ts` - All Gemini AI integration
- `components/FlipCard.tsx` - 3D animated card reveal component
- `utils/tarotImageMap.ts` - Card name to image mapping
- `utils/historyManager.ts` - LocalStorage reading history management

---

## Code References

### AI Integration
- **Google Gemini API Documentation**: https://ai.google.dev/docs
- **Structured Output with JSON Schema**: Based on Google's examples for using `responseSchema` with Gemini

### Canvas Drawing
- **HTML5 Canvas Tutorial (MDN)**: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- **Smooth Drawing with Quadratic Curves**: Adapted from various canvas drawing tutorials for bezier curve interpolation

### Animations
- **Framer Motion Documentation**: https://www.framer.com/motion/
- **3D CSS Card Flip**: Adapted from CSS-Tricks tutorial on 3D transforms: https://css-tricks.com/almanac/properties/b/backface-visibility/

### Tarot Data
- **Rider-Waite Tarot Meanings**: Card meanings and interpretations referenced from various public tarot resources and personal knowledge

### Image Generation
- **html2canvas Library**: https://html2canvas.hertzen.com/ - Used for generating shareable reading images

### UI Patterns
- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Glass-morphism Effect**: Custom implementation using backdrop-blur and semi-transparent backgrounds

---

## Next Steps

If I had more time to work on this project, I would:

### Technical Improvements
- Implement Zustand or Redux for cleaner state handling across features
- Lazy-load components and implement code splitting for faster initial load
- Add service worker for offline functionality and cached readings
- Move from localStorage to Firebase/Supabase for cross-device sync

### Feature Additions
- Allow two users to draw together for multiplayer relationship readings
- Add AI-generated voice narration of interpretations
- Show animated replay of how the user drew as part of the reading experience
- Enable custom tarot deck uploads with personal card images
- Integrate moon phases and astrological events into readings
- Build community features: public readings, trending cards, shared interpretations

### Polish & Accessibility
- Conduct full accessibility audit for screen reader support and keyboard navigation
- Add internationalization (i18n) for multiple languages
- Create additional visual themes (Light Mode, Seasonal themes)
- Develop more detailed analytics for reading patterns over months/years

### Experimental Ideas
- **Palm Reading Mode** — Use camera to analyze palm lines (HandDivination component already started)
- **AR Experience** — Place tarot cards in physical space using WebXR
- **Meditation Mode** — Guided pre-reading meditation with breathing exercises

---

## Acknowledgments

- Tarot card imagery from the Rider-Waite-Smith deck (public domain)
- Sound effects from [list source]
- Background patterns from Transparent Textures
- Font selections: Serif fonts for mystical feel

---

*Created by [Your Name] for [Course Name], December 2024*

