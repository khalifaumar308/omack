import { useEffect } from 'react';

interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonical?: string;
  author?: string;
  robots?: string;
  language?: string;
  viewport?: string;
}

/**
 * SEO Hook - Manages all meta tags for search engine optimization
 * Supports Open Graph, Twitter Cards, Canonical URLs, and more
 */
export const useSEO = (metadata: SEOMetadata) => {
  useEffect(() => {
    // Set page title
    document.title = metadata.title;

    // Helper function to set or create meta tag
    const setMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Meta description
    setMetaTag('description', metadata.description);

    // Keywords (if provided)
    if (metadata.keywords) {
      setMetaTag('keywords', metadata.keywords);
    }

    // Author
    if (metadata.author) {
      setMetaTag('author', metadata.author);
    }

    // Robots directive
    if (metadata.robots) {
      setMetaTag('robots', metadata.robots);
    }

    // Open Graph tags
    setMetaTag('og:title', metadata.ogTitle || metadata.title, true);
    setMetaTag('og:description', metadata.ogDescription || metadata.description, true);
    if (metadata.ogImage) {
      setMetaTag('og:image', metadata.ogImage, true);
    }
    if (metadata.ogUrl) {
      setMetaTag('og:url', metadata.ogUrl, true);
    }
    setMetaTag('og:type', 'website', true);

    // Twitter Card tags
    setMetaTag('twitter:card', metadata.twitterCard || 'summary_large_image');
    setMetaTag('twitter:title', metadata.twitterTitle || metadata.title);
    setMetaTag('twitter:description', metadata.twitterDescription || metadata.description);
    if (metadata.twitterImage) {
      setMetaTag('twitter:image', metadata.twitterImage);
    }

    // Canonical URL
    if (metadata.canonical) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', metadata.canonical);
    }

    // Language
    if (metadata.language) {
      document.documentElement.lang = metadata.language;
    }

    return () => {
      // Cleanup is optional - meta tags persist which is usually desired
    };
  }, [metadata]);
};

export default useSEO;
