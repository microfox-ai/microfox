import subprocess

def ask_ollama(prompt):
    result = subprocess.run(
        ["ollama", "run", "llama3", prompt],
        capture_output=True,
        text=True
    )
    return result.stdout

if __name__ == "__main__":
    question = input("Enter your task for the agent: ")
    answer = ask_ollama(question)
    print("\nAgent Response:\n", answer)
