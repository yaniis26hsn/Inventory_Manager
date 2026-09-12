const currentUser = getStoredUser();

if (!getAccessToken()) {
    window.location.replace('login.html');
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatCurrency(n) {
    return Number(n || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const isAdmin = !!currentUser && currentUser.role === 'admin';
document.querySelectorAll('[data-admin-only]').forEach((el) => {
    if (!isAdmin) el.remove();
});

const userNameEl = document.querySelector('#userName');
const userRoleEl = document.querySelector('#userRole');
if (currentUser) {
    userNameEl.textContent = currentUser.username;
    userRoleEl.textContent = currentUser.role;
}

document.querySelector('#logoutBtn').addEventListener('click', () => logoutAndRedirect());

let dashboardPeriod = 'today';
let salesPeriod = 'today';

function showView(name) {
    document.querySelectorAll('.view').forEach((view) => {
        view.hidden = view.dataset.view !== name;
    });
    document.querySelectorAll('.sidebar-link').forEach((link) => {
        link.classList.toggle('active', link.dataset.nav === name);
    });
    window.scrollTo(0, 0);
    if (name === 'dashboard') loadDashboard();
    if (name === 'products') loadProducts();
    if (name === 'sales') loadSales();
    if (name === 'reports') loadReports();
    if (name === 'team') loadTeam();
}

document.querySelectorAll('.sidebar-link').forEach((link) => {
    link.addEventListener('click', (event) => {
        event.preventDefault();
        showView(link.dataset.nav);
    });
});

document.querySelectorAll('#periodControl button').forEach((btn) => {
    btn.addEventListener('click', () => {
        dashboardPeriod = btn.dataset.period;
        document.querySelectorAll('#periodControl button').forEach((b) => b.classList.toggle('active', b === btn));
        loadDashboard();
    });
});

document.querySelectorAll('#salesPeriodControl button').forEach((btn) => {
    btn.addEventListener('click', () => {
        salesPeriod = btn.dataset.period;
        document.querySelectorAll('#salesPeriodControl button').forEach((b) => b.classList.toggle('active', b === btn));
        loadSales();
    });
});

async function loadDashboard() {
    const summaryEl = document.querySelector('#summaryCards');
    const lowEl = document.querySelector('#lowStockList');
    const outEl = document.querySelector('#outOfStockList');
    summaryEl.innerHTML = '<div class="loading">Loading…</div>';
    lowEl.innerHTML = '<li class="empty">Loading…</li>';
    outEl.innerHTML = '<li class="empty">Loading…</li>';

    try {
        const summary = await getJson(`/reports/summary?period=${dashboardPeriod}`);
        summaryEl.innerHTML = `
            <div class="card metric"><span>Revenue</span><strong>${formatCurrency(summary.totalRevenue)}</strong></div>
            <div class="card metric"><span>Transactions</span><strong>${summary.totalTransactions}</strong></div>
            <div class="card metric"><span>Average sale</span><strong>${formatCurrency(summary.averageSale)}</strong></div>`;

        const alerts = await getJson('/reports/alerts');
        renderStockList(lowEl, alerts.lowStock || [], 'No low stock');
        renderStockList(outEl, alerts.outOfStock || [], 'Nothing out of stock');
    } catch (err) {
        summaryEl.innerHTML = `<div class="empty">${escapeHtml(err.message)}</div>`;
    }
}

function renderStockList(el, items, emptyText) {
    if (!items.length) {
        el.innerHTML = `<li class="empty">${emptyText}</li>`;
        return;
    }
    el.innerHTML = items
        .map((p) => `<li><span>${escapeHtml(p.name)}</span><strong>${p.quantity}</strong></li>`)
        .join('');
}

async function loadProducts() {
    const tbody = document.querySelector('#productsTbody');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading…</td></tr>';
    try {
        const products = await getJson('/products');
        if (!products.length) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty">No products yet</td></tr>';
            return;
        }
        tbody.innerHTML = products
            .map((p) => {
                const badge = p.quantity === 0
                    ? '<span class="badge badge-danger">Out</span>'
                    : p.quantity <= p.minQuantity
                        ? '<span class="badge badge-warn">Low</span>'
                        : '<span class="badge badge-ok">In stock</span>';
                return `<tr><td>${escapeHtml(p.name)}</td><td>${escapeHtml(p.category)}</td><td>${formatCurrency(p.price)}</td><td>${formatCurrency(p.cost)}</td><td>${p.quantity}</td><td>${badge}</td></tr>`;
            })
            .join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="6" class="empty">${escapeHtml(err.message)}</td></tr>`;
    }
}

async function loadSales() {
    const tbody = document.querySelector('#salesTbody');
    tbody.innerHTML = '<tr><td colspan="4" class="loading">Loading…</td></tr>';
    try {
        const sales = await getJson(`/transactions?period=${salesPeriod}`);
        if (!sales.length) {
            tbody.innerHTML = '<tr><td colspan="4" class="empty">No sales yet</td></tr>';
            return;
        }
        tbody.innerHTML = sales
            .map((t) => `
                <tr>
                    <td>#${t.idTransaction}</td>
                    <td>${escapeHtml(t.user?.username || t.workerId)}</td>
                    <td>${formatCurrency(t.total)}</td>
                    <td>${new Date(t.created_at).toLocaleString()}</td>
                </tr>`)
            .join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty">${escapeHtml(err.message)}</td></tr>`;
    }
}

function renderProductList(el, items, emptyText) {
    if (!items.length) {
        el.innerHTML = `<li class="empty">${emptyText}</li>`;
        return;
    }
    el.innerHTML = items
        .map((entry) => `<li><span>${escapeHtml(entry.product.name)}</span><strong>${entry.quantitySold} sold</strong></li>`)
        .join('');
}

async function loadReports() {
    const topEl = document.querySelector('#topProductsList');
    const lowEl = document.querySelector('#lowestProductsList');
    topEl.innerHTML = '<li class="empty">Loading…</li>';
    lowEl.innerHTML = '<li class="empty">Loading…</li>';
    try {
        const [top, lowest] = await Promise.all([
            getJson('/reports/top-products?period=month&limit=5'),
            getJson('/reports/lowest-products?period=month&limit=5'),
        ]);
        renderProductList(topEl, top, 'No sales this month');
        renderProductList(lowEl, lowest, 'No sales this month');
    } catch (err) {
        topEl.innerHTML = `<li class="empty">${escapeHtml(err.message)}</li>`;
        lowEl.innerHTML = '<li class="empty"></li>';
    }
}

async function loadTeam() {
    const tbody = document.querySelector('#teamTbody');
    tbody.innerHTML = '<tr><td colspan="3" class="loading">Loading…</td></tr>';
    try {
        const users = await getJson('/users');
        if (!users.length) {
            tbody.innerHTML = '<tr><td colspan="3" class="empty">No team members yet</td></tr>';
            return;
        }
        tbody.innerHTML = users
            .map((u) => `<tr><td>${escapeHtml(u.username)}</td><td>${escapeHtml(`${u.fname} ${u.lname}`)}</td><td>${escapeHtml(u.role)}</td></tr>`)
            .join('');
    } catch (err) {
        tbody.innerHTML = `<tr><td colspan="3" class="empty">${escapeHtml(err.message)}</td></tr>`;
    }
}

showView('dashboard');