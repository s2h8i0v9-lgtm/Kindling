# 🌱 Kindling

**A considerate job description builder for the Canadian market.**

Kindling helps employers write job descriptions that are honest, inclusive,
and compliant — without needing to be an HR or legal expert. Instead of a
blank text box, you chat with **Spark Seed**, an AI guide who walks you
through seven sections, separates genuine must-haves from nice-to-haves,
actively flags requirements that may run afoul of the **Ontario Human
Rights Code** (e.g. "Canadian experience only," coded language like "native
speaker" or "cultural fit"), and reminds you to include a salary range under
the **Ontario Pay Transparency Act**.

## Why Kindling?

Most job descriptions accidentally exclude great candidates — through
unjustified experience requirements, biased language, or vague "culture
fit" criteria that nobody can actually define. Kindling builds compliance
and inclusivity into the writing process itself, so the result is:

- **Mandatory vs. nice-to-have, clearly separated** — no hidden filters
- **Bias-aware in real time** — flags discriminatory language as you write it, not after
- **Honest about the role** — encourages real expectations over aspirational marketing
- **ATS-friendly** — clean plain-text output ready to post anywhere
- **Built for Ontario law** — OHRC and Pay Transparency Act considerations throughout

## The Studio

A three-panel interface: a progress rail on the left, your conversation
with Spark Seed in the center, and a live-updating preview of the finished
job description on the right — ready to export at any time.

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python + Flask |
| AI | Google Gemini API (`google-genai` SDK) |
| Frontend | Vanilla HTML / CSS / JavaScript |
| Storage | In-memory (no database — see Limitations) |

## Quickstart

```bash
git clone https://github.com/s2h8i0v9-lgtm/kindling.git
cd kindling
pip install -r requirements.txt
```

Create a `.env` file in the project root:

```
GOOGLE_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

```bash
python app.py
```

Then open `http://localhost:5000`.

## The Seven Sections

1. **The Role** — title, location, employment type, salary range
2. **The Mission** — responsibilities, outcomes, impact
3. **Must-Haves** — genuinely essential requirements only
4. **Nice-to-Haves** — bonus qualities, never hidden filters
5. **Open Paths** — transferable skills, non-linear backgrounds welcomed
6. **The Reality** — honest expectations about training, pace, and tools
7. **Review & Export** — final compliance check, then export to plain text

## Limitations

This is a Phase 1 prototype focused on the core builder experience.
Conversation state and collected answers live in memory only and reset on
server restart — there's no database yet. Multi-user accounts and a
two-sided candidate-matching experience are planned for later phases.

## Roadmap

- **Phase 1** (current): guided job description builder
- **Phase 2**: two-sided candidate scoring platform
- **Phase 3**: full platform with accounts and persistence

---

Built as a portfolio project exploring AI agents and considerate hiring practices.