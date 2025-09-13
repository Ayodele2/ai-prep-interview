"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface AgentProps {
  userName: string;
  userId: string;
  interviewId: string;
  feedbackId?: string;
  type: 'generate' | 'interview';
  questions?: string[];
}

interface Message {
  type: string;
  transcriptType?: string;
  role: 'user' | 'system' | 'assistant';
  transcript: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Debug logging function - now only logs to console
  const addDebugLog = (log: string) => {
    console.log(log);
    setDebugLogs(prev => [...prev, `${new Date().toISOString()}: ${log}`]);
  };

  useEffect(() => {
    addDebugLog("Component mounted");
    addDebugLog(`Props - userName: ${userName}, userId: ${userId}, type: ${type}`);
    addDebugLog(`InterviewId: ${interviewId}, feedbackId: ${feedbackId}`);
    addDebugLog(`Questions: ${questions ? questions.length : 'none'}`);
    
    const onCallStart = () => {
      addDebugLog("Call started event received");
      setCallStatus(CallStatus.ACTIVE);
    };

    const onCallEnd = () => {
      addDebugLog("Call ended event received");
      setCallStatus(CallStatus.FINISHED);
    };

    const onMessage = (message: Message) => {
      addDebugLog(`Message received - type: ${message.type}, transcriptType: ${message.transcriptType}`);
      addDebugLog(`Message content: ${JSON.stringify(message)}`);
      
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        addDebugLog(`Adding message to transcript: ${newMessage.role} - ${newMessage.content}`);
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => {
      addDebugLog("Speech start event received");
      setIsSpeaking(true);
    };

    const onSpeechEnd = () => {
      addDebugLog("Speech end event received");
      setIsSpeaking(false);
    };

    const onError = (error: Error) => {
      addDebugLog(`Error event received: ${error.message}`);
      console.error("VAPI Error:", error);
    };

    // Check if VAPI is properly initialized
    if (!vapi) {
      addDebugLog("ERROR: VAPI is not initialized!");
    } else {
      addDebugLog("VAPI is initialized successfully");
    }

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      addDebugLog("Cleaning up event listeners");
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, [userName, userId, interviewId, feedbackId, type, questions]);

  useEffect(() => {
    if (messages.length > 0) {
      const lastMsg = messages[messages.length - 1].content;
      addDebugLog(`Setting last message: ${lastMsg}`);
      setLastMessage(lastMsg);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      addDebugLog("Starting feedback generation");
      addDebugLog(`Messages count: ${messages.length}`);

      try {
        const { success, feedbackId: id } = await createFeedback({
          interviewId: interviewId!,
          userId: userId!,
          transcript: messages,
          feedbackId,
        });

        addDebugLog(`Feedback creation result - success: ${success}, id: ${id}`);

        if (success && id) {
          addDebugLog(`Redirecting to feedback page: /interview/${interviewId}/feedback`);
          router.push(`/interview/${interviewId}/feedback`);
        } else {
          addDebugLog("Error saving feedback - redirecting to home");
          router.push("/");
        }
      } catch (error) {
        addDebugLog(`Error in handleGenerateFeedback: ${error}`);
        console.error("Feedback generation error:", error);
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      addDebugLog(`Call finished - type: ${type}`);
      if (type === "generate") {
        addDebugLog("Generate type - redirecting to home");
        router.push("/");
      } else {
        addDebugLog("Interview type - generating feedback");
        handleGenerateFeedback(messages);
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  const handleCall = async () => {
    addDebugLog("=== Starting call process ===");
    addDebugLog(`Call type: ${type}`);
    addDebugLog(`Environment variables check:`);
    addDebugLog(`- NEXT_PUBLIC_VAPI_WORKFLOW_ID: ${process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID ? 'Set' : 'Not set'}`);
    
    // Check microphone permissions
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      addDebugLog("Microphone permission granted");
      stream.getTracks().forEach(track => track.stop()); // Clean up
    } catch (micError) {
      addDebugLog(`Microphone permission error: ${micError}`);
      alert("Microphone access is required for the interview. Please grant permission and try again.");
      return;
    }
    
    setCallStatus(CallStatus.CONNECTING);

    // Add timeout for connecting state
    const connectTimeout = setTimeout(() => {
      if (callStatus === CallStatus.CONNECTING) {
        addDebugLog("Connection timeout - resetting to inactive");
        setCallStatus(CallStatus.INACTIVE);
      }
    }, 10000); // 10 second timeout

    try {
      if (type === "generate") {
        addDebugLog("Starting VAPI with workflow ID");
        
        if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
          throw new Error("NEXT_PUBLIC_VAPI_WORKFLOW_ID is not set");
        }

        const config = {
          variableValues: {
            userName: userName, // Note: workflow uses userName, not username
            userid: userId,
          },
        };
        
        addDebugLog(`Workflow ID: ${process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID}`);
        addDebugLog(`Workflow config: ${JSON.stringify(config)}`);
        
        // Test VAPI connection first
        try {
          addDebugLog("Testing VAPI connection...");
          // You can add a simple test here if VAPI SDK has a test method
        } catch (testError) {
          addDebugLog(`VAPI connection test failed: ${testError}`);
        }
        
        // Alternative: Use assistant ID instead of workflow ID
        // const result = await vapi.start("your-assistant-id-here", config);
        
        const result = await vapi.start(process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID, config);
        addDebugLog(`VAPI start result: ${JSON.stringify(result)}`);
        addDebugLog("VAPI started successfully with workflow ID");
        clearTimeout(connectTimeout);
        
      } else {
        addDebugLog("Starting VAPI with interviewer config");
        
        let formattedQuestions = "";
        if (questions && questions.length > 0) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
          addDebugLog(`Formatted questions: ${formattedQuestions}`);
        } else {
          addDebugLog("No questions provided");
        }

        if (!interviewer) {
          throw new Error("Interviewer configuration is not available");
        }

        const config = {
          variableValues: {
            questions: formattedQuestions,
          },
        };
        
        addDebugLog(`Interviewer config: ${JSON.stringify(config)}`);
        addDebugLog(`Interviewer object: ${JSON.stringify(interviewer)}`);
        
        const result = await vapi.start(interviewer, config);
        addDebugLog(`VAPI start result: ${JSON.stringify(result)}`);
        addDebugLog("VAPI started successfully with interviewer config");
        clearTimeout(connectTimeout);
      }
      
    } catch (error) {
      clearTimeout(connectTimeout);
      addDebugLog(`ERROR starting VAPI call: ${error}`);
      addDebugLog(`Error type: ${typeof error}`);
      addDebugLog(`Error object: ${JSON.stringify(error)}`);
      console.error("Error starting VAPI call:", error);
      setCallStatus(CallStatus.INACTIVE);
      
      // Additional error details
      if (error instanceof Error) {
        addDebugLog(`Error name: ${error.name}`);
        addDebugLog(`Error message: ${error.message}`);
        addDebugLog(`Error stack: ${error.stack}`);
      } else {
        addDebugLog(`Non-Error object thrown: ${error}`);
      }
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 
                          typeof error === 'string' ? error : 
                          'Unhandled error. Check console for details.';
      alert(`Failed to start call: ${errorMessage}`);
    }
  };

  const handleDisconnect = () => {
    addDebugLog("Disconnecting call");
    setCallStatus(CallStatus.FINISHED);
    try {
      vapi.stop();
      addDebugLog("VAPI stopped successfully");
    } catch (error) {
      addDebugLog(`Error stopping VAPI: ${error}`);
      console.error("Error stopping VAPI:", error);
    }
  };

  return (
    <>
      <div className="call-view">
        {/* AI Interviewer Card */}
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/logo.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
          <p className="text-xs text-gray-500">Status: {callStatus}</p>
          <p className="text-xs text-gray-500">Speaking: {isSpeaking ? 'Yes' : 'No'}</p>
        </div>

        {/* User Profile Card */}
        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar.png"
              alt="profile-image"
              width={539}
              height={539}
              className="rounded-full object-cover size-[120px]"
            />
            <h3>{userName}</h3>
            <p className="text-xs text-gray-500">Messages: {messages.length}</p>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={() => handleCall()}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />

            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={() => handleDisconnect()}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;