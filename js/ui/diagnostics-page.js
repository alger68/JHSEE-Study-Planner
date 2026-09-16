import { SUBJECTS } from '../config/subjects.js';

const LABELS = { chinese:'國文', english:'英語', math:'數學', social:'社會', science:'自然' };
const GRADES = ['A++','A+','A','B++','B+','B','C'];

export function renderDiagnosticsPage(context) {
  const root = document.createElement('section');
  root.className = 'page-stack';
  root.innerHTML = '<header><p class="eyebrow">模考診斷</p><h1>輸入最新模考結果</h1><p>只用來決定讀書優先級，不等同正式落點。</p></header>';
  const form = document.createElement('form');
  form.className = 'card form-grid';
  form.innerHTML = `
    <label>日期<input name="date" type="date" required value="${context.today()}"></label>
    <label>名稱<input name="label" value="模擬考" required></label>
    <label>範圍<input name="scope" placeholder="例如：第一次模考範圍"></label>
  `;
  for (const subject of SUBJECTS) {
    const label = document.createElement('label');
    label.textContent = LABELS[subject];
    const select = document.createElement('select');
    select.name = subject;
    for (const grade of GRADES) {
      const option = document.createElement('option');
      option.value = grade; option.textContent = grade;
      if (grade === 'A') option.selected = true;
      select.append(option);
    }
    label.append(select);
    form.append(label);
  }
  const writing = document.createElement('label');
  writing.innerHTML = '<span>作文級分（可選）</span><select name="writing"><option value="">未填</option><option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option></select>';
  form.append(writing);
  const message = document.createElement('p');
  message.className = 'form-message';
  const button = document.createElement('button');
  button.className = 'button'; button.type = 'submit'; button.textContent = '儲存診斷';
  form.append(button, message);

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const record = {
      id: `mock-${data.get('date')}-${Date.now()}`,
      date: String(data.get('date')),
      label: String(data.get('label') || '模擬考'),
      scope: String(data.get('scope') || ''),
      subjects: Object.fromEntries(SUBJECTS.map(subject => [subject, { grade:String(data.get(subject)) }])),
      writingLevel: data.get('writing') ? Number(data.get('writing')) : null
    };
    const result = context.validateDiagnostic(record);
    if (!result.ok) {
      message.textContent = result.errors.join('、');
      message.dataset.state = 'error';
      return;
    }
    const records = context.storage.get('diagnostics', []);
    context.storage.set('diagnostics', [...records, record]);
    message.textContent = '已儲存，首頁優先順序會立即更新。';
    message.dataset.state = 'success';
  });
  root.append(form);
  return root;
}
