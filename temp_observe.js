const fs = require('fs');
const file = 'pages/all-cars.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add import
if (!content.includes("import { useInView } from 'react-intersection-observer';")) {
  content = content.replace(
    "import { mergeCarSpecs } from '../lib/mergeCarSpecs';",
    "import { mergeCarSpecs } from '../lib/mergeCarSpecs';\nimport { useInView } from 'react-intersection-observer';"
  );
}

// 2. Replace state and useEffect
content = content.replace(
  'const [showAllCars, setShowAllCars] = useState(false);\n    const heroImgRef = useRef(null);\n\n    useEffect(() => {\n      // Delays rendering below-the-fold cards to free up main thread (better \nTBT)\n      const timer = setTimeout(() => setShowAllCars(true), 1500);\n      return () => clearTimeout(timer);\n    }, []);',
  `const [showAllCars, setShowAllCars] = useState(false);
  const heroImgRef = useRef(null);

  const { ref: observerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '400px 0px',
  });

  useEffect(() => {
    if (inView) {
      setShowAllCars(true);
    }
  }, [inView]);

  useEffect(() => {
    // Fallback: render remaining cars after 2s if intersection observer fails to trigger
    const timer = setTimeout(() => setShowAllCars(true), 2000);
    return () => clearTimeout(timer);
  }, []);`
);
// In case the split was weird with formatting (e.g. carriage returns), let's use regex
content = content.replace(
  /const \[showAllCars, setShowAllCars\] = useState\(false\);\s*const heroImgRef = useRef\(null\);\s*useEffect\(\(\) => \{\s*\/\/[^\n]*\s*const timer = setTimeout\(\(\) => setShowAllCars\(true\), 1500\);\s*return \(\) => clearTimeout\(timer\);\s*\}, \[\]\);/g,
  `const [showAllCars, setShowAllCars] = useState(false);
  const heroImgRef = useRef(null);

  const { ref: observerRef, inView } = useInView({
    triggerOnce: true,
    rootMargin: '400px 0px',
  });

  useEffect(() => {
    if (inView) {
      setShowAllCars(true);
    }
  }, [inView]);

  useEffect(() => {
    // Fallback: render remaining cars after 2s if intersection observer fails to trigger
    const timer = setTimeout(() => setShowAllCars(true), 2000);
    return () => clearTimeout(timer);
  }, []);`
);

// 3. Add ref to skeleton
content = content.replace(
  /<div\n\s*key={`skeleton-\${car.id}`}\n\s*className="h-\[320px\] w-full bg-gray-50 animate-pulse\s*rounded-lg border border-gray-100"/g,
  `<div
                          key={\`skeleton-\${car.id}\`}
                          ref={index === 12 ? observerRef : null}
                          className="h-[320px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-100"`
);

// Handle weird spacing in Windows console output manually mapping the skeleton if regex fails:
content = content.replace(
  `                      return (\n                        <div\n                          key={\`skeleton-\${car.id}\`}\n                          className="h-[320px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-100"`,
  `                      return (\n                        <div\n                          key={\`skeleton-\${car.id}\`}\n                          ref={index === 12 ? observerRef : null}\n                          className="h-[320px] w-full bg-gray-50 animate-pulse rounded-lg border border-gray-100"`
);


fs.writeFileSync(file, content, 'utf8');
console.log('Main-thread optimization injected.');
