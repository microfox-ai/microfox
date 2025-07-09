Rate Limits
Monitor the following response headers to ensure that you're not exceeding the limits:

X-Ratelimit-Used: Approximate number of requests used in this period
X-Ratelimit-Remaining: Approximate number of requests left to use
X-Ratelimit-Reset: Approximate number of seconds to end of period
We enforce rate limits for those eligible for free access usage of our Data API. The limit is:

100 queries per minute (QPM) per OAuth client id
QPM limits will be an average over a time window (currently 10 minutes) to support bursting requests.

Free access usage also includes the following rate limits for chat messages:

2,000 messages per day per recipient
3,000 messages per day total
Bot API users can join up to 300 chat rooms per day.

Traffic not using OAuth or login credentials will be blocked, and the default rate limit will not apply.

Important note: Historically, our rate limit response headers indicated counts by client id/user id combination. These headers will update to reflect this new policy based on client id only.
