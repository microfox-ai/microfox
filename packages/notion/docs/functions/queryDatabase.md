# Querying Databases in Notion

This guide explains how to query databases in Notion using the Microfox Notion provider.

## Important Limitations

1. **Database Access**: The database must be shared with your integration before querying
2. **Integration Capabilities**: Your integration must have read content capabilities
3. **Page Size Limit**: Maximum of 100 items per page
4. **Formula/Rollup Limitations**:
   - Relations with more than 25 references may not evaluate correctly in formulas
   - Multi-layer relations may not return correct results in rollups
5. **Property Filtering**: Use `filter_properties` to limit returned properties for better performance

## Basic Database Query

To query a database, you need the database ID and can optionally specify filters, sorts, and pagination.

### Basic Example

```typescript
import { NotionClient } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
});

console.log('Results:', response.results);
console.log('Has more:', response.has_more);
console.log('Next cursor:', response.next_cursor);
```

### Query with Pagination

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  page_size: 50, // Default is 100, max is 100
  start_cursor: 'optional_cursor_from_previous_response',
});

// For subsequent pages
if (response.has_more) {
  const nextPage = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    start_cursor: response.next_cursor,
  });
}
```

## Filtering Database Entries

Filters allow you to limit which pages are returned based on property values. Filters can be combined using logical operators.

### Single Filter

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    property: 'Status',
    select: {
      equals: 'In Progress',
    },
  },
});
```

### Multiple Filters with AND Logic

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    and: [
      {
        property: 'Completed',
        checkbox: {
          equals: false,
        },
      },
      {
        property: 'Priority',
        select: {
          equals: 'High',
        },
      },
    ],
  },
});
```

### Multiple Filters with OR Logic

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    or: [
      {
        property: 'Category',
        multi_select: {
          contains: 'Frontend',
        },
      },
      {
        property: 'Category',
        multi_select: {
          contains: 'Backend',
        },
      },
    ],
  },
});
```

### Complex Filter Combinations

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    and: [
      {
        property: 'Completed',
        checkbox: {
          equals: false,
        },
      },
      {
        or: [
          {
            property: 'Priority',
            select: {
              equals: 'High',
            },
          },
          {
            property: 'Due Date',
            date: {
              before: '2024-12-31',
            },
          },
        ],
      },
    ],
  },
});
```

## Property-Specific Filters

### Text Properties

```typescript
// Exact match
{
  property: "Name",
  title: {
    equals: "Project Alpha"
  }
}

// Contains text
{
  property: "Description",
  rich_text: {
    contains: "important"
  }
}

// Starts with
{
  property: "Name",
  title: {
    starts_with: "Project"
  }
}

// Ends with
{
  property: "Name",
  title: {
    ends_with: "Beta"
  }
}

// Is empty
{
  property: "Description",
  rich_text: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Description",
  rich_text: {
    is_not_empty: true
  }
}
```

### Number Properties

```typescript
// Equals
{
  property: "Priority",
  number: {
    equals: 1
  }
}

// Greater than
{
  property: "Budget",
  number: {
    greater_than: 1000
  }
}

// Greater than or equal to
{
  property: "Budget",
  number: {
    greater_than_or_equal_to: 1000
  }
}

// Less than
{
  property: "Budget",
  number: {
    less_than: 5000
  }
}

// Less than or equal to
{
  property: "Budget",
  number: {
    less_than_or_equal_to: 5000
  }
}

// Is empty
{
  property: "Budget",
  number: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Budget",
  number: {
    is_not_empty: true
  }
}
```

### Select Properties

```typescript
// Equals
{
  property: "Status",
  select: {
    equals: "In Progress"
  }
}

// Does not equal
{
  property: "Status",
  select: {
    does_not_equal: "Completed"
  }
}

// Is empty
{
  property: "Status",
  select: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Status",
  select: {
    is_not_empty: true
  }
}
```

### Multi-Select Properties

```typescript
// Contains
{
  property: "Tags",
  multi_select: {
    contains: "Frontend"
  }
}

