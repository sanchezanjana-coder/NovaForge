document.addEventListener("DOMContentLoaded", () => {
    
    // NAVEGACIÓN ENTRE LANDING Y APP
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

    // IA CHAT - GENERADOR REAL DE CÓDIGO LUAU
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
                const generatedCode = processAIQuery(query);
                appendMessage("ai", generatedCode);
            }, 600);
        });
    }

    function processAIQuery(query) {
        const lower = query.toLowerCase();
        let code = "";
        let explanation = "";

        if (lower.includes("baje vida") || lower.includes("daño") || lower.includes("dañar") || lower.includes("quitar vida")) {
            explanation = "Aquí tienes el script para un bloque de lava/daño en Roblox Studio:";
            code = `local part = script.Parent
local damageAmount = 20

part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
    if humanoid then
        humanoid.Health = humanoid.Health - damageAmount
    end
end)`;
        } else if (lower.includes("monedas") || lower.includes("leaderstats") || lower.includes("puntos")) {
            explanation = "Este es el script de Leaderstats para guardar puntos o monedas:";
            code = `local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Monedas"
    coins.Value = 0
    coins.Parent = leaderstats
end)`;
        } else {
            explanation = `Script generado para: "${query}"`;
            code = `-- Script Luau Generado para Roblox Studio
local Part = script.Parent

local function onAction(otherPart)
    local character = otherPart.Parent
    local humanoid = character:FindFirstChildOfClass("Humanoid")
    if humanoid then
        print("Acción ejecutada correctamente en " .. character.Name)
    end
end

Part.Touched:Connect(onAction)`;
        }

        return `${explanation}<br><br><pre><code>${code}</code></pre><button class="btn-outline copy-btn"><i class="fas fa-copy"></i> Copiar Código</button>`;
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

    // ERROR FIXER - ANÁLISIS REAL DE ERRORES
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
                    <p><strong>Causa del error:</strong> Intentaste acceder a la propiedad <code>Humanoid</code> en un objeto que era <code>nil</code> (no existe).</p>
                    <p><strong>Solución:</strong> Asegúrate de comprobar con <code>FindFirstChildOfClass</code> antes de intentar modificarlo:</p>
                    <pre><code>local humanoid = hit.Parent:FindFirstChildOfClass("Humanoid")
if humanoid then
    humanoid.Health = humanoid.Health - 10
end</code></pre>`;
            } else if (err.includes("Infinite yield possible")) {
                fixerContent.innerHTML = `
                    <p><strong>Causa del error:</strong> <code>WaitForChild()</code> está esperando un objeto que nunca aparece o el nombre está mal escrito.</p>
                    <p><strong>Solución:</strong> Revisa las mayúsculas/minúsculas exactas del objeto en la ventana Explorer de Roblox Studio.</p>`;
            } else {
                fixerContent.innerHTML = `
                    <p><strong>Análisis General:</strong> Se ha detectado un problema sintáctico o de referencia nula.</p>
                    <p><strong>Recomendación:</strong> Usa <code>print()</code> antes de la línea señalada para verificar que las variables no sean <code>nil</code> y asegúrate de cerrar todas tus funciones con <code>end</code>.</p>`;
            }
        });
    }

    // COPIAR CÓDIGO
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
            document.body.classList.toggle("dark-theme");
            const isLight = document.body.classList.contains("light-mode");

            themeBtnText.textContent = isLight ? "Cambiar a Modo Oscuro" : "Cambiar a Modo Claro";
            themeBtn.querySelector("i").className = isLight ? "fas fa-moon" : "fas fa-sun";
        });
    }

    // CAMBIO DE COLORES DE ACENTO
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

    // CAMBIO DE FUENTE DE CÓDIGO
    const fontSelect = document.getElementById("font-select");
    if (fontSelect) {
        fontSelect.addEventListener("change", (e) => {
            document.documentElement.style.setProperty('--code-font', e.target.value);
        });
    }
});
