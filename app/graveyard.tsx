import React from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { useGameStore } from '../store/game-store';
import { CatState } from '../game/types';
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

export default function GraveyardScreen() {
  const router = useRouter();
  const graveyard = useGameStore((s) => s.graveyard);

  const renderCat = ({ item, index }: { item: CatState; index: number }) => (
    <View style={styles.card}>
      <View style={styles.cardNumber}>
        <Text style={styles.cardNumberText}>{graveyard.length - index}</Text>
      </View>
      <View style={styles.catHeadWrap}>
        <CatHead furColor={item.furColor} eyeColor={item.eyeColor} size={32} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.catName}>{item.name.toUpperCase()}</Text>
        <Text style={styles.catCause}>{item.causeOfDeath}</Text>
      </View>
      <View style={styles.cardStats}>
        <Text style={styles.catLevel}>LV.{item.highestLevel}</Text>
        <Text style={styles.catSteps}>{item.stepsTotal} steps</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLine} />
        <Text style={styles.title}>GRAVEYARD</Text>
        <View style={styles.headerLine} />
      </View>
      <Text style={styles.subtitle}>
        {graveyard.length} CAT{graveyard.length !== 1 ? 'S' : ''} LOST
      </Text>

      <FlatList
        data={[...graveyard].reverse()}
        renderItem={renderCat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No casualties yet.</Text>
        }
      />

      <BouncyButton style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>BACK</Text>
      </BouncyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a', padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  headerLine: {
    width: 30,
    height: 1,
    backgroundColor: '#444',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#888',
    textAlign: 'center',
    letterSpacing: 6,
  },
  subtitle: {
    fontSize: 10,
    color: '#555',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
    letterSpacing: 3,
  },
  list: { paddingBottom: 10 },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 2,
    padding: 12,
    marginBottom: 6,
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
  },
  cardNumber: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  cardNumberText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '900',
  },
  catHeadWrap: { marginRight: 12 },
  cardInfo: { flex: 1 },
  catName: { color: '#ccc', fontSize: 14, fontWeight: '800', letterSpacing: 2 },
  catCause: { color: '#555', fontSize: 11, marginTop: 2 },
  cardStats: { alignItems: 'flex-end' },
  catLevel: { color: '#888', fontSize: 13, fontWeight: '900' },
  catSteps: { color: '#444', fontSize: 10, marginTop: 2 },
  empty: { color: '#333', textAlign: 'center', marginTop: 40, fontSize: 13, letterSpacing: 2 },
  backButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#1a1a1a',
  },
  backText: { color: '#666', fontSize: 13, letterSpacing: 3 },
});
