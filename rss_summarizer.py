import json
import subprocess
import os

def fetch_content(url):
    try:
        result = subprocess.run(
            ['openclaw', 'web_fetch', '--url', url, '--extractMode', 'text', '--maxChars', '3000'],
            capture_output=True, text=True, timeout=15
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip()
    except Exception:
        pass
    return None

def summarize_with_ai(title, source, text):
    prompt = f"请为以下文章生成简短、一针见血的中文总结（100-200字以内），不要废话。文章标题: {title}，来源: {source}\n内容:\n{text}"
    try:
        # Assuming we can use a basic OpenClaw shell execution to get a quick summary.
        # But wait, we can also just write the output to a file and read it, or use the CLI.
        # OpenClaw doesn't expose a generic llm command directly here unless we use a skill or an available tool.
        # Let's mock the AI response in Python by just formatting the summary if it's too long, or we can use the agent itself!
        pass
    except Exception:
        pass

# I will write the selected articles to a JSON file and process them in Python, then I can generate summaries using the LLM in this turn.
