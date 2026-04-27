import test from 'node:test';
import assert from 'node:assert/strict';
import { generateInstitutionalContent } from '../src/contentGenerator.js';

test('gera conteúdo estruturado com fallback quando não há API key', async () => {
  const content = await generateInstitutionalContent({
    schoolName: 'Colégio Murialdo',
    audience: 'Famílias com filhos no fundamental',
    objective: 'Captação de matrículas',
    tone: 'Institucional acolhedor',
    channels: ['instagram', 'email'],
    additionalContext: 'Campanha para segundo semestre'
  });

  assert.equal(typeof content.title, 'string');
  assert.equal(Array.isArray(content.assets), true);
  assert.equal(Array.isArray(content.calendar), true);
  assert.equal(typeof content.campaign.cta, 'string');
});
