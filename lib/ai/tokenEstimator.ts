export function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}

export function estimateMessagesTokens(messages: Array<{ content: string }>) {
  return estimateTokens(messages.map((message) => message.content).join("\n"));
}
