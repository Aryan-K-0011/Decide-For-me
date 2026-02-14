import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { userService } from '../services/userService';

const SpinWheelPage: React.FC = () => {
  const [options, setOptions] = useState<string[]>(['Pizza', 'Burger', 'Sushi', 'Tacos']);
  const [newOption, setNewOption] = useState('');
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);

  // Wheel colors
  const colors = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const addOption = () => {
    if (newOption.trim() && options.length < 12) {
      setOptions([...options, newOption.trim()]);
      setNewOption('');
      setWinner(null);
    }
  };

  const removeOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index));
    setWinner(null);
  };

  const spin = () => {
    if (isSpinning || options.length < 2) return;

    setIsSpinning(true);
    setWinner(null);
    
    // Random rotation between 5 and 10 full spins plus random offset
    const randomSpins = 360 * (5 + Math.random() * 5);
    const newRotation = rotation + randomSpins;
    
    setRotation(newRotation);

    // Calculate winner
    setTimeout(() => {
      setIsSpinning(false);
      const degrees = newRotation % 360;
      // The pointer is usually at 0 degrees (right) or 270 (top). 
      // Assuming SVG starts drawing at 0 (right), and rotates clockwise.
      
      const sliceAngle = 360 / options.length;
      // Correcting calculation based on CSS rotation direction
      // The wheel rotates Clockwise. The pointer is static at the Right (0 degrees).
      // Effective angle is 360 - (degrees % 360).
      const effectiveAngle = (360 - (degrees % 360)) % 360;
      const winningIndex = Math.floor(effectiveAngle / sliceAngle);
      
      const winningOption = options[winningIndex];
      setWinner(winningOption);
      userService.saveSpinResult(winningOption);
      
    }, 4000); // Match CSS transition duration
  };

  // Helper to create SVG path for a slice
  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  const renderWheel = () => {
    let cumulativePercent = 0;

    return options.map((option, index) => {
      const slicePercent = 1 / options.length;
      const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
      cumulativePercent += slicePercent;
      const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
      
      const largeArcFlag = slicePercent > 0.5 ? 1 : 0;
      
      const pathData = [
        `M 0 0`,
        `L ${startX} ${startY}`,
        `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
        `Z`
      ].join(' ');

      // Calculate text position (midpoint angle)
      const midAngle = 2 * Math.PI * (cumulativePercent - slicePercent / 2);
      const textX = Math.cos(midAngle) * 0.6; 
      const textY = Math.sin(midAngle) * 0.6;

      return (
        <g key={index}>
          <path d={pathData} fill={colors[index % colors.length]} stroke="#1e293b" strokeWidth="0.02" />
          <text 
            x={textX} 
            y={textY} 
            fill="white" 
            fontSize="0.1" 
            fontWeight="bold"
            textAnchor="middle" 
            dominantBaseline="middle"
            transform={`rotate(${(midAngle * 180 / Math.PI)}, ${textX}, ${textY})`}
            style={{ pointerEvents: 'none' }}
          >
            {option.length > 10 ? option.substring(0, 8) + '..' : option}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="pt-24 pb-8 min-h-screen px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        
        {/* Controls */}
        <div className="glass-panel p-6 rounded-3xl order-2 md:order-1">
          <h2 className="text-2xl font-bold mb-4 text-white">Add Your Options</h2>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={newOption}
              onChange={(e) => setNewOption(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOption()}
              placeholder="E.g. Taco Bell"
              className="flex-1 bg-surface border border-gray-600 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary"
            />
            <button onClick={addOption} className="bg-primary hover:bg-primary/80 text-white p-2 rounded-xl">
              <Plus size={24} />
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {options.map((opt, i) => (
              <div key={i} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="text-gray-200">{opt}</span>
                <button onClick={() => removeOption(i)} className="text-gray-500 hover:text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={spin}
            disabled={isSpinning || options.length < 2}
            className="w-full mt-6 bg-gradient-to-r from-secondary to-primary py-4 rounded-xl font-bold text-xl text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition"
          >
            {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
          </button>
        </div>

        {/* Wheel Display */}
        <div className="flex flex-col items-center justify-center order-1 md:order-2 relative">
          <div className="relative w-80 h-80 md:w-96 md:h-96">
            {/* Pointer */}
            <div className="absolute top-1/2 -right-4 w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[30px] border-r-white z-20 -translate-y-1/2 filter drop-shadow-lg" />
            
            <svg 
              viewBox="-1 -1 2 2" 
              className="w-full h-full transform transition-transform cubic-bezier(0.1, 0.7, 0.1, 1)"
              style={{ 
                transform: `rotate(${rotation}deg)`, 
                transitionDuration: isSpinning ? '4s' : '0s' 
              }}
            >
              {renderWheel()}
            </svg>
          </div>

          {winner && (
            <div className="mt-8 animate-bounce">
              <div className="bg-white text-dark px-6 py-3 rounded-full font-bold text-xl shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                🎉 Winner: {winner} 🎉
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default SpinWheelPage;
