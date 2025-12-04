import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface AssistantRequest {
  action: 'generate_description' | 'optimize_title' | 'recommend_category' | 
          'analyze_pricing' | 'extract_keywords' | 'score_completeness' | 'generate_features';
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

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

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
        result = await generateDescription(data);
        break;
      case 'optimize_title':
        result = await optimizeTitle(data);
        break;
      case 'recommend_category':
        result = await recommendCategory(data);
        break;
      case 'analyze_pricing':
        result = await analyzePricing(data);
        break;
      case 'extract_keywords':
        result = await extractKeywords(data);
        break;
      case 'generate_features':
        result = await generateFeatures(data);
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

async function callOpenAI(prompt: string, systemPrompt: string) {
  if (!OPENAI_API_KEY) {
    return {
      success: false,
      error: 'OpenAI API key not configured. This is a demo response.',
      demoMode: true
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      success: true,
      content: result.choices[0].message.content,
      usage: result.usage,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function generateDescription(data: any) {
  const { title, price, category, existingDescription } = data;
  
  const prompt = `Generate 3 different product descriptions for an e-commerce listing.

Product Title: ${title || 'Product'}
Price: $${price || 'TBD'}
Category: ${category || 'General'}
${existingDescription ? `Current Description: ${existingDescription}` : ''}

Create 3 variants:
1. Professional: Formal, detailed, emphasizes quality and value
2. Casual: Friendly, conversational, relatable tone
3. Marketing: Persuasive, benefit-focused, compelling call-to-action

Return as JSON: {"professional": "...", "casual": "...", "marketing": "..."}`;

  const systemPrompt = 'You are an expert e-commerce copywriter. Create compelling, accurate product descriptions that drive conversions. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    return {
      variants: [
        {
          style: 'professional',
          text: `This premium ${title || 'product'} offers exceptional quality and value. Carefully crafted with attention to detail, it meets the highest standards of excellence. Perfect for discerning customers who appreciate superior craftsmanship and reliable performance. Backed by our commitment to customer satisfaction.`,
          description: 'Formal and detailed, emphasizing quality'
        },
        {
          style: 'casual',
          text: `Looking for a great ${title || 'product'}? You've found it! This is one of our customer favorites, and for good reason. It's practical, well-made, and just works. Plus, at this price point, it's a no-brainer. Don't miss out on snagging one while we have them in stock!`,
          description: 'Friendly and conversational'
        },
        {
          style: 'marketing',
          text: `Transform your experience with this incredible ${title || 'product'}! Don't settle for less when you can have the best. Limited stock available - secure yours now and discover why thousands of satisfied customers choose us. Order today and enjoy fast shipping plus our satisfaction guarantee!`,
          description: 'Persuasive with strong call-to-action'
        }
      ],
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return {
      variants: [
        { style: 'professional', text: parsed.professional, description: 'Formal and detailed' },
        { style: 'casual', text: parsed.casual, description: 'Friendly and conversational' },
        { style: 'marketing', text: parsed.marketing, description: 'Persuasive and compelling' }
      ]
    };
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function optimizeTitle(data: any) {
  const { title, description, category } = data;
  
  if (!title) {
    return { error: 'Title is required' };
  }

  const prompt = `Optimize this product title for e-commerce:

Current Title: ${title}
Category: ${category || 'General'}
${description ? `Description: ${description.substring(0, 200)}` : ''}

Create 3 improved versions that are:
- Clear and descriptive
- SEO-friendly with relevant keywords
- 40-80 characters long
- Professional and compelling

Return as JSON: {"optimized1": "...", "optimized2": "...", "optimized3": "...", "analysis": "brief explanation of improvements"}`;

  const systemPrompt = 'You are an e-commerce SEO expert specializing in product title optimization. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    return {
      original: title,
      suggestions: [
        `Premium ${title} - High Quality & Durable`,
        `${title} | Professional Grade`,
        `Best ${title} - Top Rated Choice`
      ],
      analysis: 'Optimized for clarity, SEO, and conversion. Added descriptive keywords and value propositions.',
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return {
      original: title,
      suggestions: [parsed.optimized1, parsed.optimized2, parsed.optimized3],
      analysis: parsed.analysis
    };
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function recommendCategory(data: any) {
  const { title, description, availableCategories } = data;
  
  const prompt = `Analyze this product and recommend the best category:

Title: ${title || 'No title'}
Description: ${description || 'No description'}

Available Categories: ${availableCategories?.join(', ') || 'Electronics, Fashion, Home & Garden, Sports, Books, Toys, Health, Automotive'}

Return as JSON: {"recommended": "category name", "confidence": "high/medium/low", "reasoning": "brief explanation", "alternatives": ["alt1", "alt2"]}`;

  const systemPrompt = 'You are a product categorization expert. Analyze products and recommend the most appropriate category. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    return {
      recommended: availableCategories?.[0] || 'Electronics',
      confidence: 'medium',
      reasoning: 'Based on title and description analysis',
      alternatives: availableCategories?.slice(1, 3) || ['Fashion', 'Home & Garden'],
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function analyzePricing(data: any) {
  const { title, description, currentPrice, category } = data;
  
  const prompt = `Analyze pricing for this product:

Title: ${title}
Category: ${category || 'General'}
Current Price: $${currentPrice || 'Not set'}
Description: ${description?.substring(0, 200) || 'No description'}

Provide pricing recommendations based on:
- Product category and market standards
- Perceived value from description
- Competitive positioning

Return as JSON: {"suggestedMin": number, "suggestedMax": number, "optimal": number, "reasoning": "explanation", "pricePoints": ["budget": number, "standard": number, "premium": number]}`;

  const systemPrompt = 'You are a pricing strategy expert for e-commerce. Provide data-driven pricing recommendations. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    const basePrice = currentPrice || 29.99;
    return {
      suggestedMin: Math.round(basePrice * 0.8 * 100) / 100,
      suggestedMax: Math.round(basePrice * 1.3 * 100) / 100,
      optimal: Math.round(basePrice * 100) / 100,
      reasoning: 'Based on category averages and product positioning',
      pricePoints: {
        budget: Math.round(basePrice * 0.85 * 100) / 100,
        standard: Math.round(basePrice * 100) / 100,
        premium: Math.round(basePrice * 1.25 * 100) / 100
      },
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function extractKeywords(data: any) {
  const { title, description } = data;
  
  const prompt = `Extract and generate SEO keywords for this product:

Title: ${title || 'No title'}
Description: ${description || 'No description'}

Extract:
1. Primary keywords (most important, 3-5 keywords)
2. Secondary keywords (supporting, 5-7 keywords)
3. Long-tail keywords (specific phrases, 3-5 phrases)

Return as JSON: {"primary": ["..."], "secondary": ["..."], "longTail": ["..."], "searchVolume": "high/medium/low"}`;

  const systemPrompt = 'You are an SEO keyword expert. Extract and generate relevant keywords for e-commerce product optimization. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    const words = (title + ' ' + description).toLowerCase().split(/\s+/).filter(w => w.length > 3);
    return {
      primary: words.slice(0, 4),
      secondary: words.slice(4, 10),
      longTail: [`best ${title}`, `buy ${title} online`, `${title} for sale`],
      searchVolume: 'medium',
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function generateFeatures(data: any) {
  const { title, description } = data;
  
  const prompt = `Generate bullet point features for this product:

Title: ${title || 'Product'}
Description: ${description || 'No description'}

Create 5-7 compelling bullet points that:
- Highlight key features and benefits
- Are concise and easy to scan
- Focus on customer value
- Use action-oriented language

Return as JSON: {"features": ["feature 1", "feature 2", ...]}`;

  const systemPrompt = 'You are a product marketing expert. Create compelling feature bullet points that drive conversions. Return only valid JSON.';
  
  const response = await callOpenAI(prompt, systemPrompt);
  
  if (!response.success || response.demoMode) {
    return {
      features: [
        `Premium quality construction ensures lasting durability`,
        `Easy to use right out of the box`,
        `Versatile design suitable for multiple applications`,
        `Backed by manufacturer warranty for peace of mind`,
        `Trusted by thousands of satisfied customers`,
        `Fast and reliable shipping available`
      ],
      demoMode: true
    };
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return { error: 'Failed to parse AI response' };
  }
}

async function scoreCompleteness(data: CompletenessData) {
  let score = 0;
  const feedback: Array<{ category: string; score: number; maxScore: number; status: 'complete' | 'partial' | 'missing'; message: string }> = [];

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