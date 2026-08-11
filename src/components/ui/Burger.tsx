interface BurgerProps {
    onClick: () => void;
    expanded: boolean;
}

/** Three hairlines — the same rule weight the rest of the page is built from. */
export default function Burger({ onClick, expanded }: BurgerProps) {
    return (
        <button
            type="button"
            className="burger"
            onClick={onClick}
            aria-label="Open menu"
            aria-expanded={expanded}
            aria-haspopup="dialog"
        >
            <span />
            <span />
            <span />
        </button>
    );
}
