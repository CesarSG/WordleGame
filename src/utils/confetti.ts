import confetti from "@hiseb/confetti";

export function launchConfetti() {
  confetti({
    position: { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    count: 200,
    size: 1,
    velocity: 300,
    fade: false,
  });
}
