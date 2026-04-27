import json
import subprocess
import time

def fetch_content(url):
    try:
        # Use OpenClaw's tools to fetch content. Since we are inside Python, we can try to use a simple curl and strip HTML
        cmd = f"curl -sL --max-time 5 '{url}' | head -c 10000"
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout
    except:
        return ""

# Actually, it's better to spawn an agent to do this, or just construct prompts and call LLM API directly here
# Or I can just write a script that sends everything to an LLM for summarization.
# Since we have access to Polo API in the workspace (from MEMORY: sk-vPYI81WXaBK95LE9TGPRWMVlpQ6YOOkKCKopNTtiFWROBxPW)
