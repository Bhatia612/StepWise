const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

export const explainProblemStream = (problem, onEvent, onDone, onError) => {
  fetch(`${API_BASE}/explain`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ problem }),
  })
    .then((response) => {
      if (!response.ok) {
        onError({ status: response.status });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const read = () => {
        reader.read().then(({ done, value }) => {
          if (done) return;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();

          let currentEvent = null;

          for (const line of lines) {
            if (line.startsWith("event:")) {
              currentEvent = line.replace("event:", "").trim();
            } else if (line.startsWith("data:")) {
              try {
                const data = JSON.parse(line.replace("data:", "").trim());
                if (currentEvent === "done") {
                  onDone(data.data);
                } else if (currentEvent) {
                  onEvent(currentEvent, data);
                }
              } catch {
                // malformed line
              }
              currentEvent = null;
            }
          }

          read();
        });
      };

      read();
    })
    .catch(onError);
};

export const getAllExplanations = async () => {
  const response = await fetch(`${API_BASE}/explanations`, {
    credentials: "include",
  });
  return response.json();
};

export const getExplanationById = async (id) => {
  const response = await fetch(`${API_BASE}/explanations/${id}`, {
    credentials: "include",
  });
  return response.json();
};