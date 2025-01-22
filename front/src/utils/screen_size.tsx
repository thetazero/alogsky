import { useEffect, useState } from "react";

/**
 * Custom hook to determine if a media query matches.
 * @param query The media query string (e.g., "(max-width: 640px)")
 * @returns Boolean indicating if the query matches
 */
export const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        const handleChange = () => setMatches(mediaQuery.matches);

        // Initial check
        handleChange();
        // Listen for changes
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup listener on unmount
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, [query]);

    return matches;
};

export const useIsSmallScreen = () => useMediaQuery("(max-width: 640px)");
