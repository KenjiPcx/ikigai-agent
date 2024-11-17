import { tool } from 'ai/rsc';
import { z } from 'zod';

export const ikigaiTool = tool('updateIkigai', {
  description: 'Update the Ikigai diagram with new information',
  parameters: z.object({
    whatYouLove: z.array(z.string()),
    whatYouAreGoodAt: z.array(z.string()),
    whatTheWorldNeeds: z.array(z.string()),
    whatYouCanBePaidFor: z.array(z.string()),
    completed: z.boolean().optional(),
  }),
  render: ({ whatYouLove, whatYouAreGoodAt, whatTheWorldNeeds, whatYouCanBePaidFor, completed }) => {
    return (
      <IkigaiChart 
        data={{ 
          whatYouLove, 
          whatYouAreGoodAt, 
          whatTheWorldNeeds, 
          whatYouCanBePaidFor 
        }}
        isTransitioning={completed}
      />
    );
  },
}); 