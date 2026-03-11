import React from 'react';
import { View } from 'react-native';

interface Props {
  furColor: string;
  eyeColor?: string;
  size: number;
}

export default function CatHead({ furColor, eyeColor = '#4CAF50', size }: Props) {
  const s = size;
  const earW = s * 0.28;
  const earH = s * 0.32;
  const innerEarW = earW * 0.55;
  const innerEarH = earH * 0.6;
  const eyeW = s * 0.2;
  const eyeH = s * 0.22;
  const pupilW = eyeW * 0.5;
  const pupilH = eyeH * 0.7;
  const shineSize = eyeW * 0.25;
  const noseW = s * 0.1;
  const noseH = s * 0.07;
  const whiskerLen = s * 0.28;
  const whiskerThick = Math.max(1, s * 0.015);
  const mouthW = s * 0.06;
  const mouthH = s * 0.04;

  return (
    <View style={{ width: s, height: s * 1.05, alignItems: 'center' }}>
      {/* Ears */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: s * 0.82, marginBottom: -s * 0.1, zIndex: 1 }}>
        {/* Left ear */}
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 0, height: 0,
            borderLeftWidth: earW * 0.5,
            borderRightWidth: earW * 0.5,
            borderBottomWidth: earH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: furColor,
          }} />
          {/* Inner ear */}
          <View style={{
            position: 'absolute', bottom: 0,
            width: 0, height: 0,
            borderLeftWidth: innerEarW * 0.5,
            borderRightWidth: innerEarW * 0.5,
            borderBottomWidth: innerEarH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#D4838A',
          }} />
        </View>
        {/* Right ear */}
        <View style={{ alignItems: 'center' }}>
          <View style={{
            width: 0, height: 0,
            borderLeftWidth: earW * 0.5,
            borderRightWidth: earW * 0.5,
            borderBottomWidth: earH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: furColor,
          }} />
          <View style={{
            position: 'absolute', bottom: 0,
            width: 0, height: 0,
            borderLeftWidth: innerEarW * 0.5,
            borderRightWidth: innerEarW * 0.5,
            borderBottomWidth: innerEarH,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#D4838A',
          }} />
        </View>
      </View>

      {/* Head */}
      <View style={{
        width: s,
        height: s * 0.78,
        borderRadius: s * 0.39,
        backgroundColor: furColor,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'visible',
      }}>
        {/* Cheek highlights */}
        <View style={{
          position: 'absolute', bottom: s * 0.12, left: s * 0.05,
          width: s * 0.22, height: s * 0.15,
          borderRadius: s * 0.1,
          backgroundColor: 'rgba(255,255,255,0.07)',
        }} />
        <View style={{
          position: 'absolute', bottom: s * 0.12, right: s * 0.05,
          width: s * 0.22, height: s * 0.15,
          borderRadius: s * 0.1,
          backgroundColor: 'rgba(255,255,255,0.07)',
        }} />

        {/* Eyes */}
        <View style={{ flexDirection: 'row', gap: s * 0.16, marginTop: -s * 0.02 }}>
          {/* Left eye */}
          <View style={{
            width: eyeW, height: eyeH,
            borderRadius: eyeH / 2,
            backgroundColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{
              width: pupilW, height: pupilH,
              borderRadius: pupilH / 2,
              backgroundColor: eyeColor,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <View style={{ width: pupilW * 0.55, height: pupilH * 0.6, borderRadius: pupilH * 0.3, backgroundColor: '#111' }} />
            </View>
            {/* Eye shine */}
            <View style={{
              position: 'absolute', top: eyeH * 0.15, right: eyeW * 0.18,
              width: shineSize, height: shineSize, borderRadius: shineSize / 2,
              backgroundColor: '#fff',
            }} />
          </View>
          {/* Right eye */}
          <View style={{
            width: eyeW, height: eyeH,
            borderRadius: eyeH / 2,
            backgroundColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <View style={{
              width: pupilW, height: pupilH,
              borderRadius: pupilH / 2,
              backgroundColor: eyeColor,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <View style={{ width: pupilW * 0.55, height: pupilH * 0.6, borderRadius: pupilH * 0.3, backgroundColor: '#111' }} />
            </View>
            <View style={{
              position: 'absolute', top: eyeH * 0.15, right: eyeW * 0.18,
              width: shineSize, height: shineSize, borderRadius: shineSize / 2,
              backgroundColor: '#fff',
            }} />
          </View>
        </View>

        {/* Nose */}
        <View style={{
          width: noseW, height: noseH, marginTop: s * 0.03,
          borderRadius: noseW / 2,
          backgroundColor: '#D4838A',
        }} />

        {/* Mouth — two tiny arcs */}
        <View style={{ flexDirection: 'row', gap: 1, marginTop: 1 }}>
          <View style={{
            width: mouthW, height: mouthH,
            borderBottomLeftRadius: mouthW,
            borderBottomRightRadius: mouthW,
            borderBottomWidth: whiskerThick,
            borderLeftWidth: whiskerThick,
            borderColor: 'rgba(255,255,255,0.25)',
          }} />
          <View style={{
            width: mouthW, height: mouthH,
            borderBottomLeftRadius: mouthW,
            borderBottomRightRadius: mouthW,
            borderBottomWidth: whiskerThick,
            borderRightWidth: whiskerThick,
            borderColor: 'rgba(255,255,255,0.25)',
          }} />
        </View>

        {/* Whiskers left */}
        <View style={{ position: 'absolute', left: -whiskerLen * 0.3, top: s * 0.38 }}>
          <View style={{ width: whiskerLen, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.35)', transform: [{ rotate: '-8deg' }], marginBottom: s * 0.04 }} />
          <View style={{ width: whiskerLen * 1.05, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: s * 0.04 }} />
          <View style={{ width: whiskerLen, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.25)', transform: [{ rotate: '8deg' }] }} />
        </View>
        {/* Whiskers right */}
        <View style={{ position: 'absolute', right: -whiskerLen * 0.3, top: s * 0.38, alignItems: 'flex-end' }}>
          <View style={{ width: whiskerLen, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.35)', transform: [{ rotate: '8deg' }], marginBottom: s * 0.04 }} />
          <View style={{ width: whiskerLen * 1.05, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: s * 0.04 }} />
          <View style={{ width: whiskerLen, height: whiskerThick, backgroundColor: 'rgba(255,255,255,0.25)', transform: [{ rotate: '-8deg' }] }} />
        </View>
      </View>
    </View>
  );
}
