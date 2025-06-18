Listings: Navigating Reddit's Dynamic Content
Many Reddit API endpoints use a pagination system called "Listings" to handle frequently updated content like posts and comments. Instead of traditional page numbers, listings work with slices of data.


Key Parameters:

after / before: These parameters specify the anchor point for your data slice. You should only use one at a time. They take the fullname of a Reddit item (like a post or comment).

after: Fetches items that come after the specified item.

before: Fetches items that come before the specified item.

limit: Sets the maximum number of items to return per request (e.g., limit=25).

count: Tracks the total number of items you have already viewed in the listing. While not always required, it helps Reddit provide accurate before and after links.

show: An optional parameter. If you pass show=all, it will disable user-specific filters, like hiding posts you've already voted on.

How to Paginate:
Make your first request without after or before.
The API response will include an after value.
For the next page, use that after value in your next request's after parameter.
Increment your count by the number of items you just received and include it in the next request.

Fullnames: Reddit's Universal IDs
Every object on Reddit (like a comment, post, or user) has a globally unique identifier called a fullname.
A fullname is created by combining the object's type prefix with its unique base-36 ID. For example, a post with ID 15bfi0 has the fullname t3_15bfi0.
Common Type Prefixes:
Prefix	Object Type
t1_	Comment
t2_	Account/User
t3_	Link/Post
t4_	Message
t5_	Subreddit
t6_	Award

JSON Response Encoding
By default, Reddit's API escapes <, >, and & characters in JSON responses. To receive raw, unescaped JSON, add the raw_json=1 parameter to your request URL.