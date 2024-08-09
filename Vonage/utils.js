export function isDoctorClient() {
  const currentUrl = window.location.href;
  const urlObj = new URL(currentUrl);

  const doctorParam = urlObj.searchParams.get("doctor");
  return doctorParam;
}

export function updateChat(messages) {
  const chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML = "";
  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.textContent = `${message.speaker}: ${message.phrase}`;
    chatMessages.appendChild(messageElement);
  });
}
