import React from 'react';

interface ImageDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  variations: string[];
  isGeneratingVariations: boolean;
  variationError: string | null;
  onGenerateVariations: () => void;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full">
    <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="mt-4 text-gray-600 font-semibold">Generating your new masterpiece...</p>
    <p className="mt-2 text-sm text-gray-500">This might take a moment.</p>
  </div>
);

const ImageCard: React.FC<{ src: string; title: string; }> = ({ src, title }) => (
  <div className="w-full">
    <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
    <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
      <img src={src} alt={title} className="w-full h-full object-contain" />
    </div>
  </div>
);

const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  originalImage, 
  generatedImage, 
  isLoading, 
  error,
  variations,
  isGeneratingVariations,
  variationError,
  onGenerateVariations
}) => {
  const handleSave = (imageUrl: string | null) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `generated-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {originalImage && <ImageCard src={originalImage} title="Original Photo" />}
      
      <div className="w-full">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Generated Photo</h3>
        <div className="aspect-w-1 aspect-h-1 w-full bg-white rounded-xl shadow-lg flex items-center justify-center p-4 min-h-[300px] md:min-h-0">
          {isLoading && <LoadingSpinner />}
          {error && !isLoading && (
            <div className="text-center text-red-600 bg-red-100 border border-red-400 p-4 rounded-lg">
              <h4 className="font-bold">An error occurred</h4>
              <p>{error}</p>
            </div>
          )}
          {generatedImage && !isLoading && (
            <img src={generatedImage} alt="Generated" className="w-full h-full object-contain" />
          )}
          {!generatedImage && !isLoading && !error && (
             <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Your generated image will appear here</h3>
                <p className="mt-1 text-sm text-gray-500">Adjust the settings and click "Generate".</p>
              </div>
          )}
        </div>
        {generatedImage && !isLoading && (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handleSave(generatedImage)}
              className="inline-flex items-center justify-center py-2 px-6 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              aria-label="Save generated photo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span>Save Photo</span>
            </button>
             <button
              onClick={onGenerateVariations}
              disabled={isGeneratingVariations}
              className="inline-flex items-center justify-center py-2 px-6 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              aria-label="Generate variations of the photo"
            >
              {isGeneratingVariations ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a1 1 0 011-1h14a1 1 0 110 2H3a1 1 0 01-1-1z" />
                  </svg>
                  <span>Generate Variations</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {(isGeneratingVariations || variationError || variations.length > 0) && (
            <div className="mt-10">
                <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">Variations</h4>
                {isGeneratingVariations && (
                    <div className="flex justify-center items-center p-4">
                        <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="ml-3 text-gray-600">Generating variations...</p>
                    </div>
                )}
                {variationError && !isGeneratingVariations && (
                     <div className="text-center text-red-600 bg-red-100 border border-red-400 p-4 rounded-lg">
                        <h4 className="font-bold">Error generating variations</h4>
                        <p>{variationError}</p>
                    </div>
                )}
                {!isGeneratingVariations && variations.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {variations.map((variationSrc, index) => (
                            <div key={index}>
                                <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden shadow-md">
                                    <img src={variationSrc} alt={`Variation ${index + 1}`} className="w-full h-full object-contain" />
                                </div>
                                <div className="mt-3 text-center">
                                    <button
                                        onClick={() => handleSave(variationSrc)}
                                        className="inline-flex items-center py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Save Variation {index + 1}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageDisplay;