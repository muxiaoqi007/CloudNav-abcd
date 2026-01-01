import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Disc, Volume2, VolumeX } from 'lucide-react';

interface WoodenFishWidgetProps {
    onBack: () => void;
    darkMode: boolean;
}

const STORAGE_KEY = 'cloudnav_wooden_fish';

const WoodenFishWidget: React.FC<WoodenFishWidgetProps> = ({ onBack, darkMode }) => {
    const [merit, setMerit] = useState(0);
    const [todayMerit, setTodayMerit] = useState(0);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [isAnimating, setIsAnimating] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number }[]>([]);
    const audioContextRef = useRef<AudioContext | null>(null);
    const nextIdRef = useRef(0);

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if (data.merit) setMerit(data.merit);
                if (data.todayMerit && data.date === new Date().toDateString()) {
                    setTodayMerit(data.todayMerit);
                }
            } catch (e) {
                console.error('Failed to load saved data', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            merit,
            todayMerit,
            date: new Date().toDateString()
        }));
    }, [merit, todayMerit]);

    const playSound = useCallback(() => {
        if (!soundEnabled) return;

        try {
            // Create AudioContext on first interaction
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();

            // Wooden fish sound simulation
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.2);

            gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);

            oscillator.start(ctx.currentTime);
            oscillator.stop(ctx.currentTime + 0.3);
        } catch (e) {
            console.error('Failed to play sound', e);
        }
    }, [soundEnabled]);

    const meritTexts = [
        '功德 +1',
        '善哉善哉',
        '阿弥陀佛',
        '心诚则灵',
        '积德行善',
        '福报无量',
    ];

    const knock = () => {
        // Play sound
        playSound();

        // Update merit
        setMerit(prev => prev + 1);
        setTodayMerit(prev => prev + 1);

        // Animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 150);

        // Floating text
        const text = meritTexts[Math.floor(Math.random() * meritTexts.length)];
        const id = nextIdRef.current++;
        const x = Math.random() * 60 - 30; // Random offset

        setFloatingTexts(prev => [...prev, { id, text, x }]);
        setTimeout(() => {
            setFloatingTexts(prev => prev.filter(t => t.id !== id));
        }, 1500);
    };

    const resetMerit = () => {
        if (confirm('确定要清空所有功德吗？')) {
            setMerit(0);
            setTodayMerit(0);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <div className="p-2 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl">
                        <Disc size={24} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">电子木鱼</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400">敲击积功德</p>
                    </div>
                </div>
                <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`p-2 rounded-lg transition-colors ${soundEnabled
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                        }`}
                >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                </button>
            </div>

            {/* Merit Counter */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 text-center">
                    <p className="text-sm text-amber-600 dark:text-amber-400 mb-1">今日功德</p>
                    <p className="text-3xl font-bold text-amber-700 dark:text-amber-300">{todayMerit.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 text-center">
                    <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">累计功德</p>
                    <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{merit.toLocaleString()}</p>
                </div>
            </div>

            {/* Wooden Fish */}
            <div className="relative flex justify-center my-8">
                {/* Floating Texts */}
                {floatingTexts.map(({ id, text, x }) => (
                    <div
                        key={id}
                        className="absolute text-amber-600 dark:text-amber-400 font-bold text-lg pointer-events-none animate-float-up"
                        style={{
                            left: `calc(50% + ${x}px)`,
                            transform: 'translateX(-50%)',
                            animation: 'floatUp 1.5s ease-out forwards'
                        }}
                    >
                        {text}
                    </div>
                ))}

                {/* Fish Button */}
                <button
                    onClick={knock}
                    className={`relative w-48 h-48 rounded-full transition-transform ${isAnimating ? 'scale-95' : 'scale-100 hover:scale-105'
                        }`}
                    style={{
                        background: darkMode
                            ? 'radial-gradient(circle at 30% 30%, #b45309, #78350f)'
                            : 'radial-gradient(circle at 30% 30%, #fbbf24, #b45309)',
                        boxShadow: isAnimating
                            ? 'inset 0 5px 20px rgba(0,0,0,0.4)'
                            : '0 10px 40px rgba(180, 83, 9, 0.4), inset 0 -5px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    {/* Wood Grain Pattern */}
                    <div className="absolute inset-4 rounded-full opacity-30"
                        style={{
                            background: 'repeating-radial-gradient(circle at center, transparent, transparent 8px, rgba(0,0,0,0.1) 10px)'
                        }}
                    />

                    {/* Center Circle */}
                    <div className={`absolute inset-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-amber-900' : 'bg-amber-700'
                        }`}
                        style={{
                            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.3)'
                        }}
                    >
                        <span className="text-4xl">🪵</span>
                    </div>

                    {/* Ripple Effect */}
                    {isAnimating && (
                        <div className="absolute inset-0 rounded-full border-4 border-amber-400 animate-ping opacity-30" />
                    )}
                </button>
            </div>

            {/* Instructions */}
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-4">
                点击木鱼积累功德
            </p>

            {/* Reset Button */}
            <button
                onClick={resetMerit}
                className="w-full py-2 text-sm text-slate-400 hover:text-red-500 transition-colors"
            >
                清空功德
            </button>

            {/* Styles */}
            <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            top: 40%;
          }
          100% {
            opacity: 0;
            top: 0%;
          }
        }
        .animate-float-up {
          animation: floatUp 1.5s ease-out forwards;
        }
      `}</style>
        </div>
    );
};

export default WoodenFishWidget;
