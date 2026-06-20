// ============================================================
// DATA LOADER — fetch từ Apps Script Web App (JSONP)
// ============================================================

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqDir1F75ohu2ZhNianRUD6h84GLHgvNleb2JHpuPk0fCbjE7Jl7Z0mji4ITItkDrwFg/exec';

// Bao nhiêu giây thì tự fetch lại (60 = 1 phút)
const REFRESH_INTERVAL_SEC = 60;

// Biến lưu data toàn cục — main.js đọc từ đây
let GROUPS   = [];
let ROUND_16 = [];
let ROUND_8  = [];
let QUARTER  = [];
let SEMI     = [];
let FINAL    = [];

// ---------- Fetch bằng JSONP (tránh CORS khi mở local) ----------
function loadData() {
  showLoadingState(true);

  const callbackName = 'caroCallback_' + Date.now();
  window[callbackName] = function(data) {
    GROUPS   = data.groups   || [];
    ROUND_16 = data.round16  || [];
    ROUND_8  = data.round8   || [];
    QUARTER  = data.quarter  || [];
    SEMI     = data.semi     || [];
    FINAL    = data.final    || [];

    renderGroups();
    renderBracket();
    showLoadingState(false);

    // Cleanup
    delete window[callbackName];
    const old = document.getElementById('jsonp-script');
    if (old) old.remove();
  };

  const script = document.createElement('script');
  script.id  = 'jsonp-script';
  script.src = APPS_SCRIPT_URL + '?callback=' + callbackName;
  script.onerror = () => {
    showError('Không thể tải dữ liệu.');
    delete window[callbackName];
  };
  document.body.appendChild(script);
}

function showLoadingState(isLoading) {
  const pill = document.querySelector('.status-pill');
  if (!pill) return;
  if (isLoading) {
    pill.innerHTML = '<span class="dot" style="background:#f0a500"></span> Đang tải dữ liệu…';
  } else {
    pill.innerHTML = '<span class="dot"></span> Đang cập nhật trực tiếp';
  }
}

function showError(msg) {
  const pill = document.querySelector('.status-pill');
  if (pill) pill.innerHTML = '<span class="dot" style="background:#a33"></span> Lỗi kết nối';
  console.warn(msg);
}

// ---------- Init & auto-refresh ----------
loadData();
setInterval(loadData, REFRESH_INTERVAL_SEC * 1000);