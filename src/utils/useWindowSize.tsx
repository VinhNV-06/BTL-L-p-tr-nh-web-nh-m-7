import { useEffect, useState } from "react";

interface WindowSize {
    width: number;
    height: number;
}

export const useWindowSize = (): WindowSize => {
    const [size, setSize] = useState<[number, number]>([window.innerWidth, window.innerHeight]);

    useEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };

        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return {
        width: size[0],
        height: size[1],
    };
};
