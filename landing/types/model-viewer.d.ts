declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      alt?: string;
      'auto-rotate'?: boolean;
      'camera-controls'?: boolean;
      'disable-zoom'?: boolean;
      loading?: 'auto' | 'lazy' | 'eager';
      reveal?: 'auto' | 'interaction' | 'manual';
      'environment-image'?: string;
      poster?: string;
      'shadow-intensity'?: number;
      'shadow-softness'?: number;
      'exposure'?: number;
      'tone-mapping'?: string;
    };
  }
}