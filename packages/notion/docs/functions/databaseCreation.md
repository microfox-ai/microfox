# Creating Databases in Notion

This guide explains how to create databases in Notion using the Microfox Notion provider.

## Important Limitations

1. **Parent Page Requirement**: The parent of a new database must be a Notion page or a wiki database
2. **Integration Capabilities**: Your integration must have insert content capabilities
3. **Status Properties**: Creating new status database properties is currently not supported
4. **Property Schema**: All properties must be defined in the schema when creating the database

## Basic Database Creation

To create a database in Notion, you need to specify:

1. The parent page ID
2. Database title
3. Properties schema (which defines the structure of the database)

### Basic Example

```typescript
import { NotionClient } from '@microfox/notion';

const notion = new NotionClient({
  auth: process.env.NOTION_TOKEN,
});

const response = await notion.databases.create({
  parent: {
    type: 'page_id',
    page_id: process.env.NOTION_PARENT_PAGE_ID,
  },
  title: [
    {
      type: 'text',
      text: {
        content: 'My Database',
      },
    },
  ],
  properties: {
    // Title property (required for all databases)
    Name: {
      title: {},
    },
    // Additional properties
    Description: {
      rich_text: {},
    },
    Priority: {
      number: {},
    },
  },
});
```

### Database with Icon and Cover

```typescript
const response = await notion.databases.create({
  parent: {
    type: 'page_id',
    page_id: process.env.NOTION_PARENT_PAGE_ID,
  },
  icon: {
    type: 'emoji',
    emoji: '📝',
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://website.domain/images/image.png',
    },
  },
  title: [
    {
      type: 'text',
      text: {
        content: 'Project Tasks',
      },
    },
  ],
  properties: {
    Name: {
      title: {},
    },
    Status: {
      select: {
        options: [
          {
            name: 'Not Started',
            color: 'gray',
          },
          {
            name: 'In Progress',
            color: 'yellow',
          },
          {
            name: 'Completed',
            color: 'green',
          },
        ],
      },
    },
    Priority: {
      select: {
        options: [
          {
            name: 'Low',
            color: 'blue',
          },
          {
            name: 'Medium',
            color: 'orange',
          },
          {
            name: 'High',
            color: 'red',
          },
        ],
      },
    },
  },
});
```

## Database Property Schema

Each database property schema object has at least one key which is the property type. This type controls the behavior of the property. The following property types are supported:

### Title Property (Required)

Every database must have exactly one title property. This controls the title that appears at the top of the page when opened.

```typescript
{
  "Name": {
    title: {}
  }
}
```

**Configuration**: No additional configuration required.

### Text Properties

Rich text properties allow for formatted text content.

```typescript
{
  "Description": {
    rich_text: {}
  },
  "Notes": {
    rich_text: {}
  }
}
```

**Configuration**: No additional configuration required.

### Number Properties

Number properties can be formatted in various ways for display.

```typescript
{
  "Priority": {
    number: {
      format: "number" // Optional formatting
    }
  },
  "Score": {
    number: {
      format: "percent"
    }
  },
  "Budget": {
    number: {
      format: "dollar"
    }
  }
}
```

**Available Formats**:

