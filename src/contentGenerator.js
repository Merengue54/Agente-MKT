import OpenAI from 'openai';

const model = process.env.OPENAI_MODEL || 'gpt-4.1-mini';
const hasApiKey = Boolean(process.env.OPENAI_API_KEY);
const client = hasApiKey ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

function buildPrompt({ schoolName, audience, objective, tone, channels, additionalContext }) {
  return `Você é um estrategista de marketing escolar.

Crie conteúdo institucional para a escola "${schoolName}".

Dados:
- Público-alvo: ${audience}
- Objetivo: ${objective}
- Tom de voz: ${tone}
- Canais: ${channels.join(', ')}
- Contexto adicional: ${additionalContext || 'Não informado'}

Retorne JSON válido com esta estrutura:
{
  "title": "...",
  "summary": "...",
  "campaign": {
    "positioning": "...",
    "keyMessages": ["..."],
    "cta": "..."
  },
  "assets": [
    {
      "channel": "instagram|facebook|site|email|whatsapp",
      "format": "post|story|banner|newsletter|mensagem",
      "headline": "...",
      "body": "..."
    }
  ],
  "calendar": [
    {
      "day": "D+1",
      "action": "..."
    }
  ]
}`;
}

function fallbackContent(input) {
  return {
    title: `Campanha institucional - ${input.schoolName}`,
    summary: `Plano de conteúdo para ${input.objective.toLowerCase()} com foco em ${input.audience.toLowerCase()}.`,
    campaign: {
      positioning: `${input.schoolName} como referência em formação integral e acolhimento.`,
      keyMessages: [
        'Educação com propósito e resultados.',
        'Comunidade escolar próxima das famílias.',
        'Projetos que desenvolvem competências para o futuro.'
      ],
      cta: 'Agende uma visita e conheça nossa proposta pedagógica.'
    },
    assets: input.channels.map((channel) => ({
      channel,
      format: channel === 'instagram' ? 'post' : 'newsletter',
      headline: `${input.schoolName}: matrículas abertas`,
      body: `Descubra como nossa proposta atende ${input.audience.toLowerCase()} com excelência acadêmica e humana.`
    })),
    calendar: [
      { day: 'D+1', action: 'Publicar teaser da campanha.' },
      { day: 'D+3', action: 'Disparar conteúdo institucional por email.' },
      { day: 'D+7', action: 'Reforçar CTA para visita guiada.' }
    ]
  };
}

export async function generateInstitutionalContent(input) {
  if (!client) {
    return fallbackContent(input);
  }

  const response = await client.responses.create({
    model,
    input: buildPrompt(input),
    temperature: 0.7
  });

  const text = response.output_text?.trim() || '{}';

  try {
    return JSON.parse(text);
  } catch {
    return fallbackContent(input);
  }
}
