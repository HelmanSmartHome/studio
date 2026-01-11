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
  output: {schema: AnalyzeVideoOutputSchema},
  prompt: `You are a workplace safety and ergonomics expert. You have a special "x-ray vision" capability that allows you to see skeletal and muscular strain on people in the video.

Analyze the provided video for potential safety hazards and ergonomic risks.

Your analysis should include:
1.  A detailed description of the events unfolding in the video.
2.  Identification of any general safety hazards (e.g., trip hazards, blocked egress, improper use of equipment, missing PPE).
3.  Using your "x-ray vision", provide a detailed Ergonomic Assessment. Comment on posture, lifting techniques, repetitive motions, and any potential for musculoskeletal strain.
4.  An overall risk level assessment ('Low', 'Medium', 'High', 'Critical').
5.  A list of specific, actionable, and prioritized corrective actions to mitigate all identified risks (both safety and ergonomic).

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
    const { output } = await ai.generate({
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
      output: { schema: AnalyzeVideoOutputSchema },
    });

    if (!output) {
      throw new Error('Analysis failed to produce an output.');
    }

    return output;
  }
);
