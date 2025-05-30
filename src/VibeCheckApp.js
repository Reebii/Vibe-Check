import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Brain, Music, Trophy, Flame, Sparkles, MapPin, Clock } from 'lucide-react';

const VibeCheckApp = () => {
  // State variables
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [vibeScore, setVibeScore] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [personalityType, setPersonalityType] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [achievementUnlocked, setAchievementUnlocked] = useState(null);
  const [particles, setParticles] = useState([]);
  const [balloons, setBalloons] = useState([]);
  const [selectedBalloon, setSelectedBalloon] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isQuestionTransitioning, setIsQuestionTransitioning] = useState(false);
  const [cosmicBackground, setCosmicBackground] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Refs
  const balloonCanvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const cosmicCanvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  // Questions data
  const questions = [
    {
      id: 1,
      text: "Your consciousness is vibrating at which dimensional frequency?",
      subtitle: "Pop the balloon that resonates with your current state of being",
      options: [
        { value: 'alpha', label: 'Alpha Dimension', emoji: '🧠', color: '#8B5CF6', weight: 8 },
        { value: 'beta', label: 'Beta Reality', emoji: '⚡', color: '#EF4444', weight: 6 },
        { value: 'gamma', label: 'Gamma Nexus', emoji: '🚀', color: '#10B981', weight: 10 },
        { value: 'theta', label: 'Theta Flow', emoji: '🌊', color: '#06B6D4', weight: 7 }
      ]
    },
    {
      id: 2,
      text: "Your emotional quantum state is experiencing which phenomena?",
      subtitle: "Touch the balloon that captures your soul's current resonance",
      options: [
        { value: 'superposition', label: 'Superposition State', emoji: '🌈', color: '#F59E0B', weight: 9 },
        { value: 'entangled', label: 'Quantum Entanglement', emoji: '🔗', color: '#8B5CF6', weight: 8 },
        { value: 'coherent', label: 'Perfect Coherence', emoji: '✨', color: '#F97316', weight: 10 },
        { value: 'decoherent', label: 'Quantum Decoherence', emoji: '🌪️', color: '#6366F1', weight: 5 }
      ]
    },
    {
      id: 3,
      text: "Your social energy matrix operates on which power source?",
      subtitle: "Grab the balloon that fuels your interpersonal connections",
      options: [
        { value: 'solar', label: 'Solar Powered', emoji: '☀️', color: '#F59E0B', weight: 8 },
        { value: 'nuclear', label: 'Nuclear Fusion', emoji: '🔥', color: '#DC2626', weight: 9 },
        { value: 'wind', label: 'Wind Powered', emoji: '💨', color: '#06B6D4', weight: 6 },
        { value: 'hibernation', label: 'Hibernation Mode', emoji: '🐻', color: '#7C3AED', weight: 4 }
      ]
    }
  ];

  // Initialize balloons
  const createBalloon = useCallback((option, index) => {
    const angle = (index * (Math.PI * 2)) / questions[currentQuestion].options.length;
    const radius = 180;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    return {
      id: `${currentQuestion}-${index}`,
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      vx: 0,
      vy: 0,
      size: 80 + Math.random() * 20,
      color: option.color,
      option: option,
      isSelected: false,
      bobOffset: Math.random() * Math.PI * 2
    };
  }, [currentQuestion]);

  // Create cosmic background
  const createCosmicBackground = useCallback(() => {
    const stars = [];
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 0.5,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
        twinkleOffset: Math.random() * Math.PI * 2,
        brightness: Math.random()
      });
    }
    setCosmicBackground(stars);
  }, []);

  // Create particles
  const createParticles = useCallback((x, y, color) => {
    const newParticles = [];
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1,
        decay: 0.02 + Math.random() * 0.02,
        size: Math.random() * 6 + 2,
        color: color
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  }, []);

  // Update balloons animation
  const updateBalloons = useCallback(() => {
    setBalloons(prevBalloons => {
      return prevBalloons.map(balloon => {
        // Floating animation
        const bobAmount = Math.sin(Date.now() * 0.001 + balloon.bobOffset) * 10;
        
        // Mouse attraction
        const dx = mousePosition.x - balloon.x;
        const dy = mousePosition.y - balloon.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let attractionForce = 0;
        if (distance < 150) {
          attractionForce = (150 - distance) / 150 * 0.5;
        }
        
        // Update position
        balloon.vx += (dx / distance) * attractionForce * 0.1;
        balloon.vy += (dy / distance) * attractionForce * 0.1;
        balloon.vx *= 0.95;
        balloon.vy *= 0.95;
        balloon.x += balloon.vx;
        balloon.y += balloon.vy + bobAmount * 0.1;
        
        return balloon;
      });
    });
  }, [mousePosition]);

  // Update particles animation
  const updateParticles = useCallback(() => {
    setParticles(prevParticles => {
      return prevParticles.filter(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1;
        particle.life -= particle.decay;
        return particle.life > 0;
      });
    });
  }, []);

  // Main animation loop
  const animate = useCallback(() => {
    updateBalloons();
    updateParticles();
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateBalloons, updateParticles]);

  // Render cosmic background
  const renderCosmicBackground = useCallback(() => {
    const canvas = cosmicCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    cosmicBackground.forEach(star => {
      const twinkle = Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset);
      const alpha = (star.brightness + twinkle * 0.3) * 0.8;
      
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [cosmicBackground]);

  // Render balloons
  const renderBalloons = useCallback(() => {
    const canvas = balloonCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    balloons.forEach(balloon => {
      ctx.save();
      ctx.translate(balloon.x, balloon.y);
      
      // Balloon body
      ctx.beginPath();
      ctx.arc(0, 0, balloon.size, 0, Math.PI * 2);
      ctx.fillStyle = balloon.color;
      ctx.fill();
      
      // Emoji
      ctx.font = `${balloon.size * 0.4}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(balloon.option.emoji, 0, 0);
      
      ctx.restore();
    });
  }, [balloons]);

  // Render particles
  const renderParticles = useCallback(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      ctx.globalAlpha = particle.life;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [particles]);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize
  useEffect(() => {
    createCosmicBackground();
    
    const updateCanvasSize = () => {
      [balloonCanvasRef, particleCanvasRef, cosmicCanvasRef].forEach(ref => {
        if (ref.current) {
          ref.current.width = window.innerWidth;
          ref.current.height = window.innerHeight;
        }
      });
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [createCosmicBackground]);

  // Start animation
  useEffect(() => {
    animate();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate]);

  // Render loop
  useEffect(() => {
    const renderLoop = () => {
      renderCosmicBackground();
      renderBalloons();
      renderParticles();
      requestAnimationFrame(renderLoop);
    };
    renderLoop();
  }, [renderCosmicBackground, renderBalloons, renderParticles]);

  // Initialize balloons on question change
  useEffect(() => {
    const newBalloons = questions[currentQuestion].options.map(createBalloon);
    setBalloons(newBalloons);
    setSelectedBalloon(null);
  }, [currentQuestion, createBalloon]);

  // Handle balloon click
  const handleBalloonClick = useCallback((balloon) => {
    setSelectedBalloon(balloon);
    handleAnswer(questions[currentQuestion].id, balloon.option.value);
    createParticles(balloon.x, balloon.y, balloon.color);
  }, [currentQuestion]);

  // Canvas click detection
  useEffect(() => {
    const handleCanvasClick = (e) => {
      const rect = balloonCanvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      balloons.forEach(balloon => {
        const dx = clickX - balloon.x;
        const dy = clickY - balloon.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= balloon.size) {
          handleBalloonClick(balloon);
        }
      });
    };
    
    const canvas = balloonCanvasRef.current;
    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick);
      return () => canvas.removeEventListener('click', handleCanvasClick);
    }
  }, [balloons, handleBalloonClick]);

  // Answer handling
  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  // Next question
  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setIsQuestionTransitioning(true);
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setIsQuestionTransitioning(false);
      }, 500);
    } else {
      calculateResults();
    }
  };

  // Calculate final results
  const calculateResults = () => {
    setIsLoading(true);
    
    // Calculate score
    let score = 0;
    let totalWeight = 0;
    
    questions.forEach(question => {
      const answer = answers[question.id];
      const option = question.options.find(opt => opt.value === answer);
      if (option) {
        score += option.weight * 10;
        totalWeight += option.weight;
      }
    });
    
    const finalScore = Math.round((score / totalWeight) * 10);
    setVibeScore(finalScore);
    
    // Generate personality type
    const types = [
      "Quantum Dreamer", "Cosmic Explorer", "Neon Psychonaut", 
      "Digital Shaman", "Starborn Wanderer"
    ];
    setPersonalityType(types[Math.floor(Math.random() * types.length)]);
    
    // Check for achievements
    if (finalScore >= 90) {
      setAchievementUnlocked("Cosmic Harmony Master");
    } else if (finalScore <= 30) {
      setAchievementUnlocked("Zen Void Explorer");
    }
    
    // Simulate fetching weather
    setTimeout(() => {
      setWeatherData({
        condition: ['sunny', 'cloudy', 'rainy', 'stormy'][Math.floor(Math.random() * 4)],
        temperature: Math.floor(Math.random() * 30) + 10
      });
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mb-4"></div>
          <p className="text-white text-xl">Processing your cosmic vibe signature...</p>
        </div>
      </div>
    );
  }

  if (vibeScore !== null) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-white">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">Your Vibe Analysis Complete! 🎉</h1>
              <div className="text-6xl font-bold text-yellow-400 mb-2">{vibeScore}/100</div>
              <p className="text-lg">
                {vibeScore >= 80 ? '🔥 Legendary Vibes!' : 
                 vibeScore >= 60 ? '⚡ High Energy!' : 
                 vibeScore >= 40 ? '🌊 Chill Vibes' : '🌙 Low-key Energy'}
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-all"
              >
                Experience Again
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Brain className="text-purple-300 mr-2" size={24} />
                  <h3 className="text-lg font-bold">Mindset Matrix</h3>
                </div>
                <p className="text-sm">{personalityType}</p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <MapPin className="text-green-300 mr-2" size={24} />
                  <h3 className="text-lg font-bold">Location Vibes</h3>
                </div>
                <p className="text-sm">
                  {weatherData ? `${weatherData.condition} (${weatherData.temperature}°C)` : 'Unknown'}
                </p>
              </div>

              <div className="bg-white/10 p-6 rounded-2xl">
                <div className="flex items-center mb-4">
                  <Clock className="text-yellow-300 mr-2" size={24} />
                  <h3 className="text-lg font-bold">Time Alignment</h3>
                </div>
                <p className="text-sm">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            {achievementUnlocked && (
              <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 p-6 rounded-2xl border border-yellow-500/50 mb-6">
                <div className="flex items-center">
                  <Trophy className="text-yellow-400 mr-3" size={32} />
                  <div>
                    <h3 className="text-xl font-bold">Achievement Unlocked!</h3>
                    <p className="text-yellow-200">{achievementUnlocked}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background canvases */}
      <canvas 
        ref={cosmicCanvasRef} 
        className="fixed inset-0 w-full h-full z-0"
      />
      <canvas 
        ref={particleCanvasRef} 
        className="fixed inset-0 w-full h-full z-10 pointer-events-none"
      />
      <canvas 
        ref={balloonCanvasRef} 
        className="fixed inset-0 w-full h-full z-20 pointer-events-none"
      />

      {/* Content overlay */}
      <div className={`relative z-30 h-full w-full flex flex-col items-center justify-center p-4 transition-opacity duration-500 ${isQuestionTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Vibe Check
          </h1>
          
          <div className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {questions[currentQuestion].text}
            </h2>
            <p className="text-purple-200 mb-6">
              {questions[currentQuestion].subtitle}
            </p>
            
            <div className="flex justify-center mt-12">
              <button 
                onClick={handleNext}
                disabled={!answers[questions[currentQuestion].id]}
                className={`px-8 py-3 rounded-xl font-bold transition-all ${answers[questions[currentQuestion].id] ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
              >
                {currentQuestion === questions.length - 1 ? 'Calculate My Vibe' : 'Next Dimension'}
              </button>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {questions.map((_, index) => (
              <div 
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${currentQuestion === index ? 'w-8 bg-purple-500' : 'w-4 bg-white/30'}`}
              />
            ))}
          </div>
        </div>

        {/* Sound toggle */}
        <button 
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="fixed bottom-4 right-4 bg-white/10 p-3 rounded-full backdrop-blur-lg hover:bg-white/20 transition-all"
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          <Music className={soundEnabled ? "text-white" : "text-white/50"} size={20} />
        </button>
      </div>
    </div>
  );
};

export default VibeCheckApp;    