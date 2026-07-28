document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. NAVEGACIÓN Y CAMBIO DE VISTAS (PANELES)
    // ==========================================
    const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
    const viewSections = document.querySelectorAll(".view-section");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            const targetView = item.getAttribute("data-view");

            // Quitar clase activa de todos los botones y secciones
            navItems.forEach(nav => nav.classList.remove("active"));
            viewSections.forEach(sec => sec.classList.remove("active"));

            // Activar botón y vista seleccionados
            item.classList.add("active");
            const activeSection = document.getElementById(`view-${targetView}`);
            if (activeSection) {
                activeSection.classList.add("active");
            }
        });
    });

    // ==========================================
    // 2. CHAT IA (INTERACCIÓN)
    // ==========================================
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");

    if (chatForm) {
        chatForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            // Mostrar mensaje del usuario
            appendMessage("user", text);
            chatInput.value = "";

            // Respuesta simulada de la IA
            setTimeout(() => {
                const aiResponse = `He procesado tu solicitud sobre: "<strong>${text}</strong>".<br><br>Aquí tienes el código generado en Luau:<br><pre><code>-- Script Luau Generado para Roblox Studio
local Players = game:GetService("Players")

local function main()
    print("Ejecutando lógica para: ${text}")
end

main()</code></pre>
<button class="btn-secondary copy-btn" style="margin-top: 8px;"><i class="fas fa-copy"></i> Copiar Código</button>`;
                appendMessage("ai", aiResponse);
            }, 500);
        });
    }

    function appendMessage(sender, content) {
        const msgDiv = document.createElement("div");
        msgDiv.classList.add("message", sender === "user" ? "user-message" : "ai-message");

        if (sender === "user") {
            msgDiv.innerHTML = `
                <div class="message-content">${content}</div>
                <i class="fas fa-user avatar"></i>
            `;
        } else {
            msgDiv.innerHTML = `
                <i class="fas fa-robot avatar"></i>
                <div class="message-content">${content}</div>
            `;
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        bindCopyButtons();
    }

    // ==========================================
    // 3. ERROR FIXER LOGIC
    // ==========================================
    const fixerSubmit = document.getElementById("fixer-submit");
    const fixerInput = document.getElementById("fixer-input");
    const fixerResult = document.getElementById("fixer-result");
    const fixerContent = document.getElementById("fixer-content");

    if (fixerSubmit) {
        fixerSubmit.addEventListener("click", () => {
            const errText = fixerInput.value.trim();
            if (!errText) return;

            fixerResult.classList.remove("hidden");

            if (errText.includes("nil with") || errText.includes("WaitForChild")) {
                fixerContent.innerHTML = `
                    <p><strong>Causa probable:</strong> Intentaste acceder a un objeto antes de que cargara en el cliente.</p>
                    <p><strong>Solución:</strong> Reemplaza el acceso directo tipo <code>game.Workspace.Parte</code> por <code>WaitForChild("Parte")</code>.</p>
                `;
            } else if (errText.includes("arithmetic") || errText.includes("string")) {
                fixerContent.innerHTML = `
                    <p><strong>Causa probable:</strong> Intentaste concatenar un texto con un número usando el signo <code>+</code>.</p>
                    <p><strong>Solución:</strong> En Luau usa el operador <code>..</code> para unir variables de texto con números.</p>
                `;
            } else {
                fixerContent.innerHTML = `
                    <p><strong>Análisis General:</strong> Verifica que todas tus variables estén declaradas con <code>local</code> y que tus funciones cierren correctamente con <code>end</code>.</p>
                `;
            }
        });
    }

    // ==========================================
    // 4. FUNCIONALIDAD DE COPIAR CÓDIGO
    // ==========================================
    function bindCopyButtons() {
        const copyBtns = document.querySelectorAll(".copy-btn");
        copyBtns.forEach(btn => {
            btn.onclick = () => {
                const card = btn.closest(".card") || btn.closest(".message-content");
                const code = card ? card.querySelector("pre code") : null;
                
                if (code) {
                    navigator.clipboard.writeText(code.innerText);
                    const originalText = btn.innerHTML;
                    btn.innerHTML = `<i class="fas fa-check"></i> ¡Copiado!`;
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                    }, 2000);
                }
            };
        });
    }

    bindCopyButtons();
});
