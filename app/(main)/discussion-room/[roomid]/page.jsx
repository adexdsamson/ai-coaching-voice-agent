"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { getToken } from "@/services/GlobalServices";
import { CoachingExpert } from "@/services/Options";
import { UserButton } from "@stackframe/stack";
import { RealtimeTranscriber } from "assemblyai";
import { useQuery } from "convex/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useRef, useState } from "react";
import RecordRTC from "recordrtc";
// const RecordRTC = dynamic(() => import("recordrtc") , { ssr: false })

function DiscussionRoom() {
  let silenceTimeout;
  const recorder = useRef(null);
  const { roomid } = useParams();
  const realtimeTranscriber = useRef(null);
  const [enableMic, setEnableMic] = useState(false);
  const [transcribe, setTranscribe] = useState()
  const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, {
    id: roomid,
  });

  let texts = {}

  if (!DiscussionRoomData) return <p>loading....</p>;

  const expert = CoachingExpert.find(
    (item) => item.name === DiscussionRoomData?.expertName
  );

  const connectToServer = async () => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;
    setEnableMic(true);

    realtimeTranscriber.current = new RealtimeTranscriber({
      token: await getToken(),
      sampleRate: 16_000,
    });

    realtimeTranscriber.current.on("transcript", (transcript) => {
      console.log("transcript", transcript);

      texts[transcript.audio_start] = transcript.text;
      const kets = Object.keys(texts);
      const sortedKeys = kets.sort((a, b) => a - b);
      const sortedTexts = sortedKeys.map((key) => texts[key]);
      const finalText = sortedTexts.join(" ");
      console.log("finalText", finalText);
      setTranscribe(finalText);
    });

    await realtimeTranscriber.current.connect();

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorder.current = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: async (blob) => {
            console.log("data available", blob);
            if (!realtimeTranscriber.current) return;

            clearTimeout(silenceTimeout);

            const buffer = await blob.arrayBuffer();
            console.log("buffer", buffer);
            realtimeTranscriber.current.sendAudio(buffer);

            // Restart the silence timeout
            silenceTimeout = setTimeout(() => {
              console.log("silence timeout");
              // recorder.current.stopRecording();
              // recorder.current = null;
            }, 2000);
            //   realtimeTranscriber.current.transcribe(buffer);
          },
        });

        console.log("recorder", recorder.current);

        recorder.current?.startRecording?.();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const disconnect = async (e) => {
    e.preventDefault();
    console.log("disconnect", recorder.current);

    if (recorder.current) {
      await realtimeTranscriber.current.disconnect();
      recorder.current.pauseRecording();
      recorder.current = null;
      setEnableMic(false);
    }
  };

  return (
    <div className="-mt-12">
      <h2 className="text-lg font-bold">
        {DiscussionRoomData?.coachingOption}
      </h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <Image
              src={expert?.avatar ?? ""}
              alt={expert?.name}
              width={200}
              height={200}
              className="h-40 w-40 rounded-full object-cover"
            />
            <h2 className="text-gray-500 mt-2">{expert?.name}</h2>
            <div className="p-5 bg-gray-200 px-10 rounded-lg absolute bottom-10 right-10">
              <UserButton />
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center">
            <Button
              variant={!enableMic ? "default" : "destructive"}
              onClick={!enableMic ? connectToServer : disconnect}
            >
              {!enableMic ? "Connect" : "Disconnect"}
            </Button>
          </div>
        </div>

        <div>
          <div className="h-[60vh] bg-secondary border rounded-4xl flex flex-col items-center justify-center relative">
            <h2>Chat Section</h2>
          </div>
          <h2 className="mt-4 text-gray-500 text-sm">
            At the end of your conversation we will automatically generate
            feedback/notes from your conversation
          </h2>
        </div>
      </div>

      <div>
        <h2>
            {transcribe}
        </h2>
      </div>
    </div>
  );
}

export default DiscussionRoom;
