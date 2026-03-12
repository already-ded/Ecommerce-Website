'use client';

import Image from 'next/image';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false); // Quản lý trạng thái mở ảnh to

  const goToNextImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPreviousImage = () => {
    setMainImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square rounded-xl border border-[#f2f2f2] bg-gray-100 flex items-center justify-center text-gray-400">
        Không có ảnh
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Ảnh chính */}
      <div 
        className="relative aspect-square rounded-2xl border border-gray-200 overflow-hidden bg-white group cursor-zoom-in"
        onClick={() => setIsOpen(true)} // Mở Lightbox khi nhấn vào ảnh
      >
        <Image
          src={images[mainImageIndex]}
          alt={`${alt} - ${mainImageIndex + 1}`}
          fill
          className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        
        {/* Nút điều hướng ảnh chính (ẩn/hiện khi hover) */}
        {images.length > 1 && (
          <div className="hidden group-hover:block">
            <button
              onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10 transition-all"
            >
              <FaChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg z-10 transition-all"
            >
              <FaChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Danh sách ảnh thumbnail */}
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((imageSrc, index) => (
            <div
              key={index}
              className={`relative w-20 h-20 shrink-0 rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden ${
                index === mainImageIndex 
                  ? 'border-blue-500 scale-95 shadow-inner' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              onClick={() => setMainImageIndex(index)}
            >
              <Image
                src={imageSrc}
                alt={`${alt} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Lightbox (Ảnh to giữa màn hình) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-999 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setIsOpen(false)} // Đóng khi nhấn ra ngoài
        >
          {/* Nút đóng */}
          <button 
            onClick={() => setIsOpen(false)} 
            className="absolute top-6 right-6 text-white/70 hover:text-white p-3 bg-white/10 rounded-full transition-colors z-1001"
          >
            <FaTimes size={28} />
          </button>

          {/* Container ảnh lớn */}
          <div 
            className="relative w-full max-w-4xl h-[80vh]" 
            onClick={(e) => e.stopPropagation()} // Ngăn đóng khi nhấn vào ảnh
          >
            <Image 
              src={images[mainImageIndex]} 
              alt={alt} 
              fill 
              className="object-contain transition-all duration-300" 
            />
          </div>

          {/* Nút điều hướng trong Modal */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-all" 
                onClick={(e) => { e.stopPropagation(); goToPreviousImage(); }}
              >
                <FaChevronLeft size={48} />
              </button>
              <button 
                className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-all" 
                onClick={(e) => { e.stopPropagation(); goToNextImage(); }}
              >
                <FaChevronRight size={48} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}