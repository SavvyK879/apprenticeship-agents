const STAGES = ['Not applied', 'Applied', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

async function load() {
  const [companies, personal] = await Promise.all([
    fetch('/api/companies').then((r) => r.json()),
    fetch('/api/personal').then((r) => r.json()),
  ]);
  render(companies, personal);
}

function render(companies, personal) {
  const container = document.getElementById('companies');
  container.innerHTML = '';
  for (const c of companies) {
    const entry = personal[c.id] || {
      currentStage: 'Not applied',
      nextStage: '',
      nextStageDone: false,
      registeredForUpdates: false,
      notes: '',
    };
    const div = document.createElement('div');
    div.className = 'company';
    div.innerHTML = `
      <h2>${c.company} — ${c.role}</h2>
      <label>Current Stage
        <select data-field="currentStage">
          ${STAGES.map((s) => `<option value="${s}" ${s === entry.currentStage ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </label>
      <label>Next Stage
        <input type="text" data-field="nextStage" />
      </label>
      <label><input type="checkbox" data-field="nextStageDone" ${entry.nextStageDone ? 'checked' : ''} /> Next Stage Done</label>
      <label><input type="checkbox" data-field="registeredForUpdates" ${entry.registeredForUpdates ? 'checked' : ''} /> Registered for Updates</label>
      <label>Notes
        <textarea data-field="notes"></textarea>
      </label>
      <button type="button">Save</button>
    `;
    // Set free-text values as properties rather than interpolating them into the
    // HTML string above: these are the user's own notes and may contain an
    // apostrophe, quote, or "<" that would otherwise corrupt the markup.
    div.querySelector('[data-field="nextStage"]').value = entry.nextStage;
    div.querySelector('[data-field="notes"]').value = entry.notes;
    div.querySelector('button').addEventListener('click', () => save(c.id, div));
    container.appendChild(div);
  }
}

async function save(id, div) {
  const entry = {
    currentStage: div.querySelector('[data-field="currentStage"]').value,
    nextStage: div.querySelector('[data-field="nextStage"]').value,
    nextStageDone: div.querySelector('[data-field="nextStageDone"]').checked,
    registeredForUpdates: div.querySelector('[data-field="registeredForUpdates"]').checked,
    notes: div.querySelector('[data-field="notes"]').value,
  };
  const button = div.querySelector('button');
  const originalLabel = button.textContent;
  try {
    const res = await fetch('/api/personal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, entry }),
    });
    if (!res.ok) {
      let message = `Save failed (${res.status})`;
      try {
        const body = await res.json();
        if (body && body.error) message = body.error;
      } catch {
        // Response body wasn't JSON; fall back to the generic message above.
      }
      button.textContent = message;
      setTimeout(() => { button.textContent = originalLabel; }, 3000);
      return;
    }
    button.textContent = 'Saved';
    setTimeout(() => { button.textContent = originalLabel; }, 1500);
  } catch {
    button.textContent = 'Save failed (network error)';
    setTimeout(() => { button.textContent = originalLabel; }, 3000);
  }
}

load();
