import { useState } from 'react';

interface ImageGalleryProps {
  images: string[];
}

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Large Image */}
      <div className="h-64 md:h-96 w-full rounded-xl overflow-hidden bg-gray-100">
        <img src={mainImage} alt="Property main view" className="w-full h-full object-cover" />
      </div>
      
      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setMainImage(img)}
            className={`h-20 w-24 shrink-0 rounded-lg overflow-hidden border-2 transition-colors duration-200 cursor-pointer ${
              mainImage === img ? 'border-primary' : 'border-transparent'
            }`}
          >
            <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}