const fs = require('fs');
let content = fs.readFileSync('pages/index.jsx', 'utf8');

// 1. Add static import for CarCard
if (!content.includes("import CarCard from")) {
    content = content.replace(
        "import Link from 'next/link';",
        "import Link from 'next/link';\nimport CarCard from '../components/CarCard';"
    );
}

// 2. Remove dynamic import for CarCard
content = content.replace(
    /\/\/ Lazy load non-critical components to reduce TBT\s+const CarCard = dynamic\(\(\) => import\('\.\.\/components\/CarCard'\), \{\s+loading: \(\) => <div className="h-\[300px\] w-full bg-gray-100 animate-pulse rounded-lg"><\/div>,\s+\}\);\s+const HomeSearchSection/,
    "// Lazy load non-critical components to reduce TBT\n  const HomeSearchSection"
);

// 3. Find mapping of safeCars and inject priority
content = content.replace(
    /\{safeCars\.slice\(0, showAllCars \? 8 : 4\)\.map\(car => \{\s+const mergedCar = mergeCarSpecs\(car, null\);\s+return <CarCard key=\{car\.id\} car=\{mergedCar\} \/>;\s+\}\)\}/,
    `{safeCars.slice(0, showAllCars ? 8 : 4).map((car, index) => {
                      const mergedCar = mergeCarSpecs(car, null);
                      return <CarCard key={car.id} car={mergedCar} priority={index < 4} />;
                    })}`
);

fs.writeFileSync('pages/index.jsx', content);
console.log("Fixed index.jsx!");