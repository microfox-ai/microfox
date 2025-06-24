# Creating Pages in Notion

This guide explains how to create pages in Notion using the Microfox Notion provider.

## Basic Page Creation

To create a page in a Notion database, you need to specify:
1. The parent database ID
2. Page properties (which must match the database schema)
3. Page content (optional)

### Basic Example

```typescript
import { NotionClient } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN
});

const response = await notion.pages.create({
  parent: { 
    database_id: process.env.NOTION_DATABASE_ID 
  },
  properties: {
    // Title property (must match your database schema name)
    Name: {
      type: "title",
      title: [{ 
        type: "text", 
        text: { content: "My Page Title" } 
      }]
    },
    // Status property (if your database has a status column)
    Status: {
      type: "status",
      status: {
        name: "In Progress" // Must match one of your database's status options
      }
    }
  }
});
```

### Adding Page Content

You can add content to your page using blocks:

```typescript
const response = await notion.pages.create({
  parent: { 
    database_id: process.env.NOTION_DATABASE_ID 
  },
  properties: {
    Name: {
      type: "title",
      title: [{ type: "text", text: { content: "My Page Title" } }]
    }
  },
  children: [
    {
      object: 'block',
      type: 'heading_1',
      heading_1: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Main Heading' } 
        }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Some paragraph text' } 
        }]
      }
    },
    {
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'A bullet point' } 
        }]
      }
    }
  ]
});
```

## Common Property Types

Here are examples of common property types you might need:

### Text Properties

```typescript
{
  "Description": {
    type: "rich_text",
    rich_text: [{ 
      type: "text", 
      text: { content: "Some description" } 
    }]
  }
}
```

### Number Properties

```typescript
{
  "Priority": {
    type: "number",
    number: 1
  }
}
```

### Select Properties

```typescript
{
  "Category": {
    type: "select",
    select: {
      name: "Option A" // Must match one of your database's select options
    }
  }
}
```

### Multi-Select Properties

```typescript
{
  "Tags": {
    type: "multi_select",
    multi_select: [
      { name: "Tag 1" },
      { name: "Tag 2" }
    ]
  }
}
```

### Date Properties

```typescript
{
  "Deadline": {
    type: "date",
    date: {
      start: "2024-03-20",
      end: null // Optional end date for ranges
    }
  }
}
```

### Status Properties

```typescript
{
  "Status": {
    type: "status",
    status: {
      name: "In Progress" // Must match one of your database's status options
    }
  }
}
```

## Error Handling

When creating pages, handle potential errors:

```typescript
try {
  const response = await notion.pages.create({
    // ... page configuration
  });
  console.log('Page created:', response.id);
} catch (error) {
  if (error.code === 'validation_error') {
    console.error('Invalid property values:', error.message);
  } else if (error.code === 'unauthorized') {
    console.error('Check your Notion token and permissions');
  } else {
    console.error('Error creating page:', error);
  }
}
```

## Best Practices

1. Always validate that property names match your database schema
2. Use proper property types as defined in your database
3. For status and select properties, ensure the values match the options in your database
4. Include error handling for validation and permission issues
5. Use environment variables for sensitive information like tokens and database IDs

## Common Issues

1. **Property Not Found**: Ensure property names exactly match your database schema
2. **Invalid Status**: Status name must match one of the options in your database
3. **Permission Denied**: Check that your integration has been added to the database
4. **Invalid Property Type**: Verify that the property type matches your database schema