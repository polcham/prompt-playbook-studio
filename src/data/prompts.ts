
export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  tool: 'chatgpt' | 'midjourney' | 'claude' | 'dall-e' | 'other';
  category: string;
  tags: string[];
  authorName: string;
  createdAt: string;
  likes: number;
  featured?: boolean;
  trending?: boolean;
}

export const promptCategories = [
  { id: 'all', name: 'All Prompts' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'writing', name: 'Writing' },
  { id: 'design', name: 'Design' },
  { id: 'coding', name: 'Coding' },
  { id: 'productivity', name: 'Productivity' },
  { id: 'business', name: 'Business' },
];

export const promptTools = [
  { id: 'all', name: 'All Tools' },
  { id: 'chatgpt', name: 'ChatGPT' },
  { id: 'midjourney', name: 'Midjourney' },
  { id: 'claude', name: 'Claude' },
  { id: 'dall-e', name: 'DALL-E' },
  { id: 'other', name: 'Other Tools' },
];

export const samplePrompts: Prompt[] = [
  {
    id: 'blog-outline-generator',
    title: 'Blog Outline Generator',
    description: 'Create a detailed outline for any blog post topic',
    content: `I want you to create a detailed blog post outline on the topic: "[TOPIC]". Include an introduction, at least 5 main sections with 3-4 subsections each, and a conclusion. For each section, provide a brief description of what should be covered. Consider SEO best practices, reader engagement, and make it comprehensive enough for a 1500-2000 word article.`,
    tool: 'chatgpt',
    category: 'writing',
    tags: ['blogging', 'content creation', 'SEO'],
    authorName: 'Content Creator',
    createdAt: '2023-04-15',
    likes: 345,
    featured: true,
    trending: true
  },
  {
    id: 'product-description',
    title: 'E-commerce Product Description',
    description: 'Generate compelling product descriptions for online stores',
    content: `Create a compelling product description for [PRODUCT NAME], which is a [BRIEF DESCRIPTION]. The target audience is [TARGET AUDIENCE]. The key features include: [FEATURE 1], [FEATURE 2], [FEATURE 3]. The key benefits are: [BENEFIT 1], [BENEFIT 2]. The price point is [PRICE RANGE]. The tone should be [TONE, e.g., professional, friendly, luxury]. Include a catchy headline and a call-to-action at the end.`,
    tool: 'chatgpt',
    category: 'marketing',
    tags: ['e-commerce', 'copywriting', 'sales'],
    authorName: 'Marketing Pro',
    createdAt: '2023-05-10',
    likes: 289,
    featured: true
  },
  {
    id: 'fantasy-landscape',
    title: 'Fantasy Landscape Generator',
    description: 'Create stunning fantasy landscapes with detailed prompts',
    content: `A breathtaking fantasy landscape with [LANDSCAPE FEATURE], featuring [MAGICAL ELEMENT] and [CREATURES/CHARACTERS]. The scene is illuminated by [LIGHT SOURCE], creating a [MOOD/ATMOSPHERE] atmosphere. The color palette includes [COLORS]. Style: highly detailed digital art, 8k resolution, concept art by [ARTIST INSPIRATION].`,
    tool: 'midjourney',
    category: 'design',
    tags: ['fantasy', 'landscapes', 'digital art'],
    authorName: 'Digital Artist',
    createdAt: '2023-06-05',
    likes: 521,
    trending: true
  },
  {
    id: 'code-refactoring',
    title: 'Code Refactoring Assistant',
    description: 'Get help refactoring complex code into cleaner solutions',
    content: `I have the following code in [LANGUAGE]:
\`\`\`
[PASTE YOUR CODE HERE]
\`\`\`

Please refactor this code to make it more:
1. Readable
2. Maintainable
3. Efficient

Focus on applying these principles:
- DRY (Don't Repeat Yourself)
- Single Responsibility Principle
- Appropriate naming conventions
- Error handling
- Performance optimization

Provide comments explaining the major changes and why they improve the code.`,
    tool: 'chatgpt',
    category: 'coding',
    tags: ['programming', 'refactoring', 'clean code'],
    authorName: 'Dev Expert',
    createdAt: '2023-03-22',
    likes: 412,
    trending: true
  },
  {
    id: 'marketing-campaign',
    title: 'Marketing Campaign Planner',
    description: 'Develop a comprehensive marketing campaign strategy',
    content: `Help me create a comprehensive marketing campaign for [PRODUCT/SERVICE], targeting [TARGET AUDIENCE]. The campaign objective is to [OBJECTIVE, e.g., increase sales, build brand awareness]. 

Please include:
1. Campaign concept and creative direction
2. Key messaging and taglines
3. Marketing channels to utilize (with specific tactics for each)
4. Timeline with key milestones
5. KPIs and measurement approach
6. Estimated budget allocation by channel
7. Potential challenges and mitigation strategies

Our brand voice is [BRAND VOICE], and we want to emphasize these unique selling points: [USP1], [USP2].`,
    tool: 'claude',
    category: 'marketing',
    tags: ['campaign planning', 'strategy', 'integrated marketing'],
    authorName: 'Campaign Strategist',
    createdAt: '2023-07-12',
    likes: 278,
    featured: true
  },
  {
    id: 'character-portrait',
    title: 'Character Portrait Creator',
    description: 'Generate detailed character portraits for games, stories or RPGs',
    content: `Create a detailed portrait of [CHARACTER TYPE] with [PHYSICAL ATTRIBUTES]. Their expression shows [EMOTION], and they are wearing [CLOTHING/ARMOR]. The character has [DISTINCTIVE FEATURES] and is posed [POSE DESCRIPTION]. The background suggests [ENVIRONMENT/CONTEXT]. Lighting is [LIGHTING DESCRIPTION]. Style: [ART STYLE], 8k, highly detailed.`,
    tool: 'dall-e',
    category: 'design',
    tags: ['characters', 'portraits', 'illustration'],
    authorName: 'Character Designer',
    createdAt: '2023-05-30',
    likes: 367
  },
  {
    id: 'business-pitch',
    title: 'Business Pitch Generator',
    description: 'Create compelling startup or business pitches',
    content: `Create a compelling [LENGTH: 2-3 minute] pitch for [BUSINESS/STARTUP NAME], which is a [BRIEF DESCRIPTION]. 

The pitch should include:

1. A hook that grabs attention in the first 15 seconds
2. Clear explanation of the problem we're solving
3. Our innovative solution and its unique value proposition
4. Target market and market size
5. Business model and how we make money
6. Competitive advantages and barriers to entry
7. Current traction or milestones achieved
8. Team highlights (briefly mention key expertise)
9. Ask - what we're looking for (investment amount, partnerships, etc.)
10. Vision for the future

Our primary competitors are [COMPETITOR 1] and [COMPETITOR 2]. Our key differentiator is [DIFFERENTIATOR]. The tone should be confident, clear, and compelling.`,
    tool: 'chatgpt',
    category: 'business',
    tags: ['startup', 'pitch', 'entrepreneurship'],
    authorName: 'Startup Founder',
    createdAt: '2023-04-18',
    likes: 298
  },
  {
    id: 'weekly-planner',
    title: 'Weekly Productivity Planner',
    description: 'Generate a structured weekly plan based on your goals and tasks',
    content: `Create a detailed weekly productivity plan for me based on these inputs:

Main goals for this week:
1. [GOAL 1]
2. [GOAL 2]
3. [GOAL 3]

Tasks that need to be completed:
- [TASK 1] (Estimated time: [TIME], Priority: [High/Medium/Low])
- [TASK 2] (Estimated time: [TIME], Priority: [High/Medium/Low])
- [TASK 3] (Estimated time: [TIME], Priority: [High/Medium/Low])
- [Add more tasks as needed]

My typical available hours:
- Monday: [TIME RANGE]
- Tuesday: [TIME RANGE]
- Wednesday: [TIME RANGE]
- Thursday: [TIME RANGE]
- Friday: [TIME RANGE]
- Weekend availability: [SPECIFY]

Energy patterns (when I'm most focused/creative): [SPECIFY]

Please create a structured day-by-day plan that optimizes my productivity based on these inputs, includes buffer time, breaks, and groups similar tasks. Add recommendations for staying focused and tracking progress.`,
    tool: 'claude',
    category: 'productivity',
    tags: ['planning', 'time management', 'organization'],
    authorName: 'Productivity Coach',
    createdAt: '2023-06-22',
    likes: 245,
    trending: true
  }
];

export const getPromptById = (id: string): Prompt | undefined => {
  return samplePrompts.find(prompt => prompt.id === id);
};

export const getPromptsByCategory = (category: string): Prompt[] => {
  if (category === 'all') return samplePrompts;
  return samplePrompts.filter(prompt => prompt.category === category);
};

export const getPromptsByTool = (tool: string): Prompt[] => {
  if (tool === 'all') return samplePrompts;
  return samplePrompts.filter(prompt => prompt.tool === tool);
};

export const getFeaturedPrompts = (): Prompt[] => {
  return samplePrompts.filter(prompt => prompt.featured);
};

export const getTrendingPrompts = (): Prompt[] => {
  return samplePrompts.filter(prompt => prompt.trending);
};
