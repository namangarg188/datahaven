// DataHaven Quiz App
// Storage keys
const LS_KEYS = {
  USER_QUESTIONS: 'dh_user_questions',
  SCORES: 'dh_scores', // array of {name, score, weekId, at}
  WEEK_START: 'dh_week_start', // for info-only
};

// Admin code (change in README or here)
const ADMIN_CODE = 'datahaven-admin';
let adminUnlocked = false;

// Seed questions (20)
const seedQuestions = [
  {
    q: 'Why was DataHaven created?',
    A: 'Only for NFTs',
    B: 'To provide decentralized, secure storage and interoperability',
    C: 'For centralized cloud storage',
    D: 'Just as a token project',
    correct: 'B', seed: true,
  },
  {
    q: 'Which problem does DataHaven primarily address?',
    A: 'Gaming optimization',
    B: 'Secure decentralized storage + Ethereum integration',
    C: 'Video streaming',
    D: 'IoT device management',
    correct: 'B', seed: true,
  },
  {
    q: 'DataHaven is primarily built on which blockchain framework?',
    A: 'Cosmos SDK', B: 'Substrate', C: 'Solana', D: 'Avalanche',
    correct: 'B', seed: true,
  },
  {
    q: 'DataHaven achieves Ethereum compatibility through:',
    A: 'Native EVM Pallet', B: 'Tendermint', C: 'Solidity-only support', D: 'WASM restrictions',
    correct: 'A', seed: true,
  },
  {
    q: 'Substrate provides DataHaven with:',
    A: 'Modularity and custom runtime development', B: 'Centralized storage systems', C: 'Ethereum-only execution', D: 'Proof-of-Work mining',
    correct: 'A', seed: true,
  },
  {
    q: 'Which component of Substrate helps DataHaven build custom features?',
    A: 'Smart Contracts', B: 'Runtime Pallets', C: 'Shards', D: 'Validators only',
    correct: 'B', seed: true,
  },
  {
    q: 'DataHaven achieves Ethereum integration via:',
    A: 'JSON APIs', B: 'Native bridge + RPC compatibility', C: 'Solana relayers', D: 'Binance Smart Chain',
    correct: 'B', seed: true,
  },
  {
    q: 'Which assets can DataHaven support?',
    A: 'Only native tokens', B: 'Only ERC-20 tokens', C: 'Both native & bridged assets', D: 'Only NFTs',
    correct: 'C', seed: true,
  },
  {
    q: 'DataHaven supports AVS through which ecosystem?',
    A: 'Cosmos Hub', B: 'EigenLayer', C: 'Filecoin', D: 'Arbitrum',
    correct: 'B', seed: true,
  },
  {
    q: 'What is a unique feature of DataHaven compared to traditional storage networks?',
    A: 'Backup Storage Providers (BSPs)', B: 'CPU mining', C: 'On-chain games', D: 'Oracles only',
    correct: 'A', seed: true,
  },
  {
    q: 'What is the role of the DataHaven system token?',
    A: 'Governance + payments + staking', B: 'Meme trading', C: 'NFT minting only', D: 'Exchange-only liquidity',
    correct: 'A', seed: true,
  },
  {
    q: 'Which of the following requires staking in DataHaven?',
    A: 'MSPs and BSPs', B: 'Random wallets', C: 'Only Ethereum validators', D: 'NFT holders',
    correct: 'A', seed: true,
  },
  {
    q: 'Storage fees in DataHaven are paid for:',
    A: 'Transactions', B: 'On-chain governance', C: 'Data uploads & retention', D: 'Only token swaps',
    correct: 'C', seed: true,
  },
  {
    q: 'Who earns rewards from execution payments?',
    A: 'System token holders', B: 'Relayers and operators', C: 'Only Ethereum stakers', D: 'Exchanges',
    correct: 'B', seed: true,
  },
  {
    q: 'The DataHaven Runtime manages:',
    A: 'Consensus & governance logic', B: 'Storage provider contracts', C: 'Both A & B', D: 'None',
    correct: 'C', seed: true,
  },
  {
    q: 'The consensus & finality of DataHaven is inherited from:',
    A: 'Bitcoin', B: 'Polkadot / Substrate consensus', C: 'Cosmos Hub', D: 'Arbitrum',
    correct: 'B', seed: true,
  },
  {
    q: 'The Native Bridge in DataHaven connects with:',
    A: 'Binance Chain', B: 'Ethereum', C: 'Solana', D: 'Avalanche',
    correct: 'B', seed: true,
  },
  {
    q: 'Bridged assets in DataHaven are:',
    A: 'ERC-20 and ERC-721 compatible', B: 'Non-transferable', C: 'Only NFTs', D: 'Limited to staking tokens',
    correct: 'A', seed: true,
  },
  {
    q: 'MSPs in DataHaven are:',
    A: 'Main Storage Providers', B: 'Metadata Storage Pools', C: 'Market Service Platforms', D: 'Mining Stake Pools',
    correct: 'A', seed: true,
  },
  {
    q: 'BSPs provide what functionality?',
    A: 'Compute power', B: 'Backup redundancy', C: 'Token exchange', D: 'DeFi lending',
    correct: 'B', seed: true,
  },
];

