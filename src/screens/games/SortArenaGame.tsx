import React, { useState, useEffect } from 'react';

interface SortArenaProps {
  onComplete: (stars: number, xp: number) => void;
  onDamage?: () => void;
}

export const SortArena: React.FC<SortArenaProps> = ({ onComplete, onDamage }) => {
  const [array, setArray] = useState<number[]>([42, 17, 89, 34, 12, 65, 23]);
  const [selectedPivotIdx, setSelectedPivotIdx] = useState<number | null>(null);
  const [partitionStage, setPartitionStage] = useState<'SELECT' | 'SPLIT'>('SELECT');
  const [leftArray, setLeftArray] = useState<number[]>([]);
  const [rightArray, setRightArray] = useState<number[]>([]);
  const [hearts, setHearts] = useState(5);
  const [clearedPartitions, setClearedPartitions] = useState(0);

  const generateNewArray = () => {
    const arr = Array.from({ length: 7 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(arr);
    setSelectedPivotIdx(null);
    setPartitionStage('SELECT');
    setLeftArray([]);
    setRightArray([]);
  };

  const handleConfirmPivot = () => {
    if (selectedPivotIdx === null) return;
    const pivot = array[selectedPivotIdx];
    const left = array.filter((v, idx) => v < pivot && idx !== selectedPivotIdx);
    const right = array.filter((v, idx) => v >= pivot && idx !== selectedPivotIdx);

    setLeftArray(left);
    setRightArray(right);
    setPartitionStage('SPLIT');

    // Balance evaluation
    const balanceRatio = Math.abs(left.length - right.length);
    if (balanceRatio >= 4) {
      // Extremely unbalanced partition O(n^2) penalty
      setHearts((h) => {
        const next = Math.max(0, h - 1);
        if (onDamage) onDamage();
        return next;
      });
    } else {
      setClearedPartitions((c) => c + 1);
    }
  };

  useEffect(() => {
    if (clearedPartitions >= 4) {
      const stars = hearts >= 4 ? 3 : hearts >= 2 ? 2 : 1;
      onComplete(stars, 250);
    }
  }, [clearedPartitions, hearts, onComplete]);

  return (
    <div className="flex flex-col h-full w-full bg-[#0E1013] p-6 text-white font-mono select-none">
      <div className="flex justify-between items-center bg-[#15181E] border border-[#262C36] px-5 py-3 rounded-lg mb-6">
        <span className="text-[#DE5C34] text-xs font-bold uppercase tracking-wider">GAME 03 // PIVOT STRIKER (QUICKSORT PARTITION)</span>
        <div className="flex items-center gap-6 text-xs">
          <div>PARTITIONS: <span className="text-[#3D8B66] font-bold">{clearedPartitions} / 4</span></div>
          <div>LIVES: <span className="text-red-400 font-bold">{'♥'.repeat(hearts)}{'♡'.repeat(Math.max(0, 5 - hearts))}</span></div>
        </div>
      </div>

      <div className="flex-1 bg-[#12151B] border border-[#262C36] rounded-xl p-8 flex flex-col justify-between">
        <div className="text-center">
          <h3 className="text-base font-bold text-[#F1F3F7]">
            {partitionStage === 'SELECT' ? 'Select Median Pivot Element' : 'Partition Partition Result'}
          </h3>
          <p className="text-xs text-[#8C94A4] mt-1">
            Pick a value that divides the dataset into equal halves. Unbalanced splits damage pipeline throughput.
          </p>
        </div>

        {partitionStage === 'SELECT' ? (
          /* Active Array Bars */
          <div className="flex justify-center items-end gap-4 h-48 py-4">
            {array.map((val, idx) => {
              const isSelected = selectedPivotIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedPivotIdx(idx)}
                  className={`flex flex-col items-center justify-end w-14 rounded transition-all group ${
                    isSelected ? 'ring-2 ring-[#DE5C34]' : 'hover:opacity-80'
                  }`}
                  style={{ height: `${val * 1.8}px` }}
                >
                  <div
                    className={`w-full h-full rounded-t flex items-center justify-center text-xs font-bold ${
                      isSelected ? 'bg-[#DE5C34] text-white' : 'bg-[#262C36] text-[#8C94A4]'
                    }`}
                  >
                    {val}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          /* Partition Result Channels */
          <div className="grid grid-cols-2 gap-8 my-8">
            <div className="bg-[#15181E] border border-blue-500/40 rounded-xl p-4 text-center">
              <span className="text-xs text-blue-400 font-bold">LEFT CHUTE (&lt; PIVOT)</span>
              <div className="flex justify-center gap-2 mt-4">
                {leftArray.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-[#262C36] rounded text-xs">{v}</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">{leftArray.length} items</span>
            </div>

            <div className="bg-[#15181E] border border-amber-500/40 rounded-xl p-4 text-center">
              <span className="text-xs text-amber-400 font-bold">RIGHT CHUTE (&gt;= PIVOT)</span>
              <div className="flex justify-center gap-2 mt-4">
                {rightArray.map((v, i) => (
                  <span key={i} className="px-3 py-1 bg-[#262C36] rounded text-xs">{v}</span>
                ))}
              </div>
              <span className="text-[10px] text-gray-500 mt-2 block">{rightArray.length} items</span>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex justify-center gap-4">
          {partitionStage === 'SELECT' ? (
            <button
              onClick={handleConfirmPivot}
              disabled={selectedPivotIdx === null}
              className={`px-8 py-3 rounded-lg text-xs font-bold transition-all ${
                selectedPivotIdx !== null
                  ? 'bg-[#DE5C34] hover:bg-[#DE5C34]/80 text-white'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed'
              }`}
            >
              EXECUTE PARTITION STRIKE
            </button>
          ) : (
            <button
              onClick={generateNewArray}
              className="bg-[#3D8B66] hover:bg-[#3D8B66]/80 text-white px-8 py-3 rounded-lg text-xs font-bold"
            >
              NEXT DATASET WAVE →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};