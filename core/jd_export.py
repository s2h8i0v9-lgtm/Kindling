# core/jd_export.py
# Turns collected answers into a finished, ATS-friendly job description

from datetime import date

def generate_jd_text(data):
    """
    Takes all collected answers and formats them into a clean,
    plain-text job description.

    Why plain text? ATS systems (Workday, Greenhouse, Lever etc.)
    work best with simple text — no tables, no images, no columns.
    """

    # Professional headings for each section
    section_headings = {
        "the_role":      "POSITION OVERVIEW",
        "the_mission":   "KEY RESPONSIBILITIES",
        "must_haves":    "REQUIRED QUALIFICATIONS",
        "nice_to_haves": "PREFERRED QUALIFICATIONS",
        "open_paths":    "TRANSFERABLE BACKGROUNDS WELCOMED",
        "the_reality":   "WORK ENVIRONMENT AND EXPECTATIONS",
    }

    # The order sections appear in the document
    section_order = [
        "the_role",
        "the_mission",
        "must_haves",
        "nice_to_haves",
        "open_paths",
        "the_reality",
    ]

    lines = []

    # ── Document header ──────────────────────────────────────
    lines.append("JOB DESCRIPTION")
    lines.append("=" * 55)
    lines.append(f"Date: {date.today().strftime('%B %d, %Y')}")
    lines.append("")

    # ── Each section ─────────────────────────────────────────
    for section_id in section_order:

        # Get answers for this section, skip if empty
        answers = data.get(section_id, [])
        answers = [a.strip() for a in answers if a.strip()]

        if not answers:
            continue

        # Write the heading
        heading = section_headings.get(section_id, section_id.upper())
        lines.append(heading)
        lines.append("-" * len(heading))

        # Write each answer as a bullet point
        for answer in answers:
            lines.append(f"- {answer}")

        lines.append("")

    # ── Inclusive hiring footer ───────────────────────────────
    lines.append("=" * 55)
    lines.append("EQUAL OPPORTUNITY STATEMENT")
    lines.append("-" * 26)
    lines.append(
        "We welcome applications from candidates with non-traditional "
        "career paths and transferable skills from all industries. "
        "We are committed to inclusive hiring practices in accordance "
        "with the Ontario Human Rights Code and the Canadian Human "
        "Rights Act. Accommodations are available upon request."
    )
    lines.append("")
    lines.append("=" * 55)
    lines.append("Created with Spark Seed — Ethical Job Description Builder")
    lines.append("Designed for the Canadian market.")
    lines.append("=" * 55)

    return "\n".join(lines)