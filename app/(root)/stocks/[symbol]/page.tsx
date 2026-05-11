import TradingViewWidget from "@/components/TradingViewWidget";
import {
    BASELINE_WIDGET_CONFIG,
    CANDLE_CHART_WIDGET_CONFIG,
    COMPANY_FINANCIALS_WIDGET_CONFIG,
    COMPANY_PROFILE_WIDGET_CONFIG,
    SYMBOL_INFO_WIDGET_CONFIG,
    TECHNICAL_ANALYSIS_WIDGET_CONFIG,
} from "@/lib/constants";

const WatchlistButton = ({
    symbol,
    company,
    isInWatchlist,
}: WatchlistButtonProps) => (
    <button
        type="button"
        className={`watchlist-btn ${isInWatchlist ? "watchlist-remove" : ""}`}
        aria-label={`${isInWatchlist ? "Remove" : "Add"} ${company} (${symbol}) ${isInWatchlist ? "from" : "to"} watchlist`}
    >
        {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
    </button>
);

const SCRIPT_URL = "https://s3.tradingview.com/external-embedding/embed-widget-";

const StockDetails = async ({ params }: StockDetailsPageProps) => {
    const { symbol } = await params;

    return (
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
            <section className="space-y-8">
                <TradingViewWidget
                    scriptUrl={`${SCRIPT_URL}symbol-info.js`}
                    config={SYMBOL_INFO_WIDGET_CONFIG(symbol)}
                    height={170}
                />
                <TradingViewWidget
                    title="Candlestick Chart"
                    scriptUrl={`${SCRIPT_URL}advanced-chart.js`}
                    config={CANDLE_CHART_WIDGET_CONFIG(symbol)}
                    className="custom-chart"
                    height={600}
                />
                <TradingViewWidget
                    title="Baseline Chart"
                    scriptUrl={`${SCRIPT_URL}advanced-chart.js`}
                    config={BASELINE_WIDGET_CONFIG(symbol)}
                    className="custom-chart"
                    height={600}
                />
            </section>

            <section className="space-y-8">
                <WatchlistButton
                    symbol={symbol.toUpperCase()}
                    company={symbol.toUpperCase()}
                    isInWatchlist={false}
                />
                <TradingViewWidget
                    title="Technical Analysis"
                    scriptUrl={`${SCRIPT_URL}technical-analysis.js`}
                    config={TECHNICAL_ANALYSIS_WIDGET_CONFIG(symbol)}
                    height={400}
                />
                <TradingViewWidget
                    title="Company Profile"
                    scriptUrl={`${SCRIPT_URL}symbol-profile.js`}
                    config={COMPANY_PROFILE_WIDGET_CONFIG(symbol)}
                    height={440}
                />
                <TradingViewWidget
                    title="Financials"
                    scriptUrl={`${SCRIPT_URL}financials.js`}
                    config={COMPANY_FINANCIALS_WIDGET_CONFIG(symbol)}
                    height={464}
                />
            </section>
        </div>
    );
};

export default StockDetails;
