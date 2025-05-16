```python
import concurrent.futures
import os
import time
from typing import Callable, List, Optional


def process_item(item: str) -> Optional[str]:
    """
    Simulates processing a single item.  Replace with your actual item processing logic.
    Returns the processed item or None if processing fails.
    """
    try:
        # Simulate some processing time
        time.sleep(0.1)
        return f"Processed: {item}"
    except Exception as e:
        print(f"Error processing {item}: {e}")
        return None


def process_items_batch(items: List[str], processing_function: Callable[[str], Optional[str]]) -> List[Optional[str]]:
    """
    Processes a batch of items using the provided processing function.
    """
    results = []
    for item in items:
        results.append(processing_function(item))
    return results


def process_items_parallel(items: List[str], processing_function: Callable[[str], Optional[str]], max_workers: Optional[int] = None) -> List[Optional[str]]:
    """
    Processes items in parallel using a thread pool executor.
    """
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers or os.cpu_count()) as executor:
        futures = [executor.submit(processing_function, item) for item in items]
        results = [future.result() for future in concurrent.futures.as_completed(futures)]
    return results


def chunk_list(input_list: List[str], chunk_size: int) -> List[List[str]]:
    """
    Chunks a list into smaller sublists of a specified size.
    """
    return [input_list[i:i + chunk_size] for i in range(0, len(input_list), chunk_size)]


def process_items_batched_parallel(items: List[str], processing_function: Callable[[str], Optional[str]], batch_size: int, max_workers: Optional[int] = None) -> List[Optional[str]]:
    """
    Processes items in batches and then processes the batches in parallel.
    """
    chunks = chunk_list(items, batch_size)
    with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers or os.cpu_count()) as executor:
        futures = [executor.submit(process_items_batch, chunk, processing_function) for chunk in chunks]
        # Flatten the list of lists into a single list of results. Maintain order as much as possible.
        results = []
        for future in concurrent.futures.as_completed(futures):
            results.extend(future.result())
    return results


def main(items: List[str], processing_mode: str = "parallel", batch_size: int = 10, max_workers: Optional[int] = None):
    """
    Main function to process items based on the specified mode.
    """

    start_time = time.time()

    if processing_mode == "serial":
        results = process_items_batch(items, process_item)
    elif processing_mode == "parallel":
        results = process_items_parallel(items, process_item, max_workers)
    elif processing_mode == "batched_parallel":
        results = process_items_batched_parallel(items, process_item, batch_size, max_workers)
    else:
        raise ValueError("Invalid processing_mode.  Must be 'serial', 'parallel', or 'batched_parallel'.")

    end_time = time.time()

    print(f"Processed {len(items)} items in {end_time - start_time:.2f} seconds using mode: {processing_mode}")
    # Optional: Print a sample of the results to verify
    # print("Sample results:", results[:5])


if __name__ == "__main__":
    # Example usage:
    item_list = [f"Item {i}" for i in range(100)]  # Simulate a list of items
    main(item_list, processing_mode="batched_parallel", batch_size=20, max_workers=4)  # Example using batched parallel processing
```