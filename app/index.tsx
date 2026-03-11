import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import CatHead from '../components/ui/cat-head';

export default function SplashScreen() {
  const router = useRouter();

  const catScale = useSharedValue(0);
  const catRotation = useSharedValue(-15);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const dotsOpacity = useSharedValue(0);
  const glowOpacity = useSharedValue(0);
  const wholeOpacity = useSharedValue(1);

  useEffect(() => {
    // Cat head bounces in
    catScale.value = withSpring(1, { damping: 8, stiffness: 120 });
    catRotation.value = withSequence(
      withTiming(10, { duration: 200 }),
      withTiming(-5, { duration: 150 }),
      withTiming(3, { duration: 120 }),
      withTiming(0, { duration: 100 }),
    );

    // Glow pulse behind cat
    glowOpacity.value = withDelay(300, withRepeat(
      withSequence(
        withTiming(0.6, { duration: 800 }),
        withTiming(0.2, { duration: 800 }),
      ),
      -1,
      true,
    ));

    // Title slides up
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 500 }));
    titleTranslateY.value = withDelay(400, withSpring(0, { damping: 12, stiffness: 100 }));

    // Subtitle fades in
    subtitleOpacity.value = withDelay(800, withTiming(1, { duration: 400 }));

    // Loading dots
    dotsOpacity.value = withDelay(1000, withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0.3, { duration: 500 }),
      ),
      -1,
      true,
    ));

    // Navigate after 2.5s
    const timer = setTimeout(() => {
      wholeOpacity.value = withTiming(0, { duration: 300, easing: Easing.in(Easing.quad) });
      setTimeout(() => {
        router.replace('/home');
      }, 350);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const catStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: catScale.value },
      { rotate: `${catRotation.value}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const dotsStyle = useAnimatedStyle(() => ({
    opacity: dotsOpacity.value,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: wholeOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background grid */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {Array.from({ length: 5 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 16.6}%` }]} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 11.1}%` }]} />
        ))}
      </View>

      <View style={styles.content}>
        {/* Glow behind cat */}
        <Animated.View style={[styles.glow, glowStyle]} />

        {/* Cat head logo */}
        <Animated.View style={[styles.catWrap, catStyle]}>
          <CatHead furColor="#F5A623" eyeColor="#4CAF50" size={90} />
        </Animated.View>

        {/* Title */}
        <Animated.View style={titleStyle}>
          <Text style={styles.title}>CAT-A-STROPHE</Text>
          <View style={styles.titleLine} />
        </Animated.View>

        {/* Subtitle */}
        <Animated.View style={subtitleStyle}>
          <Text style={styles.subtitle}>NINE LIVES. MAKE THEM COUNT.</Text>
        </Animated.View>

        {/* Loading dots */}
        <Animated.View style={[styles.dotsRow, dotsStyle]}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
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
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(245, 166, 35, 0.15)',
  },
  catWrap: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    letterSpacing: 5,
  },
  titleLine: {
    width: 50,
    height: 2,
    backgroundColor: '#fff',
    alignSelf: 'center',
    marginVertical: 6,
  },
  subtitle: {
    fontSize: 9,
    color: '#555',
    letterSpacing: 3,
    marginTop: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 20,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
  },
});
