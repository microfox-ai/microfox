import os
import subprocess
from dotenv import load_dotenv
import google.generativeai as genai

# Explicitly load the .env file from the script's directory
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '.env'))




def get_prompt() -> str:
    
    return input("what can i help you with")


def genrate_code(prompt):
    systm_msg = "You need to write clean Python code according to prompt, no explanations"
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-2.0-flash")
    response = model.generate_content([systm_msg, prompt])
    return response.text

def save_code(code):
    with open("generated_script.py", "w") as f:
        f.write(code)

def run_code() :
    result = subprocess.run(["python","generated_script.py"],capture_output=True,text=True)
    print("Output:")
    print(result.stdout if result.stdout else result.stderr)


def main():
    prompt = get_prompt()
    while True:
        code = genrate_code(prompt)
        print("\n Generated Code:\n")
        print(code)
        save_code(code)
        run_code()
        again = input("\n🔁 Do you want to improve or add to this? (yes/no): ").strip().lower()
        if again != "yes":
            break
        prompt = input("Describe the improvement or addition: ")

if __name__ == "__main__":
    main()