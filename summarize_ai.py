import sys
import json
import os
import urllib.request
import urllib.parse
from http.client import HTTPSConnection

# This script splits the content and makes API requests for Claude locally if Polo API is available,
# but it's easier to just use the agent's capability directly.

def main():
    with open('to_summarize.txt', 'r', encoding='utf-8') as f:
        print(f.read())

if __name__ == "__main__":
    main()
