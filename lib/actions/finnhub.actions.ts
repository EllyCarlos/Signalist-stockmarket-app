'use server';

import { formatArticle, getDateRange, validateArticle } from "@/lib/utils";

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const MAX_NEWS_ARTICLES = 6;

type FetchOptions = {
    cache: RequestCache;
    next?: {
        revalidate: number;
    };
};

export const fetchJSON = async <T>(url: string, revalidateSeconds?: number): Promise<T> => {
    const options: FetchOptions = revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' };

    const response = await fetch(url, options);

    if (!response.ok) {
        throw new Error(`Finnhub request failed with status ${response.status}`);
    }

    return response.json() as Promise<T>;
};

const getFinnhubApiKey = () => {
    if (!NEXT_PUBLIC_FINNHUB_API_KEY) {
        throw new Error("NEXT_PUBLIC_FINNHUB_API_KEY is required");
    }

    return NEXT_PUBLIC_FINNHUB_API_KEY;
};

const cleanSymbols = (symbols: string[]) =>
    [...new Set(
        symbols
            .map((symbol) => symbol.trim().toUpperCase())
            .filter(Boolean),
    )];

const buildUrl = (path: string, params: Record<string, string>) => {
    const url = new URL(`${FINNHUB_BASE_URL}${path}`);
    url.searchParams.set('token', getFinnhubApiKey());

    for (const [key, value] of Object.entries(params)) {
        url.searchParams.set(key, value);
    }

    return url.toString();
};

const dedupeArticles = (articles: MarketNewsArticle[]) => {
    const seen = new Set<string>();

    return articles.filter((article) => {
        const keys = [
            `id:${article.id}`,
            `url:${article.url.toLowerCase()}`,
            `headline:${article.headline.toLowerCase()}`,
        ];

        if (keys.some((key) => seen.has(key))) return false;
        keys.forEach((key) => seen.add(key));
        return true;
    });
};

const getValidCompanyArticle = (
    symbol: string,
    articlesBySymbol: Map<string, RawNewsArticle[]>,
    usedArticleKeys: Set<string>,
) => {
    const articles = articlesBySymbol.get(symbol) || [];

    return articles.find((article) => {
        if (!validateArticle(article)) return false;

        const key = String(article.id || article.url || article.headline).toLowerCase();
        return !usedArticleKeys.has(key);
    });
};

export const getNews = async (symbols?: string[]): Promise<MarketNewsArticle[]> => {
    try {
        const { from, to } = getDateRange(5);
        const cleanedSymbols = symbols ? cleanSymbols(symbols) : [];

        if (cleanedSymbols.length > 0) {
            const articles: MarketNewsArticle[] = [];
            const articlesBySymbol = new Map<string, RawNewsArticle[]>();
            const usedArticleKeys = new Set<string>();

            await Promise.all(
                cleanedSymbols.map(async (symbol) => {
                    const url = buildUrl('/company-news', { symbol, from, to });
                    const companyNews = await fetchJSON<RawNewsArticle[]>(url, 300);
                    articlesBySymbol.set(symbol, companyNews);
                }),
            );

            for (let round = 0; round < MAX_NEWS_ARTICLES; round += 1) {
                const symbol = cleanedSymbols[round % cleanedSymbols.length];
                const validArticle = getValidCompanyArticle(symbol, articlesBySymbol, usedArticleKeys);

                if (validArticle) {
                    const key = String(validArticle.id || validArticle.url || validArticle.headline).toLowerCase();
                    usedArticleKeys.add(key);
                    articles.push(formatArticle(validArticle, true, symbol, round));
                }
            }

            const sortedArticles = dedupeArticles(articles)
                .sort((a, b) => b.datetime - a.datetime)
                .slice(0, MAX_NEWS_ARTICLES);

            if (sortedArticles.length > 0) return sortedArticles;
        }

        const generalNewsUrl = buildUrl('/news', { category: 'general' });
        const generalNews = await fetchJSON<RawNewsArticle[]>(generalNewsUrl, 300);

        return dedupeArticles(
            generalNews
                .filter(validateArticle)
                .map((article, index) => formatArticle(article, false, undefined, index)),
        )
            .sort((a, b) => b.datetime - a.datetime)
            .slice(0, MAX_NEWS_ARTICLES);
    } catch (e) {
        console.error('Error fetching Finnhub news', e);
        throw new Error('Failed to fetch news');
    }
};
