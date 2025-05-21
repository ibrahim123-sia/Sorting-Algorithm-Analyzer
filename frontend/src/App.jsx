import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const sortingAlgorithms = {
  "Bubble Sort": (arr) => {
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;
    const start = performance.now();
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
  },

  "Quick Sort": (arr) => {
    let comparisons = 0;
    let swaps = 0;
    const a = [...arr];
    const start = performance.now();

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

    const quickSort = (low, high) => {
      if (low < high) {
        const pi = partition(low, high);
        quickSort(low, pi - 1);
        quickSort(pi + 1, high);
      }
    };

    quickSort(0, a.length - 1);
    return { time: performance.now() - start, comparisons, swaps };
  },

  "Merge Sort": (arr) => {
    let comparisons = 0;
    let swaps = 0;
    const start = performance.now();
    const a = [...arr];

    const merge = (left, right) => {
      const result = [];
      let i = 0,
        j = 0;

      while (i < left.length && j < right.length) {
        comparisons++;
        if (left[i] <= right[j]) {
          result.push(left[i++]);
        } else {
          result.push(right[j++]);
        }
        swaps++; 
      }

      while (i < left.length) {
        result.push(left[i++]);
        swaps++;
      }

      while (j < right.length) {
        result.push(right[j++]);
        swaps++;
      }

      return result;
    };

    const mergeSort = (array) => {
      if (array.length <= 1) return array;
      const mid = Math.floor(array.length / 2);
      return merge(mergeSort(array.slice(0, mid)), mergeSort(array.slice(mid)));
    };

    mergeSort(a);
    return { time: performance.now() - start, comparisons, swaps };
  },

  "Insertion Sort": (arr) => {
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;
    const start = performance.now();

    for (let i = 1; i < a.length; i++) {
      const key = a[i];
      let j = i - 1;

      while (j >= 0) {
        comparisons++;
        if (a[j] > key) {
          a[j + 1] = a[j];
          swaps++;
          j--;
        } else {
          break;
        }
      }
      a[j + 1] = key;
      swaps++;
    }

    return { time: performance.now() - start, comparisons, swaps };
  },

  "Selection Sort": (arr) => {
    const a = [...arr];
    let comparisons = 0;
    let swaps = 0;
    const start = performance.now();

    for (let i = 0; i < a.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        comparisons++;
        if (a[j] < a[minIdx]) {
          minIdx = j;
        }
      }
      if (minIdx !== i) {
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        swaps++;
      }
    }

    return { time: performance.now() - start, comparisons, swaps };
  },
};

const MAX_ARRAY_SIZE = 10000;

export default function App() {
  const [size, setSize] = useState("");
  const [selectedAlgos, setSelectedAlgos] = useState(new Set());
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);

  const generateArray = (n) => {
  return Array.from({ length: n }, () =>
    Math.floor(Math.random() * 10000) + 1
  );
};


  const handleSort = () => {
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

    selectedAlgos.forEach((algoName) => {
      const { time, comparisons, swaps } = sortingAlgorithms[algoName](data);
      newResults.push({
        name: algoName,
        time: +time.toFixed(2),
        comparisons,
        swaps,
        size: Number(size),
      });
    });

    setResults(newResults);
    setHistory((prev) => [...prev, ...newResults]);
    setSize("");
    setSelectedAlgos(new Set());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
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
              {Object.keys(sortingAlgorithms).map((algo) => (
                <label
                  key={algo}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedAlgos.has(algo)
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={selectedAlgos.has(algo)}
                    onChange={(e) => {
                      const newSet = new Set(selectedAlgos);
                      e.target.checked ? newSet.add(algo) : newSet.delete(algo);
                      setSelectedAlgos(newSet);
                    }}
                  />
                  <span className="select-none">{algo}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleSort}
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
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1F2937" }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
                      <Bar
                        dataKey="time"
                        name="Time (ms)"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
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
                      <Tooltip
                        contentStyle={{ backgroundColor: "#1F2937" }}
                        itemStyle={{ color: "#E5E7EB" }}
                      />
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
