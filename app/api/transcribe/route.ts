import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { Readable } from "stream";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import fs from "fs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audio = formData.get("audio") as Blob;
    const buffer = Buffer.from(await audio.arrayBuffer());

    // Initialize the Groq client
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY!,
    });

    const tempFilePath = join('/tmp', `audio-${Date.now()}.wav`);
    await writeFile(tempFilePath, buffer);

    // Create a transcription
    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: "whisper-large-v3-turbo",
      response_format: "json",
      language: "en",
      temperature: 0.0,
    });

    return NextResponse.json({ text: transcription.text });
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}
