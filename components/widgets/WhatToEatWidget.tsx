import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shuffle, Plus, X, History, Utensils } from 'lucide-react';

interface WhatToEatWidgetProps {
    onBack: () => void;
    darkMode: boolean;
}

const defaultFoods = [
    // 中餐
    { name: '红烧肉', category: '中餐' },
    { name: '宫保鸡丁', category: '中餐' },
    { name: '麻婆豆腐', category: '中餐' },
    { name: '糖醋排骨', category: '中餐' },
    { name: '鱼香肉丝', category: '中餐' },
    { name: '回锅肉', category: '中餐' },
    { name: '东坡肉', category: '中餐' },
    { name: '水煮鱼', category: '中餐' },
    // 面食
    { name: '兰州拉面', category: '面食' },
    { name: '重庆小面', category: '面食' },
    { name: '炸酱面', category: '面食' },
    { name: '刀削面', category: '面食' },
    { name: '热干面', category: '面食' },
    { name: '担担面', category: '面食' },
    // 快餐
    { name: '汉堡薯条', category: '快餐' },
    { name: '炸鸡', category: '快餐' },
    { name: '披萨', category: '快餐' },
    { name: '三明治', category: '快餐' },
    // 日韩料理
    { name: '寿司', category: '日韩料理' },
    { name: '拉面', category: '日韩料理' },
    { name: '韩式烤肉', category: '日韩料理' },
    { name: '石锅拌饭', category: '日韩料理' },
    { name: '咖喱饭', category: '日韩料理' },
    // 其他
    { name: '火锅', category: '其他' },
    { name: '烧烤', category: '其他' },
    { name: '自助餐', category: '其他' },
    { name: '麻辣烫', category: '其他' },
    { name: '黄焖鸡', category: '其他' },
    { name: '沙县小吃', category: '其他' },
    { name: '煲仔饭', category: '其他' },
];

const STORAGE_KEY = 'cloudnav_what_to_eat';

const WhatToEatWidget: React.FC<WhatToEatWidgetProps> = ({ onBack, darkMode }) => {
    const [foods, setFoods] = useState(defaultFoods);
    const [result, setResult] = useState<string | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState<string[]>([]);
    const [showAddFood, setShowAddFood] = useState(false);
    const [newFood, setNewFood] = useState('');
    const [newCategory, setNewCategory] = useState('其他');

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.foods) setFoods(data.foods);
                if (data.history) setHistory(data.history);
            } catch (e) {
                console.error('Failed to load saved data', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ foods, history }));
    }, [foods, history]);

    const spin = () => {
        if (isSpinning) return;

        setIsSpinning(true);
        setResult(null);

        // Simulate spinning animation
        let count = 0;
        const maxCount = 20;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * foods.length);
            setResult(foods[randomIndex].name);
            count++;

            if (count >= maxCount) {
                clearInterval(interval);
                setIsSpinning(false);
                const finalResult = foods[Math.floor(Math.random() * foods.length)].name;
                setResult(finalResult);
                setHistory(prev => [finalResult, ...prev.slice(0, 9)]);
            }
        }, 100);
    };

    const addFood = () => {
        if (!newFood.trim()) return;
        setFoods(prev => [...prev, { name: newFood.trim(), category: newCategory }]);
        setNewFood('');
        setShowAddFood(false);
    };

    const removeFood = (name: string) => {
        setFoods(prev => prev.filter(f => f.name !== name));
    };

    const categories = [...new Set(foods.map(f => f.category))];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                </button>
                <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl">
                    <Utensils size={24} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">今天吃什么</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">让命运来决定！</p>
                </div>
            </div>

            {/* Result Display */}
            <div className="relative mb-6">
                <div className={`text-center py-12 px-6 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-dashed ${isSpinning ? 'border-orange-400 animate-pulse' : 'border-orange-200 dark:border-orange-800'
                    }`}>
                    {result ? (
                        <div className="space-y-2">
                            <p className="text-sm text-orange-600 dark:text-orange-400">今天就吃</p>
                            <p className={`text-4xl font-bold text-orange-600 dark:text-orange-400 ${isSpinning ? 'animate-bounce' : ''}`}>
                                {result}
                            </p>
                            {!isSpinning && (
                                <p className="text-sm text-orange-500 dark:text-orange-500 mt-2">🍜 祝您用餐愉快！</p>
                            )}
                        </div>
                    ) : (
                        <div className="text-orange-400 dark:text-orange-500">
                            <p className="text-lg">点击下方按钮</p>
                            <p className="text-sm mt-1">开始随机选择</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Spin Button */}
            <button
                onClick={spin}
                disabled={isSpinning}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 transition-all ${isSpinning
                        ? 'bg-slate-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40'
                    }`}
            >
                <Shuffle size={22} className={isSpinning ? 'animate-spin' : ''} />
                {isSpinning ? '选择中...' : '随机选择'}
            </button>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-4">
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="flex-1 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <History size={18} />
                    历史记录
                </button>
                <button
                    onClick={() => setShowAddFood(!showAddFood)}
                    className="flex-1 py-2 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <Plus size={18} />
                    添加美食
                </button>
            </div>

            {/* History Panel */}
            {showHistory && (
                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">最近选择</h3>
                    {history.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {history.map((item, index) => (
                                <span key={index} className="px-3 py-1 rounded-full bg-white dark:bg-slate-600 text-sm text-slate-600 dark:text-slate-300">
                                    {item}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">暂无记录</p>
                    )}
                </div>
            )}

            {/* Add Food Panel */}
            {showAddFood && (
                <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-slate-700/50 space-y-3">
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300">添加新美食</h3>
                    <input
                        type="text"
                        value={newFood}
                        onChange={(e) => setNewFood(e.target.value)}
                        placeholder="美食名称"
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <select
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-white dark:bg-slate-600 border border-slate-200 dark:border-slate-500 outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                        <option value="其他">其他</option>
                    </select>
                    <button
                        onClick={addFood}
                        className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
                    >
                        添加
                    </button>

                    {/* Food List */}
                    <div className="max-h-40 overflow-y-auto space-y-1 mt-3">
                        {foods.map((food, index) => (
                            <div key={index} className="flex items-center justify-between px-3 py-1.5 bg-white dark:bg-slate-600 rounded-lg">
                                <span className="text-sm text-slate-700 dark:text-slate-300">{food.name}</span>
                                <button
                                    onClick={() => removeFood(food.name)}
                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatToEatWidget;
