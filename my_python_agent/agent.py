#This Agent accepts prompts from user,
#generates code with OpenAI(running out of free trail - no real input)
#saves the generated code automatically into a new file anmed generated_code.py
#and also deploys it using os.system()
#This iterates itself and goes through a loop towards improvement

import os
from openai import OpenAI
from dotenv import load_dotenv
load_dotenv()

#Initialized the OpenAI client with my API key
client = OpenAI(api_key = os.getenv("OPENAI_API_KEY"))

def get_code_from_gpt(user_input):
  #Ensures all responses will be generated only in code format
  chat = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
       {"role": "system", "content": "You are a coding assistant. Just give the code."},
       {"role": "user", "content": user_input}
    ],
    temperature = 0.1,
    max_tokens = 300
  )
  return chat.choices[0].message.content

def deploy_code(generated_code):
  #Writes the generated code based on prompt into a file for easy re-use
  with open("generated_code.py", "w") as f:
    f.write(generated_code)
  print("Code Written to 'generated_code.py'.")
  print("Running the code...\n")

  #Attempt to run the file - this starts the basic deployment
  os.system("python3 generated_code.py")

#Main loop for Iteration
def main():
  while True:
    user_prompt = input("What do you want to build today?\n")
    result = get_code_from_gpt(user_prompt)

    print("Generated Code:\n")
    print(result)

    deploy_code(result)

    #prompt from agent to continue or to exit
    again = input("Want to continue improving or building something else?(y/n): ").lower()
    if again != 'y':
      print("Noted, lets proceed ")
      break

if __name__ == "__main__":
  main()



  

  
