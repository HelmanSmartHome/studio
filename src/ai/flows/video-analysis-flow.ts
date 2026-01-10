'use server';
/**
 * @fileOverview A video analysis AI flow.
 *
 * - analyzeVideo - A function that handles the video analysis process.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeVideoInputSchema,
  AnalyzeVideoOutputSchema,
  type AnalyzeVideoInput,
  type AnalyzeVideoOutput,
} from '@/ai/schemas/video-analysis';


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
