import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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

export default function DeathScreen() {
  const router = useRouter();
  const { currentCatIndex, resetAll } = useGameStore();
  const params = useLocalSearchParams<{
    name: string;
    cause: string;
    score: string;
    level: string;
    furColor: string;
    eyeColor: string;
    collarColor: string;
  }>();

  const livesRemaining = 9 - currentCatIndex;
  const allDead = currentCatIndex >= 9;
  const nextPreset = !allDead ? PRESET_CATS[currentCatIndex] : null;

  return (
    <View style={styles.safe}>
      <View style={styles.row}>
        {/* Left: memorial */}
        <View style={styles.leftCol}>
          <View style={styles.tombstone}>
            <View style={styles.crossRow}>
              <View style={styles.crossH} />
            </View>
            <Text style={styles.rip}>R.I.P.</Text>
            <Text style={styles.name}>{params.name?.toUpperCase()}</Text>
            <View style={styles.divider} />
            <View style={styles.ghost}>
              <View style={{ transform: [{ rotate: '-6deg' }] }}>
                <CatHead furColor={params.furColor || '#888'} eyeColor={params.eyeColor || '#666'} size={36} />
              </View>
            </View>
            <Text style={styles.cause} numberOfLines={2}>{params.cause}</Text>
          </View>
        </View>

        {/* Center: stats */}
        <View style={styles.centerCol}>
          <View style={styles.stats}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>STEPS</Text>
              <Text style={styles.statValue}>{params.score}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>LEVEL</Text>
              <Text style={styles.statValue}>{params.level}</Text>
            </View>
          </View>
          {livesRemaining > 0 && (
            <Text style={styles.livesText}>
              {livesRemaining} {livesRemaining === 1 ? 'LIFE' : 'LIVES'} LEFT
            </Text>
          )}
        </View>

        {/* Right: actions */}
        <View style={styles.rightCol}>
          {allDead ? (
            <>
              <Text style={styles.allUsed}>ALL 9 LIVES USED</Text>
              <BouncyButton style={styles.button} onPress={() => { resetAll(); router.replace('/home'); }}>
                <Text style={styles.buttonText}>START OVER</Text>
              </BouncyButton>
            </>
          ) : (
            <>
              {nextPreset && (
                <Text style={styles.nextCatName}>NEXT: {nextPreset.name.toUpperCase()}</Text>
              )}
              <BouncyButton style={styles.button} onPress={() => router.replace('/game')}>
                <Text style={styles.buttonText}>NEXT CAT</Text>
              </BouncyButton>
            </>
          )}
          <BouncyButton style={styles.secondaryButton} onPress={() => router.replace('/home')}>
            <Text style={styles.secondaryText}>HOME</Text>
          </BouncyButton>
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
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 20,
  },
  leftCol: {
    alignItems: 'center',
    flex: 1,
  },
  centerCol: {
    alignItems: 'center',
    flex: 0.7,
  },
  rightCol: {
    alignItems: 'center',
    flex: 1,
  },
  tombstone: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 3,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#0f0f0f',
  },
  crossRow: {
    width: 14,
    height: 20,
    marginBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossH: {
    width: 14,
    height: 2,
    backgroundColor: '#444',
  },
  rip: {
    fontSize: 22,
    fontWeight: '900',
    color: '#555',
    letterSpacing: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#bbb',
    marginTop: 2,
    letterSpacing: 2,
  },
  divider: {
    width: 30,
    height: 1,
    backgroundColor: '#222',
    marginVertical: 6,
  },
  ghost: {
    opacity: 0.3,
    marginBottom: 4,
  },
  cause: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  stats: {
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 3,
    padding: 10,
    width: '100%',
    backgroundColor: '#0f0f0f',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  statDivider: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginVertical: 4,
  },
  statLabel: { color: '#555', fontSize: 10, letterSpacing: 2 },
  statValue: { color: '#fff', fontSize: 13, fontWeight: '900' },
  livesText: {
    color: '#444',
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 6,
  },
  nextCatName: {
    color: '#bbb',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  allUsed: {
    fontSize: 12,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 2,
    marginBottom: 6,
  },
  buttonText: { color: '#0a0a0a', fontSize: 12, fontWeight: '900', letterSpacing: 2 },
  secondaryButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 2,
  },
  secondaryText: { color: '#555', fontSize: 10, letterSpacing: 2 },
});
