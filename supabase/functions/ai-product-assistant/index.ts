import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssistantRequest {
  action: 'generate_description' | 'optimize_title' | 'recommend_category' | 
          'analyze_pricing' | 'extract_keywords' | 'score_completeness';
  data: Record<string, any>;
}

interface CompletenessData {
  title?: string;
  description?: string;
  price?: number | string;
  stock?: number | string;
  category_id?: string;
  images?: string[];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { action, data }: AssistantRequest = await req.json();
    
    let result;
    switch (action) {
      case 'score_completeness':
        result = await scoreCompleteness(data as CompletenessData);
        break;
      case 'generate_description':
        result = { error: 'Coming in Phase 2', phase: 2 };
        break;
      case 'optimize_title':
        result = { error: 'Coming in Phase 2', phase: 2 };
        break;
      case 'recommend_category':
        result = { error: 'Coming in Phase 2', phase: 2 };
        break;
      case 'analyze_pricing':
        result = { error: 'Coming in Phase 3', phase: 3 };
        break;
      case 'extract_keywords':
        result = { error: 'Coming in Phase 3', phase: 3 };
        break;
      default:
        throw new Error('Invalid action');
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scoreCompleteness(data: CompletenessData) {
  let score = 0;
  const feedback: Array<{ category: string; score: number; maxScore: number; status: 'complete' | 'partial' | 'missing'; message: string }> = [];

  // Title scoring (15 points)
  if (data.title) {
    const titleLength = data.title.trim().length;
    if (titleLength >= 20 && titleLength <= 80) {
      score += 15;
      feedback.push({
        category: 'Title',
        score: 15,
        maxScore: 15,
        status: 'complete',
        message: 'Excellent title length'
      });
    } else if (titleLength > 0) {
      const titleScore = Math.min(15, Math.floor((titleLength / 50) * 15));
      score += titleScore;
      feedback.push({
        category: 'Title',
        score: titleScore,
        maxScore: 15,
        status: 'partial',
        message: titleLength < 20 ? 'Title is too short. Aim for 20-80 characters.' : 'Title is too long. Keep it under 80 characters.'
      });
    } else {
      feedback.push({
        category: 'Title',
        score: 0,
        maxScore: 15,
        status: 'missing',
        message: 'Add a descriptive title (20-80 characters)'
      });
    }
  } else {
    feedback.push({
      category: 'Title',
      score: 0,
      maxScore: 15,
      status: 'missing',
      message: 'Add a descriptive title (20-80 characters)'
    });
  }

  // Description scoring (25 points)
  if (data.description) {
    const descLength = data.description.trim().length;
    const wordCount = data.description.trim().split(/\s+/).length;
    
    if (wordCount >= 50 && descLength >= 200) {
      score += 25;
      feedback.push({
        category: 'Description',
        score: 25,
        maxScore: 25,
        status: 'complete',
        message: 'Comprehensive description'
      });
    } else if (descLength > 0) {
      const descScore = Math.min(25, Math.floor((wordCount / 50) * 25));
      score += descScore;
      feedback.push({
        category: 'Description',
        score: descScore,
        maxScore: 25,
        status: 'partial',
        message: `Add ${50 - wordCount} more words for better detail (${wordCount}/50 words)`
      });
    } else {
      feedback.push({
        category: 'Description',
        score: 0,
        maxScore: 25,
        status: 'missing',
        message: 'Add a detailed description (at least 50 words)'
      });
    }
  } else {
    feedback.push({
      category: 'Description',
      score: 0,
      maxScore: 25,
      status: 'missing',
      message: 'Add a detailed description (at least 50 words)'
    });
  }

  // Images scoring (20 points)
  if (data.images && data.images.length > 0) {
    const imageScore = Math.min(20, data.images.length * 5);
    score += imageScore;
    
    if (data.images.length >= 4) {
      feedback.push({
        category: 'Images',
        score: 20,
        maxScore: 20,
        status: 'complete',
        message: `Great! ${data.images.length} images added`
      });
    } else {
      feedback.push({
        category: 'Images',
        score: imageScore,
        maxScore: 20,
        status: 'partial',
        message: `Add ${4 - data.images.length} more images (${data.images.length}/4)`
      });
    }
  } else {
    feedback.push({
      category: 'Images',
      score: 0,
      maxScore: 20,
      status: 'missing',
      message: 'Add at least 4 product images'
    });
  }

  // Category scoring (10 points)
  if (data.category_id && data.category_id.trim() !== '') {
    score += 10;
    feedback.push({
      category: 'Category',
      score: 10,
      maxScore: 10,
      status: 'complete',
      message: 'Category selected'
    });
  } else {
    feedback.push({
      category: 'Category',
      score: 0,
      maxScore: 10,
      status: 'missing',
      message: 'Select a category for better discoverability'
    });
  }

  // Price scoring (10 points)
  const priceValue = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
  if (priceValue && priceValue > 0) {
    score += 10;
    feedback.push({
      category: 'Price',
      score: 10,
      maxScore: 10,
      status: 'complete',
      message: 'Price set'
    });
  } else {
    feedback.push({
      category: 'Price',
      score: 0,
      maxScore: 10,
      status: 'missing',
      message: 'Set a competitive price'
    });
  }

  // Stock scoring (10 points)
  const stockValue = typeof data.stock === 'string' ? parseInt(data.stock) : data.stock;
  if (stockValue !== undefined && stockValue >= 0) {
    score += 10;
    feedback.push({
      category: 'Stock',
      score: 10,
      maxScore: 10,
      status: 'complete',
      message: 'Stock quantity specified'
    });
  } else {
    feedback.push({
      category: 'Stock',
      score: 0,
      maxScore: 10,
      status: 'missing',
      message: 'Specify stock quantity'
    });
  }

  // Keywords scoring (10 points) - Basic check for now
  if (data.title && data.description) {
    const combinedText = `${data.title} ${data.description}`.toLowerCase();
    const hasKeywords = combinedText.length > 100;
    
    if (hasKeywords) {
      score += 10;
      feedback.push({
        category: 'Keywords',
        score: 10,
        maxScore: 10,
        status: 'complete',
        message: 'Good keyword coverage'
      });
    } else {
      score += 5;
      feedback.push({
        category: 'Keywords',
        score: 5,
        maxScore: 10,
        status: 'partial',
        message: 'Add more descriptive keywords'
      });
    }
  } else {
    feedback.push({
      category: 'Keywords',
      score: 0,
      maxScore: 10,
      status: 'missing',
      message: 'Add keywords for better search visibility'
    });
  }

  // Determine quality level
  let qualityLevel: string;
  let qualityMessage: string;
  
  if (score >= 90) {
    qualityLevel = 'excellent';
    qualityMessage = 'Excellent listing! Ready to publish.';
  } else if (score >= 75) {
    qualityLevel = 'good';
    qualityMessage = 'Good listing. A few improvements would make it great.';
  } else if (score >= 50) {
    qualityLevel = 'fair';
    qualityMessage = 'Fair listing. Add more details to attract buyers.';
  } else {
    qualityLevel = 'poor';
    qualityMessage = 'Needs work. Complete missing fields for better results.';
  }

  return {
    score,
    maxScore: 100,
    percentage: score,
    qualityLevel,
    qualityMessage,
    feedback,
    recommendations: feedback
      .filter(f => f.status !== 'complete')
      .sort((a, b) => (b.maxScore - b.score) - (a.maxScore - a.score))
      .slice(0, 3)
      .map(f => f.message)
  };
}