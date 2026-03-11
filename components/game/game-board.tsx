import React, { useEffect, useRef, useCallback, useState } from 'react';
import { View, StyleSheet, Pressable, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  Easing,
  type SharedValue,
  interpolate,
} from 'react-native-reanimated';
import { GameState, CELL_SIZE, LANE_SLOTS } from '../../game/types';
import { stepForward, updateObstacles, checkIdleTimeout } from '../../game/engine';
import { initSounds, playJump, playDeath, playBGM, stopBGM, cleanup } from '../../game/sounds';
import RowRenderer from './row';
import CatSprite from './cat-sprite';
import HUD from './hud';

interface Props {
  gameState: GameState;
  setGameState: (s: GameState | ((prev: GameState) => GameState)) => void;
  catName: string;
  furColor: string;
  eyeColor: string;
  collarColor: string;
  currentCatIndex: number;
  bestCat?: { name: string; level: number } | null;
  onDeath: (cause: string) => void;
}

function UfoSprite({ beamOpacity }: { beamOpacity: SharedValue<number> }) {
  const W = 64;
  const H = 28;
  const beamStyle = useAnimatedStyle(() => ({
    opacity: beamOpacity.value,
    transform: [{ scaleX: interpolate(beamOpacity.value, [0, 1], [0.5, 1.2]) }],
  }));

  return (
    <View style={{ width: W, height: H + 80, alignItems: 'center' }}>
      {/* Dome */}
      <View style={{
        width: W * 0.4, height: H * 0.6,
        borderTopLeftRadius: W * 0.2,
        borderTopRightRadius: W * 0.2,
        backgroundColor: 'rgba(100,230,255,0.6)',
        borderWidth: 1.5,
        borderBottomWidth: 0,
        borderColor: 'rgba(140,220,255,0.4)',
        alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
      }}>
        <View style={{ width: 8, height: 9, borderRadius: 4, backgroundColor: '#4eff4e', marginTop: 3 }}>
          <View style={{ flexDirection: 'row', gap: 2, marginTop: 2, justifyContent: 'center' }}>
            <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: '#000' }} />
            <View style={{ width: 2, height: 2, borderRadius: 1, backgroundColor: '#000' }} />
          </View>
        </View>
      </View>
      {/* Saucer body */}
      <View style={{
        width: W, height: H * 0.45,
        borderRadius: W * 0.5,
        backgroundColor: '#444',
        marginTop: -3,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#555',
        overflow: 'hidden',
        zIndex: 1,
      }}>
        {/* Metal rim highlight */}
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: H * 0.15,
          backgroundColor: 'rgba(255,255,255,0.1)',
        }} />
        {/* Lights */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#ff3333' }} />
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#33ff33' }} />
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#3333ff' }} />
          <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#ffff33' }} />
        </View>
      </View>
      
      {/* Tractor beam */}
      <Animated.View style={[{
        position: 'absolute',
        top: H * 0.8,
        width: 0, height: 0,
        borderLeftWidth: W * 0.35,
        borderRightWidth: W * 0.35,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(100,255,150,0.15)',
      }, beamStyle]} />
      
      {/* Beam inner core */}
      <Animated.View style={[{
        position: 'absolute',
        top: H * 0.8,
        width: 0, height: 0,
        borderLeftWidth: W * 0.15,
        borderRightWidth: W * 0.15,
        borderBottomWidth: 100,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(255,255,255,0.1)',
      }, beamStyle]} />
    </View>
  );
}


