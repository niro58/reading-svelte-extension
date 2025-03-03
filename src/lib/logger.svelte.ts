export function addLog(...log: string[]) {
  const logger = document.getElementById("logger");
  if (!logger) return;
  const randId = Math.random().toString(36).slice(-8);

  const divEl = document.createElement("div");
  divEl.id = randId;
  divEl.innerHTML = log.join(" ");

  logger.appendChild(divEl);

  setTimeout(() => {
    divEl.remove();
  }, 2000);
}
