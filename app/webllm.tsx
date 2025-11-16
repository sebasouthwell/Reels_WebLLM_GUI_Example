"use client";
import * as webllm from "@mlc-ai/web-llm";
import { useState } from "react";

export default function WebLLM() {
    const [engine, setEngine] = useState<webllm.MLCEngine | null>(null); // We return the get/set methods for the MLC Engine
    const [input, setInput] = useState<string>(""); // This creates a get/set method for the input text element which is an input field in our UI
    const [messages, setMessages] = useState<string[]>([]); // This creates a get/set method for a log array, where we will store the chat history
    const [selectedModel, setSelectedModel] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);

    const models = webllm.prebuiltAppConfig.model_list;

    // This is a local function that just tells us how close the model is to being loaded
    const initProgressCallback = (initProgress: any) => {
        console.log(initProgress);
    };
    
    // This just loads the model, and has a nice little, loading indicator, the only bit that matters is in the try block, where we create the engine, and set it to the state.
    const loadModel = async () => {
        if (!selectedModel) return;
        setIsLoading(true);
        try {
            const mlcEngine = await webllm.CreateMLCEngine(
                selectedModel,
                { initProgressCallback }
            );
            setEngine(mlcEngine);
        } catch (error) {
            console.error("Failed to load model:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    // The main thing in this function, is that it takes the the input from our get/set method, clears the input, then just tries to send only this message to the model. This does not have chat history but is a basic example of how to use the model.
    const handleMessage = async () => {
        if (!engine || !input.trim()) return;

        const userMessage = input;
        setInput("");
        setMessages((prev) => [...prev, `You: ${userMessage}`]);

        try {
            const result = await engine.chatCompletion({
                messages: [{ role: "user", content: userMessage }],
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
            });

            const response = result.choices[0]?.message?.content;
            if (response) {
                setMessages((prev) => [...prev, `AI: ${response}`]);
            }
        } catch (error) {
            console.error("Failed to get response:", error);
            setMessages((prev) => [...prev, `AI: Error generating response`]);
        }
    };

    // This is just a react function, to listen for enter key being pressed, so we can make it more user friendly, and not have to click the send button.
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleMessage();
        }
    };
    
    return (
        <div className="flex flex-col h-screen max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            {!engine ? (
                <div className="flex flex-col items-center justify-center h-full space-y-6">
                    <div className="w-full max-w-md space-y-4">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                            WebLLM Chat
                        </h1>
                        <label htmlFor="model-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Select Model
                        </label>
                        <select
                            id="model-select"
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 transition-all duration-200 hover:border-slate-400 dark:hover:border-slate-500"
                        >
                            <option value="" disabled>Choose a model...</option>
                            {models.map((model) => (
                                <option key={model.model_id} value={model.model_id}>
                                    {model.model_id}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={loadModel}
                            disabled={!selectedModel || isLoading}
                            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    {/* This is just a loading spinner, that shows us we are waiting for the model to load */}
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading Model...
                                </span>
                            ) : (
                                "Load Model"
                            )}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col h-full space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {selectedModel || "Model Loaded"}
                        </h2>
                        <button
                            onClick={() => {
                                setEngine(null);
                                setMessages([]);
                                setSelectedModel("");
                            }}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200"
                        >
                            Change Model
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">
                                <p className="text-center">Start a conversation by typing a message below</p>
                            </div>
                        ) : (
                            messages.map((msg, i) => {
                                const isUser = msg.startsWith("You: ");
                                const content = isUser ? msg.substring(5) : msg.substring(4);
                                return (
                                    <div
                                        key={i}
                                        className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
                                                isUser
                                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-br-none"
                                                    : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-none"
                                            }`}
                                        >
                                            <div className="text-xs font-semibold mb-1 opacity-80">
                                                {isUser ? "You" : "AI"}
                                            </div>
                                            <div className="whitespace-pre-wrap break-words">{content}</div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="flex gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md">
                        <input
                            type="text"
                            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 transition-all duration-200"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <button
                            onClick={handleMessage}
                            disabled={!input.trim()}
                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
