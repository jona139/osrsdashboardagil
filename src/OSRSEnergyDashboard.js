import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OSRSEnergyDashboard = () => {
  // State for user inputs
  const [agilityLevel, setAgilityLevel] = useState(50);
  const [weight, setWeight] = useState(0);
  const [hasGraceful, setHasGraceful] = useState(false);
  const [hasStamina, setHasStamina] = useState(false);
  const [hasRingOfEndurance, setHasRingOfEndurance] = useState(false);
  
  // Calculate values for depletion
  const calculateDepletionRate = () => {
    const clampedWeight = Math.min(Math.max(weight, 0), 64);
    const weightFactor = Math.floor((67 * clampedWeight) / 64);
    let energyLossPerTick = (60 + weightFactor) * (1 - agilityLevel / 300);
    
    if (hasStamina) {
      energyLossPerTick = Math.floor(0.3 * energyLossPerTick);
    } else if (hasRingOfEndurance) {
      energyLossPerTick = Math.floor(0.85 * energyLossPerTick);
    }
    
    return energyLossPerTick;
  };
  
  const calculateRecoveryRate = () => {
    let recoveryPerTick = Math.floor(agilityLevel / 10) + 15;
    
    if (hasGraceful) {
      recoveryPerTick = Math.floor(1.3 * recoveryPerTick);
    }
    
    return recoveryPerTick;
  };
  
  const calculateTimeToDeplete = () => {
    const energyLossPerTick = calculateDepletionRate();
    const ticksToDeplete = Math.ceil(10000 / energyLossPerTick);
    return {
      ticks: ticksToDeplete,
      seconds: (ticksToDeplete * 0.6).toFixed(1),
      minutes: ((ticksToDeplete * 0.6) / 60).toFixed(2)
    };
  };
  
  const calculateTimeToRecover = () => {
    const recoveryPerTick = calculateRecoveryRate();
    const ticksToRecover = Math.ceil(10000 / recoveryPerTick);
    return {
      ticks: ticksToRecover,
      seconds: (ticksToRecover * 0.6).toFixed(1),
      minutes: ((ticksToRecover * 0.6) / 60).toFixed(2)
    };
  };
  
  const generateDepletionData = () => {
    const data = [];
    for (let w = 0; w <= 64; w += 2) {
      const clampedWeight = Math.min(Math.max(w, 0), 64);
      const weightFactor = Math.floor((67 * clampedWeight) / 64);
      
      let baseEnergyLoss = (60 + weightFactor) * (1 - agilityLevel / 300);
      
      let withoutBoostTicks = Math.ceil(10000 / baseEnergyLoss);
      let withStaminaTicks = Math.ceil(10000 / (Math.floor(0.3 * baseEnergyLoss)));
      let withRingTicks = Math.ceil(10000 / (Math.floor(0.85 * baseEnergyLoss)));
      
      data.push({
        weight: w,
        noBoost: withoutBoostTicks * 0.6,
        stamina: withStaminaTicks * 0.6,
        ring: withRingTicks * 0.6
      });
    }
    return data;
  };
  
  const generateRecoveryData = () => {
    const data = [];
    for (let a = 1; a <= 99; a += 5) {
      let normalRecovery = Math.floor(a / 10) + 15;
      let gracefulRecovery = Math.floor(1.3 * normalRecovery);
      
      let normalTicks = Math.ceil(10000 / normalRecovery);
      let gracefulTicks = Math.ceil(10000 / gracefulRecovery);
      
      data.push({
        agility: a,
        normal: normalTicks * 0.6 / 60,
        graceful: gracefulTicks * 0.6 / 60
      });
    }
    return data;
  };
  
  const depletionTime = calculateTimeToDeplete();
  const recoveryTime = calculateTimeToRecover();
  const depletionData = generateDepletionData();
  const recoveryData = generateRecoveryData();

  return (
    <div className="flex flex-col w-full bg-gray-100 p-6 rounded-lg shadow">
      <h1 className="text-3xl font-bold text-center mb-6">OSRS Run Energy Dashboard</h1>
      
      {/* YouTube Series Link - Added Here */}
      <div className="bg-yellow-100 p-3 rounded-md shadow mb-6 text-center">
        <a 
          href="https://www.youtube.com/watch?v=slWKBb1DXsA&t=1s" 
          target="_blank"
          rel="noopener noreferrer" 
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center"
        >
          <span>👍 Like the dashboard? Check out my YouTube series! 🎬</span>
        </a>
      </div>
      
      {/* Controls */}
      <div className="bg-white p-4 rounded-md shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Configure Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agility Level: {agilityLevel}
            </label>
            <input
              type="range"
              min="1"
              max="99"
              value={agilityLevel}
              onChange={(e) => setAgilityLevel(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg): {weight}
            </label>
            <input
              type="range"
              min="0"
              max="64"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="flex flex-col justify-center space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="graceful"
                checked={hasGraceful}
                onChange={() => setHasGraceful(!hasGraceful)}
                className="mr-2"
              />
              <label htmlFor="graceful" className="text-sm font-medium text-gray-700">
                Full Graceful Set
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="stamina"
                checked={hasStamina}
                onChange={() => {
                  setHasStamina(!hasStamina);
                  if (!hasStamina) setHasRingOfEndurance(false);
                }}
                className="mr-2"
              />
              <label htmlFor="stamina" className="text-sm font-medium text-gray-700">
                Stamina Potion Effect
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="ring"
                checked={hasRingOfEndurance}
                onChange={() => {
                  setHasRingOfEndurance(!hasRingOfEndurance);
                  if (!hasRingOfEndurance) setHasStamina(false);
                }}
                disabled={hasStamina}
                className="mr-2"
              />
              <label htmlFor="ring" className={`text-sm font-medium ${hasStamina ? 'text-gray-400' : 'text-gray-700'}`}>
                Ring of Endurance
              </label>
            </div>
          </div>
        </div>
      </div>
      
      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Run Energy Depletion</h2>
          <p className="text-sm mb-2">How long it takes to go from 100% to 0% energy while running:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-500">Time in ticks</p>
              <p className="text-2xl font-bold">{depletionTime.ticks}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded">
              <p className="text-xs text-gray-500">Time in seconds</p>
              <p className="text-2xl font-bold">{depletionTime.seconds}s</p>
            </div>
            <div className="bg-blue-50 p-3 rounded col-span-2">
              <p className="text-xs text-gray-500">Time in minutes</p>
              <p className="text-2xl font-bold">{depletionTime.minutes} min</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Run Energy Recovery</h2>
          <p className="text-sm mb-2">How long it takes to go from 0% to 100% energy while standing/walking:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-gray-500">Time in ticks</p>
              <p className="text-2xl font-bold">{recoveryTime.ticks}</p>
            </div>
            <div className="bg-green-50 p-3 rounded">
              <p className="text-xs text-gray-500">Time in seconds</p>
              <p className="text-2xl font-bold">{recoveryTime.seconds}s</p>
            </div>
            <div className="bg-green-50 p-3 rounded col-span-2">
              <p className="text-xs text-gray-500">Time in minutes</p>
              <p className="text-2xl font-bold">{recoveryTime.minutes} min</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Energy Depletion by Weight</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={depletionData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="weight" label={{ value: 'Weight (kg)', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Seconds to Deplete', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(1)}s`, 'Time']} />
                <Legend />
                <Line type="monotone" dataKey="noBoost" name="No Boost" stroke="#8884d8" />
                <Line type="monotone" dataKey="stamina" name="Stamina Potion" stroke="#82ca9d" />
                <Line type="monotone" dataKey="ring" name="Ring of Endurance" stroke="#ffc658" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">Energy Recovery by Agility Level</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={recoveryData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agility" label={{ value: 'Agility Level', position: 'insideBottomRight', offset: -5 }} />
                <YAxis label={{ value: 'Minutes to Recover', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`${value.toFixed(2)} min`, 'Time']} />
                <Legend />
                <Line type="monotone" dataKey="normal" name="Without Graceful" stroke="#8884d8" />
                <Line type="monotone" dataKey="graceful" name="With Graceful" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          Data based on the OSRS Wiki page formulas:
        </p>
        <p className="mt-1">
          Energy depletion: L(weight) = (60 + ⌊(67 * clamp[0,64](weight) / 64)⌋) × (1 - agility/300)
        </p>
        <p className="mt-1">
          Energy recovery: R(agility) = ⌊agility/10⌋ + 15
        </p>
      </div>
    </div>
  );
};

export default OSRSEnergyDashboard;