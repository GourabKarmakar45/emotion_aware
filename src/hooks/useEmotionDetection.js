import { useState, useEffect, useRef, useCallback } from 'react';
import * as faceapi from 'face-api.js';

// Emotion labels mapping
const EMOTION_LABELS = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];

// Map face-api emotions to our app's emotions
const mapEmotion = (emotion) => {
  const mapping = {
    'happy': 'Happy',
    'sad': 'Sad',
    'angry': 'Angry',
    'fear': 'Confused',
    'surprise': 'Focused',
    'neutral': 'Neutral',
    'disgust': 'Angry'
  };
  return mapping[emotion] || 'Neutral';
};

export const useEmotionDetection = (videoRef, onEmotionChange) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [emotionHistory, setEmotionHistory] = useState([]);
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const modelsLoadedRef = useRef(false);

  // Initialize webcam
  const initializeWebcam = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsWebcamOn(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Could not access webcam. Please ensure camera permissions are granted.');
      return false;
    }
  }, [videoRef]);

  // Load face-api models
  const loadModels = useCallback(async () => {
    if (modelsLoadedRef.current) return true;
    
    try {
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
      
      modelsLoadedRef.current = true;
      return true;
    } catch (err) {
      console.error('Error loading models:', err);
      setError('Failed to load emotion detection models.');
      return false;
    }
  }, []);

  // Detect emotions in the video frame
  const detectEmotions = useCallback(async () => {
    if (!videoRef.current || !modelsLoadedRef.current) return;

    try {
      const video = videoRef.current;
      
      // Check if video is ready
      if (video.readyState !== 4) return;

      // Detect faces with expressions
      const detections = await faceapi.detectAllFaces(
        video,
        new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.5 })
      ).withFaceExpressions();

      if (detections.length > 0) {
        // Get the largest face
        const largestFace = detections.reduce((prev, current) => {
          const prevBox = prev.detection.box;
          const currBox = current.detection.box;
          return (prevBox.width * prevBox.height) > (currBox.width * currBox.height) ? prev : current;
        });

        const expressions = largestFace.expressions;
        
        // Get the emotion with highest confidence
        let maxEmotion = 'neutral';
        let maxConfidence = 0;
        
        Object.entries(expressions).forEach(([emotion, conf]) => {
          if (conf > maxConfidence) {
            maxConfidence = conf;
            maxEmotion = emotion;
          }
        });

        const mappedEmotion = mapEmotion(maxEmotion);
        
        setCurrentEmotion(mappedEmotion);
        setConfidence(Math.round(maxConfidence * 100));

        // Add to history (keep last 20)
        setEmotionHistory(prev => {
          const newHistory = [...prev, { 
            emotion: mappedEmotion, 
            confidence: Math.round(maxConfidence * 100),
            timestamp: Date.now()
          }];
          return newHistory.slice(-20);
        });
      }
    } catch (err) {
      console.error('Error detecting emotions:', err);
    }
  }, [videoRef]);

  // Start emotion detection
  const startDetection = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // Load models first
    const modelsLoaded = await loadModels();
    if (!modelsLoaded) {
      setIsLoading(false);
      return;
    }

    // Initialize webcam
    const webcamInitialized = await initializeWebcam();
    if (!webcamInitialized) {
      setIsLoading(false);
      return;
    }

    // Wait for video to be ready
    if (videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        videoRef.current.play();
        
        // Start detection interval
        detectionIntervalRef.current = setInterval(detectEmotions, 500);
        setIsLoading(false);
      };
    }
  }, [loadModels, initializeWebcam, detectEmotions, videoRef]);

  // Stop emotion detection
  const stopDetection = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsWebcamOn(false);
  }, []);

  // Get emotion breakdown for display
  const getEmotionBreakdown = useCallback(() => {
    if (emotionHistory.length === 0) return [];

    const counts = {};
    emotionHistory.forEach(({ emotion }) => {
      counts[emotion] = (counts[emotion] || 0) + 1;
    });

    const total = emotionHistory.length;
    const colors = {
      'Happy': '#fbbf24',
      'Focused': '#10b981',
      'Neutral': '#6b7280',
      'Confused': '#ef4444',
      'Sad': '#3b82f6',
      'Angry': '#ef4444'
    };

    return Object.entries(counts).map(([emotion, count]) => ({
      emotion,
      percentage: Math.round((count / total) * 100),
      color: colors[emotion] || '#6b7280'
    }));
  }, [emotionHistory]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, [stopDetection]);

  return {
    isLoading,
    error,
    currentEmotion,
    confidence,
    emotionHistory,
    isWebcamOn,
    startDetection,
    stopDetection,
    getEmotionBreakdown
  };
};

export default useEmotionDetection;