export default function GameBoard({
  gameState,
  setGameState,
  catName,
  furColor,
  eyeColor,
  collarColor,
  currentCatIndex,
  bestCat,
  onDeath,
}: Props) {
  const catTranslateX = useSharedValue(0);
  const catTranslateY = useSharedValue(0);
  const catScaleX = useSharedValue(1);
  const catScaleY = useSharedValue(1);
  const catRotation = useSharedValue(0);
  const catShadowScale = useSharedValue(1);
  const catOpacity = useSharedValue(1);

  // Screen shake and UI values
  const screenShakeX = useSharedValue(0);
  const screenShakeY = useSharedValue(0);

  // UFO animation values
  const ufoY = useSharedValue(-150);
  const ufoOpacity = useSharedValue(0);
  const ufoScale = useSharedValue(0.4);
  const beamOpacity = useSharedValue(0);
  const [showUfo, setShowUfo] = useState(false);

  const gameStateRef = useRef(gameState);
  const deathHandled = useRef(false);

  const [areaSize, setAreaSize] = useState({ width: 0, height: 0 });

  const onGameAreaLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setAreaSize({ width, height });
  }, []);

  // Commit ref to React state once per frame
  const flushRef = useCallback(() => {
    setGameState({ ...gameStateRef.current });
  }, []);

  // Game loop for obstacle movement
  useEffect(() => {
    if (!gameState.isPlaying) return;
    let running = true;

    const loop = () => {
      if (!running) return;

      const cur = gameStateRef.current;
      if (!cur.isPlaying || cur.isDead) return;

      if (checkIdleTimeout(cur)) {
        gameStateRef.current = { ...cur, isDead: true, isPlaying: false };
        flushRef();
        return;
      }

      gameStateRef.current = updateObstacles(cur);
      flushRef();
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
    return () => { running = false; };
  }, [gameState.isPlaying]);

  // Sound system
  useEffect(() => {
    initSounds();
    return () => { cleanup(); };
  }, []);

  useEffect(() => {
    if (gameState.isPlaying && !gameState.isDead) {
      playBGM();
    }
  }, [gameState.isPlaying]);

  // Detect death
  useEffect(() => {
    if (gameState.isDead && !deathHandled.current) {
      deathHandled.current = true;

      // Screen shake on death
      screenShakeX.value = withSequence(
        withTiming(15, { duration: 50 }),
        withTiming(-12, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(-4, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      screenShakeY.value = withSequence(
        withTiming(10, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );

      stopBGM();
      const isAbducted = checkIdleTimeout(gameState);
      const cause = isAbducted
        ? 'Abducted by aliens!'
        : findDeathCause(gameState);
      playDeath(cause);

      if (isAbducted) {
        // UFO abduction animation
        setShowUfo(true);

        ufoOpacity.value = withTiming(1, { duration: 300 });
        ufoScale.value = withTiming(1, { duration: 500, easing: Easing.out(Easing.back(1.2)) });
        ufoY.value = withTiming(0, { duration: 500, easing: Easing.out(Easing.quad) });

        beamOpacity.value = withDelay(600, withSequence(
          withTiming(1, { duration: 200 }),
          withTiming(0.6, { duration: 150 }),
          withTiming(1, { duration: 150 }),
        ));

        catShadowScale.value = withDelay(700, withTiming(0, { duration: 200 }));

        catTranslateX.value = withDelay(650, withSequence(
          withTiming(4, { duration: 60 }),
          withTiming(-4, { duration: 60 }),
          withTiming(3, { duration: 60 }),
          withTiming(-3, { duration: 60 }),
          withTiming(2, { duration: 60 }),
          withTiming(-2, { duration: 60 }),
          withTiming(1, { duration: 60 }),
          withTiming(0, { duration: 60 }),
        ));

        catTranslateY.value = withDelay(900, withTiming(-250, { duration: 1000, easing: Easing.in(Easing.cubic) }));
        catRotation.value = withDelay(900, withTiming(720, { duration: 1000 }));
        catScaleX.value = withDelay(900, withTiming(0.1, { duration: 1000 }));
        catScaleY.value = withDelay(900, withTiming(0.1, { duration: 1000 }));
        catOpacity.value = withDelay(1600, withTiming(0, { duration: 200 }));

        ufoY.value = withDelay(1900, withTiming(-300, { duration: 400, easing: Easing.in(Easing.back(1)) }));
        ufoOpacity.value = withDelay(2100, withTiming(0, { duration: 200 }));
        beamOpacity.value = withDelay(1800, withTiming(0, { duration: 150 }));

        setTimeout(() => onDeath(cause), 2500);
      } else {
        // Normal death — spin + fly + fade
        catRotation.value = withTiming(1080, { duration: 800, easing: Easing.out(Easing.quad) });
        catTranslateX.value = withTiming(-CELL_SIZE * 2, { duration: 800, easing: Easing.out(Easing.quad) });
        catTranslateY.value = withTiming(-CELL_SIZE, { duration: 800, easing: Easing.out(Easing.quad) });
        catOpacity.value = withTiming(0, { duration: 800 });
        catShadowScale.value = withTiming(0, { duration: 400 });

        setTimeout(() => onDeath(cause), 1000);
      }
    }
  }, [gameState.isDead]);

  const findDeathCause = (state: GameState): string => {
    const lane = state.lanes[state.catLane];
    if (!lane) return 'Unknown demise';
    if (lane.type === 'WATER') return 'Fell in the water!';
    if (lane.type === 'ROAD') return 'Hit by a car!';
    if (lane.type === 'RAIL') return 'Hit by a train!';
    return 'Unknown demise';
  };

  const handleTap = useCallback(() => {
    if (!gameStateRef.current.isPlaying || gameStateRef.current.isDead) return;

    playJump();

    // Squash and stretch
    catScaleX.value = withSequence(
      withTiming(1.3, { duration: 60 }),
      withTiming(0.8, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );
    catScaleY.value = withSequence(
      withTiming(0.7, { duration: 60 }),
      withTiming(1.4, { duration: 100, easing: Easing.out(Easing.quad) }),
      withSpring(1, { damping: 10, stiffness: 200 }),
    );

    // Jump arc
    catTranslateY.value = withSequence(
      withTiming(-18, { duration: 100, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 100, easing: Easing.in(Easing.quad) }),
    );

    // Jump forward
    catTranslateX.value = withSequence(
      withTiming(CELL_SIZE * 0.3, { duration: 100, easing: Easing.out(Easing.quad) }),
      withTiming(0, { duration: 100, easing: Easing.in(Easing.quad) }),
    );

    catShadowScale.value = withSequence(
      withTiming(0.4, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );

    const next = stepForward(gameStateRef.current);
    gameStateRef.current = next;
    if (next.isDead) {
      flushRef();
    }
  }, []);

  const ufoAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: ufoY.value },
      { scale: ufoScale.value },
    ],
    opacity: ufoOpacity.value,
  }));

  const gridAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: screenShakeX.value },
      { translateY: screenShakeY.value },
    ],
  }));

  // Calculate how many lanes fit on screen
  const gridHeight = LANE_SLOTS * CELL_SIZE;
  const visibleLaneCount = Math.max(1, Math.floor(areaSize.width / CELL_SIZE));
  const offsetY = Math.max(0, (areaSize.height - gridHeight) / 2);

  // Camera: cat stays near the left side
  const catVisualLane = Math.min(3, Math.floor(visibleLaneCount * 0.25));
  const startLane = Math.max(0, gameState.catLane - catVisualLane);
  const endLane = startLane + visibleLaneCount;
  const visibleLanes = gameState.lanes.slice(startLane, endLane);

  const catScreenLane = gameState.catLane - startLane;
  const catX = catScreenLane * CELL_SIZE + CELL_SIZE * 0.05;
  const catY = gameState.catSlot * CELL_SIZE + CELL_SIZE * 0.05;

  const catAnimStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: catTranslateX.value },
      { translateY: catTranslateY.value },
      { scaleX: catScaleX.value },
      { scaleY: catScaleY.value },
      { rotate: `${catRotation.value}deg` },
    ],
    opacity: catOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <HUD catName={catName} level={gameState.level} score={gameState.score} bestCat={bestCat} currentCatIndex={currentCatIndex} furColor={furColor} />
      <Pressable style={styles.gameArea} onPress={handleTap} onLayout={onGameAreaLayout}>
        <Animated.View style={[styles.grid, { top: offsetY, height: gridHeight, width: areaSize.width }, gridAnimStyle]}>
          <View style={styles.lanesRow}>
            {visibleLanes.map((lane) => (
              <RowRenderer key={lane.id} row={lane} />
            ))}
          </View>
          {/* Cat */}
          <View style={[styles.catContainer, { left: catX, top: catY }]}>
            <Animated.View style={catAnimStyle}>
              <CatSprite
                furColor={furColor}
                eyeColor={eyeColor}
                collarColor={collarColor}
                translateX={useSharedValue(0)}
                translateY={useSharedValue(0)}
                scaleX={useSharedValue(1)}
                rotation={useSharedValue(0)}
                shadowScale={catShadowScale}
                isDead={gameState.isDead}
                opacity={useSharedValue(1)}
              />
            </Animated.View>
            
            {/* UFO overlay — positioned above cat */}
            {showUfo && (
              <Animated.View style={[styles.ufoContainer, ufoAnimStyle]}>
                <UfoSprite beamOpacity={beamOpacity} />
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gameArea: {
    flex: 1,
    overflow: 'hidden',
  },
  grid: {
    position: 'absolute',
    left: 0,
    overflow: 'hidden',
  },
  lanesRow: {
    flexDirection: 'row',
  },
  catContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  ufoContainer: {
    position: 'absolute',
    top: -110,
    left: -12,
    zIndex: 20,
  },
});
