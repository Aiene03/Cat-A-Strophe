import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Obstacle as ObstacleType, CELL_SIZE } from '../../game/types';

interface Props {
  obstacle: ObstacleType;
  laneType?: string;
}

function CarBody({ width, height, color }: { width: number; height: number; color: string }) {
  const roofH = height * 0.35;
  const wheelSize = Math.min(width * 0.25, 10);
  const winW = width * 0.35;
  const winH = roofH * 0.7;
  const isMovingUp = false; // Could determine from speed if needed

  return (
    <View style={{ width, height, borderRadius: 5, backgroundColor: color, overflow: 'visible' }}>
      {/* Main Body Shading */}
      <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 3, backgroundColor: 'rgba(0,0,0,0.2)' }} />
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: 'rgba(255,255,255,0.1)' }} />

      {/* Bumpers */}
      <View style={{ position: 'absolute', top: 0, left: 2, right: 2, height: 4, backgroundColor: '#333', borderRadius: 2 }} />
      <View style={{ position: 'absolute', bottom: 0, left: 2, right: 2, height: 4, backgroundColor: '#333', borderRadius: 2 }} />

      {/* Roof */}
      <View style={{
        position: 'absolute', top: height * 0.18, left: width * 0.1,
        width: width * 0.8, height: roofH,
        borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.15)',
        borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)',
      }} />

      {/* Windows */}
      <View style={{
        position: 'absolute', top: height * 0.22, left: width * 0.18,
        width: winW, height: winH, borderRadius: 2, backgroundColor: '#1a1a1a',
      }} />
      <View style={{
        position: 'absolute', top: height * 0.22, right: width * 0.18,
        width: winW, height: winH, borderRadius: 2, backgroundColor: '#1a1a1a',
      }} />
      
      {/* Window shine */}
      <View style={{
        position: 'absolute', top: height * 0.24, left: width * 0.2,
        width: winW * 0.3, height: winH * 0.4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1,
      }} />

      {/* Side Mirrors */}
      <View style={{ position: 'absolute', top: height * 0.35, left: -3, width: 4, height: 6, backgroundColor: color, borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: height * 0.35, right: -3, width: 4, height: 6, backgroundColor: color, borderRadius: 2 }} />

      {/* Wheels */}
      <View style={{
        position: 'absolute', bottom: height * 0.1, left: -wheelSize * 0.2,
        width: wheelSize, height: wheelSize * 1.2, borderRadius: 3, backgroundColor: '#111',
        borderLeftWidth: 2, borderLeftColor: '#222',
      }} />
      <View style={{
        position: 'absolute', bottom: height * 0.1, right: -wheelSize * 0.2,
        width: wheelSize, height: wheelSize * 1.2, borderRadius: 3, backgroundColor: '#111',
        borderRightWidth: 2, borderRightColor: '#222',
      }} />
      <View style={{
        position: 'absolute', top: height * 0.1, left: -wheelSize * 0.2,
        width: wheelSize, height: wheelSize * 1.2, borderRadius: 3, backgroundColor: '#111',
        borderLeftWidth: 2, borderLeftColor: '#222',
      }} />
      <View style={{
        position: 'absolute', top: height * 0.1, right: -wheelSize * 0.2,
        width: wheelSize, height: wheelSize * 1.2, borderRadius: 3, backgroundColor: '#111',
        borderRightWidth: 2, borderRightColor: '#222',
      }} />

      {/* Lights */}
      <View style={{
        position: 'absolute', top: 3, left: width * 0.15,
        width: 6, height: 3, backgroundColor: '#fff', borderRadius: 1,
        shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 3,
      }} />
      <View style={{
        position: 'absolute', top: 3, right: width * 0.15,
        width: 6, height: 3, backgroundColor: '#fff', borderRadius: 1,
        shadowColor: '#fff', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 3,
      }} />
      
      <View style={{
        position: 'absolute', bottom: 3, left: width * 0.15,
        width: 6, height: 3, backgroundColor: '#f00', borderRadius: 1,
      }} />
      <View style={{
        position: 'absolute', bottom: 3, right: width * 0.15,
        width: 6, height: 3, backgroundColor: '#f00', borderRadius: 1,
      }} />
    </View>
  );
}

function TrainBody({ width, height }: { width: number; height: number }) {
  const segCount = Math.max(2, Math.round(height / 35));
  const segH = height / segCount;
  const dotSize = Math.min(width * 0.15, 6);

  return (
    <View style={{ width, height, borderRadius: 4, backgroundColor: '#444', overflow: 'hidden' }}>
      {/* Metallic Gradient Effect */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: width * 0.3, backgroundColor: 'rgba(255,255,255,0.05)' }} />
      <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width * 0.2, backgroundColor: 'rgba(0,0,0,0.2)' }} />

      {/* Side stripe */}
      <View style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: width * 0.2, backgroundColor: '#222',
        borderRightWidth: 1, borderRightColor: '#555',
      }} />

      {/* Window segments */}
      {Array.from({ length: segCount }).map((_, i) => (
        <View key={i} style={{
          position: 'absolute',
          top: segH * i + segH * 0.2,
          left: width * 0.35,
          width: width * 0.5,
          height: segH * 0.6,
          backgroundColor: '#111',
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#333',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          {/* Window Reflection */}
          <View style={{ width: '60%', height: '30%', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, position: 'absolute', top: 2 }} />
        </View>
      ))}

      {/* Segment dividers */}
      {Array.from({ length: segCount - 1 }).map((_, i) => (
        <View key={`d${i}`} style={{
          position: 'absolute', top: segH * (i + 1) - 1,
          left: 0, right: 0, height: 2,
          backgroundColor: '#222',
          borderTopWidth: 1, borderTopColor: '#555',
        }} />
      ))}

      {/* Front/End details */}
      <View style={{
        position: 'absolute', top: 4, left: width * 0.4,
        width: width * 0.2, height: 4, backgroundColor: '#ffd700', borderRadius: 2,
        shadowColor: '#ffd700', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.9, shadowRadius: 4,
      }} />
      <View style={{
        position: 'absolute', bottom: 4, left: width * 0.4,
        width: width * 0.2, height: 4, backgroundColor: '#f00', borderRadius: 2,
      }} />
    </View>
  );
}

export default function Obstacle({ obstacle, laneType }: Props) {
  const w = CELL_SIZE * 0.75;
  const isTrain = laneType === 'RAIL';

  return (
    <View style={[styles.obstacle, { top: obstacle.y, height: obstacle.height, width: w }]}>
      {isTrain ? (
        <TrainBody width={w} height={obstacle.height} />
      ) : (
        <CarBody width={w} height={obstacle.height} color={obstacle.color || '#555'} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  obstacle: {
    position: 'absolute',
    left: CELL_SIZE * 0.125,
  },
});
