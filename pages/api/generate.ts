import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AICC_API_KEY,
  baseURL: "https://api.aic.cc/v1",
});
const foodPairs = [
  { hero: 'Quinoa Salad', villain: 'Fast Food Burger' },
  { hero: 'Grilled Salmon', villain: 'Frozen Fish Sticks' },
  { hero: 'Fresh Avocado', villain: 'Processed Cheese Dip' },
  { hero: 'Organic Kale', villain: 'Potato Chips' },
  { hero: 'Greek Yogurt', villain: 'Sugary Pudding' },
  { hero: 'Almonds', villain: 'Candy Bar' },
  { hero: 'Sweet Potato', villain: 'French Fries' },
  { hero: 'Green Smoothie', villain: 'Soda' },
  { hero: 'Grilled Chicken', villain: 'Chicken Nuggets' },
  { hero: 'Oatmeal', villain: 'Sugary Cereal' },
  { hero: 'Hummus', villain: 'Processed Ranch Dip' },
  { hero: 'Fresh Berries', villain: 'Fruit Roll-Ups' },
  { hero: 'Dark Chocolate', villain: 'Milk Chocolate Bar' },
  { hero: 'Sparkling Water', villain: 'Energy Drink' },
  { hero: 'Whole Grain Bread', villain: 'White Bread' },
  { hero: 'Edamame', villain: 'Processed Snack Mix' },
  { hero: 'Chia Pudding', villain: 'Instant Pudding' },
  { hero: 'Roasted Vegetables', villain: 'Canned Vegetables' },
  { hero: 'Fresh Sushi', villain: 'Frozen Burrito' },
  { hero: 'Homemade Soup', villain: 'Canned Soup' },
  { hero: 'Steel Cut Oats', villain: 'Instant Oatmeal' },
  { hero: 'Grass-fed Steak', villain: 'Processed Deli Meat' },
  { hero: 'Fresh Mango', villain: 'Canned Fruit Cocktail' },
  { hero: 'Raw Honey', villain: 'High Fructose Corn Syrup' },
  { hero: 'Coconut Water', villain: 'Sports Drink' },
  { hero: 'Turmeric Latte', villain: 'Flavored Coffee Creamer' },
  { hero: 'Fermented Kimchi', villain: 'Pickled Processed Vegetables' },
  { hero: 'Wild Rice', villain: 'Instant Rice' },
  { hero: 'Fresh Herbs', villain: 'Dried Seasoning Packet' },
  { hero: 'Cold Pressed Juice', villain: 'Fruit Punch' },
];

let usedPairs: Set<string> = new Set();

function getUniqueFoodPair(userFood?: string): { hero: string; villain: string } {
  if (userFood) {
    const userFoodLower = userFood.toLowerCase();
    const healthyIndicators = ['salad', 'grilled', 'fresh', 'organic', 'steamed', 'raw', 'green', 'fruit', 'vegetable', 'fish', 'chicken breast', 'quinoa', 'kale', 'spinach', 'avocado'];
    const isUserFoodHealthy = healthyIndicators.some(indicator => userFoodLower.includes(indicator));

    if (isUserFoodHealthy) {
      const villains = foodPairs.map(p => p.villain);
      const randomVillain = villains[Math.floor(Math.random() * villains.length)];
      return { hero: userFood, villain: randomVillain };
    } else {
      const heroes = foodPairs.map(p => p.hero);
      const randomHero = heroes[Math.floor(Math.random() * heroes.length)];
      return { hero: randomHero, villain: userFood };
    }
  }

  const availablePairs = foodPairs.filter(pair => !usedPairs.has(pair.hero));

  if (availablePairs.length === 0) {
    usedPairs.clear();
    const randomPair = foodPairs[Math.floor(Math.random() * foodPairs.length)];
    usedPairs.add(randomPair.hero);
    return randomPair;
  }

  const selectedPair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
  usedPairs.add(selectedPair.hero);
  return selectedPair;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { food } = req.body;
    const { hero, villain } = getUniqueFoodPair(food);

    const prompt = `Create viral "food battle" content for a short video (12-16 seconds) featuring ${hero} (hero) vs ${villain} (villain).

Generate the following in JSON format:
{
  "script": {
    "dialogue": [
      {"speaker": "${hero}", "line": "..."},
      {"speaker": "${villain}", "line": "..."}
    ],
    "duration": "..."
  },
  "imagePrompts": [
    "Cinematic shot of ${hero} with warm golden lighting, detailed textures, macro photography style...",
    "Dramatic shot of ${villain} with moody lighting, showing processed texture...",
    "Epic battle scene confrontation between ${hero} and ${villain}, cinematic composition..."
  ],
  "videoPrompts": [
    "Continuous action shot: ${hero} enters frame confidently, camera tracks movement, warm lighting, 4k cinematic...",
    "Single scene continuous: ${villain} reacts with fear, dramatic lighting, no split screen...",
    "Dynamic continuous shot: ${hero} defeats ${villain}, particles and energy effects, same scene throughout..."
  ],
  "seo": {
    "title": "...",
    "description": "...",
    "tags": ["...", "...", "..."],
    "hashtags": ["#...", "#...", "#..."]
  }
}

Requirements:
- Script: 12-16 seconds total, aggressive confident hero lines vs weak pathetic villain lines, extended dramatic dialogue
- Image prompts: cinematic, warm lighting, detailed textures, professional food photography style
- Video prompts: same scene throughout, no split screen, continuous action, dynamic camera movement
- SEO: optimized for TikTok/YouTube Shorts/Instagram Reels`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a viral content creator specializing in dramatic food battle videos. Create engaging, dramatic content with aggressive heroes and weak villains. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    });

    const generatedContent = JSON.parse(completion.choices[0].message.content || '{}');

    return res.status(200).json({
      success: true,
      data: {
        pair: { hero, villain },
        ...generatedContent,
      },
    });
  } catch (error) {
    console.error('Generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate content. Please try again.',
    });
  }
}
