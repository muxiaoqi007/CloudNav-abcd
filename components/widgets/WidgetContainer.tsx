import React, { useState } from 'react';
import { X, Utensils, Disc, Calculator, Sparkles } from 'lucide-react';
import WhatToEatWidget from './WhatToEatWidget';
import WoodenFishWidget from './WoodenFishWidget';
import CalculatorWidget from './CalculatorWidget';

interface WidgetContainerProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

type WidgetType = 'menu' | 'whatToEat' | 'woodenFish' | 'calculator';

interface WidgetInfo {
  id: WidgetType;
  name: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const widgets: WidgetInfo[] = [
  {
    id: 'whatToEat',
    name: '今天吃什么',
    icon: <Utensils size={24} />,
    description: '随机选择美食，解决选择困难症',
    color: 'from-orange-400 to-red-500'
  },
  {
    id: 'woodenFish',
    name: '电子木鱼',
    icon: <Disc size={24} />,
    description: '敲击木鱼，积累功德',
    color: 'from-amber-400 to-yellow-600'
  },
  {
    id: 'calculator',
    name: '计算器',
    icon: <Calculator size={24} />,
    description: '简洁好用的计算工具',
    color: 'from-blue-400 to-indigo-500'
  }
];

const WidgetContainer: React.FC<WidgetContainerProps> = ({ isOpen, onClose, darkMode }) => {
  const [activeWidget, setActiveWidget] = useState<WidgetType>('menu');

  if (!isOpen) return null;

  const handleClose = () => {
    setActiveWidget('menu');
    onClose();
  };

  const handleBack = () => {
    setActiveWidget('menu');
  };

  const renderWidget = () => {
    switch (activeWidget) {
      case 'whatToEat':
        return <WhatToEatWidget onBack={handleBack} darkMode={darkMode} />;
      case 'woodenFish':
        return <WoodenFishWidget onBack={handleBack} darkMode={darkMode} />;
      case 'calculator':
        return <CalculatorWidget onBack={handleBack} darkMode={darkMode} />;
      default:
        return renderMenu();
    }
  };

  const renderMenu = () => (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">小工具</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">选择一个小工具开始使用</p>
        </div>
      </div>

      <div className="grid gap-4">
        {widgets.map((widget) => (
          <button
            key={widget.id}
            onClick={() => setActiveWidget(widget.id)}
            className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all group"
          >
            <div className={`p-3 rounded-xl bg-gradient-to-br ${widget.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
              {widget.icon}
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold text-slate-800 dark:text-white">{widget.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{widget.description}</p>
            </div>
            <div className="text-slate-400 group-hover:text-blue-500 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md mx-4 rounded-2xl shadow-2xl overflow-hidden ${
        darkMode ? 'bg-slate-800' : 'bg-slate-50'
      }`}>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-200/80 dark:bg-slate-700/80 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
        >
          <X size={18} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto">
          {renderWidget()}
        </div>
      </div>
    </div>
  );
};

export default WidgetContainer;
