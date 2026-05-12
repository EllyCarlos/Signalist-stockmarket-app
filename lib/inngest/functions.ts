import {inngest} from "@/lib/inngest/client";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {sendWelcomeEmail} from "@/lib/nodemailer";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {getNews} from "@/lib/actions/finnhub.actions";

type UserNewsPayload = {
    user: User;
    symbols: string[];
    news: MarketNewsArticle[];
};

type UserNewsSummaryPayload = {
    user: User;
    newsContent: string | null;
};


export const sendSignUpEmail = inngest.createFunction(
    {
        id: 'sign-up-email',
        triggers: [{ event: 'app/user.created' }],
    },
    async ({ event, step }) => {
        const userProfile = `
        - New user: recently joined Signalist
        - Intro focus: general market tracking and investing workflow
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const aiResponse = await step.ai.infer('generate-welcome-intro',{
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                body: {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: prompt}
                            ]
                        }
                    ]
                }

        })

        await step.run('send-welcome-email', async () =>{

            const part = aiResponse.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null)  || 'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves'

            const { data: { email, name }} = event;

            return await sendWelcomeEmail({email, name, intro: introText})
        })

        return {
            success: true,
            message: 'Welcome email sent successfully!'
        }
    }
)

export const sendDailyNewsSummary = inngest.createFunction(
    {
        id: 'daily-news-summary',
        triggers: [ { event: 'app/send.daily.news' }, { cron: '0 12 * * *'} ],
    },
    async ({ step }) => {
            // Step #1: Get all users for news delivery
            const users = await step.run('get-all-users', getAllUsersForNewsEmail)

            // Step #2: Fetch personalized news for each user
            const userNews = await step.run('fetch-user-news', async (): Promise<UserNewsPayload[]> => {
                if (users.length === 0) return [];

                return Promise.all(
                    users.map(async (user) => {
                        const symbols = await getWatchlistSymbolsByEmail(user.email);
                        let news: MarketNewsArticle[] = [];

                        try {
                            news = await getNews(symbols);
                        } catch (e) {
                            console.error(`Error fetching news for userId ${user.id}`, e);
                        }

                        return {
                            user,
                            symbols,
                            news: news.slice(0, 6),
                        };
                    }),
                );
            });

            const userNewsSummaries = await step.run('summarize-user-news', async (): Promise<UserNewsSummaryPayload[]> => {
                return userNews.map(({ user, news }) => ({
                    user,
                    newsContent: news.length > 0 ? `Prepared ${news.length} articles for ${user.email}` : null,
                }));
            });

            await step.run('send-news-emails', async () => {
                return userNewsSummaries.map(({ user, newsContent }) => ({
                    userId: user.id,
                    queued: Boolean(newsContent),
                }));
            });

            return { success: true };
    }

)
