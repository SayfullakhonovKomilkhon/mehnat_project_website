'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Images, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface ArticleImage {
  id: number;
  url: string;
  original_name: string;
  order: number;
}

interface ArticleImagesProps {
  images: ArticleImage[];
  locale: string;
}

const translations = {
  uz: {
    title: 'Rasmlar',
    close: 'Yopish',
    previous: 'Oldingi',
    next: 'Keyingi',
    of: '/',
    viewFull: "To'liq ko'rish",
  },
  ru: {
    title: 'Изображения',
    close: 'Закрыть',
    previous: 'Предыдущее',
    next: 'Следующее',
    of: '/',
    viewFull: 'Смотреть полностью',
  },
  en: {
    title: 'Images',
    close: 'Close',
    previous: 'Previous',
    next: 'Next',
    of: '/',
    viewFull: 'View full size',
  },
};

export function ArticleImages({ images, locale }: ArticleImagesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const t = translations[locale as keyof typeof translations] || translations.uz;

  if (!images || images.length === 0) {
    return null;
  }

  const openModal = (index: number) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        {/* Section Header */}
        <div className="flex items-center gap-3 rounded-t-xl bg-primary-800 p-4 text-white">
          <Images className="h-5 w-5" />
          <h2 className="font-heading text-lg font-semibold">{t.title}</h2>
          <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-sm">
            {images.length}
          </span>
        </div>

        {/* Images Grid */}
        <div className="rounded-b-xl border border-t-0 border-gov-border bg-gov-surface p-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image, index) => (
              <motion.button
                key={image.id}
                onClick={() => openModal(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                <Image
                  src={image.url}
                  alt={image.original_name || `Image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                  <ZoomIn className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                aria-label={t.close}
              >
                <X className="h-6 w-6" />
              </button>

              {/* Navigation - Previous */}
              {images.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  aria-label={t.previous}
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}

              {/* Image */}
              <div className="relative h-[80vh] w-full max-w-5xl">
                <Image
                  src={images[currentIndex].url}
                  alt={images[currentIndex].original_name || `Image ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </div>

              {/* Navigation - Next */}
              {images.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  aria-label={t.next}
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}

              {/* Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                {currentIndex + 1} {t.of} {images.length}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ArticleImages;
