# TradeWatch - A stock market manipulation detection system
## What is manipulation and how to investigate it?

There are three types of manipulation: 

- *information-based* : circulation of incorrect or misleading information to change the price of an asset in the desired direction
- *action-based* : taking actions beyond the trades - for example, operational changes in a company or selling a branch of the company without informing the shareholders - to change the actual or perceived value of an asset
- *trade-based* : the attempts of manipulation by selling or buying the asset in a specific way

The first two types of manipulation is taken care of. However, confronting the third type of manipulation is more difficult because these kinds of manipulations seem to be legal in appearance and no objective violation can be found, but since some of these trades may be spoofing or carried out based on intentional fraud, they are considered as manipulations that are difficult to detect

## Investigation Strategy: Connecting All The Dots

The investigation system is multi-layered approach comprising of technical analysis, sentiment analysis and anomaly detection.

- **Market Data Integration**: Combines price/volume patterns with sentiment indicators
- **Temporal Analysis**: Tracks how metrics evolve over time (5-day windows)
- **Statistical Anomaly Detection**: Uses z-scores to identify outliers

### Red Flags the system look for

**Pump Signs (Artificial Price Inflation)**

- **Abnormal Price Movement**: Price `z-score > 0.5` without fundamental justification
- **Sentiment Manipulation**: Tweet sentiment `z-score > 0.5` with limited news coverage `news_count < mean * 1.2`
- **Volume Patterns**: Steady increase in volume preceding price jumps
- **Momentum Shifts**: Sudden acceleration in price momentum `price_momentum > 0.8`
- **Timing Analysis**: Suspicious patterns occurring near market open/close or before announcements

**Dump Signs (Orchestrated Selloffs)**

- **Volume Spikes**: Volume `z-score > 0.5` with negative price change
- **Sentiment Deterioration**: Tweet sentiment `z-score < -0.5`
- **Correlation Breaks**: Sudden divergence between price and broader market trends
- **News-Price Disconnects**: Price movements disproportionate to actual news impact

### Pattern Recognition Methodology

1. **Primary Screening using Isolation Forest**
2. **Secondary Analysis with XG Boost**

## System Overview

TradeWatch is a comprehensive stock market analysis and manipulation detection platform built Machine Learning models and modern web technologies. The system provides real-time market monitoring, advanced pattern recognition, and automated alert generation for detecting potential market manipulation activities.

## Technology Stack

**Machine Learning Model**

- **Isolation Forest**
    - Identifies unusual data patterns across all metrics
    - Flags days with statistical anomalies in price, volume, or sentiment
    - Sets baseline "anomaly scores" for further investigation
- **XG Boost**
    - Evaluates flagged anomalies against known manipulation patterns
    - Assigns manipulation probability scores (0-1)
    - Identifies which specific metrics contributed to the detection

**Frontend Framework**

- **React 18** with TypeScript for type-safe component development
- **Tailwind CSS** for utility-first responsive styling
- **Recharts** for high-performance data visualizations
- **Lucide React** for consistent iconography

**Backend Integration**

- **Alpha Vantage API** for real-time stock market data and social media…
- **GNews API** for financial news aggregation
- **Custom JWT implementation** for secure authentication

## Core Components Breakdown

### 1. Authentication System

```jsx
interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export const Login: React.FC = () => {
  // Features:
  // - JWT-based stateless authentication
  // - Secure password handling with bcrypt
  // - 2FA integration ready
  // - Session timeout management
  // - Password recovery workflow
}
```

### 2. Profile Management System

```jsx
interface UserProfile {
  id: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: NotificationSettings;
    defaultTimeframe: string;
    watchlistLimit: number;
  };
 
  apiKeys: APIKey[];
}
```

**Functionality:**

- Personalized dashboard configurations
- Theme selection with system preference detection
- API key generation and management
- Subscription tier management
- User activity tracking

### 3. Real-Time Alert System

```jsx
interface Alert {
  id: string;
  type: 'manipulation' | 'volatility' | 'volume_anomaly' | 'security' | 'news';
  severity: 'low' | 'medium' | 'high' | 'critical';
  symbol: string;
  message: string;
  details: AlertDetails;
  timestamp: Date;
  isRead: boolean;
  acknowledged: boolean;
  actions: AlertAction[];
}

class AlertService {
  private websocket: WebSocket;

  // Methods:
  // - Real-time alert processing with WebSocket
  // - Alert filtering and prioritization
  // - Batch alert processing for performance
  // - Alert history with search and pagination
  // - Custom alert rule creation
  // - Integration with notification services
}

```

**Advanced Features:**

- Machine learning-based alert prioritization
- Custom alert rule builder with visual interface
- Multi-channel alert delivery (email, SMS, push, webhook)
- Alert correlation and grouping
- Historical alert analytics

### 4. **Analysis Parameters**

On enter the ticker, and the period of manipulation - the user gets a detailed report on manipulation over that period.
**Summary -** Provides includes a breakdown on suspected dates of manipulation and the suspect factor


<img width="1919" height="913" alt="Screenshot 2025-09-12 221805" src="https://github.com/user-attachments/assets/b7e2c587-b51d-40bc-b650-6ac1c4f02b18" />  
<img width="1912" height="925" alt="Screenshot 2025-09-12 221818" src="https://github.com/user-attachments/assets/a888f523-bc62-4a88-b1bf-d0e55f057d70" />  

