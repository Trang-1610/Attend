export function playSound(path) {
    const audio = new Audio(path);
    audio.play().catch((err) => {
        console.warn("Không thể phát âm thanh:", err);
    });
}

export default playSound;