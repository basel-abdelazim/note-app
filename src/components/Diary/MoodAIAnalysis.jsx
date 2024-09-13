import { useRef, useState } from "react";
import { Charts } from "@/components/Diary";
import axios from 'axios';

const MoodAIAnalysis = ({ entries }) => {
  const [loading, setLoading] = useState(false);
  const [aiSummary, setAISummary] = useState(null);
  const modalRef = useRef();

  const handleAISummary = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a sentiment analysis tool. Analyze the following diary entries seperate to Negative and Posetives and provide an overall sentiment as a single word: positive, neutral, negative, happy, sad, excited, tired or busy.'
          },
          {
            role: 'user',
            content: `Here are some diary entries for sentiment analysis: ${entries.map(entry => entry.content).join(' ')}`
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'i473prjtjanocg4a23tybf',
          'provider': 'open-ai',
          'mode': 'production'
        }
      });

      console.log(response.data);
      setAISummary(response.data.message.content);
    } catch (error) {
      console.error('Error fetching AI summary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => modalRef.current.showModal()}
          className="bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10"
        >
          ✨
        </button>
      </div>
      <dialog id="modal-note" className="modal" ref={modalRef}>
        <div className="modal-box h-[600px] py-0 w-11/12 max-w-5xl">
          <div className="modal-action items-center justify-between mb-2">
            <h1 className="text-2xl text-center">
              Get your AI Gen Mood Analysis
            </h1>
            <form method="dialog">
              <button className="btn">&times;</button>
            </form>
          </div>
          <div className="flex items-center gap-3">
            <div className="textarea textarea-success w-1/2 h-[400px] overflow-y-scroll">
              {loading
                ? "Loading..."
                : aiSummary
                ? aiSummary // Adjust this based on the actual response structure
                : "AI SUMMARY GOES HERE..."}
            </div>
            <div className="textarea textarea-success w-1/2 h-[400px] overflow-y-scroll">
              <Charts aiSummary={aiSummary} />
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className={`mt-5 btn bg-purple-500 hover:bg-purple-400 text-white ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleAISummary}
              disabled={entries.length === 0 || loading}
            >
              {loading ? "Generating..." : "Gen AI mood analysis ✨"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default MoodAIAnalysis;
