import { useState } from "react";
import API from "../api/axios";

const AIAssistant = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const { data } = await API.post("/ai/ask", {
        message: userMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (error) {
      console.error("AI FRONTEND ERROR:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error.response?.data?.message ||
            "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-accent text-sm font-medium">
          MyStore AI
        </p>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-2">
          AI Shopping Assistant
        </h1>

        <p className="text-muted mt-3">
          Ask me about products, categories, or what might
          suit your needs.
        </p>
      </div>

      {/* Chat Box */}
      <div className="bg-card border border-line rounded-2xl overflow-hidden">
        {/* Messages */}
        <div className="min-h-[400px] max-h-[500px] overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-[350px] flex items-center justify-center text-center">
              <div>
                <div className="text-4xl mb-4">✨</div>

                <h2 className="text-ink font-semibold text-lg">
                  How can I help you?
                </h2>

                <p className="text-muted text-sm mt-2">
                  Try asking:
                </p>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="bg-surface border border-line rounded-lg px-3 py-2 text-sm text-muted">
                    What products do you recommend?
                  </span>

                  <span className="bg-surface border border-line rounded-lg px-3 py-2 text-sm text-muted">
                    Help me find a gift
                  </span>
                </div>
              </div>
            </div>
          ) : (
            messages.map((item, index) => (
              <div
                key={index}
                className={`flex ${
                  item.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    item.role === "user"
                      ? "bg-accent text-white"
                      : "bg-surface border border-line text-ink"
                  }`}
                >
                  <p className="text-sm leading-6 whitespace-pre-wrap">
                    {item.content}
                  </p>
                </div>
              </div>
            ))
          )}

          {/* Loading */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface border border-line rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted">
                    Finding the best products for you
                  </span>

                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"></span>
                    <span
                      className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></span>
                    <span
                      className="w-1.5 h-1.5 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></span>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSend}
          className="border-t border-line p-4 flex gap-3"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask the AI assistant..."
            disabled={loading}
            className="flex-1 bg-surface border border-line text-ink rounded-xl px-4 py-3 outline-none focus:border-accent disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="bg-accent hover:bg-accent-dark text-white px-5 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;

