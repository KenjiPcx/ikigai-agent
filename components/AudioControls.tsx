import { useState, useRef } from 'react';
import { Mic, MicOff, Play, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioControlsProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: (audioUrl: string) => void;
  audioUrl?: string;
}

export function AudioControls({
  onStartRecording,
  onStopRecording,
  onPlayAudio,
  audioUrl
}: AudioControlsProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      onStopRecording();
    } else {
      setIsRecording(true);
      onStartRecording();
    }
  };

  const handlePlayToggle = () => {
    if (audioUrl) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        onPlayAudio(audioUrl);
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleRecordToggle}
        className={isRecording ? "bg-red-500 text-white" : ""}
      >
        {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
      {audioUrl && (
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayToggle}
        >
          {isPlaying ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
      )}
    </div>
  );
} 