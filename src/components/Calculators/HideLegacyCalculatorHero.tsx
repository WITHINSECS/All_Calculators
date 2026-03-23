"use client";

import { useEffect } from "react";

function findLegacyHeroContainer(root: HTMLElement) {
    const heading = root.querySelector("h1");

    if (!(heading instanceof HTMLHeadingElement)) {
        return null;
    }

    let current: HTMLElement | null = heading.parentElement;

    while (current && current !== root) {
        if (
            !current.querySelector("input, button, select, textarea, form, table, canvas, svg")
        ) {
            return current;
        }

        current = current.parentElement;
    }

    return heading;
}

export default function HideLegacyCalculatorHero() {
    useEffect(() => {
        const roots = document.querySelectorAll("[data-managed-calculator-legacy-root]");

        roots.forEach((root) => {
            if (!(root instanceof HTMLElement)) {
                return;
            }

            const legacyHero = findLegacyHeroContainer(root);

            if (!(legacyHero instanceof HTMLElement)) {
                return;
            }

            legacyHero.style.display = "none";
        });
    }, []);

    return null;
}
