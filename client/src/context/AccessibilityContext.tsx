import React, { createContext, useContext, useState, useEffect } from 'react';
import { AccessibilitySettings, AccessibilityProfile } from '../types';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  activeProfile: AccessibilityProfile;
  setSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  applyProfile: (profile: AccessibilityProfile) => void;
  resetAccessibility: () => void;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  textToSpeech: true,
  audioInstructions: true,
  reducedAnimation: false,
  calmMode: false,
  fontFamily: 'sans',
  readingRuler: false,
  largeButtons: true,
};

const PROFILE_PRESETS: Record<AccessibilityProfile, Partial<AccessibilitySettings>> = {
  dyslexia: {
    fontFamily: 'lexend',
    fontSize: 'large',
    readingRuler: false,
    textToSpeech: true,
    audioInstructions: true,
    largeButtons: true,
  },
  adhd: {
    fontFamily: 'sans',
    fontSize: 'normal',
    readingRuler: false,
    audioInstructions: true,
    reducedAnimation: false,
    calmMode: false,
    largeButtons: true,
  },
  autism: {
    fontFamily: 'sans',
    fontSize: 'normal',
    reducedAnimation: true,
    calmMode: true,
    readingRuler: false,
    largeButtons: true,
  },
  slow_learning: {
    fontFamily: 'lexend',
    fontSize: 'large',
    textToSpeech: true,
    audioInstructions: true,
    reducedAnimation: false,
    largeButtons: true,
  },
  default: {
    fontFamily: 'sans',
    fontSize: 'normal',
    highContrast: false,
    textToSpeech: true,
    audioInstructions: true,
    reducedAnimation: false,
    calmMode: false,
    readingRuler: false,
    largeButtons: true,
  }
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeProfile, setActiveProfile] = useState<AccessibilityProfile>(() => {
    return (localStorage.getItem('learnable_profile') as AccessibilityProfile) || 'dyslexia';
  });

  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('learnable_accessibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return { ...DEFAULT_SETTINGS, ...PROFILE_PRESETS['dyslexia'] };
  });

  // Apply DOM classes whenever settings change
  useEffect(() => {
    const body = document.body;

    // Font size
    body.classList.remove('font-size-large', 'font-size-xlarge');
    if (settings.fontSize === 'large') body.classList.add('font-size-large');
    if (settings.fontSize === 'xlarge') body.classList.add('font-size-xlarge');

    // High Contrast
    if (settings.highContrast) {
      body.classList.add('high-contrast');
    } else {
      body.classList.remove('high-contrast');
    }

    // Calm Mode
    if (settings.calmMode) {
      body.classList.add('calm-mode');
    } else {
      body.classList.remove('calm-mode');
    }

    // Reduced Animation
    if (settings.reducedAnimation) {
      body.classList.add('reduced-animation');
    } else {
      body.classList.remove('reduced-animation');
    }

    // Font Family
    if (settings.fontFamily === 'lexend') {
      body.classList.add('font-lexend');
    } else {
      body.classList.remove('font-lexend');
    }

    // Large Touch Targets
    if (settings.largeButtons) {
      body.classList.add('large-touch-targets');
    } else {
      body.classList.remove('large-touch-targets');
    }

    localStorage.setItem('learnable_accessibility', JSON.stringify(settings));
    localStorage.setItem('learnable_profile', activeProfile);
  }, [settings, activeProfile]);

  const setSetting = <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profile: AccessibilityProfile) => {
    setActiveProfile(profile);
    setSettings(prev => ({
      ...prev,
      ...PROFILE_PRESETS[profile],
    }));
  };

  const resetAccessibility = () => {
    applyProfile('default');
  };

  return (
    <AccessibilityContext.Provider value={{ settings, activeProfile, setSetting, applyProfile, resetAccessibility }}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
