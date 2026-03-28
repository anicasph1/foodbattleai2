import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.AICC_API_KEY,
  baseURL: "https://api.ai.cc/v1", // ✅ FIXED
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

    const prompt = `Create a viral food battle short.

Hero: ${hero}
Villain: ${villain}

Make it dramatic, aggressive, and entertaining.

Return EXACTLY in this JSON format:

{
  "script": "short aggressive dialogue (12-16 seconds)",
  "hook": "viral hook",
  "imagePrompt": "cinematic food shot",
  "videoPrompt": "cinematic video scene",
  "title": "viral title",
  "description": "short seo description",
  "hashtags": ["#food", "#viral", "#shorts"]
}

IMPORTANT:
- Return ONLY JSON
- No extra text
`;

    const completion = await openai.chat.completions.create({
      model: 'model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You create viral short-form content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.9,
    });

    const text = completion.choices[0].message.content || "";

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      // fallback kung hindi JSON
      parsed = {
        script: text,
        hook: text,
        imagePrompt: text,
        videoPrompt: text,
        title: "Viral Food Battle",
        description: text,
        hashtags: ["#viral", "#food"],
      };
    }

    return res.status(200).json({
      success: true,
      data: {
        pair: { hero, villain },
        ...parsed,
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
