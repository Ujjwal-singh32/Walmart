"use client";

import React, { useRef, useEffect } from 'react';

function ProductSlider({ children }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8; 
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    let interval;
    const startAutoPlay = () => {
      interval = setInterval(() => {
        if (scrollRef.current) {
          const { scrollWidth, clientWidth, scrollLeft } = scrollRef.current;
          const totalChildrenWidth = scrollWidth / 2; // Assuming children are duplicated once

          if (scrollLeft >= totalChildrenWidth - clientWidth) {
            // If we are at the end of the first set of children, jump to the start of the second set
            scrollRef.current.scrollTo({ left: 0, behavior: 'instant' });
          } else {
            scroll('right');
          }
        }
      }, 5000); // Change slide every 5 seconds
    };

    const stopAutoPlay = () => {
      if (interval) clearInterval(interval);
    };

    startAutoPlay();

    const sliderElement = scrollRef.current;
    if (sliderElement) {
      sliderElement.addEventListener('mouseenter', stopAutoPlay);
      sliderElement.addEventListener('mouseleave', startAutoPlay);
    }

    return () => {
      stopAutoPlay();
      if (sliderElement) {
        sliderElement.removeEventListener('mouseenter', stopAutoPlay);
        sliderElement.removeEventListener('mouseleave', startAutoPlay);
      }
    };
  }, [children]); 

  const duplicatedChildren = React.Children.map(children, (child, index) => 
    React.cloneElement(child, { key: `original-${index}`})
  ).concat(
    React.Children.map(children, (child, index) => 
      React.cloneElement(child, { key: `duplicate-${index}`})
    )
  );

  return (
    <div className="relative group">
      <div 
        ref={scrollRef}
        className="flex overflow-x-scroll scrollbar-hide space-x-4 p-4 -ml-4 -mr-4"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        {duplicatedChildren.map((child) => (
          <div key={child.key} style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductSlider; 