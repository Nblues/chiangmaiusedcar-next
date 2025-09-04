// Custom image loader that disables optimization
export default function customLoader({ src, width, quality }) {
  // Return the original source without any optimization
  return src;
}