// Does not contain
{
  property: "Tags",
  multi_select: {
    does_not_contain: "Deprecated"
  }
}

// Is empty
{
  property: "Tags",
  multi_select: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Tags",
  multi_select: {
    is_not_empty: true
  }
}
```

### Date Properties

```typescript
// Equals
{
  property: "Due Date",
  date: {
    equals: "2024-03-20"
  }
}

// Before
{
  property: "Due Date",
  date: {
    before: "2024-12-31"
  }
}

// On or before
{
  property: "Due Date",
  date: {
    on_or_before: "2024-12-31"
  }
}

// After
{
  property: "Due Date",
  date: {
    after: "2024-01-01"
  }
}

// On or after
{
  property: "Due Date",
  date: {
    on_or_after: "2024-01-01"
  }
}

// Past week
{
  property: "Due Date",
  date: {
    past_week: {}
  }
}

// Past month
{
  property: "Due Date",
  date: {
    past_month: {}
  }
}

// Past year
{
  property: "Due Date",
  date: {
    past_year: {}
  }
}

// Next week
{
  property: "Due Date",
  date: {
    next_week: {}
  }
}

// Next month
{
  property: "Due Date",
  date: {
    next_month: {}
  }
}

// Next year
{
  property: "Due Date",
  date: {
    next_year: {}
  }
}

// Is empty
{
  property: "Due Date",
  date: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Due Date",
  date: {
    is_not_empty: true
  }
}
```

### Checkbox Properties

```typescript
// Equals true
{
  property: "Completed",
  checkbox: {
    equals: true
  }
}

// Equals false
{
  property: "Completed",
  checkbox: {
    equals: false
  }
}
```

### People Properties

```typescript
// Contains
{
  property: "Assignee",
  people: {
    contains: "user_id_here"
  }
}

// Does not contain
{
  property: "Assignee",
  people: {
    does_not_contain: "user_id_here"
  }
}

// Is empty
{
  property: "Assignee",
  people: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Assignee",
  people: {
    is_not_empty: true
  }
}
```

### URL Properties

```typescript
// Contains
{
  property: "Website",
  url: {
    contains: "github.com"
  }
}

// Does not contain
{
  property: "Website",
  url: {
    does_not_contain: "example.com"
  }
}

// Is empty
{
  property: "Website",
  url: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Website",
  url: {
    is_not_empty: true
  }
}
```

### Email Properties

```typescript
// Contains
{
  property: "Contact Email",
  email: {
    contains: "@company.com"
  }
}

// Does not contain
{
  property: "Contact Email",
  email: {
    does_not_contain: "@personal.com"
  }
}

// Is empty
{
  property: "Contact Email",
  email: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Contact Email",
  email: {
    is_not_empty: true
  }
}
```

### Phone Number Properties

```typescript
// Contains
{
  property: "Phone",
  phone_number: {
    contains: "+1"
  }
}

// Does not contain
{
  property: "Phone",
  phone_number: {
    does_not_contain: "+44"
  }
}

// Is empty
{
  property: "Phone",
  phone_number: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Phone",
  phone_number: {
    is_not_empty: true
  }
}
```

### Files Properties

```typescript
// Is empty
{
  property: "Attachments",
  files: {
    is_empty: true
  }
}

// Is not empty
{
  property: "Attachments",
  files: {
    is_not_empty: true
  }
}
```

## Sorting Database Entries

Sorts allow you to order the results based on property values or page timestamps.

### Single Sort

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  sorts: [
    {
      property: 'Name',
      direction: 'ascending',
    },
  ],
});
```

### Multiple Sorts

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  sorts: [
    {
      property: 'Priority',
      direction: 'descending',
    },
    {
      property: 'Due Date',
      direction: 'ascending',
    },
    {
      property: 'Name',
      direction: 'ascending',
    },
  ],
});
```

### Sort by Page Timestamps

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  sorts: [
    {
      timestamp: 'created_time',
      direction: 'descending',
    },
  ],
});
```

