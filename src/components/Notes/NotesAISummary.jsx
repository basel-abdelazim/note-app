import { useRef, useState } from 'react';
import axios from 'axios';

const NotesAISummary = ({ notes }) => {
  const modalRef = useRef();
  const [loading, setLoading] = useState(false); 
  const [stream, setStream] = useState(false); 
  const [aiSummary, setAiSummary] = useState(null);

  const handleAISummary = async () => {
    setLoading(true); 
    try {
      const response = await axios.post('https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions', {
        model: 'gpt-4',
        stream: stream, 
        messages: [
          {
            role: 'system',
            content: 'You are a note summarization tool. Summarize the content provided in a concise, easy-to-read format.'
          },
          {
            role: 'user',
            content: `Summarize the following note: ${notes[0]?.content || ''}`
          }
        ]
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${import.meta.env.VITE_TOKEN_OPENAI}`,
          'provider': 'open-ai',
          'mode': 'production'
        }
      });

      console.log('AI Response:', response.data);
      setAiSummary(response.data.message.content); 
    } catch (error) {
      console.error('Error fetching AI summary:', error);
      setAiSummary({ error: error.message }); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <>
      <div className='fixed bottom-4 right-4'>
        <button
          onClick={() => modalRef.current.showModal()}
          className='bg-purple-400 hover:bg-purple-300 text-white font-bold py-2 px-4 rounded-full shadow-lg w-10 h-10'
        >
          ✨
        </button>
      </div>
      <dialog id='modal-note' className='modal' ref={modalRef}>
        <div className='modal-box h-[600px] py-0'>
          <div className='modal-action items-center justify-between mb-2'>
            <h1 className='text-2xl text-center'>Get AI Summary for Notes</h1>
            <label htmlFor='Stream?' className='flex items-center gap-1'>
              Stream?
              <input
                id='Stream?'
                type='checkbox'
                className='toggle toggle-error'
                checked={stream}
                onChange={() => setStream(p => !p)} 
              />
            </label>
            <form method='dialog'>
              <button className='btn'>&times;</button>
            </form>
          </div>
          <div className='flex flex-col items-center gap-3'>
            <div className='textarea textarea-success w-full h-[400px] overflow-y-scroll'>
              {loading ? "Loading..." : aiSummary ? aiSummary.error ? `Error: ${aiSummary.error}` : aiSummary : 'AI SUMMARY GOES HERE'}
            </div>
            <button
              className={`mt-5 btn bg-purple-500 hover:bg-purple-400 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleAISummary}
              disabled={loading} 
            >
              {loading ? "Generating..." : "Gen AI Summary ✨"}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default NotesAISummary;