**Price Analysis -** Provides price movement visualizations, abnormal event flags, trend charts
<img width="1520" height="727" alt="Screenshot 2025-09-16 202616" src="https://github.com/user-attachments/assets/1a6efa7f-8087-402d-b121-37c96ad3afbf" />

**Sentiment Analysis -** Provides time-series charts mapping aggregated tweet/news sentiment against stock data.
<img width="1531" height="735" alt="Screenshot 2025-09-17 144122" src="https://github.com/user-attachments/assets/dbe6c2da-e239-4153-82a2-d64aab36c1fe" />


**Model Details -** Exposes model architecture, feature importance, ROC-AUC metrics.

### 5. Dashboard Components
<img width="1908" height="895" alt="Screenshot 2025-09-12 221900" src="https://github.com/user-attachments/assets/9284513d-5bf8-458c-8eae-ff366dffcb9e" />  

#### a. Watchlist

- **Functionality:** Tracks selected tickers for ongoing manipulative activity; customizable by user.
- **API Usage:** Alpha vantage API

#### b. Alerts

- **Functionality:** Compilation of recently triggered manipulation or anomaly events for monitored stocks.
- **API Usage:** Alert server feeds tied to backend database and event streaming system.

#### c. News Feed

- **Functionality:** Aggregates the latest relevant news articles, correlates with price/sentiment spikes.
- **API Usage:** GNews

#### d. Chart

- **Functionality:** Interactive charts for price, volume, sentiment, and manipulation probability.
- **Implementation:** D3.js, Chart.js, or Plotly for rendering; data sourced from backend APIs.

### 6. Case Management System

- **Functionality:** Manages manipulation case records, tracks evidence, logs analyst notes, and investigation outcomes.
- **API Usage:** CRUD operations handled via case management REST endpoints.
- **Features:** Assigns cases, links alerts/evidence, status tracking (e.g., open, closed, escalated).
- **Notes:** Supports compliance/audit workflows.

### 7. Security Module

#### API Keys

- **Functionality:** API key administration (generation, revocation, listing).
- **Logic:** Governs market data and sentiment API access.
- **Notes:** Essential for regulated environments, maintaining data access controls.

#### Audit & Privacy

- **Functionality:** Shows logs/access history, governs privacy settings.
- **Implementation:** Tables of user actions, API call records; data access policies.
- **Notes:** Fulfills audit trails mandatory for financial applications.

## API Integration Architecture

### Alpha Vantage Integration

```jsx
interface AlphaVantageConfig {
  baseUrl: 'https://www.alphavantage.co/query';
  apiKey: string;
  functions: {
    TIME_SERIES_INTRADAY: 'intraday data';
    TIME_SERIES_DAILY: 'daily data';
    TIME_SERIES_WEEKLY: 'weekly data';
    TIME_SERIES_MONTHLY: 'monthly data';
    GLOBAL_QUOTE: 'real-time quote';
    SYMBOL_SEARCH: 'symbol lookup';
    TECHNICAL_INDICATORS: 'RSI, MACD, etc.';
  };
  rateLimits: {
    requestsPerMinute: 5;
    requestsPerDay: 500;
  };
}

```

### GNews Integration

```jsx
interface GNewsConfig {
  baseUrl: 'https://gnews.io/api/v4';
  apiKey: string;
  endpoints: {
    topHeadlines: '/top-headlines';
    everything: '/search';
  };
  parameters: {
    category: 'business';
    country: string;
    language: 'en';
    max: number;
    from: string;
    to: string;
    sortby: 'publishedAt' | 'relevance';
  };
}

```
## Yahoo Finance API

````jsx
interface YahooFinanceConfig {
  baseUrl: 'https://query1.finance.yahoo.com/v8/finance';
  apiKey: null; // No API key required
  endpoints: {
    chart: '/chart';
    quote: '/quote';
    options: '/options';
  };
  parameters: {
    interval: '1m' | '2m' | '5m' | '15m' | '30m' | '60m' | '90m' | '1h' | '1d' | '5d' | '1wk' | '1mo' | '3mo';
    range: '1d' | '5d' | '1mo' | '3mo' | '6mo' | '1y' | '2y' | '5y' | '10y' | 'ytd' | 'max';
    region: 'US' | 'AU' | 'CA' | 'FR' | 'DE' | 'HK' | 'IN' | 'IT' | 'ES' | 'GB' | 'SG';
    lang: 'en-US';
    includePrePost: boolean;
    events: 'div' | 'split' | 'div,split';
    corsDomain: 'finance.yahoo.com';
  };
}
````

## Issues Faced:

- **CORS Issues**: Most financial APIs don't allow direct browser access due to security policies
- **API Key Issues**: Free APIs often have strict limits or require backend implementation
- **Rate Limiting**: Too many requests can get blocked

## Testing

## Future Development Roadmap

1. **Deep Learning Integration:** Incorporate LSTM-AE and RNN architectures for more accurate anomaly detection in sequential financial data.
2. **Explainable AI:** Enhance feature attribution in machine learning predictions; provide clear reasoning behind flagged manipulation events to comply with regulatory auditing.
3. Use Reddit for sentiment analysis.
4. **Next-Level Alerts:** Develop advanced event-based alerting logic - send real-time mails on alerts.
5. **Premium Data Sources.**




