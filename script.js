const API_URL = "https://script.google.com/macros/s/AKfycbx9otg113CeOARkof67HvQHDOxuwz9KecM0gK1yWKk4GUEL9vg4sqHIxhWXpCfLBs8wQw/exec";
const EVENT_DATE = new Date("2026-06-13T17:00:00+01:00");

function updateCountdown() {
  const now = new Date();
  const diff = EVENT_DATE - now;

  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = "<h3>It's reveal time! 🍒</h3>";
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

async function loadResults() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    document.getElementById("totalVotes").textContent = data.total;
    document.getElementById("boyPercent").textContent = data.boyPercent + "%";
    document.getElementById("girlPercent").textContent = data.girlPercent + "%";

    document.getElementById("boyBar").style.width = data.boyPercent + "%";
    document.getElementById("girlBar").style.width = data.girlPercent + "%";
  } catch (error) {
    console.error("Could not load vote results", error);
  }
}

async function submitVote(vote) {
  const name = document.getElementById("voteName").value.trim();
  const message = document.getElementById("voteMessage");

  if (!name) {
    message.textContent = "Please enter your name before voting.";
    return;
  }

  message.textContent = "Submitting your vote...";

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "vote",
        name: name,
        vote: vote
      })
    });

    message.textContent = `Thank you, ${name}! Your Team ${vote} vote is saved 🍒`;
    document.getElementById("voteName").value = "";

    setTimeout(loadResults, 1200);
  } catch (error) {
    message.textContent = "Something went wrong. Please try again.";
  }
}

async function submitRSVP(status) {
  const name = document.getElementById("rsvpName").value.trim();
  const guests = document.getElementById("guestCount").value || "1";
  const message = document.getElementById("rsvpMessage");

  if (!name) {
    message.textContent = "Please enter your name before submitting RSVP.";
    return;
  }

  message.textContent = "Saving your RSVP...";

  try {
    await fetch(API_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "rsvp",
        name: name,
        status: status,
        guests: guests
      })
    });

    message.textContent = `Thank you, ${name}! Your RSVP is saved 🍒`;
    document.getElementById("rsvpName").value = "";
    document.getElementById("guestCount").value = "";
  } catch (error) {
    message.textContent = "Something went wrong. Please try again.";
  }
}

updateCountdown();
loadResults();
setInterval(updateCountdown, 1000);
setInterval(loadResults, 15000);
