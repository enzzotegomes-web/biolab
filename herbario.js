/* =====================================================================
   herbario.js — Herbário Digital do BioLab Dynamics
   Carregue DEPOIS do <script> principal (usa db, user, uid, me, tab,
   $, escapeHtml, openAuth, save, render e handleSession do código original).
   Dados em SP (uma única lista). Progresso salvo no Supabase (herbarium_entries).
   ===================================================================== */
(() => {
  // ---------- DADOS DAS ESPÉCIES (edite/adicione aqui) ----------
  // gal: [rótulo, sufixo] -> imagens/<id>-<sufixo>.jpg (opcionais; somem se não existirem)
  const SP = [
    { id:"araucaria", pop:"Pinheiro-do-paraná", sci:"Araucaria angustifolia", fam:"Araucariaceae", grupo:"Gimnosperma", clado:"Conífera", bioma:"Mata Atlântica",
      dist:"Sul do Brasil (Floresta Ombrófila Mista, a mata de araucárias) e manchas de altitude no Sudeste; também na Argentina (Misiones).",
      folha:"Simples, rígidas, lanceoladas e pontiagudas, em espiral nos ramos e persistentes por vários anos.",
      caule:"Tronco reto e cilíndrico; os ramos saem em verticilos e formam a copa em candelabro.",
      flor:"Não forma flores. Cones (estróbilos) masculinos e femininos ficam em plantas diferentes (espécie dioica).",
      fruto:"Não há fruto verdadeiro: as sementes (pinhões), grandes e comestíveis, ficam expostas na pinha.",
      eco:"O pinhão alimenta aves, roedores e outros animais; a gralha-azul enterra sementes e ajuda na dispersão.",
      curio:"Pinhões esquecidos pela gralha-azul podem germinar e formar novas árvores.",
      cons:"Criticamente em perigo (IUCN).", gal:[["Folhas","folha"],["Pinha e pinhões","pinha"],["Tronco","tronco"]] },
    { id:"pau-brasil", pop:"Pau-brasil", sci:"Paubrasilia echinata", fam:"Fabaceae", grupo:"Angiosperma", clado:"Eudicotiledônea", bioma:"Mata Atlântica",
      dist:"Mata Atlântica da costa brasileira, do Rio Grande do Norte ao Rio de Janeiro; hoje restrito a remanescentes.",
      folha:"Compostas bipinadas, com folíolos pequenos.",
      caule:"Tronco e ramos com acúleos (pequenos espinhos); o cerne é avermelhado.",
      flor:"Amarelas, com uma pétala central avermelhada, reunidas em cachos.",
      fruto:"Legume coberto de espinhos, que guarda as sementes.",
      eco:"Árvore típica da Mata Atlântica; a exploração intensiva desde o período colonial reduziu muito suas populações.",
      curio:"O cerne produz a brasilina, pigmento usado como corante vermelho; a madeira é valorizada em arcos de violino. É a árvore nacional do Brasil.",
      cons:"Em perigo (IUCN).", gal:[["Folha","folha"],["Flor","flor"],["Fruto","fruto"],["Tronco","tronco"]] },
    { id:"vitoria-regia", pop:"Vitória-régia", sci:"Victoria amazonica", fam:"Nymphaeaceae", grupo:"Angiosperma", clado:"Nymphaeales", bioma:"Amazônia",
      dist:"Bacia Amazônica, em lagos, remansos e áreas alagadas de águas calmas.",
      folha:"Flutuante, circular e muito grande (pode passar de 2 m), com borda elevada e nervuras salientes e espinhosas na face inferior.",
      caule:"Rizoma submerso, preso ao fundo; pecíolos longos levam as folhas à superfície.",
      flor:"Grandes e noturnas; brancas na primeira noite e rosadas a arroxeadas na seguinte; polinizadas por besouros.",
      fruto:"Fruto carnoso e espinhoso, com numerosas sementes.",
      eco:"Dá sombra e abrigo na água; aves como a jaçanã caminham sobre as folhas.",
      curio:"Na primeira noite a flor retém besouros polinizadores, que saem carregados de pólen na noite seguinte.",
      cons:null, gal:[["Folha","folha"],["Flor","flor"]] },
    { id:"pequi", pop:"Pequi", sci:"Caryocar brasiliense", fam:"Caryocaraceae", grupo:"Angiosperma", clado:"Eudicotiledônea", bioma:"Cerrado",
      dist:"Cerrado do Brasil Central, com ocorrência em áreas de transição.",
      folha:"Compostas, com três folíolos, dispostas de forma oposta.",
      caule:"Árvore de porte médio, com tronco tortuoso e casca grossa e rugosa, típicos do Cerrado.",
      flor:"Grandes, com muitos estames longos e claros; abrem à noite e atraem principalmente morcegos.",
      fruto:"Drupa de polpa amarela comestível que reveste um caroço com espinhos finos; a semente fica dentro do caroço.",
      eco:"Alimento para a fauna e base de extrativismo e culinária regional.",
      curio:"Os espinhos finos do caroço exigem cuidado: o fruto deve ser roído, não mordido.",
      cons:null, gal:[["Folha","folha"],["Flor","flor"],["Fruto","fruto"]] },
    { id:"mandacaru", pop:"Mandacaru", sci:"Cereus jamacaru", fam:"Cactaceae", grupo:"Angiosperma", clado:"Eudicotiledônea", bioma:"Caatinga",
      dist:"Caatinga do Nordeste, chegando a áreas vizinhas.",
      folha:"Ausentes na planta adulta; os espinhos são folhas modificadas.",
      caule:"Suculento, colunar e ramificado, com costelas e espinhos; armazena água e faz fotossíntese.",
      flor:"Grandes, brancas, noturnas e de vida curta; polinizadas por morcegos e mariposas.",
      fruto:"Baga vermelha ou rosada, com polpa branca e muitas sementes pequenas e pretas.",
      eco:"Oferece néctar e frutos à fauna e é usado como forragem em períodos de seca.",
      curio:"Faz fotossíntese do tipo CAM: abre os estômatos à noite para reduzir a perda de água.",
      cons:null, gal:[["Caule","caule"],["Flor","flor"],["Fruto","fruto"]] },
    { id:"seringueira", pop:"Seringueira", sci:"Hevea brasiliensis", fam:"Euphorbiaceae", grupo:"Angiosperma", clado:"Eudicotiledônea", bioma:"Amazônia",
      dist:"Nativa da Amazônia; cultivada em outras regiões do Brasil e do mundo (por exemplo, no Sudeste Asiático).",
      folha:"Compostas, com três folíolos e pecíolo longo.",
      caule:"Tronco ereto; a casca contém laticíferos, células que produzem látex.",
      flor:"Pequenas, unissexuais, em panículas, na mesma planta (monoica).",
      fruto:"Cápsula grande de três lóculos que se abre e lança sementes grandes e manchadas.",
      eco:"Árvore de floresta tropical e principal fonte comercial de borracha natural.",
      curio:"O látex é extraído por cortes na casca (sangria), sem derrubar a árvore.",
      cons:null, gal:[["Folha","folha"],["Fruto","fruto"],["Tronco","tronco"]] },
    { id:"xaxim", pop:"Xaxim", sci:"Dicksonia sellowiana", fam:"Dicksoniaceae", grupo:"Monilófita", clado:"Samambaia arborescente", bioma:"Mata Atlântica",
      dist:"Matas úmidas e de altitude do Sul e Sudeste do Brasil; também fora do país, na América tropical.",
      folha:"Frondes grandes, divididas em segmentos (pinadas), reunidas no topo do caule.",
      caule:"Cáudice ereto e fibroso, envolto por raízes adventícias, que sustenta a planta como um tronco.",
      flor:"Não tem flores.",
      fruto:"Não tem frutos nem sementes: reproduz-se por esporos, formados em soros na face inferior das frondes.",
      eco:"O cáudice serve de substrato para epífitas, como bromélias e orquídeas, em matas úmidas.",
      curio:"O cáudice foi muito usado como substrato de plantas ornamentais, o que levou à exploração excessiva; hoje a extração é restrita por lei.",
      cons:"Em perigo (IUCN).", gal:[["Fronde","fronde"],["Tronco","tronco"]] },
    { id:"ipe-amarelo", pop:"Ipê-amarelo", sci:"Handroanthus chrysotrichus", fam:"Bignoniaceae", grupo:"Angiosperma", clado:"Eudicotiledônea", bioma:"Mata Atlântica",
      dist:"Mata Atlântica, principalmente do Sudeste ao Sul do Brasil.",
      folha:"Compostas digitadas, com cinco folíolos, opostas; a árvore perde folhas na estação seca.",
      caule:"Tronco com casca fissurada; a copa fica quase sem folhas na época da floração.",
      flor:"Amarelas, em forma de sino/tubo, em inflorescências; abrem em geral no fim da estação seca.",
      fruto:"Cápsula alongada que se abre e libera sementes aladas, dispersas pelo vento.",
      eco:"As flores atraem abelhas, que polinizam a espécie; é muito usada na arborização urbana.",
      curio:"O epíteto chrysotrichus remete aos pelos dourados que recobrem partes da planta.",
      cons:null, gal:[["Folha","folha"],["Flor","flor"],["Fruto","fruto"],["Tronco","tronco"]] }
  ];
  const FONTES = [["Flora e Funga do Brasil","https://floradobrasil.jbrj.gov.br/"],["POWO (Kew)","https://powo.science.kew.org/"],["GBIF","https://www.gbif.org/"],["Lista Vermelha da IUCN","https://www.iucnredlist.org/"]];
  const FB = "data:image/svg+xml;utf8," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#10263d"/><text x="200" y="150" font-size="48" text-anchor="middle">🌿</text><text x="200" y="195" font-size="16" fill="#9fd9ff" text-anchor="middle" font-family="sans-serif">Foto não encontrada</text></svg>');

  // ---------- ESTADO ----------
  let ent = new Map();                 // species_id -> {is_favorite, discovered_at}
  const F = { q:"", b:"", g:"", fav:false };
  let openId = null;
  const E = v => escapeHtml(v);
  const norm = s => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const isFav = id => !!ent.get(id)?.is_favorite;
  const isDisc = id => !!ent.get(id)?.discovered_at;
  const warn = m => { const el = $("hmsg"); if (el) { el.textContent = m; setTimeout(() => { if (el) el.textContent = ""; }, 5000); } };
  const syncLegacy = () => { me.fav = SP.filter(s => isFav(s.id)).map(s => s.sci); }; // mantém player_progress.favorites coerente

  // ---------- SUPABASE ----------
  async function up(row) {
    if (!db || !uid) return false;
    const { error } = await db.from("herbarium_entries").upsert({ user_id: uid, ...row }, { onConflict: "user_id,species_id" });
    if (error) { console.error("Herbário:", error); return false; }
    return true;
  }
  async function load() {
    ent = new Map();
    if (!db || !uid) { syncLegacy(); return; }
    const { data, error } = await db.from("herbarium_entries").select("species_id,is_favorite,discovered_at").eq("user_id", uid);
    if (error) { console.error("Herbário:", error); return; }
    (data || []).forEach(r => ent.set(r.species_id, { is_favorite: r.is_favorite, discovered_at: r.discovered_at }));
    // migra favoritos antigos (guardados por nome científico em player_progress.favorites)
    for (const s of SP.filter(s => (me.fav || []).includes(s.sci) && !isFav(s.id))) {
      if (await up({ species_id: s.id, is_favorite: true })) ent.set(s.id, { ...(ent.get(s.id) || {}), is_favorite: true });
    }
    syncLegacy();
  }
  async function toggleFav(id) {
    if (!user) { openAuth("login", "Entre para guardar suas espécies favoritas."); return; }
    const cur = ent.get(id) || {}, nv = !cur.is_favorite;
    ent.set(id, { ...cur, is_favorite: nv }); syncLegacy(); refresh();
    if (await up({ species_id: id, is_favorite: nv })) save();
    else { ent.set(id, cur); syncLegacy(); refresh(); warn("Não foi possível salvar o favorito. Verifique sua conexão."); }
  }
  async function discover(id) {
    if (!user || isDisc(id)) return;
    const cur = ent.get(id) || {}, d = new Date().toISOString();
    ent.set(id, { ...cur, discovered_at: d }); refresh();
    if (!await up({ species_id: id, discovered_at: d })) { ent.set(id, cur); refresh(); warn("Não foi possível registrar a descoberta."); }
  }

  // ---------- INTERFACE ----------
  function stats() {
    const d = SP.filter(s => isDisc(s.id)).length, p = Math.round(100 * d / SP.length);
    $("hst").innerHTML = `<b>${SP.length}</b> espécies cadastradas · <b>${d}</b> descobertas (${p}%)<div class="bar"><i style="width:${p}%"></i></div>`
      + (!user ? `<small>Entre para registrar descobertas e favoritos.</small>` : "")
      + (user && d === SP.length ? `<p class="hb-win">🎉 Parabéns! Você descobriu todas as espécies do herbário.</p>` : "");
  }
  function grid() {
    const q = norm(F.q.trim());
    const list = SP.filter(s => (!q || norm([s.pop, s.sci, s.fam, s.bioma, s.grupo, s.clado].join(" ")).includes(q))
      && (!F.b || s.bioma === F.b) && (!F.g || s.grupo === F.g) && (!F.fav || isFav(s.id)));
    $("hg").innerHTML = list.length ? list.map(s => `<article class="herb-card">
      <div class="herb-media"><img class="herb-image" loading="lazy" src="imagens/${s.id}.jpg" alt="${E(s.pop)} (${E(s.sci)})" onerror="this.onerror=null;this.src=FB_IMG">
      <span class="herb-badge ${isDisc(s.id) ? "ok" : ""}">${isDisc(s.id) ? "✓ Descoberta" : "Nova"}</span></div>
      <div class="herb-content"><h3 class="herb-name">${E(s.pop)}</h3><p class="herb-scientific"><i>${E(s.sci)}</i></p>
      <div class="herb-tags"><span class="tag">${E(s.fam)}</span><span class="tag">${E(s.grupo)}</span></div>
      <p class="herb-info">🌎 ${E(s.bioma)}</p>
      <div class="herb-actions"><button onclick="HB.open('${s.id}')">Conhecer espécie</button>
      <button class="o" aria-pressed="${isFav(s.id)}" onclick="HB.fav('${s.id}')">${isFav(s.id) ? "★ Favorita" : "☆ Favoritar"}</button></div></div></article>`).join("")
      : `<p class="muted">Nenhuma espécie encontrada com esses filtros.</p>`;
  }
  function renderHerb() {
    const opt = (arr, all) => `<option value="">${all}</option>` + arr.map(v => `<option>${E(v)}</option>`).join("");
    $("m").innerHTML = `<div class="hb-top"><div id="hst"></div><button onclick="HB.rnd()">🎲 Descobrir uma espécie</button></div>
      <div class="hb-tools"><input id="f" type="search" placeholder="Buscar por nome, família, bioma..." oninput="HB.filter()">
      <select id="fb" onchange="HB.filter()">${opt([...new Set(SP.map(s => s.bioma))], "Todos os biomas")}</select>
      <select id="fg" onchange="HB.filter()">${opt([...new Set(SP.map(s => s.grupo))], "Todos os grupos")}</select>
      <label class="hb-chk"><input type="checkbox" id="ff" onchange="HB.filter()"> ★ Só favoritas</label></div>
      <p id="hmsg" class="save-status" aria-live="polite"></p><div id="hg"></div>
      <p class="muted">Fontes de consulta: ${FONTES.map(f => `<a href="${f[1]}" target="_blank" rel="noopener">${f[0]}</a>`).join(" · ")}</p>`;
    $("f").value = F.q; $("fb").value = F.b; $("fg").value = F.g; $("ff").checked = F.fav;
    stats(); grid();
  }
  function sheet(s) {
    const row = (k, v) => `<div class="hs-row"><b>${k}</b><span>${E(v)}</span></div>`;
    const gal = s.gal.map(([l, k]) => `<figure><img loading="lazy" src="imagens/${s.id}-${k}.jpg" alt="${E(l)} de ${E(s.pop)}" onerror="this.closest('figure').remove()"><figcaption>${E(l)}</figcaption></figure>`).join("");
    return `<button class="o hs-x" onclick="HB.close()" aria-label="Fechar">✕</button>
      <img class="hs-hero" src="imagens/${s.id}.jpg" alt="${E(s.pop)}" onerror="this.onerror=null;this.src=FB_IMG">
      <h2 id="hsT">${E(s.pop)}</h2><p class="herb-scientific"><i>${E(s.sci)}</i></p>
      <div class="herb-tags"><span class="tag">${E(s.fam)}</span><span class="tag">${E(s.grupo)} · ${E(s.clado)}</span><span class="tag">${E(s.bioma)}</span></div>
      ${row("Distribuição", s.dist)}${row("Folhas", s.folha)}${row("Caule", s.caule)}${row("Flores", s.flor)}${row("Frutos e sementes", s.fruto)}
      ${row("Importância ecológica", s.eco)}${row("Curiosidade", s.curio)}
      ${row("Conservação", s.cons || "Sem avaliação confirmada neste herbário; consulte as fontes abaixo.")}
      <div class="hs-gal" data-t="Fotografias complementares">${gal}</div>
      <p class="muted">Fontes: ${FONTES.map(f => `<a href="${f[1]}" target="_blank" rel="noopener">${f[0]}</a>`).join(" · ")}</p>
      ${user ? "" : `<p class="save-status">Entre na sua conta para registrar esta descoberta.</p>`}
      <div class="hs-act"><button onclick="HB.fav('${s.id}')">${isFav(s.id) ? "★ Remover dos favoritos" : "☆ Favoritar"}</button><button class="o" onclick="HB.close()">Fechar</button></div>`;
  }
  function paintSheet() {
    const s = SP.find(x => x.id === openId); let box = $("herbModal");
    if (!s) { if (box) box.classList.remove("show"); return; }
    if (!box) {
      box = document.createElement("div"); box.id = "herbModal"; box.className = "hs-back";
      box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-labelledby", "hsT");
      box.innerHTML = '<div class="hs-panel" id="hsP"></div>'; document.body.appendChild(box);
      box.addEventListener("click", e => { if (e.target === box) close(); });
    }
    $("hsP").innerHTML = sheet(s); box.classList.add("show");
  }
  const refresh = () => { if (tab === "herb" && $("hg")) { stats(); grid(); } if (openId) paintSheet(); };
  function open(id) { openId = id; paintSheet(); discover(id); }
  function close() { openId = null; const b = $("herbModal"); if (b) b.classList.remove("show"); }
  function rnd() { const pool = SP.filter(s => !isDisc(s.id)), l = pool.length ? pool : SP; open(l[Math.floor(Math.random() * l.length)].id); }
  function filter() { F.q = $("f").value; F.b = $("fb").value; F.g = $("fg").value; F.fav = $("ff").checked; grid(); }

  window.FB_IMG = FB;
  window.HB = { open, close, rnd, filter, fav: toggleFav };
  document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });

  // ---------- INTEGRAÇÃO COM O CÓDIGO ORIGINAL ----------
  const _render = window.render, _session = window.handleSession;
  window.render = function () { return tab === "herb" ? renderHerb() : _render.apply(this, arguments); };
  window.handleSession = async function (s) {
    await _session(s); await load(); if (!user) close();
    if (tab === "herb") renderHerb();
  };
  if (tab === "herb") renderHerb();
})();