export default function ChatMessage({ message }:any) {
    const { sender, content } = message;
    
    return (
      <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
        <div 
          className={`max-w-[80%] p-3 rounded-lg ${
            sender === 'user' 
              ? 'bg-indigo-500 text-white rounded-br-none' 
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {content}
        </div>
      </div>
    );
  }