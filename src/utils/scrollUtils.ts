export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

export const scrollToElement = (elementId: string, offset = 0) => {
  requestAnimationFrame(() => {
    const element = document.getElementById(elementId);
    if (element) {
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
};

export const createScrollListener = (callback: (scrollY: number) => void, delay = 100) => {
  let ticking = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  return () => {
    if (!ticking) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          callback(window.scrollY);
          ticking = false;
        });
      }, delay);
      ticking = true;
    }
  };
};
