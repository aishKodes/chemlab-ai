export const redoxMotion = {
  fadeIn: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" },
  },
  pop: {
    initial: { opacity: 0, scale: 0.88 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.35, type: "spring", stiffness: 220, damping: 18 },
  },
  successPulse: {
    animate: {
      boxShadow: [
        "0 0 0 rgba(34, 197, 94, 0)",
        "0 0 42px rgba(34, 197, 94, 0.45)",
        "0 0 0 rgba(34, 197, 94, 0)",
      ],
    },
    transition: { duration: 1.25, repeat: 2 },
  },
  wrongShake: {
    animate: { x: [0, -8, 8, -5, 5, 0] },
    transition: { duration: 0.38 },
  },
};

export const storyCameraClasses: Record<string, string> = {
  slow_zoom: "scale-105",
  pan_left: "scale-105 -translate-x-3",
  pan_right: "scale-105 translate-x-3",
  none: "",
};
