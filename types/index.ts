export interface WatchlistStock {
  symbol: string
  companyName: string
  addedAt: string
}

export interface WatchlistState {
  stocks: WatchlistStock[]
  isLoading: boolean
  error: string | null
}

export interface NewsArticle {
  id: string
  headline: string
  summary: string
  source: string
  url: string
  datetime: number
  image: string | null
  symbols: string[]
  sentiment: "positive" | "negative" | "neutral" | null
}

export interface WatchlistNewsResponse {
  articles: NewsArticle[]
  symbols: string[]
  fetchedAt: string
}