- `"number"` - Standard number format
- `"number_with_commas"` - Numbers with comma separators
- `"percent"` - Percentage format
- `"dollar"` - US Dollar format
- `"canadian_dollar"` - Canadian Dollar format
- `"euro"` - Euro format
- `"pound"` - British Pound format
- `"yen"` - Japanese Yen format
- `"ruble"` - Russian Ruble format
- `"rupee"` - Indian Rupee format
- `"won"` - Korean Won format
- `"yuan"` - Chinese Yuan format
- `"real"` - Brazilian Real format
- `"lira"` - Turkish Lira format
- `"rupiah"` - Indonesian Rupiah format
- `"franc"` - Swiss Franc format
- `"hong_kong_dollar"` - Hong Kong Dollar format
- `"new_zealand_dollar"` - New Zealand Dollar format
- `"krona"` - Swedish Krona format
- `"norwegian_krone"` - Norwegian Krone format
- `"mexican_peso"` - Mexican Peso format
- `"rand"` - South African Rand format
- `"new_taiwan_dollar"` - New Taiwan Dollar format
- `"danish_krone"` - Danish Krone format
- `"zloty"` - Polish Zloty format
- `"baht"` - Thai Baht format
- `"forint"` - Hungarian Forint format
- `"koruna"` - Czech Koruna format
- `"shekel"` - Israeli Shekel format
- `"chilean_peso"` - Chilean Peso format
- `"philippine_peso"` - Philippine Peso format
- `"dirham"` - UAE Dirham format
- `"colombian_peso"` - Colombian Peso format
- `"riyal"` - Saudi Riyal format
- `"ringgit"` - Malaysian Ringgit format
- `"leu"` - Romanian Leu format
- `"argentine_peso"` - Argentine Peso format
- `"uruguayan_peso"` - Uruguayan Peso format
- `"singapore_dollar"` - Singapore Dollar format

### Select Properties

Single-select properties allow choosing one option from a predefined list.

```typescript
{
  "Category": {
    select: {
      options: [
        {
          name: "Work",
          color: "blue"
        },
        {
          name: "Personal",
          color: "green"
        },
        {
          name: "Urgent",
          color: "red"
        }
      ]
    }
  }
}
```

**Configuration**:

- `options` (optional): Array of select option objects

**Select Option Properties**:

- `name` (string): Name of the option as it appears in Notion
- `color` (optional string): Color of the option. Possible values: `"default"`, `"gray"`, `"brown"`, `"orange"`, `"yellow"`, `"green"`, `"blue"`, `"purple"`, `"pink"`, `"red"`

### Multi-Select Properties

Multi-select properties allow choosing multiple options from a predefined list.

```typescript
{
  "Tags": {
    multi_select: {
      options: [
        {
          name: "Frontend",
          color: "blue"
        },
        {
          name: "Backend",
          color: "green"
        },
        {
          name: "Design",
          color: "purple"
        }
      ]
    }
  }
}
```

**Configuration**:

- `options` (optional): Array of multi-select option objects

**Multi-Select Option Properties**:

- `name` (string): Name of the option as it appears in Notion
- `color` (optional string): Color of the option. Same color options as select properties.

### Date Properties

Date properties store date and time information.

```typescript
{
  "Due Date": {
    date: {}
  },
  "Created": {
    date: {}
  }
}
```

**Configuration**: No additional configuration required.

### People Properties

People properties allow assigning users to database entries.

```typescript
{
  "Assignee": {
    people: {}
  },
  "Reviewer": {
    people: {}
  }
}
```

**Configuration**: No additional configuration required.

### Files & Media Properties

File properties allow uploading and storing files.

```typescript
{
  "Attachments": {
    files: {}
  },
  "Images": {
    files: {}
  }
}
```

**Configuration**: No additional configuration required.

### Checkbox Properties

Checkbox properties store boolean true/false values.

```typescript
{
  "Completed": {
    checkbox: {}
  },
  "Reviewed": {
    checkbox: {}
  }
}
```

**Configuration**: No additional configuration required.

### URL Properties

URL properties store web links.

```typescript
{
  "Website": {
    url: {}
  },
  "Documentation": {
    url: {}
  }
}
```

**Configuration**: No additional configuration required.

### Email Properties

Email properties store email addresses.

```typescript
{
  "Contact Email": {
    email: {}
  }
}
```

**Configuration**: No additional configuration required.

### Phone Number Properties

Phone number properties store phone numbers.

```typescript
{
  "Phone": {
    phone_number: {}
  }
}
```

**Configuration**: No additional configuration required.

### Formula Properties

Formula properties calculate values based on other properties.

```typescript
{
  "Days Remaining": {
    formula: {
      expression: "dateBetween(prop(\"Due Date\"), now(), \"days\")"
    }
  },
  "Priority Score": {
    formula: {
      expression: "if(prop(\"Priority\") == \"High\", 3, if(prop(\"Priority\") == \"Medium\", 2, 1))"
    }
  }
}
```

