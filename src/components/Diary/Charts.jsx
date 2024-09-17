const Charts = ({ aiSummary }) => {
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

  const { overallSentiment, positive, negative } = parseAISummary(aiSummary);

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
