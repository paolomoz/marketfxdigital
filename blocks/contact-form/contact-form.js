/* contact-form — a working lead form that posts to a PLACEHOLDER endpoint.
   =====================================================================
   BRAND TEAM: two placeholders must be replaced before go-live —
     1. data-endpoint  -> your form handler URL  (search: REPLACE_WITH_FORM_ENDPOINT)
     2. data-scheduler -> your scheduler/booking URL (search: REPLACE_WITH_SCHEDULER_URL)
   Both are also surfaced as visible-in-DOM data attributes on the <form> and the
   success panel so they are easy to grep/audit in the rendered page.
   =====================================================================
   Authoring (optional): one row per field -> [label, type, options, required]
     type    = text | email | tel | select | textarea (default text)
     options = pipe-separated list for a select (e.g. "SEO|Paid media|Other")
     required= "required" / "yes" to mark the field required
   With no authored rows the captured marketFX fields below are used. */

const NAME = 'contact-form';
const FORM_ENDPOINT = 'REPLACE_WITH_FORM_ENDPOINT';
const SCHEDULER_URL = 'REPLACE_WITH_SCHEDULER_URL';

const DEFAULT_FIELDS = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'email', label: 'Work email', type: 'email', required: true },
  { name: 'company', label: 'Company', type: 'text', required: false },
  { name: 'phone', label: 'Phone', type: 'tel', required: false },
  {
    name: 'help',
    label: 'What do you need help with?',
    type: 'select',
    required: false,
    options: [
      'General inquiry',
      'Paid media',
      'SEO & AI visibility',
      'Analytics',
      'Full-funnel strategy',
      'Other',
    ],
  },
];

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseAuthoredFields(block) {
  const rows = [...block.children].filter((r) => r.children.length);
  if (!rows.length) return null;
  const fields = rows.map((row) => {
    const cells = [...row.children].map((c) => c.textContent.trim());
    const [label, type = 'text', options = '', required = ''] = cells;
    if (!label) return null;
    return {
      name: slug(label),
      label,
      type: type.toLowerCase() || 'text',
      required: /^(y|yes|required|true)$/i.test(required.trim()),
      options: options ? options.split('|').map((o) => o.trim()).filter(Boolean) : [],
    };
  }).filter(Boolean);
  return fields.length ? fields : null;
}

function buildField(field) {
  const wrap = document.createElement('div');
  wrap.className = 'cf-field';

  const id = `cf-${field.name}`;
  const label = document.createElement('label');
  label.className = 'cf-label';
  label.htmlFor = id;
  label.append(document.createTextNode(field.label));
  if (field.required) {
    const req = document.createElement('span');
    req.className = 'cf-req';
    req.setAttribute('aria-hidden', 'true');
    req.textContent = '*';
    label.append(req);
  }

  let control;
  if (field.type === 'select') {
    control = document.createElement('select');
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Select an option';
    control.append(ph);
    (field.options || []).forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      control.append(o);
    });
  } else if (field.type === 'textarea') {
    control = document.createElement('textarea');
    control.rows = 4;
  } else {
    control = document.createElement('input');
    control.type = field.type;
  }
  control.id = id;
  control.name = field.name;
  control.className = 'cf-control';
  if (field.required) {
    control.required = true;
    label.append(document.createTextNode(''));
  }
  control.setAttribute('aria-required', field.required ? 'true' : 'false');

  const error = document.createElement('p');
  error.className = 'cf-error';
  error.id = `${id}-error`;
  error.setAttribute('role', 'alert');
  control.setAttribute('aria-describedby', error.id);

  wrap.append(label, control, error);
  return { wrap, control, error };
}

function validate(fields) {
  let firstInvalid = null;
  fields.forEach(({ field, control, error }) => {
    let msg = '';
    const val = control.value.trim();
    if (field.required && !val) {
      msg = `${field.label} is required.`;
    } else if (field.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      msg = 'Enter a valid email address.';
    }
    if (msg) {
      error.textContent = msg;
      control.setAttribute('aria-invalid', 'true');
      if (!firstInvalid) firstInvalid = control;
    } else {
      error.textContent = '';
      control.removeAttribute('aria-invalid');
    }
  });
  return firstInvalid;
}

export default function decorate(block) {
  const fields = parseAuthoredFields(block) || DEFAULT_FIELDS;

  block.replaceChildren();
  block.classList.remove(NAME);

  const section = document.createElement('section');
  section.setAttribute('data-section', NAME);
  section.setAttribute('data-intent', 'conversion');
  section.setAttribute('data-layout', 'lead-form');

  const wrap = document.createElement('div');
  wrap.className = 'wrap';

  const card = document.createElement('div');
  card.className = 'cf-card';
  card.setAttribute('data-reveal', '');

  const form = document.createElement('form');
  form.className = 'cf-form';
  form.noValidate = true;
  form.setAttribute('data-endpoint', FORM_ENDPOINT);
  // visible-in-DOM flags for the brand team (see file header)
  form.setAttribute('data-endpoint-todo', 'REPLACE_WITH_FORM_ENDPOINT');

  const fieldRefs = [];
  fields.forEach((field) => {
    const { wrap: fw, control, error } = buildField(field);
    fieldRefs.push({ field, control, error });
    form.append(fw);
  });

  // hidden UTM fields, populated from the URL query string on load
  let params;
  try {
    params = new URLSearchParams(window.location.search);
  } catch (e) {
    params = new URLSearchParams();
  }
  UTM_KEYS.forEach((key) => {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = params.get(key) || '';
    form.append(input);
  });

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn-primary cf-submit';
  submit.textContent = 'Send and pick a time';
  form.append(submit);

  // success state, hidden until submit
  const success = document.createElement('div');
  success.className = 'cf-success';
  success.hidden = true;
  success.setAttribute('role', 'status');
  success.setAttribute('data-scheduler', SCHEDULER_URL);
  success.setAttribute('data-scheduler-todo', 'REPLACE_WITH_SCHEDULER_URL');
  const sh = document.createElement('h3');
  sh.textContent = "Thanks — we'll reply within 24 hours.";
  const sp = document.createElement('p');
  sp.textContent = 'Pick a time:';
  const sa = document.createElement('a');
  sa.className = 'btn btn-primary cf-scheduler';
  sa.href = SCHEDULER_URL;
  sa.textContent = 'Book a strategy call';
  success.append(sh, sp, sa);

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const firstInvalid = validate(fieldRefs);
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }
    // Placeholder submit: no real endpoint wired yet. When data-endpoint is
    // replaced, POST new FormData(form) here. For now, show the success state.
    form.hidden = true;
    success.hidden = false;
    success.focus?.();
  });

  card.append(form, success);
  wrap.append(card);
  section.append(wrap);
  block.append(section);
}
