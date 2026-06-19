import time
import os
from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv
from google import genai
from google.genai import types
from core.sections import SECTIONS
from core.jd_state import JDState

# Load your API key from the .env file
load_dotenv()

# Create the web server
app = Flask(__name__, static_folder='static', static_url_path='')

# Connect to Google Gemini AI using your API key
client = genai.Client(api_key=os.getenv('GOOGLE_API_KEY'))

# Memory: stores the conversation for each section separately
conversation_histories = {}

# Notebook: tracks everything collected so far
jd_state = JDState()


# ─── ROUTE 1: Serve the main webpage ───────────────────────────
@app.route('/')
def home():
    return send_from_directory('static', 'index.html')


# ─── ROUTE 2: Start a section ──────────────────────────────────
@app.route('/api/start/<section_id>', methods=['GET'])
def start_section(section_id):
    """Spark Seed sends its opening message for this section"""
    section = SECTIONS.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404

    conversation_histories[section_id] = []

    return jsonify({
        'message': section['opening'],
        'section_id': section_id,
        'section_name': section['name']
    })


# ─── ROUTE 3: Handle a chat message ───────────────────────────
@app.route('/api/chat', methods=['POST'])
def chat():
    data       = request.get_json()
    section_id = data.get('section_id')
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'error': 'No message provided'}), 400

    section = SECTIONS.get(section_id)
    if not section:
        return jsonify({'error': 'Section not found'}), 404

    history = conversation_histories.get(section_id, [])

    # Build contents list from history + new message
    contents = []
    for msg in history:
        role  = msg.get('role', 'user')
        parts = msg.get('parts', [''])
        text  = parts[0] if isinstance(parts, list) else parts
        contents.append(types.Content(
            role=role,
            parts=[types.Part(text=text)]
        ))
    contents.append(types.Content(
        role='user',
        parts=[types.Part(text=user_message)]
    ))

    ai_reply   = None
    last_error = None

    for attempt in range(3):
        try:
            response = client.models.generate_content(
                model='gemini-2.5-flash-lite',
                contents=contents,
                config=types.GenerateContentConfig(
                    system_instruction=build_spark_seed_prompt(section, jd_state.get_section(section_id))
                )
            )
            ai_reply   = response.text
            last_error = None
            break
        except Exception as e:
            last_error = e
            if '503' in str(e) or 'UNAVAILABLE' in str(e):
                time.sleep(3 * (attempt + 1))  # wait a bit longer each retry
                continue
            break  # don't bother retrying other error types (e.g. quota)

    if last_error is not None:
        print(f"[Spark Seed error] {last_error}")
        return jsonify({'message': f'[Spark Seed error] {str(last_error)}', 'error': True}), 200

    # Save updated history
    conversation_histories[section_id] = history + [
        {'role': 'user',  'parts': [user_message]},
        {'role': 'model', 'parts': [ai_reply]}
    ]

    jd_state.collect(section_id, user_message)

    return jsonify({'message': ai_reply, 'section_id': section_id})


# ─── ROUTE 4: Export the finished JD ──────────────────────────
@app.route('/api/export', methods=['GET'])
def export_jd():
    """Turn everything collected into a finished job description"""
    from core.jd_export import generate_jd_text
    jd_text = generate_jd_text(jd_state.get_all())
    return jsonify({'jd': jd_text})


# ─── ROUTE 5: Reset and start fresh ───────────────────────────
@app.route('/api/reset', methods=['POST'])
def reset():
    global conversation_histories, jd_state
    conversation_histories = {}
    jd_state = JDState()
    return jsonify({'status': 'ok'})


# ─── SPARK SEED'S PERSONALITY BUILDER ────────────────────────
def build_spark_seed_prompt(section, collected_so_far=None):
    """Write Spark Seed's instructions for each section"""
    already_collected = ""
    if collected_so_far:
        items = "\n".join(f"- {item}" for item in collected_so_far)
        already_collected = f"""

Information already collected in this section — do NOT ask for this
information again UNLESS it contains a potential compliance issue
(see Compliance note below). Compliance flags always take priority:
if any previously collected answer contains something that should be
flagged under the Ontario Human Rights Code or Pay Transparency Act,
you must still raise it, even if it was already recorded.
Move on to whatever is still missing from your goal:
{items}"""

    return f"""You are Spark Seed — a warm, professional AI guide helping
employers write ethical, inclusive job descriptions for the Canadian market.

You are handling the "{section['name']}" section.

Your personality: {section['personality']}
Your goal: {section['goal']}
Compliance note: {section['compliance_note']}{already_collected}

Rules you must always follow:
- Ask only ONE question at a time
- Keep replies short and conversational — 2 to 4 sentences maximum
- If an answer is vague, gently ask for more detail
- If something may be discriminatory under the Ontario Human Rights Code,
    kindly flag it and suggest a better approach
 - Do not repeat or re-ask information already provided for this section, unless it contains something that must be flagged under the Compliance note
 - If everything needed for this section is already collected, ask one concise
     follow-up question to confirm or move forward
 - Always stay warm, patient, and encouraging"""


# ─── START THE SERVER ─────────────────────────────────────────
if __name__ == '__main__':
    print("🏮 Spark Seed JD Builder is starting...")
    print("Go to your browser and open: http://localhost:5000")
    app.run(debug=True, port=5000)