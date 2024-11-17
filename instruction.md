# PathQuest - Product Requirements Document

## Overview
PathQuest is an interactive journey assistant that helps users discover their ideal business niche through engaging UI, AI-powered conversations, and gamified path selection. We have scraped lots of business podcasts talking about different business ideas and niches, and we want to help users get started on their journey to building their own business and find their Ikigai.

## Core Features

### 1. Home Page - Inspiration Grid
- Grid layout showcasing various business ideas with visual cards
- Prominent "Find Your Path" CTA button
- Animated transition: grid splits horizontally, revealing chat interface
- Tech Stack:
  - Next.js for frontend
  - Framer Motion for animations
  - Drizzle ORM for data management

### 2. Interactive Discovery Chat
**Layout:**
- Split screen design
  - Top: Dynamic recommendation cards
  - Bottom: Chat interface with AI assistant

**Functionality:**
- AI-guided Ikigai questionnaire:
  1. "What are you good at?"
  2. "What do you love doing?"
  3. "What does the world need?"
  4. "What can you be paid for?"
- Real-time pathway recommendations using vector search
- Display 3 personalized business ideas as interactive cards

**Quest Card Features:**
- Swipeable/dismissible cards
- "Shortlist" and "Pass" options
- For each pathway:
  - Required skills
  - Getting started guide
  - Estimated timeline
  - Potential earnings
- Option to regenerate new suggestions for passed cards

### 3. Pathway Planner
- Generates detailed milestone timeline
- Visual progress tracking
- Actionable steps for each milestone
- Resource recommendations

## Technical Architecture

### Frontend
- Next.js application
- Framer Motion for animations
- Tailwind CSS for styling
- Vercel AI SDK for chat interface

### Backend
- Drizzle ORM for data management
- Vector search for pathway matching
- Pre-loaded business ideas database
- AI integration for personalized guidance

## User Flow
1. **Entry Point**
   - User lands on inspiration grid
   - Clicks "Find Your Path" button
   - Animated transition to chat interface

2. **Discovery Phase**
   - AI guides through Ikigai questions
   - Real-time pathway suggestions
   - User can shortlist or pass options
   - Ability to deep-dive into each suggestion

3. **Path Selection**
   - User finalizes preferred pathway
   - System generates milestone roadmap
   - Transition to progress tracking view

## Success Metrics
- User engagement with chat
- Number of pathways explored
- Time spent in discovery phase
- Pathway completion rate
- User satisfaction with recommendations

## Future Enhancements
- Community features
- Progress sharing
- Expert mentorship connections
- Advanced milestone tracking
- Resource marketplace