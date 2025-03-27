document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded triggered!");
  
    try {
      // Array of funny messages
      const messages = [
        "Remember: Procrastination won't finish that project. Be like this cat—find your inner focus!",
        "Blocked for your own good! Go finish that task and reward yourself later.",
        "This website is taking a break. Maybe you should too—by working!",
        "Why scroll endlessly when you can make progress? Stay on track!",
        "Focus now, relax later. That's the way to win the day!",
        "The internet can wait; your work can't. Be productive like this cat!",
        "If cats can meditate, you can concentrate. Get back to it!"
      ];
  
      // Select a random message
      const randomMessage = messages[Math.floor(Math.random() * messages.length)];
      console.log("Random message selected:", randomMessage);
  
      // Display the random message
      const messageElement = document.getElementById("funnyMessage");
      if (messageElement) {
        messageElement.textContent = randomMessage;
        console.log("Message displayed successfully!");
      } else {
        console.error("Message element not found in DOM.");
      }
    } catch (error) {
      console.error("Error displaying funny message:", error);
    }
  });
  