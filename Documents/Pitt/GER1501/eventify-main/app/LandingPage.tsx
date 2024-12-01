'use client';

import { useState, useEffect } from 'react';
import { Camera, Mic, Github, Upload } from 'lucide-react';
import { Button } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";

export default function LandingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [icsContent, setIcsContent] = useState<string | null>(null);
  const [naturalLanguageResponse, setNaturalLanguageResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [textInput, setTextInput] = useState<string>(''); // State to handle text box input

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/image', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setIcsContent(data.ics_content);
          setNaturalLanguageResponse(data.natural_language_response);

          // Create a Blob from the ICS content
          const blob = new Blob([data.ics_content], { type: 'text/calendar' });
          const url = window.URL.createObjectURL(blob);

          // Create a download link
          const a = document.createElement('a');
          a.href = url;
          a.download = 'event.ics';
          document.body.appendChild(a);
          a.click();
          a.remove();
          window.URL.revokeObjectURL(url);
        } else {
          console.error('File upload failed.');
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    setIsRecording(!isRecording);
    console.log('Voice recording:', isRecording ? 'stopped' : 'started');
  };

  // Handle text input change
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(event.target.value);
  };

  // Handle text input submission
  const handleTextSubmit = async () => {
    if (textInput) {
      setIsLoading(true);
      try {
        const response = await fetch('/api/text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: textInput }),
        });

        if (response.ok) {
          const data = await response.json();
          setIcsContent(data.ics_content);
          setNaturalLanguageResponse(data.natural_language_response);
        } else {
          console.error('Error processing text input.');
        }
      } catch (error) {
        console.error('Error submitting text:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Handle Enter key press to submit text
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();  // Prevent newline
      handleTextSubmit();
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#000000] via-[#DD0000] to-[#FFCC00]">
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="max-w-2xl text-white text-center mb-4">
          <h2 className="text-3xl font-medium mb-2">Überprüfe deine Faktenr</h2>
          {isLoading ? (
            <p className="text-4xl">
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
              <span className="loading-dot">.</span>
            </p>
          ) : (
            <p className="text-4xl">. . .</p>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <div>
            <Input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <Button>
              <label htmlFor="file-upload" className="flex items-center cursor-pointer">
                <Upload className="mr-2 h-4 w-4" /> Hochladen
              </label>
            </Button>
          </div>
          <div>
            <Input type="file" onChange={handleFileUpload} className="hidden" id="file-upload" />
            <Button>
              <label htmlFor="file-upload" className="flex items-center cursor-pointer">
                <Camera className="mr-2 h-4 w-4" /> Kamera
              </label>
            </Button>
          </div>
          <Button onClick={handleVoiceRecording}>
            <Mic className="mr-2 h-4 w-4" /> {isRecording ? 'Stop' : 'Stimme aufnehmen'} 
          </Button>
        </div>

        {/* Text input box */}
        <Textarea
          placeholder="Oder fügen Sie hier Ihre Fakten ein..."
          className="mt-4 w-full h-40 p-4 max-w-md rounded-lg shadow-lg"
          value={textInput}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}  // Detect Enter key
        />

        {/* Displaying the results */}
        {naturalLanguageResponse && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Ihre Informationen:</h3>
            <p className="whitespace-pre-wrap">{naturalLanguageResponse}</p>
          </div>
        )}
      </div>

      <footer className="bg-black text-white p-4 flex justify-center items-center">
        <a
          href="https://github.com/lucasloepke/eventify"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-[#eed532] transition-all duration-300 ease-in-out transform hover:scale-110 hover:-translate-y-1"
        >
          <Github className="mr-2 h-4 w-4 text-white hover:text-[#eed532]" />
          <span>Archiv</span>
        </a>
      </footer>
    </main>
  );
}
