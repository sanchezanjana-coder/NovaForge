// BANCO DE DATOS PARA LA LIBRERÍA DE COMPONENTES
const libraryData = [
  {
    id: 'lib-1',
    title: 'Shift to Sprint (Correr)',
    category: 'Movimiento',
    desc: 'Aumenta la velocidad del jugador al mantener pulsado LeftShift.',
    code: `-- LocalScript: Shift to Sprint
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

UserInputService.InputBegan:Connect(function(input, gpe)
    if gpe then return end
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = 28
    end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = 16
    end
end)`
  },
  {
    id: 'lib-2',
    title: 'Leaderstats & Coins Base',
    category: 'Databases',
    desc: 'Crea el marcador global de monedas al unirse un jugador.',
    code: `-- ServerScript: Leaderstats
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats
end)`
  },
  {
    id: 'lib-3',
    title: 'Abrir/Cerrar Interfaz (UI)',
    category: 'UI / Gui',
    desc: 'Muestra u oculta una pantalla GUI al pulsar un botón.',
    code: `-- LocalScript (Dentro del TextButton)
local button = script.Parent
local frame = button.Parent:WaitForChild("Frame")

button.MouseButton1Click:Connect(function()
    frame.Visible = not frame.Visible
end)`
  }
];

const savedScripts = [
  {
    title: 'UI_OnPlayerJoin.client.luau',
    desc: 'Gestor de interfaz de bienvenida al jugador.',
    code: `-- LocalScript: Inicio\nprint("Jugador conectado con éxito")`
  }
];

// FUNCIÓN AUXILIAR PARA COPIAR CÓDIGO
window.copySnippet = function(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(() => {
    alert("📋 ¡Código Luau copiado al portapapeles!");
  });
};

// GENERADOR DINO-LÓGICO DE RESPUESTAS LUAU (Sustituye la IA rígida)
function generateLuauResponse(userText) {
  const query = userText.toLowerCase();

  if (query.includes("interfaz") || query.includes("gui") || query.includes("ui") || query.includes("pantalla")) {
    return `¡Claro! Aquí tienes un script en Luau para manejar y cambiar una interfaz de usuario (**ScreenGui**).

**Tipo:** LocalScript (Ponlo dentro de tu StarterGui / Frame)

\`\`\`lua
-- LocalScript: Cambiar estado de Interfaz
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- Crear una pantalla simple por código
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "CustomUI"
screenGui.Parent = playerGui

local frame = Instance.new("Frame")
frame.Size = UDim2.new(0, 300, 0, 200)
frame.Position = UDim2.new(0.5, -150, 0.5, -100)
frame.BackgroundColor3 = Color3.fromRGB(35, 30, 50)
frame.BorderSizePixel = 0
frame.Parent = screenGui

local textLabel = Instance.new("TextLabel")
textLabel.Size = UDim2.new(1, 0, 1, 0)
textLabel.Text = "¡Interfaz Cambiada con Éxito!"
textLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
textLabel.BackgroundTransparency = 1
textLabel.TextSize = 18
textLabel.Parent = frame
\`\`\`
¿Te gustaría añadir alguna animación de transición o conectar este cambio a un evento del servidor?`;
  }

  if (query.includes("server") || query.includes("serverscript")) {
    return `Entendido. Para manejar eventos desde el servidor en Roblox Studio:

**Tipo:** ServerScript (Ubicación: \`ServerScriptService\`)

\`\`\`lua
-- ServerScriptService: Manejador del Servidor
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    print("Servidor: Jugador registrado -> " .. player.Name)
end)
\`\`\`
¿Necesitas comunicar este script con la UI mediante un \`RemoteEvent\`?`;
  }

  // Respuesta por defecto con código base si no coincide con una palabra clave
  return `He procesado tu solicitud para Roblox Studio. Aquí tienes la estructura base requerida:

\`\`\`lua
-- Script Luau Optimizado
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local function initializeSystem()
    print("ForgerNova Engine: Sistema inicializado correctamente.")
end

initializeSystem()
\`\`\`
Dime más detalles sobre cómo quieres que interactúe esta función en tu mapa.`;
}

