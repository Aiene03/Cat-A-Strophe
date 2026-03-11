import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../store/game-store';
import { createInitialGameState } from '../game/engine';
import { GameState } from '../game/types';
import GameBoard from '../components/game/game-board';

export default function GameScreen() {
  const router = useRouter();
  const { currentCat, currentCatIndex, bestCat, killCat, updateCatProgress, startGame } = useGameStore();
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  useEffect(() => {
    startGame();
  }, []);

  useEffect(() => {
    if (!currentCat || !currentCat.alive) {
      // Wait a tick for store to hydrate
      const timer = setTimeout(() => {
        const cat = useGameStore.getState().currentCat;
        if (!cat || !cat.alive) {
          router.replace('/home');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentCat]);

  useEffect(() => {
    if (gameState.isPlaying && currentCat) {
      updateCatProgress(gameState.score, gameState.level);
    }
  }, [gameState.level]);

  const handleDeath = useCallback((cause: string) => {
    if (currentCat) {
      killCat(cause, gameState.score, gameState.level);
      router.replace({
        pathname: '/death',
        params: {
          name: currentCat.name,
          cause,
          score: gameState.score.toString(),
          level: gameState.level.toString(),
          furColor: currentCat.furColor,
          eyeColor: currentCat.eyeColor,
          collarColor: currentCat.collarColor,
        },
      });
    }
  }, [currentCat, gameState.score, gameState.level]);

  if (!currentCat) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <GameBoard
      gameState={gameState}
      setGameState={setGameState}
      catName={currentCat.name}
      furColor={currentCat.furColor}
      eyeColor={currentCat.eyeColor}
      collarColor={currentCat.collarColor}
      currentCatIndex={currentCatIndex}
      bestCat={bestCat}
      onDeath={handleDeath}
    />
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: '#0a0a0a', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#555', fontSize: 14, letterSpacing: 3 },
});
