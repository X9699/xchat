const API_BASE = "https://YOUR_WORKER.workers.dev";

async function loadMessages() {
    const messages = document.getElementById("messages");
    messages.innerHTML = '<p style="color:#666">鍔犺浇涓?..</p>';

    try {
        const res = await fetch(`${API_BASE}/api/messages`);
        const data = await res.json();
        messages.innerHTML = "";

        if (data.length === 0) {
            messages.innerHTML = '<p style="color:#666">杩樻病鏈夌暀瑷€锛屾潵鍋氱涓€涓惂銆?/p>';
            return;
        }

        data.forEach(msg => renderMessage(msg, false));
    } catch (e) {
        messages.innerHTML = '<p style="color:#666">杩樻病鏈夌暀瑷€锛屾潵鍋氱涓€涓惂銆?/p>';
    }
}

function renderMessage(msg, prepend = true) {
    const messages = document.getElementById("messages");

    const div = document.createElement("div");
    div.className = "message";
    div.dataset.id = msg.id;

    const time = document.createElement("span");
    time.className = "time";
    time.textContent = formatTime(msg.created_at);

    const content = document.createElement("div");
    content.className = "msg-content";
    content.textContent = msg.content;

    div.appendChild(time);
    div.appendChild(content);

    if (prepend) {
        messages.prepend(div);
    } else {
        messages.appendChild(div);
    }
}

function formatTime(dateStr) {
    const d = new Date(new Date(dateStr + "Z").getTime() + 288e5);
    const pad = n => String(n).padStart(2, "0");
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

async function postMessage() {
    const input = document.getElementById("messageInput");
    const btn = document.querySelector("button");
    const content = input.value.trim();

    if (!content) return;

    btn.disabled = true;
    btn.textContent = "鍙戝竷涓?..";

    try {
        const res = await fetch(`${API_BASE}/api/messages`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content })
        });

        if (!res.ok) throw new Error(await res.text());

        const msg = await res.json();
        renderMessage(msg, true);
        input.value = "";
    } catch (e) {
        btn.style.background = "#999";
        setTimeout(() => { btn.style.background = ""; }, 1500);
    } finally {
        btn.disabled = false;
        btn.textContent = "鍖垮悕鍙戝竷";
    }
}

loadMessages();
