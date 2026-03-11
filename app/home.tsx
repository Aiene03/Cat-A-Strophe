import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useGameStore } from '../store/game-store';
import { PRESET_CATS } from '../game/presets';
import CatHead from '../components/ui/cat-head';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function BouncyButton({ style, onPress, children }: { style: any; onPress: () => void; children: React.ReactNode }) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      style={[style, animStyle]}
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95, { damping: 15, stiffness: 300 }); }}
      onPressOut={() => { scale.value = withSpring(1, { damping: 8, stiffness: 200 }); }}
    >
      {children}
    </AnimatedPressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { currentCat, currentCatIndex, bestCat, graveyard, resetAll } = useGameStore();

  const livesRemaining = 9 - currentCatIndex;
  const allDead = currentCatIndex >= 9;
  const nextPreset = !allDead ? PRESET_CATS[currentCatIndex] : null;

  return (
    <View style={styles.safe}>
      {/* Corner decorations */}
      <View style={[styles.cornerLine, { top: 8, left: 8 }]} />
      <View style={[styles.cornerLine, { top: 8, right: 8, transform: [{ rotate: '90deg' }] }]} />
      <View style={[styles.cornerLine, { bottom: 8, left: 8, transform: [{ rotate: '-90deg' }] }]} />
      <View style={[styles.cornerLine, { bottom: 8, right: 8, transform: [{ rotate: '180deg' }] }]} />

      {/* Grid overlay */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 16.6}%` }]} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 11.1}%` }]} />
        ))}
      </View>

      {/* Horizontal layout: left side = branding, right side = actions */}
      <View style={styles.row}>
        {/* Left: title + cat */}
        <View style={styles.leftCol}>
          <Text style={styles.title}>CAT-A-STROPHE</Text>
          <View style={styles.titleLine} />
          <Text style={styles.subtitle}>NINE LIVES. MAKE THEM COUNT.</Text>
          <View style={styles.catFace}>
            {nextPreset ? (
              <CatHead furColor={nextPreset.furColor} eyeColor={nextPreset.eyeColor} size={56} />
            ) : (
              <CatHead furColor="#888" eyeColor="#666" size={56} />
            )}
          </View>
          {/* Lives indicator */}
          <View style={styles.livesRow}>
            {PRESET_CATS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.lifePip,
                  i < currentCatIndex
                    ? { backgroundColor: '#444' }
                    : i === currentCatIndex
                    ? { backgroundColor: '#fff' }
                    : { backgroundColor: 'transparent', borderColor: '#555' },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Right: actions */}
        <View style={styles.rightCol}>
          {allDead ? (
            <>
              <Text style={styles.allDead}>ALL CATS LOST</Text>
              <BouncyButton style={styles.button} onPress={() => { resetAll(); }}>
                <Text style={styles.buttonText}>START OVER</Text>
              </BouncyButton>
            </>
          ) : (
            <>
              {nextPreset && (
                <Text style={styles.nextCatText}>{nextPreset.name}</Text>
              )}
              <Text style={styles.livesText}>
                {livesRemaining} {livesRemaining === 1 ? 'LIFE' : 'LIVES'} REMAINING
              </Text>
              {currentCat?.alive ? (
                <BouncyButton style={styles.button} onPress={() => router.push('/game')}>
                  <Text style={styles.buttonText}>CONTINUE</Text>
                </BouncyButton>
              ) : (
                <BouncyButton style={styles.button} onPress={() => router.push('/game')}>
                  <Text style={styles.buttonText}>PLAY</Text>
                </BouncyButton>
              )}
            </>
          )}

          {graveyard.length > 0 && (
            <BouncyButton style={styles.secondaryButton} onPress={() => router.push('/graveyard')}>
              <Text style={styles.secondaryText}>GRAVEYARD ({graveyard.length})</Text>
            </BouncyButton>
          )}

          {bestCat && (
            <View style={styles.bestRow}>
              <View style={styles.bestLine} />
              <Text style={styles.bestText}>
                BEST: {bestCat.name.toUpperCase()} LV.{bestCat.level}
              </Text>
              <View style={styles.bestLine} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  cornerLine: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    zIndex: 10,
  },
  gridOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  gridLineH: {
    position: 'absolute',
    left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0, bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.025)',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 30,
  },
  leftCol: {
    alignItems: 'center',
    flex: 1,
  },
  rightCol: {
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 5,
  },
  titleLine: {
    width: 50,
    height: 2,
    backgroundColor: '#fff',
    marginVertical: 6,
  },
  subtitle: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 3,
    marginBottom: 10,
  },
  catFace: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 40,
    padding: 8,
  },
  livesRow: {
    flexDirection: 'row',
    gap: 5,
  },
  lifePip: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    borderWidth: 1,
    borderColor: '#888',
  },
  nextCatText: {
    color: '#ccc',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 2,
    marginBottom: 3,
  },
  livesText: {
    color: '#555',
    fontSize: 10,
    letterSpacing: 2,
    marginBottom: 10,
  },
  allDead: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 4,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 2,
    marginBottom: 8,
  },
  buttonText: {
    color: '#0a0a0a',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 3,
  },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 2,
    marginBottom: 8,
  },
  secondaryText: {
    color: '#777',
    fontSize: 11,
    letterSpacing: 2,
  },
  bestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bestLine: {
    width: 16,
    height: 1,
    backgroundColor: '#333',
  },
  bestText: {
    color: '#444',
    fontSize: 9,
    letterSpacing: 2,
  },
});