// Helpers for localStorage
function readLS(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUserQuestions() {
  return readLS(LS_KEYS.USER_QUESTIONS, []);
}
function setUserQuestions(arr) { writeLS(LS_KEYS.USER_QUESTIONS, arr); }
function getScores() { return readLS(LS_KEYS.SCORES, []); }
function setScores(arr) { writeLS(LS_KEYS.SCORES, arr); }

// Week handling: reset Monday 00:00. We'll compute a weekId string like YYYY-WW.
function getCurrentWeekId(date = new Date()) {
  // ISO week number
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7; // 1-7 (Mon=1)
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
  const weekId = `${d.getUTCFullYear()}-W${String(weekNo).padStart(2,'0')}`;
  return weekId;
}

// Tabs
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tab-panel');

tabs.forEach(btn => {
  btn.addEventListener('click', () => {
    tabs.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    panels.forEach(p => p.classList.remove('active'));
    document.getElementById(`tab-${id}`).classList.add('active');
    if (id === 'leaderboard') renderLeaderboard();
    if (id === 'add') refreshYourAdditions();
    if (id === 'admin') renderAdminList();
  });
});

// QUIZ logic
const startForm = document.getElementById('start-form');
const playerNameInput = document.getElementById('playerName');
const quizArea = document.getElementById('quiz-area');
const questionText = document.getElementById('question-text');
const optionsDiv = document.getElementById('options');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const qCounter = document.getElementById('question-counter');
const sCounter = document.getElementById('score-counter');
const resultArea = document.getElementById('result-area');

let quizState = {
  name: '',
  index: 0,
  score: 0,
  questions: [...seedQuestions], // start with 20 seeds
  answered: [],
};

function shuffle(arr) {
  return arr.map(v => [Math.random(), v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
}

function startQuiz(name) {
  quizState.name = name.trim();
  quizState.index = 0;
  quizState.score = 0;
  quizState.answered = [];
  // You can mix in user questions if desired. Keeping seed for simplicity.
  quizState.questions = [...seedQuestions];
  // Shuffle questions and also shuffle options per question
  quizState.questions = shuffle(quizState.questions);
  nextBtn.disabled = true;
  submitBtn.classList.add('hidden');
  resultArea.classList.add('hidden');
  quizArea.classList.remove('hidden');
  renderQuestion();
}

function renderQuestion() {
  const { index, questions, score } = quizState;
  const q = questions[index];
  qCounter.textContent = `Question ${index + 1} / ${questions.length}`;
  sCounter.textContent = `Score: ${score}`;
  questionText.textContent = q.q;
  optionsDiv.innerHTML = '';
  const labels = ['A','B','C','D'];
  const opts = labels.map(k => ({ key: k, text: q[k] })).filter(o => !!o.text);
  // shuffle options to reduce bias but keep track of correctness
  const optsShuffled = shuffle(opts);
  optsShuffled.forEach(o => {
    const id = `opt-${o.key}-${index}`;
    const wrapper = document.createElement('label');
    wrapper.className = 'option';
    wrapper.innerHTML = `<input type="radio" name="opt" id="${id}" value="${o.key}"> <span><strong>${o.key})</strong> ${o.text}</span>`;
    wrapper.addEventListener('change', onSelect);
    optionsDiv.appendChild(wrapper);
  });
  nextBtn.disabled = true;
  nextBtn.classList.remove('hidden');
  submitBtn.classList.toggle('hidden', index !== questions.length - 1);
}

function onSelect(e) {
  const { index, questions } = quizState;
  const selected = optionsDiv.querySelector('input[name="opt"]:checked');
  if (!selected) return;
  const choice = selected.value;
  const q = questions[index];
  const correct = q.correct;

  // Visual feedback
  optionsDiv.querySelectorAll('.option').forEach(el => el.classList.remove('correct','incorrect'));
  const selectedLabel = selected.closest('.option');
  if (choice === correct) {
    selectedLabel.classList.add('correct');
  } else {
    selectedLabel.classList.add('incorrect');
  }

  nextBtn.disabled = false;
}

nextBtn.addEventListener('click', () => {
  const selected = optionsDiv.querySelector('input[name="opt"]:checked');
  if (!selected) return; // safety
  const choice = selected.value;
  const q = quizState.questions[quizState.index];
  const isCorrect = choice === q.correct;
  quizState.answered.push({ idx: quizState.index, choice, correct: q.correct, isCorrect });
  if (isCorrect) quizState.score += 1;

  if (quizState.index < quizState.questions.length - 1) {
    quizState.index += 1;
    renderQuestion();
  } else {
    // last question -> show submit instead
    nextBtn.classList.add('hidden');
    submitBtn.classList.remove('hidden');
  }
});

submitBtn.addEventListener('click', () => {
  // Record score for the week
  const weekId = getCurrentWeekId();
  const scores = getScores();
  scores.push({ name: quizState.name, score: quizState.score, weekId, at: Date.now() });
  setScores(scores);

  quizArea.classList.add('hidden');
  resultArea.classList.remove('hidden');
  resultArea.innerHTML = `
    <h2>Result</h2>
    <p class="muted">Thanks, <strong>${escapeHtml(quizState.name)}</strong>!</p>
    <div class="pill">Your Score: ${quizState.score} / ${quizState.questions.length}</div>
    <p>Visit the Leaderboard tab to see rankings. Top 1 weekly earns <strong>5 Keys</strong>.</p>
  `;
});

startForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = playerNameInput.value.trim();
  if (!name) return;
  startQuiz(name);
});

// ADD question logic
const addForm = document.getElementById('add-form');
const addDiscord = document.getElementById('addDiscord');
const addQuestion = document.getElementById('addQuestion');
const addA = document.getElementById('addA');
const addB = document.getElementById('addB');
const addC = document.getElementById('addC');
const addD = document.getElementById('addD');
const addCorrect = document.getElementById('addCorrect');
const addStatus = document.getElementById('add-status');
const yourAddedCount = document.getElementById('yourAddedCount');
const yourAddedList = document.getElementById('yourAddedList');

addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const entry = {
    id: crypto.randomUUID(),
    q: addQuestion.value.trim(),
    A: addA.value.trim(),
    B: addB.value.trim(),
    C: addC.value.trim(),
    D: addD.value.trim(),
    correct: addCorrect.value,
    addedBy: addDiscord.value.trim(),
    createdAt: Date.now(),
    seed: false,
  };
  if (!entry.q || !entry.A || !entry.B || !entry.C || !entry.D || !entry.addedBy) {
    return showTemp(addStatus, 'Please fill all fields.', true);
  }
  const list = getUserQuestions();
  list.push(entry);
  setUserQuestions(list);
  addForm.reset();
  showTemp(addStatus, 'Question added successfully.', false);
  refreshYourAdditions();
  renderAdminList();
});

