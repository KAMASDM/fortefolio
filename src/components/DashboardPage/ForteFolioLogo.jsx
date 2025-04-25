import { SvgIcon } from "@mui/material";

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

const ForteFolioLogo = (props) => {
    return (
        <SvgIcon {...props} viewBox="0 0 512 512" sx={{ width: props.width || 40, height: props.height || 40 }}>
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={lavenderPalette.medium} />
                    <stop offset="100%" stopColor={lavenderPalette.deep} />
                </linearGradient>
            </defs>
            <path
                d="M256 32c-123.5 0-224 100.5-224 224s100.5 224 224 224 224-100.5 224-224S379.5 32 256 32zm0 400c-97.2 0-176-78.8-176-176S158.8 80 256 80s176 78.8 176 176-78.8 176-176 176z"
                fill="url(#logoGradient)"
            />
            <path
                d="M352 176H256a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h96a24 24 0 0 0 24-24V200a24 24 0 0 0-24-24zm-20 164h-56V220h56v120z"
                fill="url(#logoGradient)"
            />
            <path
                d="M176 176h-40a24 24 0 0 0-24 24v160a24 24 0 0 0 24 24h40a24 24 0 0 0 24-24V200a24 24 0 0 0-24-24zm-20 164h-0V220h0v120z"
                fill="url(#logoGradient)"
            />
        </SvgIcon>)
};

export default ForteFolioLogo;