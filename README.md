This is a very basic Next.js project, that uses the WebLLM library to load a model into the browser cache, and then use it to chat with the model.
Everything in this project, is primarily a basic Next.js project with the exception of 'app/webllm.tsx' which is the main component that renders the chat interface.

If you are interested in learning more about WebLLM, you can find the documentation [here](https://webllm.github.io/docs/index.html).
And for a more comprehensive (and nicer) chat interface, checkout [this](https://chat.webllm.ai/) live demo, made by the MLC-AI.
The original repo, and the main library used in this project, can be found [here](https://github.com/mlc-ai/web-llm).

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the demo chat interface.
After running the development server, you should be able to see the chat interface and interact with the model.

## Understanding the Code
I've commented the code in 'app/webllm.tsx' to help you understand the code, it doesn't have full chat history but is a basic example of how to use the model.
It is important to note "You do not need to run this as a Next.js application", and if you want, you can use their CDN to run this from pure HTML (although it does need a server to host it, so the cache can be used properly).

Local Example:
```html
    <script type="module">
        import {prebuiltAppConfig, CreateMLCEngine} from "https://cdn.jsdelivr.net/npm/@mlc-ai/web-llm/+esm"
        let engine;

        async function loadModelByID(id){
            try{
                engine = await CreateMLCEngine(id, {
                    initProgressCallback: (progress) => {
                        console.log(progress);
                    }
                });
            }
            catch(error){
                console.error("Failed to load model:", error);
            }
        }

        async function sendMessage(message){
            try{
                const result = await engine.chatCompletion({
                    messages: [{ role: "user", content: message }],
                    max_tokens: 1000,
                    temperature: 0.7,
                    top_p: 0.9,
                });
            }
            catch(error){
                console.error("Failed to send message:", error);
            }
        }
    </script>

```

# Disclaimer
It is important to note that this code is my own attempt at implementing the disclaimer, and I am not affiliated with the MLC-AI or the WebLLM library, this code can be found also on their website/docs, it is just a simplified example to allow people to easily understand how to use the library.