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

function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, l => l.toUpperCase());
}

function extractKeywordsFromText(text: string): string[] {
  const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'this', 'that', 'these', 'those']);
  
  const words = text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));
  
  const frequency: Record<string, number> = {};
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

async function generateDescription(data: any) {
  const { title, price, category, existingDescription } = data;
  const productName = title || 'product';
  const priceStr = price ? `$${price}` : 'competitively priced';
  
  const variants = [
    {
      style: 'professional',
      text: `This premium ${productName} represents exceptional quality and outstanding value in the ${category || 'marketplace'}. Engineered with meticulous attention to detail, it meets the highest industry standards for performance and reliability. Designed for discerning customers who refuse to compromise on excellence, this product delivers consistent results you can depend on. Every aspect has been carefully considered to ensure maximum satisfaction and long-lasting durability. Backed by our unwavering commitment to quality and customer service, this investment provides peace of mind and proven performance.`,
      description: 'Formal and detailed, emphasizing quality'
    },
    {
      style: 'casual',
      text: `Looking for an awesome ${productName}? You just found it! This has become one of our absolute customer favorites, and honestly, we're not surprised. It's super practical, really well-made, and just works exactly like you'd want it to. At ${priceStr}, it's genuinely a fantastic deal. People keep coming back to tell us how happy they are with their purchase. Don't sleep on this one - grab yours while we still have them in stock!`,
      description: 'Friendly and conversational'
    },
    {
      style: 'marketing',
      text: `Transform your experience with this incredible ${productName}! Why settle for ordinary when extraordinary is within reach? This isn't just another purchase - it's an investment in quality that pays dividends every single day. Join thousands of delighted customers who've already made the smart choice. With limited availability and growing demand, now is the perfect time to secure yours. Order today and discover the difference that true quality makes. Your satisfaction is guaranteed!`,
      description: 'Persuasive with strong call-to-action'
    }
  ];

  return { variants };
}

async function optimizeTitle(data: any) {
  const { title, description, category } = data;
  
  if (!title) {
    return { error: 'Title is required' };
  }

  const keywords = description ? extractKeywordsFromText(description).slice(0, 3) : [];
  const categoryPrefix = category ? `${category} - ` : '';
  
  const suggestions = [
    `Premium ${title} - High Quality & Durable`,
    `${categoryPrefix}${title} | Professional Grade`,
    `Best ${title} - Top Rated & Trusted`,
  ];
  
  if (keywords.length > 0) {
    suggestions.push(`${title} - ${capitalizeWords(keywords.slice(0, 2).join(' & '))}`);
  }

  return {
    original: title,
    suggestions: suggestions.slice(0, 3),
    analysis: 'Optimized for clarity, SEO, and conversion. Added descriptive keywords and value propositions to improve search visibility and click-through rates.'
  };
}

async function recommendCategory(data: any) {
  const { title, description, availableCategories } = data;
  
  const text = `${title || ''} ${description || ''}`.toLowerCase();
  
  const categoryKeywords: Record<string, string[]> = {
    'Electronics': ['electronic', 'digital', 'computer', 'phone', 'device', 'tech', 'smart', 'wireless', 'bluetooth', 'usb', 'hdmi', 'battery', 'charger', 'laptop', 'tablet', 'camera', 'audio', 'video', 'screen', 'monitor'],
    'Fashion': ['clothing', 'fashion', 'wear', 'shirt', 'pants', 'dress', 'jacket', 'shoes', 'boots', 'sneakers', 'style', 'apparel', 'outfit', 'accessories', 'jewelry', 'watch', 'bag', 'belt', 'hat', 'scarf'],
    'Home & Garden': ['home', 'garden', 'furniture', 'decor', 'kitchen', 'bedroom', 'bathroom', 'outdoor', 'plant', 'tool', 'appliance', 'storage', 'organization', 'cleaning', 'lamp', 'lighting', 'carpet', 'curtain', 'pillow'],
    'Sports': ['sport', 'fitness', 'exercise', 'gym', 'workout', 'athletic', 'running', 'training', 'yoga', 'basketball', 'football', 'soccer', 'tennis', 'golf', 'cycling', 'swimming', 'outdoor', 'camping', 'hiking'],
    'Books': ['book', 'novel', 'read', 'author', 'fiction', 'story', 'literature', 'writing', 'page', 'chapter', 'edition', 'paperback', 'hardcover', 'textbook', 'guide', 'manual', 'magazine', 'comic'],
    'Toys': ['toy', 'game', 'play', 'kids', 'children', 'baby', 'puzzle', 'doll', 'action', 'figure', 'board', 'card', 'educational', 'learning', 'fun', 'entertainment'],
    'Health & Beauty': ['health', 'beauty', 'skincare', 'makeup', 'cosmetic', 'personal', 'care', 'wellness', 'vitamin', 'supplement', 'organic', 'natural', 'cream', 'lotion', 'shampoo', 'soap'],
    'Automotive': ['car', 'auto', 'vehicle', 'automotive', 'truck', 'motor', 'engine', 'tire', 'wheel', 'parts', 'accessory', 'maintenance', 'repair', 'oil', 'brake']
  };

  let bestMatch = '';
  let maxScore = 0;
  const scores: Record<string, number> = {};

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    let score = 0;
    keywords.forEach(keyword => {
      if (text.includes(keyword)) {
        score += 1;
      }
    });
    scores[category] = score;
    if (score > maxScore) {
      maxScore = score;
      bestMatch = category;
    }
  }

  if (!bestMatch && availableCategories && availableCategories.length > 0) {
    bestMatch = availableCategories[0];
  }

  const alternatives = Object.entries(scores)
    .filter(([cat]) => cat !== bestMatch)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([cat]) => cat);

  const confidence = maxScore > 3 ? 'high' : maxScore > 1 ? 'medium' : 'low';

  return {
    recommended: bestMatch || 'General',
    confidence,
    reasoning: `Based on keyword analysis of your title and description, this category best matches your product characteristics. Found ${maxScore} relevant indicators.`,
    alternatives
  };
}

