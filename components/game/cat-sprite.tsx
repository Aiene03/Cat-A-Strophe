import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  type SharedValue,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { CELL_SIZE } from '../../game/types';

interface Props {
  furColor: string;
  eyeColor: string;
  collarColor: string;
  translateX: SharedValue<number>;
  translateY: SharedValue<number>;
  scaleX: SharedValue<number>;
  rotation: SharedValue<number>;
  shadowScale: SharedValue<number>;
  isDead: boolean;
  opacity: SharedValue<number>;
}

export default function CatSprite({
  furColor, eyeColor, collarColor,
  translateX, translateY, scaleX, rotation, shadowScale,
  isDead, opacity,
}: Props) {
  const blink = useSharedValue(1);
  const breathe = useSharedValue(1);

  useEffect(() => {
    // Breathing animation
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.03, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1,
      true
    );

    // Random blinking animation
    let blinkTimer: ReturnType<typeof setTimeout>;
    const runBlink = () => {
      const delay = 2000 + Math.random() * 3000;
      blink.value = withDelay(
        delay,
        withSequence(
          withTiming(0, { duration: 100 }),
          withTiming(1, { duration: 100 }),
          withTiming(0, { duration: 100 }),
          withTiming(1, { duration: 100 })
        )
      );
      blinkTimer = setTimeout(runBlink, delay + 400);
    };
    runBlink();
    return () => clearTimeout(blinkTimer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scaleX: scaleX.value },
      { scaleY: breathe.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const shadowStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: shadowScale.value * 1.1 }, { scaleY: 0.3 }],
    opacity: shadowScale.value * 0.4,
  }));

  const eyeAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: isDead ? 1 : blink.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.container, animStyle]}>
        {/* Tail — fluffier multi-segment curve */}
        <View style={styles.tailBase}>
          <View style={[styles.tailSeg, { backgroundColor: furColor, width: 12, height: 6, transform: [{ rotate: '-40deg' }] }]} />
          <View style={[styles.tailSeg, { backgroundColor: furColor, width: 10, height: 7, transform: [{ rotate: '-70deg' }], marginLeft: -4, marginTop: -2 }]} />
          <View style={[styles.tailSeg, { backgroundColor: furColor, width: 8, height: 6, transform: [{ rotate: '-100deg' }], marginLeft: -6, marginTop: -4 }]} />
        </View>

        {/* Back legs */}
        <View style={styles.backLegArea}>
          <View style={[styles.backLeg, { backgroundColor: furColor }]}>
            <View style={styles.pawPad} />
          </View>
          <View style={[styles.backLeg, { backgroundColor: furColor, marginLeft: 2 }]}>
            <View style={styles.pawPad} />
          </View>
        </View>

        {/* Body */}
        <View style={[styles.body, { backgroundColor: furColor }]}>
          {/* Fur patches/texture */}
          <View style={[styles.patch, { top: 4, left: 2, width: 12, height: 8, borderRadius: 4 }]} />
          <View style={[styles.patch, { bottom: 6, right: 2, width: 10, height: 6, borderRadius: 3 }]} />
          
          {/* Belly */}
          <View style={styles.belly} />
          
          {/* Fur stripe markings */}
          <View style={[styles.stripe, { top: S * 0.04 }]} />
          <View style={[styles.stripe, { top: S * 0.14 }]} />
        </View>

        {/* Front legs */}
        <View style={styles.frontLegArea}>
          <View style={[styles.frontLeg, { backgroundColor: furColor }]}>
            <View style={styles.pawPad} />
          </View>
          <View style={[styles.frontLeg, { backgroundColor: furColor, marginLeft: 2 }]}>
            <View style={styles.pawPad} />
          </View>
        </View>

        {/* Collar */}
        <View style={[styles.collar, { backgroundColor: collarColor }]}>
          <View style={styles.bell} />
        </View>

        {/* Head */}
        <View style={[styles.head, { backgroundColor: furColor }]}>
          {/* Ears - Triangular */}
          <View style={styles.earLeft}>
            <View style={[styles.earTriangle, { borderBottomColor: furColor }]} />
            <View style={styles.earInnerTriangle} />
          </View>
          <View style={styles.earRight}>
            <View style={[styles.earTriangle, { borderBottomColor: furColor }]} />
            <View style={styles.earInnerTriangle} />
          </View>

          {/* Face lighter area */}
          <View style={styles.faceLight} />
          
          {/* Cheek Highlights */}
          <View style={[styles.cheek, { left: 4 }]} />
          <View style={[styles.cheek, { right: 4 }]} />

          {/* Eyes */}
          <View style={styles.eyeRow}>
            {isDead ? (
              <>
                <View style={styles.deadEye}><View style={styles.deadEyeX1}/><View style={styles.deadEyeX2}/></View>
                <View style={styles.deadEye}><View style={styles.deadEyeX1}/><View style={styles.deadEyeX2}/></View>
              </>
            ) : (
              <>
                <Animated.View style={[styles.eyeWhite, eyeAnimStyle]}>
                  <View style={[styles.iris, { backgroundColor: eyeColor }]}>
                    <View style={styles.pupil} />
                  </View>
                  <View style={styles.eyeShine} />
                </Animated.View>
                <Animated.View style={[styles.eyeWhite, eyeAnimStyle]}>
                  <View style={[styles.iris, { backgroundColor: eyeColor }]}>
                    <View style={styles.pupil} />
                  </View>
                  <View style={styles.eyeShine} />
                </Animated.View>
              </>
            )}
          </View>

          {/* Nose */}
          <View style={styles.nose} />

          {/* Mouth */}
          <View style={styles.mouthArea}>
            <View style={styles.mouthL} />
            <View style={styles.mouthR} />
          </View>

          {/* Whiskers Left */}
          <View style={styles.whiskerLeft}>
            <View style={[styles.whisker, { transform: [{ rotate: '12deg' }] }]} />
            <View style={[styles.whisker, { width: 10, transform: [{ scaleX: -1 }] }]} />
            <View style={[styles.whisker, { transform: [{ rotate: '-12deg' }] }]} />
          </View>

          {/* Whiskers Right */}
          <View style={styles.whiskerRight}>
            <View style={[styles.whisker, { transform: [{ rotate: '-12deg' }] }]} />
            <View style={[styles.whisker, { width: 10 }]} />
            <View style={[styles.whisker, { transform: [{ rotate: '12deg' }] }]} />
          </View>
        </View>
      </Animated.View>

      {/* Shadow */}
      <Animated.View style={[styles.shadow, shadowStyle]} />
    </View>
  );
}

