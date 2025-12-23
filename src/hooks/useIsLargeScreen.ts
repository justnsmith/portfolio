import { useState, useEffect } from "react";

// Hook to detect screen width
export function useIsLargeScreen(breakpoint = 1024) {
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= breakpoint);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= breakpoint);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);

    return isLargeScreen;
}
