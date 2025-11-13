import React, { useState, useCallback } from 'react';
import { ModificationOptions } from './types';
import { TIME_OF_DAY_OPTIONS, SEASON_OPTIONS, TOURIST_OPTIONS, FORMAT_OPTIONS, PERSPECTIVE_OPTIONS } from './constants';
import OptionSelector from './components/OptionSelector';
import ImageDisplay from './components/ImageDisplay';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [originalImageFile, setOriginalImageFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [variations, setVariations] = useState<string[]>([]);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState<boolean>(false);
  const [variationError, setVariationError] = useState<string | null>(null);

  const [options, setOptions] = useState<ModificationOptions>({
    timeOfDay: TIME_OF_DAY_OPTIONS[0].value,
    season: SEASON_OPTIONS[0].value,
    tourists: TOURIST_OPTIONS[0].value,
    format: FORMAT_OPTIONS[0].value,
    perspective: PERSPECTIVE_OPTIONS[0].value,
    removeText: false,
    customPrompt: '',
  });
  
  const [filenameKeyword, setFilenameKeyword] = useState<string>('');

  const handleOptionChange = useCallback(<K extends keyof ModificationOptions>(key: K, value: ModificationOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setOriginalImageFile(file);
      setOriginalImageUrl(URL.createObjectURL(file));
      setGeneratedImage(null);
      setError(null);
      setVariations([]);
      setVariationError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!originalImageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setVariations([]);
    setVariationError(null);

    try {
      const result = await generateImage(originalImageFile, options);
      setGeneratedImage(result);
    } catch (err) {
      setError(err as string);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateVariations = async () => {
    if (!originalImageFile || !generatedImage) return;

    setIsGeneratingVariations(true);
    setVariationError(null);
    setVariations([]);

    try {
      // Get available options for variations, excluding the current selection and defaults
      const otherPerspectives = PERSPECTIVE_OPTIONS
        .map(p => p.value)
        .filter(p => p !== options.perspective && p !== 'keep the original perspective');
        
      const otherTimesOfDay = TIME_OF_DAY_OPTIONS
        .map(t => t.value)
        .filter(t => t !== options.timeOfDay);
        
      const otherSeasons = SEASON_OPTIONS
        .map(s => s.value)
        .filter(s => s !== options.season);

      // Shuffle for randomness
      const shuffledPerspectives = otherPerspectives.sort(() => 0.5 - Math.random());
      const shuffledTimes = otherTimesOfDay.sort(() => 0.5 - Math.random());
      const shuffledSeasons = otherSeasons.sort(() => 0.5 - Math.random());
      
      // Define what to change for each variation
      const variationBlueprints = [
        { // Variation 1: Different perspective
          perspective: shuffledPerspectives[0 % shuffledPerspectives.length],
          promptHint: 'A different artistic style and perspective.'
        },
        { // Variation 2: Different perspective and time of day
          perspective: shuffledPerspectives[1 % shuffledPerspectives.length],
          timeOfDay: shuffledTimes[0 % shuffledTimes.length],
          promptHint: 'A different time of day and perspective.'
        },
        { // Variation 3: Different perspective and season
          perspective: shuffledPerspectives[2 % shuffledPerspectives.length],
          season: shuffledSeasons[0 % shuffledSeasons.length],
          promptHint: 'A different season and perspective.'
        }
      ].filter(bp => bp.perspective); // Ensure we have a perspective to use

      const promises = variationBlueprints.map((blueprint) => {
        const { promptHint, ...variationSpecificOptions } = blueprint;

        const finalOptions: ModificationOptions = {
            ...options,
            ...variationSpecificOptions,
            customPrompt: `${options.customPrompt} ${promptHint}`.trim(),
        };
        
        return generateImage(originalImageFile, finalOptions);
      });

      const results = await Promise.all(promises);
      setVariations(results);
    } catch (err) {
      setVariationError(err as string);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
           <div className="flex items-center space-x-3">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
             </svg>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">AI Photo Scene Changer</h1>
          </div>
          <p className="mt-1 text-sm text-gray-600">Transform your blog photos into stunning new advertisement assets.</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Control Panel */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-8 bg-white p-6 rounded-2xl shadow-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="file-upload" className="block text-lg font-semibold text-gray-700 mb-3">
                    1. Upload Photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>

                <OptionSelector label="2. Time of Day" name="timeOfDay" options={TIME_OF_DAY_OPTIONS} selectedValue={options.timeOfDay} onChange={(v) => handleOptionChange('timeOfDay', v)} />
                <OptionSelector label="3. Season" name="season" options={SEASON_OPTIONS} selectedValue={options.season} onChange={(v) => handleOptionChange('season', v)} />
                <OptionSelector label="4. Tourists" name="tourists" options={TOURIST_OPTIONS} selectedValue={options.tourists} onChange={(v) => handleOptionChange('tourists', v)} />
                <OptionSelector label="5. Format" name="format" options={FORMAT_OPTIONS} selectedValue={options.format} onChange={(v) => handleOptionChange('format', v)} />
                <OptionSelector label="6. Perspective" name="perspective" options={PERSPECTIVE_OPTIONS} selectedValue={options.perspective} onChange={(v) => handleOptionChange('perspective', v)} />
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">7. Cleanup</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="flex-grow flex flex-col" id="remove-text-label" onClick={() => handleOptionChange('removeText', !options.removeText)} style={{ cursor: 'pointer' }}>
                        <span className="text-sm font-medium text-gray-900">Remove Text & Watermarks</span>
                        <span id="remove-text-description" className="text-sm text-gray-500">Removes logos, numbers, and text.</span>
                      </span>
                      <button
                        type="button"
                        className={`${
                          options.removeText ? 'bg-indigo-600' : 'bg-gray-200'
                        } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                        role="switch"
                        aria-checked={options.removeText}
                        aria-labelledby="remove-text-label"
                        onClick={() => handleOptionChange('removeText', !options.removeText)}
                      >
                        <span
                          aria-hidden="true"
                          className={`${
                            options.removeText ? 'translate-x-5' : 'translate-x-0'
                          } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="custom-prompt" className="block text-lg font-semibold text-gray-700 mb-2">8. Extra Details</label>
                  <textarea
                    id="custom-prompt"
                    name="custom-prompt"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="e.g., add a classic red car, make it look cinematic..."
                    value={options.customPrompt}
                    onChange={(e) => handleOptionChange('customPrompt', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="filename-keyword" className="block text-lg font-semibold text-gray-700 mb-2">9. Filename Keyword <span className="text-sm font-normal text-gray-500">(Optional)</span></label>
                  <input
                    type="text"
                    id="filename-keyword"
                    name="filename-keyword"
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="e.g., travel-blog-header"
                    value={filenameKeyword}
                    onChange={(e) => setFilenameKeyword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !originalImageFile}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : 'Generate Image'}
                </button>
              </form>
            </div>
          </aside>

          {/* Image Display Area */}
          <div className="mt-8 lg:mt-0 lg:col-span-8 xl:col-span-9">
            <ImageDisplay 
              originalImage={originalImageUrl} 
              generatedImage={generatedImage} 
              isLoading={isLoading} 
              error={error}
              variations={variations}
              isGeneratingVariations={isGeneratingVariations}
              variationError={variationError}
              onGenerateVariations={handleGenerateVariations}
              filenameKeyword={filenameKeyword}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;