import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Lane, CELL_SIZE, LANE_SLOTS } from '../../game/types';
import Obstacle from './obstacle';

// Monochrome lane base colors
const LANE_COLORS: Record<string, string> = {
  GRASS: '#1a1a1a',
  ROAD: '#111',
  RAIL: '#141414',
  WATER: '#0d1117',
};

interface Props {
  row: Lane;
}

function GrassDecor() {
  const slots = Array.from({ length: LANE_SLOTS });
  return (
    <>
      {slots.map((_, i) => (
        <View key={i} style={{ position: 'absolute', top: i * CELL_SIZE, left: 0, right: 0, height: CELL_SIZE }}>
          <View style={{
            position: 'absolute', inset: 0,
            backgroundColor: i % 2 === 0 ? '#1a1a1a' : '#171717',
          }} />
          {/* Grass tufts */}
          <View style={[styles.grassTuft, { top: 10, left: 5, transform: [{ rotate: '-15deg' }] }]} />
          <View style={[styles.grassTuft, { top: 25, left: 15, height: 4, opacity: 0.6 }]} />
          <View style={[styles.grassTuft, { top: 15, right: 8, transform: [{ rotate: '10deg' }] }]} />
          <View style={[styles.grassTuft, { bottom: 8, left: 20, transform: [{ rotate: '5deg' }] }]} />
          
          {/* Tiny flowers */}
          {i % 3 === 0 && (
            <View style={{ position: 'absolute', top: 12, left: 12, width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#333' }} />
          )}
          {i % 4 === 0 && (
            <View style={{ position: 'absolute', bottom: 15, right: 10, width: 2, height: 2, borderRadius: 1, backgroundColor: '#2a2a2a' }} />
          )}
        </View>
      ))}
    </>
  );
}

function RoadDecor() {
  const dashes: React.ReactNode[] = [];
  const total = LANE_SLOTS * CELL_SIZE;
  for (let y = 5; y < total; y += 20) {
    dashes.push(
      <View key={y} style={{
        position: 'absolute',
        left: CELL_SIZE / 2 - 1,
        top: y,
        width: 2,
        height: 10,
        backgroundColor: '#2a2a2a',
        borderRadius: 1,
      }} />
    );
  }
  return (
    <>
      {/* Asphalt texture */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#111' }} />
      {/* Road grain/texture */}
      <View style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundColor: '#000' }} />
      
      {/* Edge lines */}
      <View style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#222' }} />
      <View style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 2, backgroundColor: '#222' }} />
      
      {dashes}
    </>
  );
}

function RailDecor() {
  const ties: React.ReactNode[] = [];
  const total = LANE_SLOTS * CELL_SIZE;
  for (let y = 8; y < total; y += 16) {
    ties.push(
      <View key={y} style={{
        position: 'absolute',
        left: 4,
        top: y,
        width: CELL_SIZE - 8,
        height: 4,
        backgroundColor: '#1a1a1a',
        borderRadius: 1,
        borderBottomWidth: 1,
        borderBottomColor: '#111',
      }} />
    );
  }
  return (
    <>
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#141414' }} />
      {/* Gravel */}
      {Array.from({ length: 15 }).map((_, i) => (
        <View key={i} style={{
          position: 'absolute',
          top: Math.random() * total,
          left: Math.random() * CELL_SIZE,
          width: 2, height: 2, borderRadius: 1,
          backgroundColor: '#1a1a1a',
        }} />
      ))}
      {ties}
      {/* Rails */}
      <View style={[styles.rail, { left: CELL_SIZE * 0.25 }]} />
      <View style={[styles.rail, { right: CELL_SIZE * 0.25 }]} />
    </>
  );
}

function WaterDecor({ safeSlots }: { safeSlots?: number[] }) {
  const slots = Array.from({ length: LANE_SLOTS });
  return (
    <>
      {slots.map((_, i) => (
        <View key={i} style={{ position: 'absolute', top: i * CELL_SIZE, left: 0, right: 0, height: CELL_SIZE }}>
          <View style={{
            position: 'absolute', inset: 0,
            backgroundColor: i % 2 === 0 ? '#0d1117' : '#0b0f14',
          }} />
          {/* Ripples */}
          <View style={[styles.ripple, { top: 15, left: 5, width: 15 }]} />
          <View style={[styles.ripple, { top: 35, right: 8, width: 20 }]} />
          <View style={[styles.ripple, { top: 10, right: 15, width: 10, opacity: 0.3 }]} />
        </View>
      ))}
      {/* Lily pads */}
      {safeSlots?.map((slot) => (
        <View
          key={slot}
          style={{
            position: 'absolute',
            width: CELL_SIZE * 0.7,
            height: CELL_SIZE * 0.7,
            left: CELL_SIZE * 0.15,
            top: slot * CELL_SIZE + CELL_SIZE * 0.15,
            borderRadius: CELL_SIZE * 0.35,
            backgroundColor: '#1a2a1a',
            borderWidth: 1.5,
            borderColor: '#2a3a2a',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
          }}
        >
          {/* Lily pad detail (the "cut") */}
          <View style={{
            position: 'absolute',
            top: -2,
            left: '50%',
            width: '25%',
            height: '40%',
            backgroundColor: '#0d1117', // Match water color
            transform: [{ rotate: '45deg' }, { translateX: -CELL_SIZE * 0.05 }],
          }} />
          
          <View style={{
            width: '50%',
            height: '50%',
            borderRadius: CELL_SIZE * 0.2,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.05)',
          }} />
        </View>
      ))}
    </>
  );
}

export default function RowRenderer({ row }: Props) {
  const height = LANE_SLOTS * CELL_SIZE;

  return (
    <View style={[styles.lane, { height, backgroundColor: LANE_COLORS[row.type] }]}>
      {row.type === 'GRASS' && <GrassDecor />}
      {row.type === 'ROAD' && <RoadDecor />}
      {row.type === 'RAIL' && <RailDecor />}
      {row.type === 'WATER' && <WaterDecor safeSlots={row.safeSlots} />}
      {row.obstacles.map((obs) => (
        <Obstacle key={obs.id} obstacle={obs} laneType={row.type} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  lane: {
    width: CELL_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  grassTuft: {
    position: 'absolute',
    width: 2,
    height: 6,
    backgroundColor: '#2a2a2a',
    borderRadius: 1,
  },
  rail: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#333',
    borderLeftWidth: 1,
    borderLeftColor: '#444',
  },
  ripple: {
    position: 'absolute',
    height: 1.5,
    backgroundColor: '#1a2030',
    borderRadius: 1,
  },
});