**Configuration**:

- `expression` (string): Formula to evaluate for this property. Uses Notion's formula syntax.

### Relation Properties

Relation properties create connections between databases.

```typescript
{
  "Related Projects": {
    relation: {
      database_id: "668d797c-76fa-4934-9b05-ad288df2d136",
      type: "single_property",
      single_property: {}
    }
  }
}
```

**Configuration**:

- `database_id` (string UUID): The database this relation refers to. Must be shared with the integration.
- `type` (optional string): The type of relation. Can be `"single_property"` or `"dual_property"`.

**Single Property Relation**: No additional configuration required.
**Dual Property Relation**: No additional configuration required.

### Rollup Properties

Rollup properties aggregate data from related databases.

```typescript
{
  "Total Tasks": {
    rollup: {
      relation_property_name: "Project",
      rollup_property_name: "Tasks",
      function: "count"
    }
  }
}
```

**Configuration**:

- `relation_property_name` (optional string): The name of the relation property this property is responsible for rolling up. One of `relation_property_name` or `relation_property_id` must be provided.
- `relation_property_id` (optional string): The ID of the relation property this property is responsible for rolling up. One of `relation_property_name` or `relation_property_id` must be provided.
- `rollup_property_name` (optional string): The name of the property in the related database that is used as an input to function. One of `rollup_property_name` or `rollup_property_id` must be provided.
- `rollup_property_id` (optional string): The ID of the property in the related database that is used as an input to function. One of `rollup_property_name` or `rollup_property_id` must be provided.
- `function` (string): The function that is evaluated for every page in the relation of the rollup.

**Available Functions**:

- `"count_all"` - Count all entries
- `"count_values"` - Count non-empty values
- `"count_unique_values"` - Count unique values
- `"count_empty"` - Count empty values
- `"count_not_empty"` - Count non-empty values
- `"percent_empty"` - Percentage of empty values
- `"percent_not_empty"` - Percentage of non-empty values
- `"sum"` - Sum of numeric values
- `"average"` - Average of numeric values
- `"median"` - Median of numeric values
- `"min"` - Minimum value
- `"max"` - Maximum value
- `"range"` - Range of values
- `"show_original"` - Show original values

### Created Time Properties

Created time properties automatically track when entries are created.

```typescript
{
  "Created": {
    created_time: {}
  }
}
```

**Configuration**: No additional configuration required.

### Created By Properties

Created by properties automatically track who created entries.

```typescript
{
  "Created By": {
    created_by: {}
  }
}
```

**Configuration**: No additional configuration required.

### Last Edited Time Properties

Last edited time properties automatically track when entries were last modified.

```typescript
{
  "Last Modified": {
    last_edited_time: {}
  }
}
```

**Configuration**: No additional configuration required.

### Last Edited By Properties

Last edited by properties automatically track who last modified entries.

```typescript
{
  "Last Modified By": {
    last_edited_by: {}
  }
}
```

**Configuration**: No additional configuration required.

## Complete Database Example

Here's a comprehensive example of a project management database:

