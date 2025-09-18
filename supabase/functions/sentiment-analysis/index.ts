import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: string[];
  summary: string;
}

async function analyzeSentiment(text: string): Promise<SentimentResult> {
  if (!openAIApiKey) {
    throw new Error('OpenAI API key is not configured');
  }

  const systemPrompt = `You are a sentiment analysis expert. Analyze the given text and return a JSON response with the following structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": number between 0 and 1,
  "emotions": array of detected emotions like ["joy", "excitement", "disappointment"],
  "summary": brief summary of the sentiment analysis
}

Focus on tourism and travel context. Be precise and accurate.`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    const result = JSON.parse(data.choices[0].message.content);
    
    return result;
  } catch (error) {
    console.error('Error in analyzeSentiment:', error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestBody = await req.json();
    const { type, batchAnalysis, text } = requestBody;

    if (batchAnalysis) {
      // Analyze all reviews and community posts
      console.log('Starting batch sentiment analysis...');
      
      // Get all reviews
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('id, content, title, rating')
        .not('content', 'is', null);

      if (reviewsError) throw reviewsError;

      // Get all community posts
      const { data: posts, error: postsError } = await supabase
        .from('community_posts')
        .select('id, content, title')
        .not('content', 'is', null);

      if (postsError) throw postsError;

      const analysisResults = [];

      // Analyze reviews
      for (const review of reviews || []) {
        try {
          const textToAnalyze = `${review.title || ''} ${review.content}`.trim();
          if (textToAnalyze.length > 10) {
            const sentiment = await analyzeSentiment(textToAnalyze);
            analysisResults.push({
              type: 'review',
              id: review.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence,
              emotions: sentiment.emotions,
              summary: sentiment.summary,
              rating: review.rating,
              content: textToAnalyze.substring(0, 100) + '...'
            });
          }
        } catch (error) {
          console.error(`Error analyzing review ${review.id}:`, error);
        }
      }

      // Analyze community posts
      for (const post of posts || []) {
        try {
          const textToAnalyze = `${post.title || ''} ${post.content}`.trim();
          if (textToAnalyze.length > 10) {
            const sentiment = await analyzeSentiment(textToAnalyze);
            analysisResults.push({
              type: 'community_post',
              id: post.id,
              sentiment: sentiment.sentiment,
              confidence: sentiment.confidence,
              emotions: sentiment.emotions,
              summary: sentiment.summary,
              content: textToAnalyze.substring(0, 100) + '...'
            });
          }
        } catch (error) {
          console.error(`Error analyzing post ${post.id}:`, error);
        }
      }

      // Calculate overall statistics
      const totalAnalyzed = analysisResults.length;
      const positiveCount = analysisResults.filter(r => r.sentiment === 'positive').length;
      const negativeCount = analysisResults.filter(r => r.sentiment === 'negative').length;
      const neutralCount = analysisResults.filter(r => r.sentiment === 'neutral').length;

      const averageConfidence = analysisResults.reduce((sum, r) => sum + r.confidence, 0) / totalAnalyzed;

      // Get most common emotions
      const allEmotions = analysisResults.flatMap(r => r.emotions);
      const emotionCounts = allEmotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const topEmotions = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([emotion, count]) => ({ emotion, count }));

      console.log(`Batch analysis completed: ${totalAnalyzed} items analyzed`);

      return new Response(JSON.stringify({
        success: true,
        results: analysisResults,
        statistics: {
          total: totalAnalyzed,
          positive: positiveCount,
          negative: negativeCount,
          neutral: neutralCount,
          averageConfidence,
          topEmotions
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // Single text analysis
      if (!text || text.trim().length === 0) {
        throw new Error('Text is required for analysis');
      }

      const sentiment = await analyzeSentiment(text);

      return new Response(JSON.stringify({
        success: true,
        result: sentiment
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in sentiment-analysis function:', error);
    return new Response(JSON.stringify({
      error: error.message,
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});