function refreshYourAdditions() {
  const who = addDiscord.value.trim();
  const all = getUserQuestions();
  const mine = who ? all.filter(q => (q.addedBy||'').toLowerCase() === who.toLowerCase()) : [];
  yourAddedCount.textContent = `${mine.length} added`;
  yourAddedList.innerHTML = '';
  mine.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${escapeHtml(item.q)}</span><span class="muted">by ${escapeHtml(item.addedBy)}</span>`;
    yourAddedList.appendChild(li);
  });
}
addDiscord.addEventListener('input', refreshYourAdditions);

// Leaderboard
function renderLeaderboard() {
  const leaderboardEl = document.getElementById('leaderboard');
  const contributorsEl = document.getElementById('contributors');
  const weekId = getCurrentWeekId();
  const scores = getScores().filter(s => s.weekId === weekId);
  // best score per name for this week
  const map = new Map();
  scores.forEach(s => {
    const prev = map.get(s.name);
    if (!prev || s.score > prev.score) map.set(s.name, s);
  });
  const best = Array.from(map.values()).sort((a,b)=>b.score - a.score).slice(0,20);
  leaderboardEl.innerHTML = best.map((s,i)=>`<li><strong>${i+1}. ${escapeHtml(s.name)}</strong> — ${s.score} pts</li>`).join('') || '<li>No scores yet this week.</li>';

  const contributions = getUserQuestions();
  const byUser = new Map();
  contributions.forEach(q => {
    const key = q.addedBy || 'Unknown';
    byUser.set(key, (byUser.get(key)||0)+1);
  });
  const contribList = Array.from(byUser.entries()).sort((a,b)=>b[1]-a[1]);
  contributorsEl.innerHTML = contribList.map(([name, cnt],i)=>`<li><strong>${i+1}. ${escapeHtml(name)}</strong> — ${cnt} added</li>`).join('') || '<li>No contributions yet.</li>';
}

// ADMIN
const adminCode = document.getElementById('adminCode');
const adminUnlock = document.getElementById('adminUnlock');
const adminStatus = document.getElementById('adminStatus');
const adminQuestionList = document.getElementById('adminQuestionList');

adminUnlock.addEventListener('click', () => {
  if (adminCode.value === ADMIN_CODE) {
    adminUnlocked = true;
    showTemp(adminStatus, 'Admin unlocked. You can delete user-added questions.', false);
    renderAdminList();
  } else {
    adminUnlocked = false;
    showTemp(adminStatus, 'Invalid admin code.', true);
    renderAdminList();
  }
});

function renderAdminList() {
  const arr = getUserQuestions().sort((a,b)=>b.createdAt-a.createdAt);
  adminQuestionList.innerHTML = '';
  if (arr.length === 0) {
    adminQuestionList.innerHTML = '<li>No user-added questions.</li>';
    return;
  }
  arr.forEach(item => {
    const li = document.createElement('li');
    const left = document.createElement('div');
    left.style.flex = '1';
    left.innerHTML = `<strong>${escapeHtml(item.q)}</strong><br><span class="muted">by ${escapeHtml(item.addedBy)} • Correct: ${item.correct}</span>`;
    const right = document.createElement('div');
    const del = document.createElement('button');
    del.className = 'btn';
    del.textContent = 'Delete';
    del.disabled = !adminUnlocked;
    del.addEventListener('click', () => deleteUserQuestion(item.id));
    right.appendChild(del);
    li.appendChild(left);
    li.appendChild(right);
    adminQuestionList.appendChild(li);
  });
}

function deleteUserQuestion(id) {
  if (!adminUnlocked) return;
  const list = getUserQuestions();
  const idx = list.findIndex(q => q.id === id);
  if (idx >= 0) {
    list.splice(idx,1);
    setUserQuestions(list);
    renderAdminList();
    showTemp(adminStatus, 'Question removed.', false);
  }
}

// Export/Import
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');

exportBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const data = {
    userQuestions: getUserQuestions(),
    scores: getScores(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'datahaven_export.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
});

importBtn.addEventListener('click', (e) => {
  e.preventDefault();
  importFile.click();
});

importFile.addEventListener('change', async () => {
  const file = importFile.files?.[0];
  if (!file) return;
  const text = await file.text();
  try {
    const data = JSON.parse(text);
    if (Array.isArray(data.userQuestions)) setUserQuestions(data.userQuestions);
    if (Array.isArray(data.scores)) setScores(data.scores);
    alert('Import successful.');
    renderLeaderboard();
    refreshYourAdditions();
    renderAdminList();
  } catch(err) {
    alert('Invalid JSON file.');
  } finally {
    importFile.value = '';
  }
});

// Utilities
function showTemp(el, text, isError) {
  el.textContent = text;
  el.style.color = isError ? '#dc2626' : '#065f46';
  setTimeout(() => { el.textContent = ''; }, 2500);
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[s]));
}

// Initial
renderLeaderboard();
refreshYourAdditions();
renderAdminList();
