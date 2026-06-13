export const characterMotion = {
  idle: { y: [0, -4, 0], scaleY: [1, 1.012, 1] },
  listening: { scaleY: [1, 1.007, 1], rotate: [-0.22, 0.22, -0.22] },
  explaining: { scaleY: [1, 1.014, 1], rotate: [-0.35, 0.45, -0.35] },
  speaking: { y: [0, -7, 0], rotate: [-0.6, 0.8, -0.4], scale: [1, 1.012, 1] },
  thinking: { y: [0, -5, 0], rotate: [-1.2, 0.8, -1.2] },
  confused: { x: [0, -3, 3, 0], rotate: [-1.4, 1.2, -1.4] },
  warning: { x: [0, -5, 5, -3, 3, 0] },
  celebrating: { y: [0, -18, 0], rotate: [-2, 2, -2], scale: [1, 1.04, 1] },
  pointing: { x: [0, 5, 0], y: [0, -5, 0] },
  success: { y: [0, -14, 0], scale: [1, 1.03, 1] },
};

export const characterTransition = {
  duration: 4.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export const sceneCameraMotion = {
  scale: [1, 1.035, 1],
  x: [0, -5, 0],
  y: [0, -4, 0],
};
