import { useRef } from 'react';
import { Animated, Pressable, ViewStyle } from 'react-native';

export default function PressableScale({
  children,
  onPress,
  style,
  disabled,
}: { children: React.ReactNode; onPress?: () => void; style?: ViewStyle | ViewStyle[]; disabled?: boolean }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true, speed: 50 }).start();
  };
  const onPressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 30 }).start();
  };

  return (
    <Pressable onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} disabled={disabled}>
      <Animated.View style={[style, { transform: [{ scale }] }]}>{children}</Animated.View>
    </Pressable>
  );
}