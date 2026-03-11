import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PRESET_CATS } from '../../game/presets';

interface Props {
  catName: string;
  level: number;
  score: number;
  bestCat?: { name: string; level: number } | null;
  currentCatIndex: number;
  furColor: string;
}

export default function HUD({ catName, level, score, bestCat, currentCatIndex, furColor }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={styles.nameRow}>
          <View style={[styles.furDot, { backgroundColor: furColor }]} />
          <Text style={styles.name} numberOfLines={1}>{catName.toUpperCase()}</Text>
        </View>
        <Text style={styles.info}>LV.{level}</Text>
      </View>
      <View style={styles.center}>
        <View style={styles.livesRow}>
          {PRESET_CATS.map((preset, i) => {
            const isDead = i < currentCatIndex;
            const isCurrent = i === currentCatIndex;
            return (
              <View
                key={i}
                style={[
                  styles.lifeDot,
                  isDead
                    ? { backgroundColor: '#444', borderColor: '#444' }
                    : isCurrent
                    ? { backgroundColor: '#fff', borderColor: '#fff' }
                    : { backgroundColor: 'transparent', borderColor: '#555' },
                ]}
              />
            );
          })}
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.score}>{score}</Text>
        {bestCat && (
          <Text style={styles.best} numberOfLines={1}>BEST: {bestCat.name.toUpperCase()}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: '#0a0a0a',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  left: { flex: 1 },
  center: { flex: 1, alignItems: 'center' },
  right: { flex: 1, alignItems: 'flex-end' },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  furDot: { width: 8, height: 8, borderRadius: 4 },
  name: { color: '#ccc', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  info: { color: '#555', fontSize: 10, letterSpacing: 1 },
  livesRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', justifyContent: 'center' },
  lifeDot: { width: 7, height: 7, borderRadius: 3.5, borderWidth: 1.5 },
  score: { color: '#fff', fontSize: 16, fontWeight: '900' },
  best: { color: '#444', fontSize: 8, letterSpacing: 1 },
});