```typescript
const projectDatabase = await notion.databases.create({
  parent: {
    type: 'page_id',
    page_id: process.env.NOTION_PARENT_PAGE_ID,
  },
  icon: {
    type: 'emoji',
    emoji: '🚀',
  },
  cover: {
    type: 'external',
    external: {
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop',
    },
  },
  title: [
    {
      type: 'text',
      text: {
        content: 'Project Management',
      },
    },
  ],
  properties: {
    // Required title property
    Name: {
      title: {},
    },

    // Basic information
    Description: {
      rich_text: {},
    },

    // Status tracking
    Status: {
      select: {
        options: [
          { name: 'Planning', color: 'gray' },
          { name: 'In Progress', color: 'yellow' },
          { name: 'Review', color: 'orange' },
          { name: 'Completed', color: 'green' },
          { name: 'On Hold', color: 'red' },
        ],
      },
    },

    // Priority levels
    Priority: {
      select: {
        options: [
          { name: 'Low', color: 'blue' },
          { name: 'Medium', color: 'orange' },
          { name: 'High', color: 'red' },
        ],
      },
    },

    // Categories
    Category: {
      multi_select: {
        options: [
          { name: 'Frontend', color: 'blue' },
          { name: 'Backend', color: 'green' },
          { name: 'Design', color: 'purple' },
          { name: 'Testing', color: 'yellow' },
          { name: 'Documentation', color: 'gray' },
        ],
      },
    },

    // Dates
    'Start Date': {
      date: {},
    },
    'Due Date': {
      date: {},
    },

    // People
    'Project Lead': {
      people: {},
    },
    'Team Members': {
      people: {},
    },

    // Numbers
    Budget: {
      number: {
        format: 'dollar',
      },
    },
    Progress: {
      number: {
        format: 'percent',
      },
    },

    // Checkboxes
    Approved: {
      checkbox: {},
    },
    'Client Review': {
      checkbox: {},
    },

    // URLs
    Repository: {
      url: {},
    },
    Documentation: {
      url: {},
    },

    // Contact
    'Client Email': {
      email: {},
    },
    'Client Phone': {
      phone_number: {},
    },

    // Files
    Attachments: {
      files: {},
    },

    // Formula for days remaining
    'Days Remaining': {
      formula: {
        expression: 'dateBetween(prop("Due Date"), now(), "days")',
      },
    },

    // Formula for status color
    'Status Color': {
      formula: {
        expression:
          'if(prop("Status") == "Completed", "green", if(prop("Status") == "In Progress", "yellow", "red"))',
      },
    },
  },
});
```

## Error Handling

When creating databases, handle potential errors:

```typescript
try {
  const response = await notion.databases.create({
    // ... database configuration
  });
  console.log('Database created:', response.id);
} catch (error) {
  if (error.code === 'validation_error') {
    console.error('Invalid database configuration:', error.message);
    // Check property schema format
    // Verify parent page exists and is accessible
  } else if (error.code === 'unauthorized') {
    console.error('Check your Notion token and permissions');
  } else if (error.code === 'forbidden') {
    console.error('Integration lacks insert content capabilities');
  } else if (error.code === 'not_found') {
    console.error('Parent page not found or not accessible');
  } else {
    console.error('Error creating database:', error);
  }
}
```

## Best Practices

1. **Property Schema Design**:

   - Always include a title property (required)
   - Plan your property types carefully as they cannot be easily changed later
   - Use appropriate property types for your data
   - Consider using formulas for calculated fields

2. **Parent Page Selection**:

   - Ensure the parent page exists and is accessible
   - Verify your integration has access to the parent page
   - Consider the organizational structure of your workspace

3. **Property Options**:

   - Use meaningful names for select and multi-select options
   - Choose appropriate colors for visual organization
   - Keep option lists manageable (too many options can be overwhelming)

4. **Error Handling**:

   - Implement proper error handling for all potential issues
   - Check for required permissions and capabilities
   - Validate property schema before creation

5. **Security**:
   - Use environment variables for sensitive information
   - Verify integration permissions
   - Implement proper access controls

## Common Issues and Solutions

1. **Parent Page Not Found**:

   - Verify the page ID is correct
   - Check that the page exists and is accessible
   - Ensure your integration has access to the page

2. **Missing Insert Content Capabilities**:

   - Check your integration's capabilities
   - Update integration settings if needed
   - Verify integration permissions

3. **Invalid Property Schema**:

   - Ensure all properties have valid types
   - Check property name formatting
   - Verify required properties are included

4. **Status Property Creation**:

   - Status properties cannot be created via API
   - Use select properties as alternatives
   - Create status properties manually in Notion UI

5. **Property Type Limitations**:
   - Some property types have specific requirements
   - Check Notion API documentation for current limitations
   - Use appropriate alternatives when needed

## Integration Capabilities

Your Notion integration must have the following capabilities to create databases:

- **Insert content**: Required for creating databases
- **Read content**: Required for accessing parent pages
- **Update content**: May be needed for subsequent modifications

To check your integration's capabilities, visit the [Notion Integrations page](https://www.notion.so/my-integrations) and review your integration's settings.
