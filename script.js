document.addEventListener("DOMContentLoaded", () => {
    
    // NAVEGACIÓN PORTADA -> APP
    const landingScreen = document.getElementById("landing-screen");
    const appScreen = document.getElementById("app-screen");
    const btnEnterTop = document.getElementById("btn-enter-app-top");
    const btnEnterHero = document.getElementById("btn-enter-app-hero");
    const btnBackHome = document.getElementById("btn-back-home");

    function goToApp() {
        landingScreen.classList.add("hidden");
        landingScreen.classList.remove("active");
        appScreen.classList.remove("hidden");
        appScreen.classList.add("active");
    }

    function goToLanding() {
        appScreen.classList.add("hidden");
        appScreen.classList.remove("active");
        landingScreen.classList.remove("hidden");
        landingScreen.classList.add("active");
    }

    if (btnEnterTop) btnEnterTop.addEventListener("click", goToApp);
    if (btnEnterHero) btnEnterHero.addEventListener("click", goToApp);
    if (btnBackHome) btnBackHome.addEventListener("click", goToLanding);

    // NAVEGACIÓN SIDEBAR
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    const viewSections = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetView = item.getAttribute("data-view");
            navItems.forEach(nav => nav.classList.remove("active"));
            viewSections.forEach(sec => sec.classList.remove("active"));

            item.classList.add("active");
            const activeSection = document.getElementById(`view-${targetView}`);
            if (activeSection) activeSection.classList.add("active");
        });
    });

    // CHAT IA - CÓDIGO REAL LUAU
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const query = chatInput.value.trim();
            if (!query) return;

            appendMessage("user", query);
            chatInput.value = "";

            setTimeout(() => {
                const response = processAIQuery(query);
                appendMessage("ai", response);
            }, 500);
        });
    }

    function processAIQuery(query) {
        const lower = query.toLowerCase();
        let code = "";
        let text = "";

        if (lower.includes("baje vida") || lower.includes("daño") || lower.includes("quitar vida")) {
            text = "Aquí tienes el script para reducir la vida del jugador al tocar el bloque:";
            code = `local part = script.Parent
local damage = 20

part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.Health = humanoid.Health - damage
    end
end)`;
        } else {
            text = `Aquí tienes el script generado para: "${query}"`;
            code = `-- Script generado para Roblox Studio
local part = script.Parent

part.Touched:Connect(function(hit)
    print("Objeto tocado por: " .. hit.Name)
end)`;
        }

        return `${text}<br><br><pre><code>${code}</code></pre><button class="btn-outline copy-btn"><i class="fas fa-copy"></i> Copiar Código</button>`;
    }

    function appendMessage(sender, content) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

        if (sender === "user") {
            msgDiv.innerHTML = `<div class="message-content">${content}</div><i class="fas fa-user avatar"></i>`;
        } else {
            msgDiv.innerHTML = `<i class="fas fa-robot avatar"></i><div class="message-content">${content}</div>`;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        bindCopyButtons();
    }

    // ERROR FIXER
    const fixerSubmit = document.getElementById("fixer-submit");
    const fixerInput = document.getElementById("fixer-input");
    const fixerResult = document.getElementById("fixer-result");
    const fixerContent = document.getElementById("fixer-content");

    if (fixerSubmit) {
        fixerSubmit.addEventListener("click", () => {
            const err = fixerInput.value.trim();
            if (!err) return;

            fixerResult.classList.remove("hidden");
            if (err.includes("attempt to index nil with 'Humanoid'")) {
                fixerContent.innerHTML = `
                    <p><strong>Problema:</strong> Se intentó acceder a <code>Humanoid</code> cuando la parte tocada no pertenecía a un personaje.</p>
                    <p style="margin-top:8px;"><strong>Solución:</strong> Comprueba la existencia antes de restar vida:</p>
                    <pre><code>local hum = hit.Parent:FindFirstChildOfClass("Humanoid")
if hum then
    hum.Health = hum.Health - 10
end</code></pre>`;
            } else {
                fixerContent.innerHTML = `
                    <p><strong>Sugerencia de depuración:</strong> Revisa que no tengas variables declaradas sin asignar (<code>nil</code>) o que las funciones contengan su respectivo <code>end</code>.</p>`;
            }
        });
    }

    // BOTONES DE COPIAR
    function bindCopyButtons() {
        document.querySelectorAll(".copy-btn").forEach(btn => {
            btn.onclick = () => {
                const parent = btn.closest(".glass-card") || btn.closest(".message-content");
                const code = parent ? parent.querySelector("pre code") : null;
                if (code) {
                    navigator.clipboard.writeText(code.innerText);
                    btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado!`;
                    setTimeout(() => { btn.innerHTML = `<i class="fas fa-copy"></i> Copiar Código`; }, 2000);
                }
            };
        });
    }
    bindCopyButtons();

    // MODO CLARO / OSCURO
    const themeBtn = document.getElementById("theme-toggle-btn");
    const themeBtnText = document.getElementById("theme-btn-text");

    if (themeBtn) {
        themeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            const isLight = document.body.classList.contains("light-mode");
            themeBtnText.textContent = isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
            themeBtn.querySelector("i").className = isLight ? "fas fa-moon" : "fas fa-sun";
        });
    }

    // BOTONES DE COLOR
    const colorBtns = document.querySelectorAll(".color-btn");
    colorBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            colorBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const color = btn.getAttribute("data-color");
            document.body.classList.remove("theme-purple", "theme-blue", "theme-green", "theme-orange");
            document.body.classList.add(`theme-${color}`);
        });
    });
});
