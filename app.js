let products=[],families=[],playbooks=[];
let state={brand:'Xiaomi',group:'همه',category:'همه',status:'همه',query:'',sort:'ready'};
const $=s=>document.querySelector(s);const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const num=n=>Number(n||0).toLocaleString('fa-IR');
Promise.all([fetch('./products.json').then(r=>{if(!r.ok)throw Error('products');return r.json()}),fetch('./families.json').then(r=>{if(!r.ok)throw Error('families');return r.json()}),fetch('./playbooks.json').then(r=>{if(!r.ok)throw Error('playbooks');return r.json()})])
.then(([p,f,b])=>{products=p;families=f;playbooks=b;$('#skuCount').textContent=num(products.length);$('#familyCount').textContent=num(families.length);$('#readyCount').textContent=num(playbooks.length);renderFilters();render();})
.catch(()=>{$('#resultCount').textContent='بارگذاری داده‌ها انجام نشد؛ فایل‌های JSON و مسیر انتشار را بررسی کنید.'});
function renderFilters(){
 const brands=['همه',...new Set(families.map(x=>x.brand))];
 $('#brandFilters').innerHTML=brands.map(x=>chip(x,state.brand===x,'brand')).join('');
 const filteredFamilies=families.filter(x=>(state.brand==='همه'||x.brand===state.brand));
 const groups=['همه',...new Set(filteredFamilies.map(x=>x.group))].sort((a,b)=>a==='همه'?-1:a.localeCompare(b,'fa'));
 if(!groups.includes(state.group))state.group='همه';
 $('#groupFilters').innerHTML=groups.map(x=>chip(x,state.group===x,'group')).join('');
 const cats=['همه',...new Set(filteredFamilies.filter(x=>state.group==='همه'||x.group===state.group).map(x=>x.category))].sort((a,b)=>a==='همه'?-1:a.localeCompare(b,'fa'));
 if(!cats.includes(state.category))state.category='همه';
 $('#categoryFilter').innerHTML=cats.map(x=>`<option value="${esc(x)}">${esc(x)}</option>`).join('');
 $('#categoryFilter').value=state.category;
 const statuses=['همه','مستند','در حال تکمیل'];
 $('#statusFilters').innerHTML=statuses.map(x=>chip(x,state.status===x,'status')).join('');
}
function chip(x,active,type){return `<button class="chip ${active?'active':''}" data-${type}="${esc(x)}">${esc(x)}</button>`}
function render(){
 const q=state.query.trim().toLocaleLowerCase();
 let list=families.filter(f=>{
  const hitBrand=state.brand==='همه'||f.brand===state.brand;
  const hitGroup=state.group==='همه'||f.group===state.group;
  const hitCat=state.category==='همه'||f.category===state.category;
  const pb=playbooks.find(x=>x.id===f.id);
  const ready=!!pb;
  const hitStatus=state.status==='همه'||(state.status==='مستند'?ready:!ready);
  const p=products.filter(x=>x.familyId===f.id);
  const hay=[f.name,f.brand,f.category,...p.flatMap(x=>[x.name,x.ean])].join(' ').toLocaleLowerCase();
  return hitBrand&&hitGroup&&hitCat&&hitStatus&&(!q||hay.includes(q));
 });
 list.sort((a,b)=>state.sort==='count'?b.skuCount-a.skuCount:state.sort==='name'?a.name.localeCompare(b.name,'en'):Number(!!playbooks.find(x=>x.id===b.id))-Number(!!playbooks.find(x=>x.id===a.id))||b.skuCount-a.skuCount);
 $('#sectionTitle').textContent=state.brand==='همه'?'همه خانواده‌های محصول':`خانواده‌های ${state.brand}`;
 $('#resultCount').textContent=`${num(list.length)} خانواده محصول · ${num(list.reduce((s,x)=>s+x.skuCount,0))} SKU در نتیجه`;
 $('#familyGrid').innerHTML=list.length?list.map(card).join(''):`<div class="empty">موردی با این فیلترها پیدا نشد.</div>`;
}
function card(f){const pb=playbooks.find(x=>x.id===f.id);return `<button class="family-card" data-family="${esc(f.id)}"><div class="card-top"><span class="category-tag">${esc(f.category)}</span><span class="status ${pb?'ready':'pending'}">${pb?'راهنمای مستند':'محتوا در حال تکمیل'}</span></div><h3>${esc(f.name)}</h3><p>${esc(f.brand)} <i>·</i> ${num(f.skuCount)} تنوع/SKU</p><div class="card-bottom"><span>${pb?'مشاهده راهنمای فروش':'مشاهده مدل‌ها و وضعیت اطلاعات'}</span><b>←</b></div></button>`}
function openFamily(id){const f=families.find(x=>x.id===id);if(!f)return;const pb=playbooks.find(x=>x.id===id);const ps=products.filter(x=>x.familyId===id);$('#modalContent').innerHTML=`<div class="modal-heading"><span class="category-tag">${esc(f.category)}</span><h2>${esc(f.name)}</h2><p>${esc(f.brand)} · ${num(ps.length)} SKU/تنوع</p></div>${pb?playbookHtml(pb):pendingHtml(f,ps)}<section class="sku-section"><h3>مدل‌ها و شناسه‌های ثبت‌شده</h3><div class="sku-list">${ps.map(x=>`<div class="sku-row"><span>${esc(x.name)}</span><code>EAN: ${esc(x.ean||'ثبت نشده')}</code></div>`).join('')}</div></section>`;$('#modal').classList.remove('hidden');$('#modal').setAttribute('aria-hidden','false');document.body.classList.add('modal-open');}
function pendingHtml(f,ps){return `<div class="pending-panel"><strong>محتوای تخصصی این خانواده هنوز تأیید نشده است.</strong><p>فعلاً از روی نام کالا یا دسته‌بندی، ویژگی فنی، مزیت رقابتی، ادعای عملکرد یا پاسخ اعتراض تولید نشده. مرحله بعد باید صفحه رسمی همان مدل، نسخه منطقه‌ای و مشخصات SKU را بررسی کند.</p><p class="muted">مدل‌های موجود در فایل: ${ps.map(x=>esc(x.name)).join('؛ ')}</p></div>`}
function playbookHtml(pb){return `<section class="positioning"><span>جایگاه پیشنهادی محصول</span><p>${esc(pb.positioning)}</p></section><section class="talk-track"><h3>متن پیشنهادی فروشنده</h3><p>${esc(pb.talkTrack)}</p></section><section class="content-section"><h3>برای چه مشتری‌ای مناسب است؟</h3><ul>${pb.bestFor.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="content-section"><h3>ویژگی را به منفعت تبدیل کن</h3><div class="feature-list">${pb.features.map(x=>`<article class="feature"><strong>${esc(x.feature)}</strong><p>${esc(x.benefit)}</p></article>`).join('')}</div></section>${pb.modelDifferences?`<section class="content-section"><h3>تفاوت مدل‌ها و سایزها</h3><div class="feature-list">${pb.modelDifferences.map(x=>`<article class="feature"><strong>${esc(x.model)}</strong><p>${esc(x.detail)}</p></article>`).join('')}</div></section>`:''}<section class="content-section"><h3>سؤالات کشف نیاز</h3><ol>${pb.questions.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section><section class="content-section"><h3>سناریوی دمو در فروشگاه</h3><ol>${pb.demo.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></section><section class="content-section"><h3>پاسخ به اعتراض‌های رایج</h3><div class="objections">${pb.objections.map(x=>`<article><strong>«${esc(x.q)}»</strong><p>${esc(x.a)}</p></article>`).join('')}</div></section><section class="content-section"><h3>فروش مکمل و نکات تکمیلی</h3><ul>${pb.crossSell.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="guardrails"><h3>خط قرمزهای فروشنده</h3><ul>${pb.guardrails.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></section><section class="sources"><h3>منابع رسمی بررسی‌شده</h3>${pb.sources.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)} ↗</a>`).join('')}</section>`}
$('#search').addEventListener('input',e=>{state.query=e.target.value;render()});$('#sort').addEventListener('change',e=>{state.sort=e.target.value;render()});$('#categoryFilter').addEventListener('change',e=>{state.category=e.target.value;render()});$('#clearFilters').addEventListener('click',()=>{state={brand:'Xiaomi',group:'همه',category:'همه',status:'همه',query:'',sort:'ready'};$('#search').value='';$('#sort').value='ready';renderFilters();render()});
document.addEventListener('click',e=>{const b=e.target.closest('[data-brand]');if(b){state.brand=b.dataset.brand;state.group='همه';state.category='همه';renderFilters();render();return}const g=e.target.closest('[data-group]');if(g){state.group=g.dataset.group;state.category='همه';renderFilters();render();return}const st=e.target.closest('[data-status]');if(st){state.status=st.dataset.status;renderFilters();render();return}const f=e.target.closest('[data-family]');if(f){openFamily(f.dataset.family);return}if(e.target.closest('[data-close]'))closeModal()});
function closeModal(){$('#modal').classList.add('hidden');$('#modal').setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});