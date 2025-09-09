import Image, { ImageProps } from 'next/image';

interface A11yImageProps extends Omit<ImageProps, 'alt'> {
  alt?: string;
  fallbackAlt?: string;
}

export default function A11yImage({ fallbackAlt, alt, ...props }: A11yImageProps) {
  const finalAlt = alt && alt.trim().length > 0 ? alt : (fallbackAlt ?? 'รูปภาพประกอบ');
  return <Image {...props} alt={finalAlt} />;
}
