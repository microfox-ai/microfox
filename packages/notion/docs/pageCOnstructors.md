```
// Create a table with the scraped data
  const tableRows = data.map((item) => ({
    object: 'block',
    type: 'table_row',
    table_row: {
      cells: [
        [{ type: 'text', text: { content: item.title || '' } }],
        [{ type: 'text', text: { content: item.category || '' } }],
        [
          {
            type: 'text',
            text: {
              content: item.url || '',
              link: item.url ? { url: item.url } : null,
            },
          },
        ],
        [{ type: 'text', text: { content: item.matchScore?.toString() || '' } }],
        [{ type: 'text', text: { content: item.scrapedAt || '' } }],
      ],
    },
  }))
```
