function useRandomRange() {
    return { x: Math.random() * (window.innerWidth / 2), y: Math.random() * (window.innerHeight / 2) };
}

export default useRandomRange

