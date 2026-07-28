// DATOS DE EJEMPLO PARA LA LIBRERÍA
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
  }
];

const savedScripts = [
  {
    title: 'UI_OnPlayerJoin.client.luau',
    desc: 'Gestor de interfaz de bienvenida al jugador.',
    code: `-- LocalScript: Inicio\nprint("Jugador conectado con éxito")`
  }
];

document.addEventListener('DOMContentLoaded', () => {

  // NAVEGACIÓN EN LA SIDEBAR (DASHBOARD)
  const tools = document.querySelectorAll('.tool-item');
  const panels = document.querySelectorAll('.view-panel');
  const titleHeader = document.getElementById('current-view-title');

  if (tools.length > 0) {
    tools.forEach(btn => {
      btn.addEventListener('click', () => {
        tools.forEach(t => t.classList.remove('active'));
        btn.classList.add('active');
        
        const target = btn.getAttribute('data-view');
        panels.forEach(p => {
          p.classList.remove('active');
          if (p.id === `view-${target}`) p.classList.add('active');
        });
        
        if (titleHeader) {
          titleHeader.textContent = `${btn.textContent.trim()} (ForgerNova Engine)`;
        }
      });
    });
  }

  // ENVÍO DE MENSAJES EN EL CHAT (PROTEGIDO)
  const btnSend = document.getElementById('btn-send-message');
  const inputChat = document.getElementById('chat-input');
  const messagesBox = document.getElementById('chat-messages');

  function handleSend() {
    if (!inputChat) return;
    const text = inputChat.value.trim();
    if (!text) return;

    // Crear mensaje del usuario
    const uCard = document.createElement('div');
    uCard.className = 'message-card';
    uCard.style.background = 'rgba(123, 60, 255, 0.2)';
    uCard.style.alignSelf = 'flex-end';
    
    const uTitle = document.createElement('strong');
    uTitle.textContent = 'Tú';
    const uText = document.createElement('p');
    uText.style.marginTop = '4px';
    uText.textContent = text; // Previene XSS
    
    uCard.appendChild(uTitle);
    uCard.appendChild(uText);
    messagesBox.appendChild(uCard);

    inputChat.value = '';
    messagesBox.scrollTop = messagesBox.scrollHeight;

    // Respuesta IA
    setTimeout(() => {
      const aiCard = document.createElement('div');
      aiCard.className = 'message-card';
      
      const aiTitle = document.createElement('strong');
      aiTitle.textContent = 'ForgerNova AI';
      const aiText = document.createElement('p');
      aiText.style.marginTop = '4px';
      aiText.textContent = 'Procesando tu solicitud en Luau... ¿Necesitas este código en un ServerScript o LocalScript?';

      aiCard.appendChild(aiTitle);
      aiCard.appendChild(aiText);
      messagesBox.appendChild(aiCard);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 700);
  }

  if (btnSend) btnSend.addEventListener('click', handleSend);

  // RENDER LIBRERÍA
  const libGrid = document.getElementById('library-grid');
  if (libGrid) {
    libraryData.forEach(item => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.innerHTML = `
        <span style="font-size:0.75rem; color:var(--accent-pink);">${item.category}</span>
        <h3 style="margin:5px 0;">${item.title}</h3>
        <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">${item.desc}</p>
        <button class="btn-primary" style="width:100%;" onclick="copySnippet(\`${item.code.replace(/`/g, '\\`')}\`)">📋 Copiar Script</button>
      `;
      libGrid.appendChild(card);
    });
  }

  // RENDER SCRIPTS GUARDADOS
  const savedContainer = document.getElementById('saved-scripts-list');
  if (savedContainer) {
    savedScripts.forEach(s => {
      const card = document.createElement('div');
      card.className = 'glass-card';
      card.style.display = 'flex';
      card.style.justifyContent = 'space-between';
      card.style.alignItems = 'center';
      card.innerHTML = `
        <div>
          <strong>${s.title}</strong>
          <p style="font-size:0.85rem; color:var(--text-secondary);">${s.desc}</p>
        </div>
        <button class="btn-secondary" onclick="copySnippet(\`${s.code}\`)">📋 Copiar</button>
      `;
      savedContainer.appendChild(card);
    });
  }

  // ERROR FIXER
  const btnFix = document.getElementById('btn-fix-error');
  if (btnFix) {
    btnFix.addEventListener('click', () => {
      const txt = document.getElementById('error-input').value.trim();
      if(!txt) return;
      document.getElementById('error-solution').innerHTML = `
        <div class="glass-card" style="border-color:#00e676; margin-top:10px;">
          <h4 style="color:#00e676;">✔ Solución Sugerida</h4>
          <p style="font-size:0.85rem; margin-top:5px;">Asegúrate de utilizar <code>WaitForChild</code> para objetos que cargan de forma asíncrona en el cliente.</p>
        </div>
      `;
    });
  }
});

function copySnippet(code) {
  navigator.clipboard.writeText(code);
  alert('📋 ¡Script copiado al portapapeles!');
}
