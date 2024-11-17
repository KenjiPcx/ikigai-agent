"use client";

import { useChat } from "ai/react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IkigaiChart } from "@/components/ikigai-chart";
import { Send } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { IkigaiData } from "@/types/ikigai";
import { opportunity, source } from "@/lib/db/schema";
import { enhancedOpportunity } from "@/lib/db/schema";
import { OpportunityCards } from "@/components/opportunity-cards";
import { OpportunitiesSearchResult } from "@/lib/db/queries";
import { AudioControls } from "@/components/AudioControls";
import debounce from "lodash/debounce";

export default function DiscoverPage() {
  const [phase, setPhase] = useState<"ikigai" | "recommender">("ikigai");
  const [ikigaiData, setIkigaiData] = useState<IkigaiData>({
    whatYouLove: [],
    whatYouAreGoodAt: [],
    whatTheWorldNeeds: [],
    whatYouCanBePaidFor: [],
  });
  const [paragraph, setParagraph] = useState<string>("");
  const [opportunities, setOpportunities] = useState<
    OpportunitiesSearchResult[]
  >([]);
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [accumulatedText, setAccumulatedText] = useState<string>("");

  const {
    messages,
    input,
    append,
    handleInputChange,
    handleSubmit: originalHandleSubmit,
  } = useChat({
    api: `/api/chat/${phase}`,
    maxSteps: 5,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === "updateIkigai") {
        console.log("update ikigai");
        setIkigaiData(toolCall.args as IkigaiData);
        return "Updated the Ikigai data";
      }
      if (toolCall.toolName === "completeIkigai") {
        console.log("complete ikigai");
        setPhase("recommender");
        setParagraph((toolCall.args as { paragraph: string }).paragraph);
        console.log(toolCall.args);
        return "Completed the Ikigai step";
      }
      if (toolCall.toolName === "searchOpportunities") {
        console.log("search opportunities");
        const response = await fetch("/api/opportunities", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: (toolCall.args as { query: string }).query,
          }),
        });
        const opportunities = await response.json();
        setOpportunities(opportunities);
        return opportunities;
      }
    },
  });

  const fetchOpportunities = async () => {
    const response = await fetch("/api/opportunities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: "business opportunities",
      }),
    });
    const opportunities = (await response.json()) as {
      enhancedOpportunity: typeof enhancedOpportunity.$inferSelect;
      opportunity: typeof opportunity.$inferSelect;
      source: typeof source.$inferSelect;
    }[];
    console.log(opportunities);
    return opportunities;
  };

  useEffect(() => {
    // set state to recommender phase
    setPhase("recommender");
    setParagraph(
      "Help the user find the best niche or business idea to get into based on the following information gathered from the Ikigai analysis: The user is highly interested in doing nothing, living a digital nomad lifestyle, and traveling the world"
    );
  }, []);

  const lastMessage = messages[messages.length - 1];
  const lastAssistantMessage = messages
    .filter((m) => m.role === "assistant")
    .at(-1);

  useEffect(() => {
    if (phase === "recommender") {
      // TODO: Add animation logic for cards sliding away
      // Then initiate conversation with recommender agent
      setTimeout(() => {
        append({
          role: "system",
          content: `Help the user find the best niche or business idea to get into based on the following information gathered from the Ikigai analysis: ${paragraph}`,
        });
        console.log(
          "Forwarded to recommender: " +
            `Help the user find the best niche or business idea to get into based on the following information gathered from the Ikigai analysis: ${paragraph}`
        );
      }, 2000);
    }
  }, [phase, paragraph]);

  const debouncedTTS = useCallback(
    debounce(async (text: string) => {
      console.log("TTS: " + text);
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        const audio = new Audio(url);
        audio.play();
      }
    }, 1000),
    []
  );

  useEffect(() => {
    if (lastAssistantMessage?.content) {
      console.log("Spamming");
    //   debouncedTTS(lastAssistantMessage.content);
    }

    // Cleanup
    return () => {
      debouncedTTS.cancel();
    };
  }, [lastAssistantMessage]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob);

        // Send to your Groq speech-to-text endpoint
        const response = await fetch("/api/transcribe", {
          method: "POST",
          body: formData,
        });
        const { text } = await response.json();

        // Use the transcribed text as input
        handleInputChange({ target: { value: text } } as any);
      };

      mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream
      .getTracks()
      .forEach((track) => track.stop());
  };

  const playAudio = async (url: string) => {
    const audio = new Audio(url);
    audio.play();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAudioUrl(undefined);
    await originalHandleSubmit(e);
  };

  return (
    <motion.main
      className="h-screen bg-neutral-50 dark:bg-neutral-950 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-full max-w-6xl mx-auto flex flex-col">
        {/* Ikigai Visualization */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            {phase === "ikigai" ? (
              <motion.div
                key="ikigai"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <IkigaiChart data={ikigaiData} />
              </motion.div>
            ) : (
              <motion.div
                key="recommender"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <OpportunityCards opportunities={opportunities} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* AI Message and Input */}
        <div className="space-y-4">
          {/* Latest AI Message */}
          {lastAssistantMessage && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-neutral-900 rounded-lg p-4 shadow-sm"
            >
              <p className="text-neutral-600 dark:text-neutral-400">
                {lastAssistantMessage?.content}
              </p>
            </motion.div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your response..."
              className="flex-1"
            />
            <AudioControls
              onStartRecording={startRecording}
              onStopRecording={stopRecording}
              onPlayAudio={playAudio}
              audioUrl={audioUrl}
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </motion.main>
  );
}
