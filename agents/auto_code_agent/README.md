## API Key Setup

This agent requires an OpenAI API key to generate code.

1. Get your API key from [OpenAI platform](https://platform.openai.com/account/api-keys).
2. Create a `.env` file inside the `agents/auto_code_agent/` folder with the following content:


3. Keep your API key private and **do NOT commit `.env` to version control**.

## Running the agent

Run the agent with:

```bash
python agents/auto_code_agent/main.py
