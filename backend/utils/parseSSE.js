export async function parseSSE(stream) {
  console.log("Parsing SSE response...", stream);                                                                                                   
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");            

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    result += chunk;
  }

  return result;
}