const S = CELL_SIZE * 0.9;
const styles = StyleSheet.create({
  wrapper: {
    width: S,
    height: S,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: S,
    height: S * 0.75,
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Tail segments
  tailBase: {
    marginRight: -2,
    alignItems: 'flex-start',
    zIndex: -1,
  },
  tailSeg: {
    borderRadius: 4,
  },

  // Back legs
  backLegArea: {
    position: 'absolute',
    bottom: -2,
    left: S * 0.15,
    flexDirection: 'row',
  },
  backLeg: {
    width: 6,
    height: 10,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  // Body
  body: {
    width: S * 0.42,
    height: S * 0.52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -3,
    overflow: 'hidden',
  },
  patch: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  belly: {
    width: S * 0.25,
    height: S * 0.32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  stripe: {
    position: 'absolute',
    right: 2,
    width: S * 0.1,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },

  // Front legs
  frontLegArea: {
    position: 'absolute',
    bottom: -2,
    left: S * 0.45,
    flexDirection: 'row',
  },
  frontLeg: {
    width: 6,
    height: 11,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  pawPad: {
    width: 4.5,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#D4838A',
    marginBottom: 0.5,
  },

  // Collar
  collar: {
    position: 'absolute',
    bottom: S * 0.12,
    right: S * 0.28,
    width: 5,
    height: S * 0.35,
    borderRadius: 2.5,
    alignItems: 'center',
    zIndex: 2,
  },
  bell: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFD700',
    marginTop: 1,
    borderWidth: 0.5,
    borderColor: '#DAA520',
  },

  // Head
  head: {
    width: S * 0.42,
    height: S * 0.46,
    borderRadius: S * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    zIndex: 3,
  },
  faceLight: {
    position: 'absolute',
    bottom: S * 0.02,
    width: S * 0.26,
    height: S * 0.18,
    borderRadius: S * 0.1,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cheek: {
    position: 'absolute',
    bottom: S * 0.1,
    width: 6,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(212,131,138,0.3)',
  },

  // Ears
  earLeft: {
    position: 'absolute',
    top: -8,
    left: 2,
  },
  earRight: {
    position: 'absolute',
    top: -8,
    right: 2,
  },
  earTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
  },
  earInnerTriangle: {
    position: 'absolute',
    bottom: 0,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#D4838A',
  },

  // Eyes
  eyeRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 1,
  },
  eyeWhite: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadEye: {
    width: 9,
    height: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadEyeX1: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: '#111',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  deadEyeX2: {
    position: 'absolute',
    width: 8,
    height: 2,
    backgroundColor: '#111',
    transform: [{ rotate: '-45deg' }],
    borderRadius: 1,
  },
  iris: {
    width: 6,
    height: 7,
    borderRadius: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pupil: {
    width: 3.5,
    height: 5,
    borderRadius: 2,
    backgroundColor: '#111',
  },
  eyeShine: {
    position: 'absolute',
    top: 1.5,
    right: 1.5,
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#fff',
  },

  // Nose
  nose: {
    width: 5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#D4838A',
    marginTop: 1,
  },

  // Mouth
  mouthArea: {
    flexDirection: 'row',
    gap: 0.5,
    marginTop: 0.5,
  },
  mouthL: {
    width: 3.5,
    height: 2.5,
    borderBottomLeftRadius: 3.5,
    borderBottomRightRadius: 3.5,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },
  mouthR: {
    width: 3.5,
    height: 2.5,
    borderBottomLeftRadius: 3.5,
    borderBottomRightRadius: 3.5,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.15)',
  },

  // Whiskers
  whiskerLeft: {
    position: 'absolute',
    left: -8,
    top: S * 0.2,
    alignItems: 'flex-end',
  },
  whiskerRight: {
    position: 'absolute',
    right: -8,
    top: S * 0.2,
  },
  whisker: {
    width: 10,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginBottom: 2,
  },

  // Shadow
  shadow: {
    position: 'absolute',
    bottom: -2,
    width: S * 0.7,
    height: S * 0.14,
    borderRadius: S * 0.08,
    backgroundColor: '#000',
  },
});
