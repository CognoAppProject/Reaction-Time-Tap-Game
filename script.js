let startTime;
let reactionTimes = [];
let rounds = 5;
let currentRound = 0;
let timeoutId;
let isGreen = false;

function startGame() {
  document.getElementById('instruction-modal').style.display = 'none';
  document.getElementById('game-area').style.display = 'flex';
  startRound();
}

function startRound() {
  isGreen = false;
  document.getElementById('message').innerText = "Wait for green...";
  document.getElementById('game-area').style.backgroundColor = "red";

  document.getElementById('game-area').onclick = () => {
    if (!isGreen) {
      document.getElementById('message').innerText = "Too Soon!";
      clearTimeout(timeoutId);
      setTimeout(startRound, 1000);
    }
  };

  const delay = Math.floor(Math.random() * 3000) + 1000; // 1s to 4s
  timeoutId = setTimeout(() => {
    isGreen = true;
    document.getElementById('game-area').style.backgroundColor = "green";
    document.getElementById('message').innerText = "TAP!";
    startTime = new Date().getTime();

    document.getElementById('game-area').onclick = () => {
      const reactionTime = new Date().getTime() - startTime;
      reactionTimes.push(reactionTime);
      currentRound++;

      if (currentRound < rounds) {
        setTimeout(startRound, 1000);
      } else {
        endGame();
      }
    };
  }, delay);
}

function getScore(avg) {
  if (avg < 250) return 10;
  if (avg < 500) return 8;
  if (avg < 800) return 6;
  return 4;
}

function getReactionFeedback(avg) {
  if (avg < 250) {
    return { emoji: "⚡", message: "You're a lightning bolt!" };
  } else if (avg < 500) {
    return { emoji: "🚀", message: "Super fast!" };
  } else if (avg < 800) {
    return { emoji: "🐢", message: "You're getting there!" };
  } else {
    return { emoji: "😴", message: "Try again, stay alert!" };
  }
}

function showConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    confetti.style.position = "fixed";
    confetti.style.width = "10px";
    confetti.style.height = "10px";
    confetti.style.borderRadius = "50%";
    confetti.style.top = Math.random() * 100 + "vh";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animation = "fall 2s linear";
    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 2000);
  }
}

function endGame() {
  document.getElementById('game-area').onclick = null;
  document.getElementById('game-area').style.display = 'none';

  const avg = Math.round(reactionTimes.reduce((a, b) => a + b) / reactionTimes.length);
  const feedback = getReactionFeedback(avg);
  const score = getScore(avg);

  document.getElementById('average-time').innerText = avg;
  document.getElementById('reaction-emoji').innerText = feedback.emoji;
  document.getElementById('reaction-message').innerText = feedback.message;
  document.getElementById('reaction-score').innerText = score;

  document.getElementById('result-modal').style.display = 'flex';
  showConfetti();

  // ✅ Submit to Android interface if available
  if (window.Android && Android.submitResult) {
    Android.submitResult("Reaction Time Tap Game", score, avg);
    console.log(`Submitted to Android: Score = ${score}, Avg Time = ${avg}ms`);
  }
}

function restartGame() {
  reactionTimes = [];
  currentRound = 0;
  document.getElementById('result-modal').style.display = 'none';
  document.getElementById('game-area').style.display = 'flex';
  startRound();
}
