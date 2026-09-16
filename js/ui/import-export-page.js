export function renderImportExportPage(context) {
  const root=document.createElement('section'); root.className='page-stack';
  root.innerHTML='<header><p class="eyebrow">資料</p><h1>JSON 匯入／匯出</h1><p>只接受明確 schema，不讀其他專案 LocalStorage。</p></header>';
  const exportCard=document.createElement('section'); exportCard.className='card'; exportCard.innerHTML='<h2>匯出 Study Planner</h2>';
  const exportArea=document.createElement('textarea'); exportArea.rows=12; exportArea.readOnly=true; exportArea.value=context.exportSnapshot();
  const refresh=document.createElement('button'); refresh.className='button button--secondary'; refresh.type='button'; refresh.textContent='重新產生'; refresh.addEventListener('click',()=>{exportArea.value=context.exportSnapshot();});
  const download=document.createElement('button'); download.className='button'; download.type='button'; download.textContent='下載 JSON'; download.addEventListener('click',()=>{ const blob=new Blob([context.exportSnapshot()],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='jhsee-study-planner-backup.json'; a.click(); URL.revokeObjectURL(url); });
  const exportActions=document.createElement('div'); exportActions.className='button-row'; exportActions.append(refresh,download);
  exportCard.append(exportArea,exportActions);

  const importCard=document.createElement('section'); importCard.className='card'; importCard.innerHTML='<h2>匯入 JSON</h2>';
  const mode=document.createElement('select'); mode.innerHTML='<option value="planner">Study Planner 備份</option><option value="practice">外部練習摘要</option>';
  const file=document.createElement('input'); file.type='file'; file.accept='.json,application/json';
  const area=document.createElement('textarea'); area.rows=12; area.placeholder='貼上 JSON';
  file.addEventListener('change',async()=>{ const selected=file.files?.[0]; if (selected) area.value=await selected.text(); });
  const button=document.createElement('button'); button.className='button'; button.type='button'; button.textContent='驗證並匯入';
  const msg=document.createElement('p'); msg.className='form-message';
  button.addEventListener('click',()=>{
    try {
      if (mode.value==='planner') {
        const parsed=context.parsePlannerImport(area.value);
        for (const [key,value] of Object.entries(parsed.data)) context.storage.set(key,value);
      } else {
        const logs=context.parseExternalPracticeImport(area.value);
        context.storage.set('practiceLogs',[...context.storage.get('practiceLogs',[]),...logs]);
      }
      msg.textContent='匯入成功。'; msg.dataset.state='success';
    } catch (error) {
      msg.textContent=error.message; msg.dataset.state='error';
    }
  });
  importCard.append(mode,file,area,button,msg); root.append(exportCard,importCard); return root;
}
