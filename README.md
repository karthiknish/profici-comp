# Profici Competitive Analysis

A web application that utilizes the Google Gemini API to provide comprehensive competitive analysis reports including SEO analysis, competitor information, market potential, market cap, and strategic recommendations.

## Features

- **SEO Analysis**: Get insights on your website's SEO strengths and opportunities.
- **Competitor Analysis**: Compare your business with competitors in your industry.
- **Market Potential**: Evaluate the market potential and opportunities for your business.
- **Market Cap Evaluation**: Understand the market size and potential value for your business sector.
- **Strategic Recommendations**: Receive actionable recommendations for marketing strategies and C-suite level decisions.

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
