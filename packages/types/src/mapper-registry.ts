// import { Redis } from '@upstash/redis';
// import { CrudHash } from '@microfox/db-upstash';
// import { Mapper, OutputUi } from './ui.types';

// // This is a placeholder for the actual UI part definition.
// // You should replace this with the correct type from your project.
// type ToolUIPart = any;

// /**
//  * A type for the dynamically created mapper functions.
//  */
// type MapperFunction = (data: any, part?: ToolUIPart) => any;

// /**
//  * The MapperRegistry class handles the storage and retrieval of mapper functions
//  * using Upstash Redis. It allows for dynamic registration and execution of
//  * data transformation logic.
//  */
// export class MapperRegistry {
//   private crud: CrudHash<Mapper>;
//   private cache: Map<string, MapperFunction>;

//   /**
//    * Initializes a new instance of the MapperRegistry.
//    * @param redis - The Redis client from @upstash/redis.
//    * @param keyPrefix - A prefix for the Redis keys (e.g., 'mappers').
//    */
//   constructor(redis: Redis, keyPrefix: string = 'mappers') {
//     this.crud = new CrudHash<Mapper>(redis, keyPrefix);
//     this.cache = new Map<string, MapperFunction>();
//   }

//   /**
//    * Registers a new mapper function by storing its source code in the database.
//    * @param id - The unique identifier for the mapper.
//    * @param functionStr - The stringified source code of the function.
//    * @returns The stored Mapper object.
//    */
//   async registerMapper(id: string, functionStr: string): Promise<Mapper> {
//     const mapper: Mapper = { id, functionStr };
//     // Invalidate cache on registration
//     this.cache.delete(id);
//     return this.crud.set(mapper);
//   }

//   /**
//    * Retrieves a mapper function from the registry.
//    * It first checks a local cache, and if not found, fetches the function
//    * from the database, compiles it, and caches it.
//    *
//    * @param id - The identifier of the mapper to retrieve.
//    * @returns The executable mapper function, or null if not found.
//    */
//   async getMapper(id: string): Promise<MapperFunction | null> {
//     if (this.cache.has(id)) {
//       return this.cache.get(id) ?? null;
//     }

//     const mapper = await this.crud.get(id);
//     if (!mapper) {
//       return null;
//     }

//     try {
//       // WARNING: Executing code from a string can be dangerous.
//       // Ensure that you trust the source of the mapper functions.
//       // This creates a function from the string stored in the DB.
//       const fn = new Function(
//         'data',
//         'part',
//         `return (${mapper.functionStr})(data, part);`
//       );
//       this.cache.set(id, fn as MapperFunction);
//       return fn as MapperFunction;
//     } catch (error) {
//       console.error(
//         `Failed to compile mapper function with id "${id}":`,
//         error
//       );
//       return null;
//     }
//   }
// }

// // --- Example Usage ---

// async function example() {
//   // 1. Initialize Redis and the MapperRegistry.
//   // Replace with your actual Redis connection details.
//   const redis = new Redis({
//     url: process.env.UPSTASH_REDIS_REST_URL!,
//     token: process.env.UPSTASH_REDIS_REST_TOKEN!,
//   });

//   const mapperRegistry = new MapperRegistry(redis);

//   // 2. (Provider-side) Define and register a mapper function.
//   // The function is converted to a string for storage.
//   const mapBraveWebSearch = (data: any, part?: ToolUIPart) => {
//     // ... (your mapping logic from the prompt)
//     return { transformed: 'data' }; // Simplified for example
//   };

//   await mapperRegistry.registerMapper(
//     'brave-web-search',
//     mapBraveWebSearch.toString()
//   );
//   console.log("Mapper 'brave-web-search' registered.");

//   // 3. (Client-side) Use the mapper from an OutputUi configuration.
//   const uiConfig: OutputUi = {
//     namespace: 'search.web',
//     supports: [{ type: 'main', mapInNameSpace: 'results' }],
//     mapper: 'brave-web-search',
//   };

//   const rawApiData = {
//     web: {
//       results: [
//         /* ... */
//       ],
//     },
//   };

//   // Retrieve the executable function from the registry.
//   const mapperFunc = await mapperRegistry.getMapper(uiConfig.mapper);

//   if (mapperFunc) {
//     // Execute the function to transform the data.
//     const mappedData = mapperFunc(rawApiData);
//     console.log('Successfully mapped data:', mappedData);
//   } else {
//     console.log(`Mapper '${uiConfig.mapper}' not found.`);
//   }
// }

// // To run this example, you would call `example()`.
// // Make sure to have your environment variables for Upstash set up.