**Available timestamp options**:

- `"created_time"` - Sort by when the page was created
- `"last_edited_time"` - Sort by when the page was last edited

**Available directions**:

- `"ascending"` - A to Z, 1 to 9, oldest to newest
- `"descending"` - Z to A, 9 to 1, newest to oldest

## Property Filtering

Use `filter_properties` to limit which properties are returned in the response, improving performance.

### Filter by Property IDs

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter_properties: ['property_id_1', 'property_id_2'],
});
```

### Get Property IDs

To get property IDs, first retrieve the database:

```typescript
const database = await notion.databases.retrieve({
  database_id: process.env.NOTION_DATABASE_ID,
});

// Property IDs are in the properties object
console.log('Property IDs:', Object.keys(database.properties));
```

## Complete Query Example

Here's a comprehensive example combining filters, sorts, and pagination:

```typescript
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    and: [
      {
        property: 'Completed',
        checkbox: {
          equals: false,
        },
      },
      {
        or: [
          {
            property: 'Priority',
            select: {
              equals: 'High',
            },
          },
          {
            property: 'Due Date',
            date: {
              before: '2024-12-31',
            },
          },
        ],
      },
    ],
  },
  sorts: [
    {
      property: 'Priority',
      direction: 'descending',
    },
    {
      property: 'Due Date',
      direction: 'ascending',
    },
  ],
  page_size: 50,
  filter_properties: ['Name', 'Status', 'Priority', 'Due Date'],
});

console.log('Found', response.results.length, 'items');
console.log('Has more pages:', response.has_more);

// Process results
response.results.forEach(page => {
  console.log('Page ID:', page.id);
  console.log('Title:', page.properties.Name?.title?.[0]?.text?.content);
  console.log('Status:', page.properties.Status?.select?.name);
  console.log('Priority:', page.properties.Priority?.select?.name);
  console.log('Due Date:', page.properties['Due Date']?.date?.start);
});
```

## Error Handling

When querying databases, handle potential errors:

```typescript
try {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    // ... query configuration
  });
  console.log('Query successful:', response.results.length, 'items');
} catch (error) {
  if (error.code === 'not_found') {
    console.error('Database not found or not accessible');
    // Check if database exists and is shared with integration
  } else if (error.code === 'unauthorized') {
    console.error('Check your Notion token and permissions');
  } else if (error.code === 'forbidden') {
    console.error('Integration lacks read content capabilities');
  } else if (error.code === 'validation_error') {
    console.error('Invalid filter or sort configuration:', error.message);
  } else {
    console.error('Error querying database:', error);
  }
}
```

## Best Practices

1. **Pagination**: Always handle pagination for large databases
2. **Property Filtering**: Use `filter_properties` to improve performance
3. **Filter Optimization**: Use specific filters to reduce result set size
4. **Error Handling**: Implement proper error handling for all potential issues
5. **Caching**: Consider caching frequently accessed data
6. **Rate Limiting**: Be mindful of API rate limits

## Common Issues and Solutions

1. **Database Not Found**:

   - Verify the database ID is correct
   - Ensure the database is shared with your integration
   - Check integration permissions

2. **Missing Properties**:

   - Use `filter_properties` to specify which properties to return
   - Check property names match database schema exactly
   - Verify property types in filter conditions

3. **Filter Not Working**:

   - Check property names are case-sensitive
   - Verify filter syntax matches property type
   - Test filters individually before combining

4. **Performance Issues**:

   - Use `filter_properties` to limit returned data
   - Implement pagination for large result sets
   - Use specific filters to reduce data transfer

5. **Sort Issues**:
   - Verify property names exist in database
   - Check sort direction values
   - Ensure sorts are in correct order (earlier sorts take precedence)
