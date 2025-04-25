import { Box } from "@mui/material";
import { motion } from "framer-motion";

const lavenderPalette = {
    light: "#EAE4F7",
    soft: "#D8CCF0",
    medium: "#B9A5E3",
    primary: "#9D88D9",
    deep: "#7F68C9",
    text: "#4A3B77",
    darkText: "#2E2152",
    gradient: "linear-gradient(135deg, #B9A5E3 0%, #7F68C9 100%)",
    accentGradient: "linear-gradient(45deg, #A190DD 30%, #7F68C9 90%)",
};

const FloatingElements = () => {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                overflow: "hidden",
                pointerEvents: "none",
                zIndex: -1,
            }}
        >
            {[...Array(12)].map((_, i) => {
                const size = Math.random() * 20 + 10;
                const left = `${Math.random() * 100}%`;
                const top = `${Math.random() * 100}%`;
                const duration = Math.random() * 15 + 10;
                const shapeType = Math.floor(Math.random() * 3);

                let shapeStyle = {
                    position: "absolute",
                    width: size,
                    height: size,
                    background: `${lavenderPalette.soft}15`,
                    border: `1px solid ${lavenderPalette.medium}20`,
                    left: left,
                    top: top,
                };
                let animationProps = {
                    scale: [0.7, 1, 0.7],
                    x: [0, Math.random() * 50 - 25, 0],
                    y: [0, Math.random() * 50 - 25, 0],
                };

                if (shapeType === 0) {
                    shapeStyle.borderRadius = "50%";
                    animationProps.rotate = [0, Math.random() > 0.5 ? 180 : -180, 0];
                } else if (shapeType === 1) {
                    shapeStyle.borderRadius = "4px";
                    animationProps.rotate = [0, Math.random() > 0.5 ? 90 : -90, 0];
                } else {
                    shapeStyle = {
                        ...shapeStyle,
                        width: 0,
                        height: 0,
                        background: "transparent",
                        border: "none",
                        borderLeft: `${size / 2}px solid transparent`,
                        borderRight: `${size / 2}px solid transparent`,
                        borderBottom: `${size}px solid ${lavenderPalette.soft}15`,
                    };
                    animationProps.rotate = [0, Math.random() > 0.5 ? 120 : -120, 0];
                }

                return (
                    <Box
                        key={`shape-${i}`}
                        component={motion.div}
                        sx={shapeStyle}
                        initial={{ scale: 0, rotate: 0 }}
                        animate={animationProps}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}
        </Box>
    );
};

export default FloatingElements;
