
'use server';
/**
 * @fileOverview An AI flow to classify if movie content is explicit.
 *
 * - classifyExplicitContent - A function that determines if movie content is explicit.
 * - ClassifyExplicitContentInput - The input type.
 * - ClassifyExplicitContentOutput - The return type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyExplicitContentInputSchema = z.object({
  title: z.string().describe('The title of the movie.'),
  description: z.string().describe('The description or overview of the movie.'),
});
export type ClassifyExplicitContentInput = z.infer<typeof ClassifyExplicitContentInputSchema>;

const ClassifyExplicitContentOutputSchema = z.object({
  isExplicit: z.boolean().describe('True if the movie content is considered explicit (18+ based on themes, graphic scenes, strong language, sexual content), false otherwise.'),
});
export type ClassifyExplicitContentOutput = z.infer<typeof ClassifyExplicitContentOutputSchema>;

export async function classifyExplicitContent(input: ClassifyExplicitContentInput): Promise<ClassifyExplicitContentOutput> {
  try {
    // console.log(`[classifyExplicitContent - EXPORTED WRAPPER] Invoking flow for title: "${input.title}"`);
    const result = await classifyExplicitContentFlow(input);
    // console.log(`[classifyExplicitContent - EXPORTED WRAPPER] Flow returned for "${input.title}": ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`[classifyExplicitContent - EXPORTED WRAPPER] Unhandled error for input "${input.title}". Message: ${error instanceof Error ? error.message : String(error)}`);
    if (error instanceof Error && error.stack) {
        console.error(`[classifyExplicitContent - EXPORTED WRAPPER] Stack: ${error.stack}`);
    }
    // Fallback to not explicit in case of a high-level error
    return { isExplicit: false };
  }
}

// @ts-ignore - inputSchema and outputSchema are defined, but prompt is bypassed for testing
const prompt = ai.definePrompt({
  name: 'classifyExplicitContentPrompt',
  input: {schema: ClassifyExplicitContentInputSchema},
  output: {schema: ClassifyExplicitContentOutputSchema},
  prompt: `Analyze the movie title and description to determine if its content is explicit (suitable for audiences 18 and over).
Consider themes such as graphic violence, gore, pervasive strong language, and explicit sexual content.

Movie Title: {{{title}}}
Movie Description: {{{description}}}

Based on this information, is the movie explicit?
Respond with true if it is explicit, false otherwise.
`,
  config: {
    safetySettings: [
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  }
});

const classifyExplicitContentFlow = ai.defineFlow(
  {
    name: 'classifyExplicitContentFlow',
    inputSchema: ClassifyExplicitContentInputSchema,
    outputSchema: ClassifyExplicitContentOutputSchema,
  },
  async (input) => {
    console.log(`[classifyExplicitContentFlow - DIAGNOSTIC] Bypassing AI call for "${input.title}". Returning default { isExplicit: false }.`);
    // Temporarily bypass AI call for diagnostic purposes
    return { isExplicit: false };

    // Original logic (commented out for diagnostics):
    /*
    if (!input.title || !input.description) {
        console.warn(`[classifyExplicitContentFlow] Missing title or description for classification. Defaulting to not explicit.`);
        return { isExplicit: false };
    }
    try {
      const {output} = await prompt(input);
      // console.log(`[classifyExplicitContentFlow] AI prompt for "${input.title}" - Raw output:`, JSON.stringify(output));
      
      if (output && typeof output.isExplicit === 'boolean') {
        // console.log(`[classifyExplicitContentFlow] AI prompt for "${input.title}" - Valid output received: isExplicit = ${output.isExplicit}`);
        return output;
      }
      
      console.warn(`[classifyExplicitContentFlow] AI prompt for "${input.title}" returned invalid, malformed, or no output. Raw output: ${JSON.stringify(output)}. Defaulting to not explicit.`);
      return { isExplicit: false };
    } catch (error) {
      console.error(`[classifyExplicitContentFlow] Error during AI prompt call for "${input.title}". Message: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error && error.stack) {
        console.error(`[classifyExplicitContentFlow] Stack: ${error.stack}`);
      }
      // Fallback to not explicit in case of error during the prompt call
      return { isExplicit: false };
    }
    */
  }
);

