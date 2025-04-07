# Profici Competitive Analysis

A web application that utilizes the Google Gemini API to provide comprehensive competitive analysis reports including SEO analysis, competitor information, market potential, market cap, and strategic recommendations.

## Features

- **Comprehensive Business Analysis**: Generates a multi-faceted report based on user input (business name, website, industry, competitors, etc.).
- **Detailed SEO Analysis**: Includes sections for Technical SEO, Content Analysis, Backlink Profile & Quality, Keyword Rankings & Gap Analysis, Organic Traffic, Page Speed (Mobile), Local SEO, and E-commerce SEO.
- **In-depth Competitor Analysis**: Provides competitor overviews, digital presence comparison (traffic, social, reviews, authority), pricing strategy, marketing channels, SWOT analysis, and Apollo data comparison.
- **Market Insights**: Analyzes Market Potential, Market Cap, Search Trends, and relevant News.
- **Content Strategy Tools**: Offers Content Suggestions and Topic Cluster analysis.
- **Social Media Presence**: Evaluates social media activity and engagement.
- **Strategic Recommendations**: Delivers actionable advice including a Digital Marketing Roadmap (SEO, Social, Paid Media), C-Suite Initiatives (tailored by company size), ROI Projections, and Technology/Data Opportunities.
- **PDF Report Generation**: Allows users to download the complete analysis as a formatted PDF document.
- **Interactive Elements**: Features charts for data visualization (Competitor Comparison, Technology Stack, Mobile Optimization) and a Chatbot widget.
- **User Authentication**: Secure sign-up and sign-in functionality.
- **Admin Dashboard**: Provides views for managing leads, viewing reports, and checking system status (API health, DB connection).
- **Feedback System**: Includes a Kanban board for collecting and managing user feedback.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- A Google Gemini API key (Get one from [https://ai.google.dev/](https://ai.google.dev/))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/profici-competitive-analysis.git
cd profici-competitive-analysis
```

2. Install dependencies:

```bash
npm install
```

3. Copy the environment variables file and add your Gemini API key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## How to Use

1. Fill out the form with your business details including:
   - Business name
   - Website URL
   - Industry/niche
   - Competitors
   - Key products/services
   - Target audience

2. Click "Generate Business Analysis" to get your personalized report.

3. Review the comprehensive report with sections for SEO analysis, competitor information, market potential, market cap, and strategic recommendations.

## Technologies Used

- Next.js - React framework
- Tailwind CSS - Styling
- Google Gemini API - AI-powered analysis

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

The AI-generated analysis should be used as a starting point and supplemented with expert human judgment and additional research. The accuracy of the information depends on the quality of input data and the AI model's capabilities.
