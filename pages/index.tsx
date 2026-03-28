'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';

interface FoodPair {
  hero: string;
  villain: string;
}

interface DialogueLine {
  speaker: string;
  line: string;
}

interface Script {
  dialogue: DialogueLine[];
  duration: string;
}

interface SEO {
  title: string;
  description: string;
  tags: string[];
  hashtags: string[];
}

interface GeneratedContent {
  pair: FoodPair;
  script: Script;
  imagePrompts: string[];
  videoPrompts: string[];
  seo: SEO;
}

interface GenerationResponse {
  success: boolean;
  data?: GeneratedContent;
  error?: string;
}

export default function Home() {
  const [food, setFood] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const randomFoods = [
    'Avocado Toast', 'Protein Shake', 'Kale Chips', 'Acai Bowl',
    'Green Juice', 'Quinoa Bowl', 'Grilled Salmon', 'Greek Yogurt',
  ];

  const handleRandomize = () => {
    const random = randomFoods[Math.floor(Math.random() * randomFoods.length)];
    setFood(random);
    setResult(null);
    setError('');
  };

  const handleGenerate = async () => {
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ food: food || undefined }),
      });

      const data: GenerationResponse = await response.json();

      if (data.success && data.data) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to generate content');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <Head>
        <title>Tyzn Shorts Content - Viral Food Battle Generator</title>
        <meta name="description" content="Generate viral food battle content" />
      </Head>

      <main className="min-h-screen topography-bg">
        <header className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Tyzn Shorts</h1>
                <p className="text-xs text-muted-foreground">Viral Food Battle Generator</p>
              </div>
            </div>
            <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              {isDark ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </header>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-extrabold mb-4 gradient-text">
              Create Viral Food Battles
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Generate dramatic 12-16 second scripts, cinematic prompts, and SEO-optimized content.
            </p>

            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-lg">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2 text-left">Enter a Food (Optional)</label>
                  <input type="text" value={food} onChange={(e) => setFood(e.target.value)} 
                    placeholder="e.g., Grilled Salmon, Avocado Toast..."
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                </div>
                <div className="flex items-end">
                  <button onClick={handleRandomize} className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border bg-muted text-muted-foreground hover:bg-muted/80 transition-colors font-medium flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Randomize
                  </button>
                </div>
              </div>

              <button onClick={handleGenerate} disabled={isLoading} 
                className="w-full py-4 rounded-lg bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2">
                {isLoading ? (
                  <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg> Generating...</>
                ) : (
                  <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg> Generate Food Battle</>
                )}
              </button>

              {error && <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">{error}</div>}
            </div>
          </div>
        </section>

        {result && (
          <section className="pb-16 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div className="max-w-6xl mx-auto space-y-8">
              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Battle Pair</h3>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mb-2">
                      <span className="text-3xl">🥗</span>
                    </div>
                    <p className="font-bold text-green-600 dark:text-green-400">{result.pair.hero}</p>
                    <p className="text-xs text-muted-foreground">HERO</p>
                  </div>
                  <div className="text-4xl font-black text-muted-foreground">VS</div>
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-2">
                      <span className="text-3xl">🍔</span>
                    </div>
                    <p className="font-bold text-red-600 dark:text-red-400">{result.pair.villain}</p>
                    <p className="text-xs text-muted-foreground">VILLAIN</p>
                  </div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">Script ({result.script.duration})</h3>
                  <button onClick={() => copyToClipboard(result.script.dialogue.map(d => d.speaker + ': ' + d.line).join('\n'))} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">Copy</button>
                </div>
                <div className="space-y-3">
                  {result.script.dialogue.map((line, i) => (
                    <div key={i} className={`p-4 rounded-lg ${line.speaker === result.pair.hero ? 'bg-green-500/10 border-l-4 border-green-500' : 'bg-red-500/10 border-l-4 border-red-500'}`}>
                      <p className="font-semibold text-sm mb-1">{line.speaker === result.pair.hero ? '🥗' : '🍔'} {line.speaker}</p>
                      <p className="text-foreground">{line.line}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">Image Prompts</h3>
                  <button onClick={() => copyToClipboard(result.imagePrompts.join('\n\n'))} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">Copy All</button>
                </div>
                <div className="space-y-3">
                  {result.imagePrompts.map((prompt, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-2">Prompt {i + 1}</p>
                      <p className="text-sm text-foreground">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">Video Prompts</h3>
                  <button onClick={() => copyToClipboard(result.videoPrompts.join('\n\n'))} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">Copy All</button>
                </div>
                <div className="space-y-3">
                  {result.videoPrompts.map((prompt, i) => (
                    <div key={i} className="p-4 rounded-lg bg-muted">
                      <p className="text-xs text-muted-foreground mb-2">Scene {i + 1}</p>
                      <p className="text-sm text-foreground">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">SEO Optimization</h3>
                  <button onClick={() => copyToClipboard(`Title: ${result.seo.title}\n\nDescription: ${result.seo.description}\n\nTags: ${result.seo.tags.join(', ')}\n\nHashtags: ${result.seo.hashtags.join(' ')}`)} 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors">Copy All</button>
                </div>
                <div className="space-y-4">
                  <div><p className="text-xs text-muted-foreground mb-1">Title</p><p className="font-medium">{result.seo.title}</p></div>
                  <div><p className="text-xs text-muted-foreground mb-1">Description</p><p className="text-sm text-foreground">{result.seo.description}</p></div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {result.seo.tags.map((tag, i) => <span key={i} className="px-3 py-1 rounded-full bg-muted text-xs">{tag}</span>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Hashtags</p>
                    <div className="flex flex-wrap gap-2">
                      {result.seo.hashtags.map((tag, i) => <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{tag}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="border-t border-border py-8 px-4">
          <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
            <p>© 2024 Tyzn Shorts Content. All rights reserved.</p>
          </div>
        </footer>

        <div className="watermark">Tyzn Shorts Content</div>
      </main>
    </>
  );
}
