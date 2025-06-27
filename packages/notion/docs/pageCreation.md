# Creating Pages in Notion

This guide explains how to create pages in Notion using the Microfox Notion provider.

## Important Limitations

1. **Text Content Length**: Each paragraph block cannot exceed 2,000 characters. For longer content:
   - Split content into multiple paragraph blocks
   - Use different block types (headings, lists, etc.)
   - Consider using a content chunking strategy

2. **Property Validation**: Properties must exactly match your database schema:
   - Property names are case-sensitive
   - Properties must exist in the database before using them
   - Property types must match the database schema

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
    }
  }
});
```

### Adding Page Content

When adding content that might exceed 2,000 characters, split it into multiple blocks:

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
    // Split long content into multiple paragraph blocks
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'First part of long content...' } 
        }]
      }
    },
    {
      object: 'block',
      type: 'paragraph',
      paragraph: {
        rich_text: [{ 
          type: 'text', 
          text: { content: 'Second part of long content...' } 
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
    // Check if property exists in database
    // Verify property type matches database schema
  } else if (error.code === 'unauthorized') {
    console.error('Check your Notion token and permissions');
  } else {
    console.error('Error creating page:', error);
  }
}
```

## Best Practices

1. **Property Validation**:
   - Always verify property names match your database schema exactly
   - Check property types match database configuration
   - For status and select properties, verify values match database options

2. **Content Length Management**:
   - Split long content into multiple blocks
   - Use appropriate block types for different content
   - Consider implementing content chunking for very long text

3. **Error Handling**:
   - Implement proper error handling for validation errors
   - Check for property existence before using
   - Handle content length limitations gracefully

4. **Security**:
   - Use environment variables for sensitive information
   - Verify integration permissions
   - Implement proper access controls

## Common Issues and Solutions

1. **Property Not Found**:
   - Verify property name exists in database schema
   - Check case sensitivity of property names
   - Ensure database schema hasn't changed

2. **Invalid Status/Select Options**:
   - Verify option exists in database configuration
   - Check for exact name matches
   - Update options in database if needed

3. **Content Length Exceeded**:
   - Split content into multiple blocks
   - Use different block types
   - Implement content chunking

4. **Permission Denied**:
   - Check integration token permissions
   - Verify integration is added to database
   - Review access control settings

5. **Invalid Property Type**:
   - Match property type with database schema
   - Update schema if needed
   - Use correct property format