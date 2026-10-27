// VisEditBench page-specific scripts: example tabs and leaderboard sorting

/**
 * タブ切り替えを初期化する。
 * 同じ data-tab-group を持つタブ列とパネル群を対応づけ，クリックされたタブのパネルだけを表示する。
 */
function setupTabs() {
    document.querySelectorAll('.vb-tabs[data-tab-group]').forEach(function(tabs) {
        const group = tabs.dataset.tabGroup;
        const panels = document.querySelector('.vb-tab-panels[data-tab-group="' + group + '"]');
        if (!panels) return;

        tabs.querySelectorAll('a[data-tab]').forEach(function(link) {
            link.addEventListener('click', function() {
                const name = link.dataset.tab;
                tabs.querySelectorAll('li').forEach(function(li) {
                    li.classList.toggle('is-active', li === link.parentElement);
                });
                panels.querySelectorAll('.vb-tab-panel').forEach(function(panel) {
                    panel.classList.toggle('is-active', panel.dataset.panel === name);
                });
            });
        });
    });
}

/**
 * リーダーボード表の列ソートを初期化する。
 * 見出しをクリックするとその列の data-sort（desc / asc / text）に従って並べ替え，
 * グループ見出し行（Closed / Open）を隠す。「Reset」ボタンで論文と同じグループ順に戻す。
 */
function setupLeaderboardSort() {
    const table = document.getElementById('leaderboard-table');
    if (!table) return;

    const tbody = table.tBodies[0];
    const originalRows = Array.from(tbody.rows);
    const headers = table.querySelectorAll('thead tr:last-child th[data-sort]');

    headers.forEach(function(th, col) {
        th.addEventListener('click', function() {
            const mode = th.dataset.sort;
            const rows = originalRows.filter(function(r) { return !r.classList.contains('group-row'); });

            rows.sort(function(a, b) {
                const x = a.cells[col].textContent.trim();
                const y = b.cells[col].textContent.trim();
                if (mode === 'text') return x.localeCompare(y);
                const diff = parseFloat(x) - parseFloat(y);
                return mode === 'asc' ? diff : -diff;
            });

            rows.forEach(function(r) { tbody.appendChild(r); });
            table.classList.add('is-sorted-view');
            headers.forEach(function(h) { h.classList.toggle('is-sorted', h === th); });
        });
    });

    const reset = document.querySelector('.vb-reset-sort');
    if (reset) {
        reset.addEventListener('click', function() {
            originalRows.forEach(function(r) { tbody.appendChild(r); });
            table.classList.remove('is-sorted-view');
            headers.forEach(function(h) { h.classList.remove('is-sorted'); });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupTabs();
    setupLeaderboardSort();
});
