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
  blurFaces: z.boolean().optional().describe('Whether to blur faces in the video for privacy.'),
  allowTraining: z.boolean().optional().describe('Whether the video can be used for training purposes.'),
});
export type AnalyzeVideoInput = z.infer<typeof AnalyzeVideoInputSchema>;

export const AnalyzeVideoOutputSchema = z.object({
  analysis: z.string().describe('A detailed analysis of the video content.'),
});
export type AnalyzeVideoOutput = z.infer<typeof AnalyzeVideoOutputSchema>;

export async function analyzeVideo(input: AnalyzeVideoInput): Promise<AnalyzeVideoOutput> {
  return analyzeVideoFlow(input);
}

const analyzeVideoPrompt = ai.definePrompt({
  name: 'analyzeVideoPrompt',
  input: {schema: AnalyzeVideoInputSchema},
  prompt: `Analyze the video and provide a summary of the events.
{{#if blurFaces}}
IMPORTANT: Before providing the analysis, ensure all faces in the video are blurred to protect privacy. Acknowledge this step in your analysis.
{{/if}}
{{#if allowTraining}}
The user has consented for this video to be used for training purposes.
{{else}}
The user has NOT consented for this video to be used for training. Do not store or use it beyond this analysis.
{{/if}}

Video to analyze is attached.`,
});

const analyzeVideoFlow = ai.defineFlow(
  {
    name: 'analyzeVideoFlow',
    inputSchema: AnalyzeVideoInputSchema,
    outputSchema: AnalyzeVideoOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: [
        {
          text: await analyzeVideoPrompt.render({
            input: {
              blurFaces: input.blurFaces,
              allowTraining: input.allowTraining,
            },
          }),
        },
        {media: {url: input.videoDataUri}},
      ],
    });

    return {
        analysis: llmResponse.text,
    };
  }
);