// INICIALIZADOR PRINCIPAL
document.addEventListener('DOMContentLoaded', () => {

  // 1. CAMBIO DE PESTAÑAS (SIDEBAR)
  const tools = document.querySelectorAll('.tool-item');
  const panels = document.querySelectorAll('.view-panel');
  const titleHeader = document.getElementById('current-view-title');

  tools.forEach(btn => {
    btn.addEventListener('click', () => {
      tools.forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      
      const target = btn.getAttribute('data-view');
      panels.forEach(p => {
        p.classList.remove('active');
        if (p.id === `view-${target}`) {
          p.classList.add('active');
        }
      });
      
      if (titleHeader) {
        const textBtn = btn.innerText.replace(/^[^\w\s]+/, '').trim();
        titleHeader.textContent = `${textBtn} (ForgerNova Engine)`;
      }
    });
  });

  // 2. SISTEMA DE CHAT
  const btnSend = document.getElementById('btn-send-message');
  const inputChat = document.getElementById('chat-input');
  const messagesBox = document.getElementById('chat-messages');

  function sendMessage() {
    if (!inputChat) return;
    const text = inputChat.value.trim();
    if (!text) return;

    // Mensaje del usuario
    const uCard = document.createElement('div');
    uCard.className = 'message-card';
    uCard.style.background = 'rgba(123, 60, 255, 0.18)';
    uCard.style.border = '1px solid rgba(196, 60, 255, 0.4)';
    uCard.style.alignSelf = 'flex-end';
    uCard.style.marginLeft = '40px';
    
    uCard.innerHTML = `<strong>Tú</strong><p style="margin-top:4px;">${escapeHtml(text)}</p>`;
    messagesBox.appendChild(uCard);

    inputChat.value = '';
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Respuesta inteligente de la IA
    setTimeout(() => {
      const aiCard = document.createElement('div');
      aiCard.className = 'message-card';
      aiCard.style.marginRight = '40px';
      
      const responseContent = generateLuauResponse(text);
      const formattedResponse = formatMarkdownCode(responseContent);

      aiCard.innerHTML = `<strong>ForgerNova AI</strong><div style="margin-top:6px; line-height:1.5;">${formattedResponse}</div>`;
      messagesBox.appendChild(aiCard);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 500);
  }

  if (btnSend) {
    btnSend.addEventListener('click', sendMessage);
  }

  if (inputChat) {
    inputChat.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // 3. RENDERIZAR LIBRERÍA
  const libGrid = document.getElementById('library-grid');
  if (libGrid) {
    libGrid.innerHTML = '';
    libraryData.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      const codeId = `lib-code-${idx}`;
      card.innerHTML = `
        <span style="font-size:0.75rem; color:var(--accent-pink); font-weight:bold;">${item.category}</span>
        <h3 style="margin:5px 0;">${item.title}</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">${item.desc}</p>
        <pre id="${codeId}" style="display:none;">${escapeHtml(item.code)}</pre>
        <button class="btn-primary" style="width:100%;" onclick="copySnippet('${codeId}')">📋 Copiar Script</button>
      `;
      libGrid.appendChild(card);
    });
  }

  // 4. RENDERIZAR SCRIPTS GUARDADOS
  const savedContainer = document.getElementById('saved-scripts-list');
  if (savedContainer) {
    savedContainer.innerHTML = '';
    savedScripts.forEach((s, idx) => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      const codeId = `saved-code-${idx}`;
      card.innerHTML = `
        <div>
          <strong>${s.title}</strong>
          <p style="font-size:0.85rem; color:var(--text-secondary);">${s.desc}</p>
          <pre id="${codeId}" style="display:none;">${escapeHtml(s.code)}</pre>
        </div>
        <button class="btn-secondary" onclick="copySnippet('${codeId}')">📋 Copiar</button>
      `;
      savedContainer.appendChild(card);
    });
  }

  // 5. ERROR FIXER
  const btnFix = document.getElementById('btn-fix-error');
  if (btnFix) {
    btnFix.addEventListener('click', () => {
      const inputEl = document.getElementById('error-input');
      const solutionEl = document.getElementById('error-solution');
      if (!inputEl || !solutionEl) return;
      
      const txt = inputEl.value.trim();
      if (!txt) return;

      solutionEl.innerHTML = `
        <div class="glass-card" style="border-color:#00e676; margin-top:15px;">
          <h4 style="color:#00e676;">✔ Análise y Solución Encontrada</h4>
          <p style="font-size:0.88rem; margin-top:8px;"><strong>Causa probable:</strong> Intentaste acceder a una instancia antes de que cargara en la jerarquía.</p>
          <p style="font-size:0.85rem; color:var(--text-secondary); margin-top:5px;">Sustituye los accesos directos tipo <code>game.Workspace.Parte</code> por <code>WaitForChild("Parte")</code>.</p>
        </div>
      `;
    });
  }
});

// FUNCIONES UTILITARIAS DE PARSEO Y ESCAPE
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatMarkdownCode(text) {
  // Convertir bloques de código ```lua ... ``` en formato escaneable con botón de copiar
  let counter = 0;
  let formatted = text.replace(/```(?:lua)?\n([\s\S]*?)```/g, (match, code) => {
    counter++;
    const id = `chat-code-${Date.now()}-${counter}`;
    return `
      <div style="background:var(--code-bg); border:1px solid var(--glass-border); border-radius:8px; margin:10px 0; overflow:hidden;">
        <div style="background:rgba(255,255,255,0.05); padding:6px 12px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:0.75rem; color:var(--text-secondary); font-family:var(--font-mono);">Luau Script</span>
          <button class="btn-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="copySnippet('${id}')">📋 Copiar</button>
        </div>
        <pre id="${id}" style="padding:12px; margin:0; font-family:var(--font-mono); font-size:0.85rem; color:#00e676; white-space:pre-wrap;">${escapeHtml(code.trim())}</pre>
      </div>
    `;
  });

  // Convertir negritas **texto**
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return formatted;
}
