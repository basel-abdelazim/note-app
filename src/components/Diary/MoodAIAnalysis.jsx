import react, { useRef, useState } from 'react';  
import axios from 'axios';  
import { Charts } from '@/components/Diary'; // Adjust the path as necessary  

const MoodAIAnalysis = ({ entries, userData }) => {  
  const modalRef = useRef();  
  const [aiSummary, setAiSummary] = useState(null);  
  const [loading, setLoading] = useState(false);  

  const handleAISummary = async () => {  
    // Check if token is valid (function would be defined separately)  
    if (!isTokenValid(userData)) {  
      console.error('Token is invalid or expired. Please log in again.');  
      return;  
    }  

    setLoading(true);  
    try {  
      // Construct a prompt based on diary entries  
      const promptContent = entries.length > 0 ?   
        entries.map((entry) => entry.content).join('\n') :   
        'There are no diary entries available for analysis.';  

      const response = await axios.post(  
        'https://gen-ai-wbs-consumer-api.onrender.com/api/v1/chat/completions',  
        {  
          model: 'gpt-4o',  
          messages: [  
            {  
              role: 'system',  
              content: 'You are a mood analysis assistant.'  
            },  
            {  
              role: 'user',  
              content: `Analyze the emotional tone of the following diary entries and return structured JSON:\n${promptContent}`,  
            },  
          ],  
        },  
        {  
          headers: {  
            provider: 'open-ai',  
            mode: 'production',  
            Authorization: `Bearer ${userData.token}`,  
            'Content-Type': 'application/json',  
          },  
        }  
      );  

        
      const structuredData = response.data;   
      setAiSummary(structuredData);  
    } catch (error) {  
      console.error('Error fetching AI analysis:', error);  

       
      const mockResponse = {  
        moods: {  
          happy: 3,  
          sad: 1,  
          angry: 0,  
          neutral: 2,  
        },  
        summary: "Overall mood was mostly happy with some neutral entries.",  
      };  
      
      setAiSummary(mockResponse);   
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
        <div className='modal-box h-[600px] py-0 w-11/12 max-w-5xl'>  
          <div className='modal-action items-center justify-between mb-2'>  
            <h1 className='text-2xl text-center'>Get your AI Gen Mood Analysis</h1>  
            <form method='dialog'>  
              <button className='btn'>&times;</button>  
            </form>  
          </div>  
          <div className='flex items-center gap-3'>  
            {/* Left panel for AI summary */}  
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>  
              {loading ? 'Loading AI Summary...' : aiSummary ? JSON.stringify(aiSummary, null, 2) : 'AI SUMMARY GOES HERE...'}  
            </div>  
            {/* Right panel for Charts component */}  
            <div className='textarea textarea-success w-1/2 h-[400px] overflow-y-scroll'>  
              {aiSummary && <Charts aiSummary={aiSummary} />}  
            </div>  
          </div>  
          <div className='flex justify-center'>  
            <button  
              className='mt-5 btn bg-purple-500 hover:bg-purple-400 text-white'  
              onClick={handleAISummary}  
              disabled={loading}  
            >  
              {loading ? 'Generating...' : 'Gen AI mood analysis ✨'}  
            </button>  
          </div>  
        </div>  
      </dialog>  
    </>  
  );  
};  

export default MoodAIAnalysis;
