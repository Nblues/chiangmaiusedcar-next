import Image, { ImageProps } from 'next/image';

export default function A11yImage(props: ImageProps & { fallbackAlt?: string }) {
  const alt =
    props.alt && props.alt.trim().length > 0 ? props.alt : (props.fallbackAlt ?? 'รูปภาพประกอบ');
  return <Image {...props} alt={alt} />;
}
