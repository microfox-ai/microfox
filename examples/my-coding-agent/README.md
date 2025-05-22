🤖 GPT-4 Coding Agent – Microfox Challenge Submission
This is a GPT-4-powered coding agent built for the Microfox challenge. It accepts user prompts, generates working code in response, deploys it to a file with the correct extension, and allows iterative improvements. It saves the session history and is built with extensibility in mind.

🚀 Features

✅ Natural language task input (e.g., "Write a C++ program to check for palindromes")
✅ GPT-4 powered code generation via OpenAI API
✅ Auto-detects language or defaults to Python
✅ Correct file extension handling (.py, .js, .cpp, etc.)
✅ Interactive loop to iteratively improve code
✅ Saves code files to disk
✅ Persists task history


🛠 Tech Stack

Node.js + TypeScript
OpenAI GPT-4 API
dotenv for environment configuration
CLI interaction using readline
File system interaction using fs and path


📦 Getting Started
1. Fork & Clone the Repo

⚠️ You must fork the official Microfox repo to be considered for the challenge!

bashgit clone https://github.com/YOUR_USERNAME/microfox
cd microfox/my-coding-agent
2. Install Dependencies
bashnpm install
3. Add Your OpenAI API Key
Create a .env file in the root directory:
bashOPENAI_API_KEY=your_openai_api_key_here
4. Build & Run
bashnpm run build
npm start

🎯 Usage

Enter a coding task when prompted:
"Create a function to sort an array in JavaScript"
"Write a Python web scraper"
"Build a C++ calculator program"

The agent will:

Generate code using GPT-4
Save it with the correct file extension
Ask if you want to improve it further


Files are saved in the generated/ directory with proper extensions