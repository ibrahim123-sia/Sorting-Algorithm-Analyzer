import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"; 

// Algorithms Declarations

function bubbleSort(arr) {
  const start = performance.now();
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < a.length - 1; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
      }
    }
  }

  return { time: performance.now() - start, comparisons, swaps };
}

function quickSort(arr) {
  const start = performance.now();
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  const partition = (low, high) => {
    const pivot = a[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      comparisons++;
      if (a[j] < pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
        swaps++;
      }
    }
    [a[i + 1], a[high]] = [a[high], a[i + 1]];
    swaps++;
    return i + 1;
  };

  const sort = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  sort(0, a.length - 1);
  return { time: performance.now() - start, comparisons, swaps };
}

function mergeSort(arr) {
  const start = performance.now();
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  const merge = (left, right) => {
    const result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      comparisons++;
      if (left[i] <= right[j]) {
        result.push(left[i++]);
        swaps++;
      } else {
        result.push(right[j++]);
        swaps++;
      }
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  };

  const sort = (array) => {
    if (array.length <= 1) return array;
    const mid = Math.floor(array.length / 2);
    return merge(
      sort(array.slice(0, mid)),
      sort(array.slice(mid))
    );
  };

  sort(a);
  return { time: performance.now() - start, comparisons, swaps };
}

function insertionSort(arr) {
  const start = performance.now();
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    while (j >= 0) {
      comparisons++;
      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;
        j--;
      } else break;
    }
    a[j + 1] = key;
    swaps++;
  }

  return { time: performance.now() - start, comparisons, swaps };
}

function selectionSort(arr) {
  const start = performance.now();
  const a = [...arr];
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      comparisons++;
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) {
      [a[i], a[minIdx]] = [a[minIdx], a[i]];
      swaps++;
    }
  }

  return { time: performance.now() - start, comparisons, swaps };
}

// Array of objects contains algorithms
const sortingAlgorithms = [
  { name: "Bubble Sort", func: bubbleSort },
  { name: "Quick Sort", func: quickSort },
  { name: "Merge Sort", func: mergeSort },
  { name: "Insertion Sort", func: insertionSort },
  { name: "Selection Sort", func: selectionSort },
];

const MAX_ARRAY_SIZE = 10000; 
export default function App() {
  const [size, setSize] = useState("");
  // new set is use to avoid duplication selection in algorithms
  const [selectedAlgos, setSelectedAlgos] = useState(new Set()); 
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  // end = Number.MAX_SAFE_INTEGER decide the end limit of our random value
  // Value: 9007199254740991
  // Purpose: The largest integer JavaScript can safely represent without losing precision

   const generateArray = (length, start = 0, end = Number.MAX_SAFE_INTEGER) => {
    const arr = [];
    for (let i = 0; i < length; i++) {
      
      const randomInt = (Math.floor(Math.random() * (end - start + 1)) + start);
      arr.push(randomInt);
    }
    return arr;
  };

  const InputRange = () => {
    if (!size || size < 1 || size > MAX_ARRAY_SIZE) {
      alert(`Please enter array size between 1-${MAX_ARRAY_SIZE}`);
      return;
    }

    if (selectedAlgos.size < 2) {
      alert("Please select at least 2 algorithms");
      return;
    }

    const data = generateArray(Number(size));
    const newResults = [];

    selectedAlgos.forEach(algoName => {
      const algorithm = sortingAlgorithms.find(a => a.name === algoName);
      if (!algorithm) return;
      
      const { time, comparisons, swaps } = algorithm.func(data);
      newResults.push({
        name: algoName,
        time: +time.toFixed(2),
        comparisons,
        swaps,
        size: Number(size),
      });
    });

    setResults(newResults);
    setHistory(prev => [...prev, ...newResults]);
    setSize("");
    setSelectedAlgos(new Set());
  };


  // Design Implementation
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4">
      <div className="max-w-8xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Sorting Algorithm Analyzer
        </h1>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-xl">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <input
                type="number"
                min="1"
                max={MAX_ARRAY_SIZE}
                placeholder={`Array size (1-${MAX_ARRAY_SIZE})`}
                className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {sortingAlgorithms.map((algo) => (
                <label
                  key={algo.name}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAlgos.has(algo.name)
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedAlgos.has(algo.name)}
                    onChange={(e) => {
                      const newSet = new Set(selectedAlgos);
                      e.target.checked ? newSet.add(algo.name) : newSet.delete(algo.name);
                      setSelectedAlgos(newSet);
                    }}
                  />
                  <span className="select-none">{algo.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={InputRange}
            className="w-full mt-6 py-3 px-6 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
          >
            Compare Selected Algorithms
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-8">
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl mb-4 font-semibold">Execution Time</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF"
                        ticks={[0, 50, 100, 150, 200,250,320]}
                      />
                    

                      <Bar
                        dataKey="time"
                        fill="#3B82F6"
                        radius={[9, 9, 0, 0]}
                      />

                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
                <h2 className="text-2xl mb-4 font-semibold">Comparisons</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
        
                      <Bar
                        dataKey="comparisons"
                        name="Comparisons"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl mb-4 font-semibold">Current Results</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Algorithm</th>
                      <th className="p-3 text-left">Time (ms)</th>
                      <th className="p-3 text-left">Comparisons</th>
                      <th className="p-3 text-left">Array Size</th>
                      <th className="p-3 text-left">Swaps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((result, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-600 hover:bg-gray-700"
                      >
                        <td className="p-3">{result.name}</td>
                        <td className="p-3">{result.time}</td>
                        <td className="p-3">{result.comparisons}</td>
                        <td className="p-3">{result.size}</td>
                        <td className="p-3">{result.swaps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            
            <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
              <h2 className="text-2xl mb-4 font-semibold">Session History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="p-3 text-left">Algorithm</th>
                      <th className="p-3 text-left">Time (ms)</th>
                      <th className="p-3 text-left">Comparisons</th>
                      <th className="p-3 text-left">Array Size</th>
                      <th className="p-3 text-left">Swaps</th>{" "}
                      
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-600 hover:bg-gray-700"
                      >
                        <td className="p-3">{entry.name}</td>
                        <td className="p-3">{entry.time}</td>
                        <td className="p-3">{entry.comparisons}</td>
                        <td className="p-3">{entry.size}</td>
                        <td className="p-3">{entry.swaps}</td> 
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}