async function analyzePricing(data: any) {
  const { title, description, currentPrice, category } = data;
  
  const basePriceEstimate = currentPrice || 29.99;
  
  const categoryMultipliers: Record<string, number> = {
    'Electronics': 1.5,
    'Fashion': 1.2,
    'Home & Garden': 1.1,
    'Sports': 1.3,
    'Books': 0.7,
    'Toys': 0.9,
    'Health & Beauty': 1.2,
    'Automotive': 1.4
  };

  const multiplier = categoryMultipliers[category] || 1.0;
  const adjustedBase = basePriceEstimate * multiplier;

  const descriptionQuality = description ? Math.min(description.length / 200, 1.2) : 1.0;
  const finalBase = adjustedBase * descriptionQuality;

  return {
    suggestedMin: Math.round(finalBase * 0.75 * 100) / 100,
    suggestedMax: Math.round(finalBase * 1.35 * 100) / 100,
    optimal: Math.round(finalBase * 100) / 100,
    reasoning: `Pricing analysis based on ${category || 'general'} category market standards, product description quality, and competitive positioning. This range balances profitability with market competitiveness.`,
    pricePoints: {
      budget: Math.round(finalBase * 0.80 * 100) / 100,
      standard: Math.round(finalBase * 100) / 100,
      premium: Math.round(finalBase * 1.30 * 100) / 100
    }
  };
}

async function extractKeywords(data: any) {
  const { title, description } = data;
  
  const allText = `${title || ''} ${description || ''}`;
  const keywords = extractKeywordsFromText(allText);
  
  const primary = keywords.slice(0, 5);
  const secondary = keywords.slice(5, 12);
  
  const titleWords = title ? title.toLowerCase().split(/\s+/).filter(w => w.length > 3) : [];
  const longTail = [
    `best ${titleWords[0] || 'product'}`,
    `buy ${title || 'product'} online`,
    `${titleWords[0] || 'quality'} ${titleWords[1] || 'product'} for sale`,
    `premium ${title || 'product'} deals`,
    `top rated ${titleWords[0] || 'product'}`
  ].slice(0, 5);

  const searchVolume = keywords.length > 15 ? 'high' : keywords.length > 8 ? 'medium' : 'low';

  return {
    primary,
    secondary,
    longTail,
    searchVolume
  };
}

async function generateFeatures(data: any) {
  const { title, description } = data;
  
  const keywords = description ? extractKeywordsFromText(description).slice(0, 6) : [];
  const productName = title || 'product';
  
  const features = [
    `Premium quality construction ensures lasting durability and reliability`,
    `Easy to use right out of the box with intuitive design`,
    `Versatile functionality suitable for multiple applications`,
    `Exceptional value combining quality with competitive pricing`,
    `Trusted by thousands of satisfied customers worldwide`,
    `Backed by comprehensive warranty for complete peace of mind`
  ];
  
  if (keywords.length > 0) {
    features.unshift(`${capitalizeWords(keywords[0])} technology for superior performance`);
  }
  
  if (keywords.length > 1) {
    features.push(`Advanced ${keywords[1]} design for optimal results`);
  }

  return {
    features: features.slice(0, 7)
  };
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