import json

data = {
  "🤖 AI 前沿": [
    {
      "title": "The PR you would have opened yourself",
      "link": "https://huggingface.co/blog/transformers-to-mlx",
      "source": "Hugging Face Blog",
      "summary": ""
    },
    {
      "title": "Training and Finetuning Multimodal Embedding & Reranker Models with Sentence Transformers",
      "link": "https://huggingface.co/blog/train-multimodal-sentence-transformers",
      "source": "Hugging Face Blog",
      "summary": ""
    },
    {
      "title": "Inside VAKRA: Reasoning, Tool Use, and Failure Modes of Agents",
      "link": "https://huggingface.co/blog/ibm-research/vakra-benchmark-analysis",
      "source": "Hugging Face Blog",
      "summary": ""
    },
    {
      "title": "Meet HoloTab by HCompany. Your AI browser companion.",
      "link": "https://huggingface.co/blog/Hcompany/holotab",
      "source": "Hugging Face Blog",
      "summary": ""
    },
    {
      "title": "Gemini 3.1 Flash TTS: the next generation of expressive AI speech",
      "link": "https://deepmind.google/blog/gemini-3-1-flash-tts-the-next-generation-of-expressive-ai-speech/",
      "source": "Google DeepMind",
      "summary": "Our newest audio model introduces granular audio tags that give you precise control to direct AI speech for expressive audio generation."
    },
    {
      "title": "Gemini Robotics-ER 1.6: Powering real-world robotics tasks through enhanced embodied reasoning",
      "link": "https://deepmind.google/blog/gemini-robotics-er-1-6/",
      "source": "Google DeepMind",
      "summary": "Gemini Robotics ER 1.6: Enhancing spatial reasoning and multi-view understanding for autonomous robotics."
    },
    {
      "title": "Sparse Goodness: How Selective Measurement Transforms Forward-Forward Learning",
      "link": "https://arxiv.org/abs/2604.13081",
      "source": "arXiv Machine Learning",
      "summary": "arXiv:2604.13081v1 Announce Type: new \nAbstract: The Forward-Forward (FF) algorithm is a biologically plausible alternative to backpropagation that trains neural networks layer by layer using a local goodness function to distinguish positive from negative data. Since its introduction, sum-of-squares (SoS) has served as the default goodness function. In this work, we systematically study the design space of goodness functions, investigating both which activations to measure and how to aggregate t"
    },
    {
      "title": "The Long Delay to Arithmetic Generalization: When Learned Representations Outrun Behavior",
      "link": "https://arxiv.org/abs/2604.13082",
      "source": "arXiv Machine Learning",
      "summary": "arXiv:2604.13082v1 Announce Type: new \nAbstract: Grokking in transformers trained on algorithmic tasks is characterized by a long delay between training-set fit and abrupt generalization, but the source of that delay remains poorly understood. In encoder-decoder arithmetic models, we argue that this delay reflects limited access to already learned structure rather than failure to acquire that structure in the first place. We study one-step Collatz prediction and find that the encoder organizes p"
    }
  ],
  "⭐ GitHub Trends": [
    {
      "title": "forrestchang/andrej-karpathy-skills",
      "link": "https://github.com/forrestchang/andrej-karpathy-skills",
      "source": "GitHub Trends"
    },
    {
      "title": "thedotmack/claude-mem",
      "link": "https://github.com/thedotmack/claude-mem",
      "source": "GitHub Trends"
    },
    {
      "title": "lsdefine/GenericAgent",
      "link": "https://github.com/lsdefine/GenericAgent",
      "source": "GitHub Trends"
    },
    {
      "title": "jamiepine/voicebox",
      "link": "https://github.com/jamiepine/voicebox",
      "source": "GitHub Trends"
    },
    {
      "title": "vercel-labs/open-agents",
      "link": "https://github.com/vercel-labs/open-agents",
      "source": "GitHub Trends"
    },
    {
      "title": "google/magika",
      "link": "https://github.com/google/magika",
      "source": "GitHub Trends"
    },
    {
      "title": "steipete/wacli",
      "link": "https://github.com/steipete/wacli",
      "source": "GitHub Trends"
    },
    {
      "title": "topoteretes/cognee",
      "link": "https://github.com/topoteretes/cognee",
      "source": "GitHub Trends"
    },
    {
      "title": "z-lab/dflash",
      "link": "https://github.com/z-lab/dflash",
      "source": "GitHub Trends"
    },
    {
      "title": "Lordog/dive-into-llms",
      "link": "https://github.com/Lordog/dive-into-llms",
      "source": "GitHub Trends"
    }
  ],
  "🔥 Product Hunt": [
    {
      "title": "Libertify.com",
      "link": "https://www.producthunt.com/products/libertify-com",
      "source": "Product Hunt",
      "summary": "Turn any document into an interactive video"
    },
    {
      "title": "Splitt",
      "link": "https://www.producthunt.com/products/splitt-3",
      "source": "Product Hunt",
      "summary": "Track your workout from your lock screen and Dynamic Island"
    },
    {
      "title": "MacSpoof",
      "link": "https://www.producthunt.com/products/macspoof",
      "source": "Product Hunt",
      "summary": "A quick and easy MAC address changer"
    },
    {
      "title": "Fellow for iOS",
      "link": "https://www.producthunt.com/products/fellow-app",
      "source": "Product Hunt",
      "summary": "AI meeting notes for in-person meetings"
    },
    {
      "title": "Claude Code Desktop App Redesigned",
      "link": "https://www.producthunt.com/products/claude-redesigned",
      "source": "Product Hunt",
      "summary": "Run parallel coding agents from one desktop workspace"
    },
    {
      "title": "stagewise",
      "link": "https://www.producthunt.com/products/stagewise-2",
      "source": "Product Hunt",
      "summary": "The coding agent that works in its own browser environment"
    },
    {
      "title": "Google Chrome Skills",
      "link": "https://www.producthunt.com/products/google-chrome-skills",
      "source": "Product Hunt",
      "summary": "Turn your best AI prompts into one-click tools in Chrome"
    },
    {
      "title": "Askiva AI",
      "link": "https://www.producthunt.com/products/askiva-ai",
      "source": "Product Hunt",
      "summary": "Your autonomous AI user researcher"
    },
    {
      "title": "deduce",
      "link": "https://www.producthunt.com/products/deduce",
      "source": "Product Hunt",
      "summary": "A daily Wordle-like puzzle for AI agents"
    },
    {
      "title": "TaskShell",
      "link": "https://www.producthunt.com/products/taskshell",
      "source": "Product Hunt",
      "summary": "A terminal/IDE-inspired task manager that keeps you in flow"
    }
  ]
}

# The actual task is to use AI model for summarization, since I am the AI, I will just do it internally.
