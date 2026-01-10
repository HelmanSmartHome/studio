'use server';
/**
 * @fileOverview A video analysis AI flow.
 *
 * - analyzeVideo - A function that handles the video analysis process.
 * - AnalyzeVideoInput - The input type for the analyzeVideo function.
 * - AnalyzeVideoOutput - The return type for the analyzeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const AnalyzeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeVideoInput = z.infer<typeof AnalyzeVideoInputSchema>;

export const AnalyzeVideoOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the video content.'),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;

export async function analyzeVideo(input: AnalyzeVideoInput): Promise<AnalyzeVideoOutput> {
  return analyzeVideoFlow(input);
}

const analyzeVideoFlow = ai.defineFlow(
  {
    name: 'analyzeVideoFlow',
    inputSchema: AnalyzeVideoInputSchema,
    outputSchema: AnalyzeVideoOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: [
        {text: 'Analyze the video and provide a summary of the events.'},
        {media: {url: input.videoDataUri}},
      ],
    });

    return {
        analysis: llmResponse.text,
    };
  }
);
