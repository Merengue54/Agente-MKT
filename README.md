# Murialdo Content Studio

Aplicação Node.js (Express) para gerar conteúdo institucional escolar com OpenAI, retorno em JSON estruturado e histórico automático em arquivo JSON.

## Funcionalidades
- Geração de conteúdo institucional orientado a campanha.
- Saída estruturada em JSON para uso por outros sistemas.
- Histórico persistido em `data/history.json`.
- Frontend simples em HTML/CSS/JS servido por `/content`.
- Configurações prontas para Nginx e PM2.

## Como rodar
```bash
cp .env.example .env
npm install
npm run dev
```

Acesse:
- Frontend: `http://localhost:3000/content`
- Health: `http://localhost:3000/api/health`

## Como testar
> Dica: você pode testar sem chave OpenAI; o sistema usa fallback estruturado automaticamente.

### 1) Teste automatizado (unitário)
```bash
npm test
```

### 2) Teste rápido da API (manual)
Com a aplicação rodando (`npm run dev`), execute:

```bash
curl -s http://localhost:3000/api/health
```

```bash
curl -s -X POST http://localhost:3000/api/content/generate \
  -H "Content-Type: application/json" \
  -d '{
    "schoolName": "Colégio Murialdo",
    "audience": "Famílias com filhos no ensino fundamental",
    "objective": "Captação de matrículas",
    "tone": "Institucional acolhedor",
    "channels": ["instagram", "email"],
    "additionalContext": "Campanha de inverno"
  }'
```

```bash
curl -s http://localhost:3000/api/history
```

### 3) Teste via interface
1. Abra `http://localhost:3000/content`.
2. Preencha o formulário e clique em **Gerar conteúdo**.
3. Valide se o JSON aparece em **Resultado**.
4. Confirme se uma nova entrada aparece em **Histórico**.

## Endpoints
### `POST /api/content/generate`
Gera e salva conteúdo.

Exemplo de body:
```json
{
  "schoolName": "Colégio Murialdo",
  "audience": "Famílias com filhos no ensino fundamental",
  "objective": "Captação de matrículas",
  "tone": "Institucional acolhedor",
  "channels": ["instagram", "email"],
  "additionalContext": "Campanha segundo semestre"
}
```

### `GET /api/history`
Retorna histórico de gerações.

## Deploy
- PM2: `pm2 start ecosystem.config.cjs`
- Nginx: usar `config/nginx.conf` como base de reverse proxy.
