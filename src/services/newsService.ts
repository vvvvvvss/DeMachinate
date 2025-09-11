// First create a news service
export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  url: string;
}

interface GNewsResponse {
  articles: Array<{
    title: string;
    description: string;
    content: string;
    url: string;
    image: string;
    publishedAt: string;
    source: {
      name: string;
      url: string;
    };
  }>;
}

export class NewsService {
  private static API_KEY = 'ed2f49567a84f48eeaca6e38b9ccc521';
  
  static async fetchNews(): Promise<NewsItem[]> {
    try {
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?token=${this.API_KEY}&lang=en&category=business`
      );
      
      if (!response.ok) throw new Error('Failed to fetch news');
      
      const data: GNewsResponse = await response.json();
      
      // Transform GNews response to our NewsItem format
      return data.articles.map((article, index) => ({
        id: `${index}-${Date.now()}`, // Generate a unique ID
        title: article.title,
        source: article.source.name,
        timestamp: article.publishedAt,
        url: article.url,
        sentiment: NewsService.analyzeSentiment(article.description) // Basic sentiment analysis
      }));
      
    } catch (error) {
      console.error('News fetch error:', error);
      throw error;
    }
  }

  // Basic sentiment analysis based on keywords
  private static analyzeSentiment(text: string = ''): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['gain', 'rise', 'grow', 'profit', 'success', 'positive', 'up'];
    const negativeWords = ['loss', 'fall', 'drop', 'decline', 'negative', 'down', 'fail'];

    const textLower = text.toLowerCase();
    let positiveCount = positiveWords.filter(word => textLower.includes(word)).length;
    let negativeCount = negativeWords.filter(word => textLower.includes(word)).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }
}