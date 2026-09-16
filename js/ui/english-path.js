const STAGES = ['Diagnose', 'Stabilize', 'Mixed', 'Timed', 'Maintain'];

export function renderEnglishPath(stage) {
  const currentIndex = STAGES.indexOf(stage);
  const section = document.createElement('section');
  section.className = 'card english-path';
  section.innerHTML = `
    <h2>英文加強路線</h2>
    <p>這是平台學習控制階段，不等同正式會考等級。</p>
    <ol class="stage-list">
      ${STAGES.map((name, index) => `<li class="${index === currentIndex ? 'is-current' : index < currentIndex ? 'is-done' : ''}">${name}</li>`).join('')}
    </ol>
  `;
  return section;
}
