import type { Plugin } from 'unified';
import type { Root } from 'hast';
import { visit } from 'unist-util-visit';

/**
 * Rehype plugin to wrap images in figure elements with figcaption showing alt text
 */
export const rehypeImageCaptions: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'img' && node.properties && parent && typeof index === 'number') {
        const alt = node.properties.alt;
        
        // Only wrap if there's alt text
        if (alt && typeof alt === 'string' && alt.trim() !== '') {
          // Create figure element
          const figure = {
            type: 'element',
            tagName: 'figure',
            properties: {
              class: 'blog-image-figure',
            },
            children: [
              // Keep the original image
              node,
              // Add figcaption with alt text
              {
                type: 'element',
                tagName: 'figcaption',
                properties: {
                  class: 'blog-image-caption',
                },
                children: [
                  {
                    type: 'text',
                    value: alt,
                  },
                ],
              },
            ],
          };

          // Replace the image with the figure
          if (Array.isArray(parent.children)) {
            parent.children[index] = figure;
          }
        }
      }
    });
  };
};
