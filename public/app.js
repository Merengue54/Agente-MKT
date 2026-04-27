const form = document.querySelector('#content-form');
const result = document.querySelector('#result');
const historyList = document.querySelector('#history');

async function loadHistory() {
  const response = await fetch('/api/history');
  const data = await response.json();

  historyList.innerHTML = '';
  data.items.slice(0, 10).forEach((item) => {
    const li = document.createElement('li');
    li.textContent = `${new Date(item.createdAt).toLocaleString('pt-BR')} - ${item.input.schoolName} (${item.input.objective})`;
    historyList.appendChild(li);
  });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const payload = {
    schoolName: formData.get('schoolName'),
    audience: formData.get('audience'),
    objective: formData.get('objective'),
    tone: formData.get('tone'),
    channels: String(formData.get('channels'))
      .split(',')
      .map((channel) => channel.trim())
      .filter(Boolean),
    additionalContext: formData.get('additionalContext')
  };

  result.textContent = 'Gerando...';

  const response = await fetch('/api/content/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await response.json();

  if (!response.ok) {
    result.textContent = data.error || 'Falha na geração.';
    return;
  }

  result.textContent = JSON.stringify(data.output, null, 2);
  await loadHistory();
});

loadHistory();
