# 🌱 Kindling — Considerate Job Description Builder

> A conversational AI guide that helps employers write job descriptions that are honest, inclusive, and ready for the Canadian market.

**Status:** Working prototype (local, single-user)

## Why this exists

Most job description tools help employers write cleaner sentences.

Spark Seed does something different: it questions whether those sentences are fair,
legally aware, and actually attracting the right people — including those who took
non-linear paths to get here.

## Meet Spark Seed

Spark Seed is the AI guide who walks employers through a structured, seven-step
conversation — flagging discriminatory language as it comes up and reminding
employers what Canadian employment law actually requires.

## The seven sections

| # | Section | What Spark Seed asks |
|---|---|---|
| 1 | The Role | Job title, location, type, salary range |
| 2 | The Mission | Outcomes and impact, not just duties |
| 3 | Must-Haves | Only what truly prevents someone from doing the job |
| 4 | Nice-to-Haves | Clearly separated — never used as a hidden filter |
| 5 | Open Paths | Transferable skills and non-traditional backgrounds welcomed |
| 6 | The Reality | Honest about training, tools, and day-one expectations |
| 7 | Review + Export | ATS-friendly plain text output |

## Built with Canadian compliance in mind

- Ontario Human Rights Code
- OHRC guidelines on Canadian experience requirements
- Ontario Pay Transparency Act — salary range built in
- ATS compatibility with Workday, Greenhouse, Lever, BambooHR

## Tech stack

- Python + Flask
- Google Gemini API via the `google-genai` SDK (`gemini-2.5-flash-lite`)
- HTML / CSS / JavaScript (vanilla, no framework)

## Running it locally

```bash
git clone https://github.com/s2h8i0v9-lgtm/kindling.git
cd kindling
pip install -r requirements.txt
# create a .env file containing: GOOGLE_API_KEY=your_key_here
python app.py
# open http://localhost:5000
```

## Project status

- **Phase 1** — Guided JD builder with Spark Seed *(working prototype)*
- Phase 2 — Resume scoring against the JD
- Phase 3 — Two-sided platform with employer and candidate accounts

---

*First AI agent project. Built to explore prompt engineering and
inclusive hiring design for the Canadian market.*