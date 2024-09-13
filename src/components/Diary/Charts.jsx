const Charts = ({ aiSummary }) => {
  // Define the mapping of sentiments to emojis
  const sentimentToEmoji = {
    positive: "positive 😊",
    neutral: "neutral 😎",
    negative: "negative 😢",
    happy: "happy 😂",
    sad: "sad 😢",
    excited: "excited 🙃",
    tired: "tired 😴",
    busy: "busy 🤯",
  };

  // Parse the AI summary to extract sentiment and content
  const { overallSentiment, positive, negative } = parseAISummary(aiSummary);

  // Get the emoji based on the overall sentiment
  const sentimentEmoji =
    sentimentToEmoji[overallSentiment.toLowerCase()] || "";

  return (
    <div>
      <div className="text-center text-3xl mb-4">
        Semantic: {sentimentEmoji}
      </div>
      <div className="text-lg">
        <div>
          <strong>Positive:</strong> {positive}
        </div>
        <div>
          <strong>Negative:</strong> {negative}
        </div>
      </div>
    </div>
  );
};

export default Charts;

const parseAISummary = (summary) => {
  const sentimentRegex = /Overall sentiment: (\w+)/;
  const positiveRegex = /Positive: (.+?)(?=Negative:|$)/s;
  const negativeRegex = /Negative: (.+)$/s;

  const sentimentMatch = sentimentRegex.exec(summary);
  const positiveMatch = positiveRegex.exec(summary);
  const negativeMatch = negativeRegex.exec(summary);

  return {
    overallSentiment: sentimentMatch ? sentimentMatch[1] : "unknown",
    positive: positiveMatch ? positiveMatch[1].trim() : "No positive content.",
    negative: negativeMatch ? negativeMatch[1].trim() : "No negative content.",
  };
};
