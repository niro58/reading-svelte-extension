export function addMessage(type: "warning" | "success", ...log: any[]) {
  const messages = document.getElementById("messages");
  if (!messages) return;
  const randId = Math.random().toString(36).slice(-8);

  const divEl = document.createElement("div");
  divEl.id = randId;
  divEl.innerHTML = log.join(" ");
  divEl.className = `py-2 px-4 rounded mb-2 ${
    type === "success"
      ? "bg-green-500/50 text-green-100 border border-green-500"
      : "bg-red-500/50 text-red-100 border border-red-500"
  } animate-fly-in`;

  messages.appendChild(divEl);

  setTimeout(() => {
    divEl.classList.add("animate-fly-out");
    divEl.addEventListener("animationend", () => {
      divEl.remove();
    });
  }, 2000);
}
