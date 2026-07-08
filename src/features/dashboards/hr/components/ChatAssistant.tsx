import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition z-50"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-4 bg-blue-600 text-white">
            <h4 className="font-semibold">HR Assistant</h4>
            <p className="text-xs opacity-90">Ask me about payroll or employees</p>
          </div>
          <div className="h-64 p-4 overflow-y-auto bg-gray-50">
            <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-gray-700 max-w-[80%]">
              Hello! How can I help you today?
            </div>
          </div>
          <div className="p-3 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};