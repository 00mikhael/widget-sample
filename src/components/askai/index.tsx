import React, { useState, useEffect, useRef } from 'react';
import { ReactTyped } from 'react-typed';
// Assuming ReactTyped exports its instance type, otherwise might need adjustment
import type { Typed } from 'react-typed';

// Placeholder strings for the initial typing animation
const placeholderStrings = [
  "Hello! How can I assist you with Mixhers supplements today?",
  "Questions about Mixhers supplements? Ask away!",
  "Ask me about Hertime PMS relief supplements!",
  "Curious about Mixhers for painful cramps? Ask me anything!",
  "Need info on Mixhers' metabolism boosters?",
  "Ask about Mixhers' digestion support.",
  "Learn about Mixhers' sleep aids."
];

const AskAiPage: React.FC = () => {
  const [showResults, setShowResults] = useState(false);
  const [randomPlaceholder, setRandomPlaceholder] = useState('');
  const typedInstanceRef = useRef<Typed | null>(null); // Ref to store Typed instance


  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col relative pt-[120px] md:pt-0 md:justify-center">
      {/* Initial Message */}
      <div
        className={`transition-all duration-500 absolute inset-x-0 top-0 pb-16 z-10 ${showResults ? 'opacity-0 invisible' : 'opacity-100 visible'
          }`}
      >
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center text-gray-600 text-lg sm:text-3xl pt-48 p-8">
            {!showResults && randomPlaceholder && (
              <ReactTyped
                strings={placeholderStrings}
                typeSpeed={20}
                backSpeed={30}
                backDelay={3000}
                loop
                smartBackspace
                shuffle={false}
                // Store instance for potential destruction
                typedRef={(typed) => { typedInstanceRef.current = typed; }}
              />
            )}
          </div>
        </div>
      </div>




    </div>
  );
};

export default AskAiPage;
