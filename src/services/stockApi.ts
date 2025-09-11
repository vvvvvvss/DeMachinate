import { ApiResponse, StockData, SentimentData } from '../types';

const ALPHA_VANTAGE_API_KEY = "PIG3WPABVKTBMH6Y";

export class StockAnalysisService {
  private static calculateZScore(value: number, mean: number, std: number): number {
    return std === 0 ? 0 : (value - mean) / std;
  }

  private static calculateRollingStats(data: number[], window: number = 5) {
    const result: Array<{ mean: number; std: number }> = [];
    
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const windowData = data.slice(start, i + 1);
      
      const mean = windowData.reduce((sum, val) => sum + val, 0) / windowData.length;
      const variance = windowData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windowData.length;
      const std = Math.sqrt(variance);
      
      result.push({ mean, std });
    }
    
    return result;
  }

  private static generateSyntheticSentiment(stockData: StockData[]): SentimentData[] {
    return stockData.map((stock, index) => {
      // Create sentiment that somewhat follows price changes with noise
      const baseSentiment = stock.priceChange * 10;
      const sentiment = Math.min(Math.max(baseSentiment + (Math.random() - 0.5), -1), 1);
      
      // Create more social activity on volatile days
      const tweetCount = Math.max(10, 100 + Math.abs(sentiment) * 300 + (Math.random() - 0.5) * 100);
      const newsCount = Math.max(1, 3 + Math.abs(stock.priceChange) * 30 + (Math.random() - 0.5) * 4);
      
      // Occasionally simulate manipulation scenarios
      let manipulatedSentiment = sentiment;
      if (index % 7 === 0) {
        manipulatedSentiment = Math.random() > 0.5 ? 0.8 : -0.8;
      }
      
      return {
        date: stock.date,
        tweetSentiment: manipulatedSentiment,
        newsSentiment: sentiment * 0.7 + (Math.random() - 0.5) * 0.4,
        tweetCount,
        newsCount,
        sentimentZScore: 0
      };
    });
  }

  static async fetchStockData(ticker: string, lookbackDays: number = 90): Promise<StockData[]> {
    try {
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&outputsize=full&apikey=${ALPHA_VANTAGE_API_KEY}`;
      const response = await fetch(url);
      const data: ApiResponse = await response.json();

      if (!data['Time Series (Daily)']) {
        throw new Error('Failed to fetch stock data');
      }

      const timeSeries = data['Time Series (Daily)'];
      const dates = Object.keys(timeSeries).sort().slice(-lookbackDays * 2);
      
      const rawData = dates.map(date => ({
        date,
        open: parseFloat(timeSeries[date]['1. open']),
        high: parseFloat(timeSeries[date]['2. high']),
        low: parseFloat(timeSeries[date]['3. low']),
        close: parseFloat(timeSeries[date]['4. close']),
        volume: parseFloat(timeSeries[date]['5. volume'])
      }));

      // Calculate price and volume changes
      const processedData = rawData.map((item, index) => {
        const priceChange = index > 0 ? (item.close - rawData[index - 1].close) / rawData[index - 1].close : 0;
        const volumeChange = index > 0 ? (item.volume - rawData[index - 1].volume) / rawData[index - 1].volume : 0;
        
        return {
          ...item,
          priceChange,
          volumeChange,
          volatility: 0,
          priceZScore: 0,
          volumeZScore: 0,
          anomalyScore: 0,
          isAnomaly: false,
          manipulationProbability: 0,
          predictedManipulation: false
        };
      });

      // Calculate rolling statistics and z-scores
      const priceChanges = processedData.map(d => d.priceChange);
      const volumes = processedData.map(d => d.volume);
      
      const priceStats = this.calculateRollingStats(priceChanges);
      const volumeStats = this.calculateRollingStats(volumes);

      // Apply z-scores and volatility
      const finalData = processedData.map((item, index) => {
        const volatility = index >= 5 ? 
          Math.sqrt(priceChanges.slice(index - 4, index + 1).reduce((sum, pc) => sum + pc * pc, 0) / 5) : 0;
        
        const priceZScore = this.calculateZScore(item.priceChange, priceStats[index].mean, priceStats[index].std);
        const volumeZScore = this.calculateZScore(item.volume, volumeStats[index].mean, volumeStats[index].std);
        
        // Simple anomaly detection based on z-scores
        const isAnomaly = Math.abs(priceZScore) > 1.5 || Math.abs(volumeZScore) > 1.5;
        const anomalyScore = Math.max(Math.abs(priceZScore), Math.abs(volumeZScore));
        
        // Simple manipulation probability based on combined indicators
        const manipulationProbability = Math.min(1, (Math.abs(priceZScore) + Math.abs(volumeZScore)) / 4);
        const predictedManipulation = manipulationProbability > 0.4 && isAnomaly;

        return {
          ...item,
          volatility,
          priceZScore,
          volumeZScore,
          anomalyScore,
          isAnomaly,
          manipulationProbability,
          predictedManipulation
        };
      });

      return finalData.slice(-lookbackDays);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      throw error;
    }
  }

  static async analyzeStock(ticker: string, lookbackDays: number = 90) {
    const stockData = await this.fetchStockData(ticker, lookbackDays);
    const sentimentData = this.generateSyntheticSentiment(stockData);
    
    // Calculate sentiment z-scores
    const sentiments = sentimentData.map(s => s.tweetSentiment);
    const sentimentStats = this.calculateRollingStats(sentiments);
    
    const processedSentimentData = sentimentData.map((item, index) => ({
      ...item,
      sentimentZScore: this.calculateZScore(item.tweetSentiment, sentimentStats[index].mean, sentimentStats[index].std)
    }));

    // Generate summary
    const manipulationDays = stockData.filter(d => d.predictedManipulation).length;
    const suspiciousDates = stockData
      .filter(d => d.predictedManipulation || d.isAnomaly)
      .map(d => {
        const reasons = [];
        if (Math.abs(d.priceZScore) > 1.5) reasons.push(`Abnormal price movement (z=${d.priceZScore.toFixed(2)})`);
        if (Math.abs(d.volumeZScore) > 1.5) reasons.push(`Abnormal volume (z=${d.volumeZScore.toFixed(2)})`);
        if (d.volatility > 0.05) reasons.push('High volatility');
        
        const sentiment = processedSentimentData.find(s => s.date === d.date);
        if (sentiment && Math.abs(sentiment.sentimentZScore) > 1.5) {
          reasons.push(`Abnormal sentiment (z=${sentiment.sentimentZScore.toFixed(2)})`);
        }
        
        const severity = d.manipulationProbability > 0.7 ? 'high' : 
                        d.manipulationProbability > 0.5 ? 'medium' : 'low';
        
        return {
          date: d.date,
          reasons,
          severity: severity as 'low' | 'medium' | 'high'
        };
      });

    const summary = {
      totalDays: stockData.length,
      manipulationDays,
      manipulationPercentage: (manipulationDays / stockData.length) * 100,
      suspiciousDates
    };

    // Mock model metrics
    const modelMetrics = {
      precision: 0.75 + Math.random() * 0.2,
      recall: 0.68 + Math.random() * 0.25,
      f1Score: 0.71 + Math.random() * 0.2
    };

    return {
      stockData,
      sentimentData: processedSentimentData,
      summary,
      modelMetrics
    };
  }
}