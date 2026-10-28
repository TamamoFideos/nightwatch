// Edita esta lista para agregar o cambiar las quests. Meses en formato YYYY-MM-DD.
const quests = {
  '2026-11-13': [
    { name: 'POI e Inquisition', short: 'POI + INQUISITION', time: '9:00 pm', requirements: [{name: 'POI', items: ['Nivel 80+ y Premium.']}, {name: 'Inquisition · Solo final', items: ['Nivel 100+ y Premium.', 'Llegar con las misiones 1–6 reportadas y la misión 7 (The Shadow Nexus) aceptada con Henricus.', 'Haber tocado al menos un trono de POI antes de entrar al final.', 'Llevar Special Flask (Holy Water) de Henricus.']}], details: 'Confirma asistencia en WhatsApp.' }
  ]
};
// Salidas adicionales.
quests['2026-11-27'] = quests['2026-11-13'].map(quest => ({ ...quest }));
quests['2026-10-30'] = quests['2026-11-13'].map(quest => ({ ...quest }));
const today = new Date();
let year = today.getFullYear(), month = today.getMonth();
let selected = [year, String(month + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
const calendar = document.getElementById('calendar');
const key = date => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
const capitalize = value => value[0].toUpperCase() + value.slice(1);
function renderCalendar() {
  document.getElementById('month-title').textContent = capitalize(new Date(year,month,1).toLocaleDateString('es-MX',{month:'long',year:'numeric'}));
  calendar.replaceChildren();
  const offset = (new Date(year,month,1).getDay()+6)%7;
  const days = new Date(year,month+1,0).getDate();
  const cells = Math.ceil((offset+days)/7)*7;
  for(let i=0;i<cells;i++) {
    const date = new Date(year,month,i-offset+1), dateKey = key(date), events = quests[dateKey] || [];
    const button = document.createElement('button');
    button.className = 'day' + (date.getMonth()!==month?' outside':'') + (events.length?' has-events':'') + (selected===dateKey?' selected':'');
    button.textContent = date.getDate();
    button.setAttribute('aria-label',`${date.toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'})}, ${events.length} quests`);
    button.setAttribute('aria-pressed',String(selected===dateKey));
    if(events.length) {const badge=document.createElement('span');badge.className='quest-badge';badge.setAttribute('aria-hidden','true');badge.textContent=`${events.length} ${events.length===1?'quest':'quests'}`;button.appendChild(badge);}
    button.addEventListener('click',()=>{const previousMonth=month;selected=dateKey;year=date.getFullYear();month=date.getMonth();render();calendar.querySelector('.selected')?.focus({preventScroll:true});animateSelection();if(previousMonth!==month)animateMonth();});
    calendar.appendChild(button);
  }
}
function renderDetails() {
  const date = new Date(selected+'T12:00:00'), events=quests[selected]||[];
  const dateLabel=capitalize(date.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'}));
  const selectedDate=document.getElementById('selected-date');
  selectedDate.textContent=events.length?'':dateLabel;
  selectedDate.hidden=events.length>0;
  document.getElementById('quest-count').textContent=`${events.length} ${events.length===1?'quest':'quests'}`;
  document.getElementById('events').innerHTML=events.length ? events.map(event=>`<article class="event"><h4 class="quest-title">${event.name}</h4><p class="quest-date">${dateLabel}</p><div class="event-hours"><span>Horario</span><p><time>${event.time}</time><span>Hora México (GMT -6)</span></p></div><section class="event-details"><h5>Detalles</h5>${(event.requirements || []).map(quest=>`<div class="requirement-group"><h6>${quest.name}</h6><ul>${quest.items.map(item=>`<li>${item}</li>`).join('')}</ul></div>`).join('')}<p>${event.details || 'Detalles por confirmar.'}</p></section></article>`).join('') : '<div class="empty">No hay quests programadas para este día.</div>';
}
const importantQuests = [
  {name:'POI e Inquisition', short:'POI + INQUISITION'},
  {name:'FINAL GT', short:'FINAL GT'},
  {name:'Ferumbras', short:'Ferumbras'},
  {name:'Forgotten Knowledge (Final)', short:'Forgotten Knowledge (Final)'}
];
function renderImportantQuests() {
  const list=document.getElementById('important-list');
  list.replaceChildren();
  importantQuests.forEach(quest=>{
    const scheduled=Object.entries(quests).flatMap(([date,events])=>events.filter(event=>event.short===quest.short && date.startsWith(`${year}-${String(month+1).padStart(2,'0')}-`)).map(event=>({date,event})));
    const row=document.createElement('li');
    const item=document.createElement('div');
    item.className='important-item'+(scheduled.length?' scheduled':' pending');
    const title=document.createElement('strong');title.textContent=quest.name;
    const status=document.createElement('span');
    status.textContent=scheduled.length?scheduled.map(({date,event})=>`${new Date(date+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'short'})} · ${event.time}`).join(' / '):'Sin programar';
    item.appendChild(title);item.appendChild(status);
    
    row.appendChild(item);list.appendChild(row);
  });
}
function render(){renderCalendar();renderDetails();renderImportantQuests();}
const activeAnimations = new WeakMap();
function animateElement(element, frames, duration) {
  if (!element || typeof element.animate !== 'function' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  activeAnimations.get(element)?.cancel();
  activeAnimations.set(element, element.animate(frames, {duration, easing:'cubic-bezier(.2,.7,.2,1)'}));
}
function animateSelection() {
  animateElement(calendar.querySelector('.selected'), [{transform:'scale(.92)'},{transform:'scale(1)'}], 220);
  animateElement(document.getElementById('events'), [{opacity:.25,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}], 220);
}
function animateMonth(delta=1) {
  animateElement(calendar, [{opacity:.3,transform:`translateX(${delta*10}px)`},{opacity:1,transform:'translateX(0)'}], 240);
}
function changeMonth(delta){month+=delta;const date=new Date(year,month,1);year=date.getFullYear();month=date.getMonth();selected=key(date);render();animateMonth(delta);}
document.getElementById('prev').addEventListener('click',()=>changeMonth(-1));
document.getElementById('next').addEventListener('click',()=>changeMonth(1));
render();















