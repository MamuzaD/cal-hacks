# Weyes

<div style="display:flex; align-items:center; flex-wrap:wrap;">
  <img src="https://github.com/user-attachments/assets/9f66c02b-78dd-4390-afe7-e191b2fac435" alt="Screenshot 1" style="height:275px;">
  <img src="https://github.com/user-attachments/assets/aafa8b9d-46a1-46a3-92b1-47d934c2d64c" alt="Screenshot 2" style="height:275px;">
</div>

### Explore the network between politicians, companies, and money

> React + FastAPI app to search entities, visualize connections, and drill into details.

## Built With
#### Frontend
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=fff)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=fff)
![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=fff)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-000?style=for-the-badge&logo=shadcnui&logoColor=fff)
![D3](https://img.shields.io/badge/d3%20js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)

#### Backend
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=fff)
![FastAPI](https://img.shields.io/badge/FastAPI-05998B?style=for-the-badge&logo=fastapi&logoColor=fff)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=fff)
![Anthropic](https://img.shields.io/badge/Claude-D97757?style=for-the-badge&logo=claude&logoColor=white)

## Features
### Smart Search
- AI-assisted classification (Anthropic Claude) of queries into person vs company with confidence and reasoning, with heuristic fallback when AI is unavailable.

### Interactive Graph
- D3-powered visualization shows nodes and edges between politicians and companies.
- Edges encode ownership/holding value; nodes display metadata like ticker, position, state, party, net worth.

### Entity Profiles
- Detail views for people and companies with canonical IDs.

### FastAPI + Typed Schemas
- FastAPI with typed responses, async PostgreSQL pooling via `asyncpg`.
- CORS enabled for local dev and hosted environments.

---
Built at CalHacks.
<img src="https://d112y698adiu2z.cloudfront.net/photos/production/challenge_photos/003/868/395/datas/full_width.png">
