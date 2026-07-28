// --- ESTADO Y COLECCIÓN DE SCRIPTS ---
const state = {
  currentView: 'chat',
  activeCategory: 'all',
  
  // Scripts esenciales para la Librería
  essentialLibrary: [
    {
      id: 'lib-1',
      title: 'Shift to Sprint (Correr)',
      category: 'Movimiento',
      description: 'Aumenta la velocidad del jugador al mantener presionada la tecla Shift.',
      code: `-- LocalScript: Shift to Sprint
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local NORMAL_SPEED = 16
local SPRINT_SPEED = 28

UserInputService.InputBegan:Connect(function(input, gameProcessed)
    if gameProcessed then return end
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = SPRINT_SPEED
    end
end)

UserInputService.InputEnded:Connect(function(input)
    if input.KeyCode == Enum.KeyCode.LeftShift then
        humanoid.WalkSpeed = NORMAL_SPEED
    end
end)`
    },
    {
      id: 'lib-2',
      title: 'Doble Salto (Double Jump)',
      category: 'Movimiento',
      description: 'Permite al personaje realizar un segundo salto en el aire.',
      code: `-- LocalScript: Double Jump
local UserInputService = game:GetService("UserInputService")
local Players = game:GetService("Players")

local player = Players.LocalPlayer
local character = player.Character or player.CharacterAdded:Wait()
local humanoid = character:WaitForChild("Humanoid")

local canDoubleJump = false
local hasDoubleJumped = false

humanoid.StateChanged:Connect(function(_, newState)
    if newState == Enum.HumanoidStateType.Landed then
        canDoubleJump = false
        hasDoubleJumped = false
    elseif newState == Enum.HumanoidStateType.Freefall then
        task.wait(0.1)
        canDoubleJump = true
    end
end)

UserInputService.JumpRequest:Connect(function()
    if canDoubleJump and not hasDoubleJumped then
        hasDoubleJumped = true
        humanoid:ChangeState(Enum.HumanoidStateType.Jumping)
    end
end)`
    },
    {
      id: 'lib-3',
      title: 'Leaderstats & Coins Setup',
      category: 'Databases',
      description: 'Crea el marcador de monedas y nivel en el leaderboard global.',
      code: `-- ServerScript: Leaderstats Base
local Players = game:GetService("Players")

local function onPlayerAdded(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 100
    coins.Parent = leaderstats

    local level = Instance.new("IntValue")
    level.Name = "Level"
    level.Value = 1
    level.Parent = leaderstats
end

Players.PlayerAdded:Connect(onPlayerAdded)`
    },
    {
      id: 'lib-4',
      title: 'DataStore Seguro con Pcall',
      category: 'Databases',
      description: 'Carga y guardado de datos en servidores de Roblox previniendo Data Loss.',
      code: `-- ServerScript: Basic DataStore System
local DataStoreService = game:GetService("DataStoreService")
local PlayerDataStore = DataStoreService:GetDataStore("SaveSystem_v1")
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local coins = Instance.new("IntValue")
    coins.Name = "Coins"
    coins.Value = 0
    coins.Parent = leaderstats

    local success, result = pcall(function()
        return PlayerDataStore:GetAsync(tostring(player.UserId))
    end)

    if success and result then
        coins.Value = result
    end
end)

Players.PlayerRemoving:Connect(function(player)
    if player:FindFirstChild("leaderstats") then
        local coins = player.leaderstats.Coins.Value
        pcall(function()
            PlayerDataStore:SetAsync(tostring(player.UserId), coins)
        end)
    end
end)`
    },
    {
      id: 'lib-5',
      title: 'ProximityPrompt Handler',
      category: 'UI',
      description: 'Interactúa con objetos (mantener tecla E) para otorgar recompensas o activar acciones.',
      code: `-- ServerScript: ProximityPrompt
local prompt = script.Parent -- Colocar dentro del ProximityPrompt

prompt.Triggered:Connect(function(player)
    print(player.Name .. " interactuó con el objeto.")
    
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats and leaderstats:FindFirstChild("Coins") then
        leaderstats.Coins.Value += 10
    end
end)`
    },
    {
      id: 'lib-6',
      title: 'Kill Brick (Lava Hazard)',
      category: 'Gameplay',
      description: 'Bloque dañino que elimina al jugador al tocarlo.',
      code: `-- ServerScript: Kill Brick
local part = script.Parent

part.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChildWhichIsA("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end)`
    }
  ],

  // Scripts guardados en el Gestor de Scripts
  savedScripts: [
    {
      id: 'script-1',
      title: 'UI_OnPlayerJoin.client.luau',
      description: 'Maneja la transición de la pantalla de carga al unirse un jugador.',
      code: `-- LocalScript: Interfaz al unirse
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

local localPlayer = Players.LocalPlayer
local playerGui = localPlayer:WaitForChild("PlayerGui")

print("Pantalla de inicio cargada correctamente para: " .. localPlayer.Name)`
    },
    {
      id: 'script-2',
      title: 'LeaderstatsManager.server.luau',
      description: 'Creación automática de Monedas y Nivel en el leaderboard.',
      code: `-- ServerScript: Leaderstats
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player
end)`
    }
  ]
};

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initErrorFixer();
  initLibrary();
  initScriptManager();
  initChat();
});

// --- NAVEGACIÓN ---
function initNavigation() {
  const toolItems = document.querySelectorAll('.tool-item');
  const viewPanels = document.querySelectorAll('.view-panel');
  const viewTitle = document.getElementById('current-view-title');

  toolItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetView = item.getAttribute('data-view');
      
      toolItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      viewPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === `view-${targetView}`) {
          panel.classList.add('active');
        }
      });

      state.currentView = targetView;
      const titleText = item.querySelector('span').innerText;
      if (viewTitle) viewTitle.innerText = `${titleText} (ForgerNova Engine)`;
    });
  });
}

// --- NOTIFICACIONES TOAST ---
function showToast(message) {
  let toast = document.getElementById('fn-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'fn-toast';
    toast.style.cssText = `
      position: fixed; bottom: 20px; right: 20px;
      background: linear-gradient(135deg, #7b3cff, #c43cff); color: #fff;
      padding: 12px 20px; border-radius: 8px; font-size: 0.9rem;
      font-weight: 600; box-shadow: 0 4px 15px rgba(123,60,255,0.4);
      z-index: 9999; transition: opacity 0.3s ease;
    `;
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 2500);
}

// --- LIBRERÍA DE COMPONENTES ---
function initLibrary() {
  renderLibraryGrid();
  createScriptModal();

  const categoryBtns = document.querySelectorAll('.category-btn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-category');
      renderLibraryGrid();
    });
  });
}

function renderLibraryGrid() {
  const grid = document.getElementById('library-grid');
  if (!grid) return;

  grid.innerHTML = '';

  const filteredScripts = state.activeCategory === 'all' 
    ? state.essentialLibrary 
    : state.essentialLibrary.filter(s => s.category === state.activeCategory);

  filteredScripts.forEach(script => {
    const card = document.createElement('div');
    card.className = 'glass-card';
    card.style.cssText = 'display: flex; flex-direction: column; justify-space-between; gap: 10px;';
    
    card.innerHTML = `
      <div>
        <span style="font-size: 0.7rem; background: rgba(123,60,255,0.2); border: 1px solid var(--glass-border); padding: 2px 8px; border-radius: 4px; color: #c43cff;">${script.category}</span>
        <h3 style="margin-top: 8px; font-size: 1.1rem; color: #fff;">${script.title}</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 6px;">${script.description}</p>
      </div>
      <div style="display: flex; gap: 8px; margin-top: 10px;">
        <button class="btn-primary btn-sm" style="flex: 1;" onclick="openScriptModal('${script.id}', 'library')">Ver Script</button>
        <button class="btn-secondary btn-sm" onclick="copyScriptCode('${script.id}', 'library')" title="Copiar Rápido">📋 Copiar</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

// --- GESTOR DE SCRIPTS (VER / COPIAR / DESCARGAR) ---
function initScriptManager() {
  renderScriptsList();
}

function renderScriptsList() {
  const container = document.querySelector('.scripts-list');
  if (!container) return;

  container.innerHTML = '';
  state.savedScripts.forEach(script => {
    const card = document.createElement('div');
    card.className = 'glass-card script-item';
    card.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border: 1px solid var(--glass-border); padding: 15px; border-radius: 8px;';
    card.innerHTML = `
      <div>
        <strong style="color: #fff; font-size: 1rem;">${script.title}</strong>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-top: 4px;">${script.description}</p>
      </div>
      <button class="btn-primary btn-sm" onclick="openScriptModal('${script.id}', 'saved')">Ver Script</button>
    `;
    container.appendChild(card);
  });
}

// --- MODAL PARA VISUALIZAR SCRIPTS ---
function createScriptModal() {
  if (document.getElementById('script-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'script-modal';
  modal.style.cssText = `
    display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); z-index: 2000;
    align-items: center; justify-content: center;
  `;

  modal.innerHTML = `
    <div class="glass-card" style="width: 90%; max-width: 700px; max-height: 85vh; display: flex; flex-direction: column; background: #0f0a1c; border: 1px solid var(--glass-border); padding: 20px; border-radius: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--glass-border); padding-bottom: 12px; margin-bottom: 12px;">
        <h3 id="modal-title" style="color: #fff;"></h3>
        <button class="btn-icon" onclick="closeScriptModal()" style="background:none; border:none; color:#fff; cursor:pointer; font-size:1.2rem;">✕</button>
      </div>
      <pre style="flex: 1; overflow-y: auto; background: #06040a; padding: 15px; border-radius: 8px; font-family: var(--font-mono); color: #00e676; font-size: 0.85rem; margin-bottom: 15px;"><code id="modal-code"></code></pre>
      <div style="display: flex; gap: 10px; justify-content: flex-end;">
        <button class="btn-secondary" id="btn-copy-modal">📋 Copiar Código</button>
        <button class="btn-primary" id="btn-download-modal">📥 Descargar .luau</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
}

window.openScriptModal = function(scriptId, source) {
  const collection = source === 'library' ? state.essentialLibrary : state.savedScripts;
  const script = collection.find(s => s.id === scriptId);
  if (!script) return;

  document.getElementById('modal-title').innerText = script.title;
  document.getElementById('modal-code').innerText = script.code;
  
  document.getElementById('script-modal').style.display = 'flex';

  document.getElementById('btn-copy-modal').onclick = () => {
    navigator.clipboard.writeText(script.code);
    showToast('📋 ¡Script copiado al portapapeles!');
  };

  document.getElementById('btn-download-modal').onclick = () => {
    const blob = new Blob([script.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.title.includes('.luau') ? script.title : `${script.title.replace(/\s+/g, '_')}.luau`;
    a.click();
    URL.revokeObjectURL(url);
  };
};

window.copyScriptCode = function(scriptId, source) {
  const collection = source === 'library' ? state.essentialLibrary : state.savedScripts;
  const script = collection.find(s => s.id === scriptId);
  if (script) {
    navigator.clipboard.writeText(script.code);
    showToast('📋 ¡Código copiado!');
  }
};

window.closeScriptModal = function() {
  document.getElementById('script-modal').style.display = 'none';
};

// --- CHAT INTERACTIVO ---
function initChat() {
  const btnSend = document.getElementById('btn-send-message');
  const input = document.getElementById('chat-input');
  const messagesScroll = document.getElementById('chat-messages');

  if (btnSend && input && messagesScroll) {
    const sendMessage = () => {
      const text = input.value.trim();
      if (!text) return;

      // Mensaje Usuario
      const userMsg = document.createElement('div');
      userMsg.className = 'message-card user-message';
      userMsg.style.cssText = 'background: rgba(123,60,255,0.15); margin-bottom: 15px; padding: 12px; border-radius: 8px; align-self: flex-end;';
      userMsg.innerHTML = `<strong>Tú</strong><p style="margin-top: 4px; color: #fff;">${text}</p>`;
      messagesScroll.appendChild(userMsg);

      input.value = '';
      messagesScroll.scrollTop = messagesScroll.scrollHeight;

      // Respuesta simulada
      setTimeout(() => {
        const aiMsg = document.createElement('div');
        aiMsg.className = 'message-card ai-message';
        aiMsg.style.cssText = 'background: rgba(255,255,255,0.05); margin-bottom: 15px; padding: 12px; border-radius: 8px;';
        aiMsg.innerHTML = `
          <strong>ForgerNova AI</strong>
          <p style="margin-top: 4px; color: #fff;">Entendido. Procesando tu consulta sobre Luau para Roblox Studio...</p>
        `;
        messagesScroll.appendChild(aiMsg);
        messagesScroll.scrollTop = messagesScroll.scrollHeight;
      }, 800);
    };

    btnSend.addEventListener('click', sendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }
}

// --- ERROR FIXER LOGIC ---
function initErrorFixer() {
  const btnFix = document.getElementById('btn-fix-error');
  const input = document.getElementById('error-input');
  const solutionArea = document.getElementById('error-solution');

  if (btnFix && input && solutionArea) {
    btnFix.addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        showToast('⚠️ Por favor pega un mensaje de error primero.');
        return;
      }

      solutionArea.innerHTML = `
        <div class="glass-card" style="margin-top: 15px; border-color: #00e676; padding: 15px; border-radius: 8px; background: rgba(0,230,118,0.05);">
          <h4 style="color: #00e676; margin-bottom: 8px;">✔ Análisis Finalizado</h4>
          <p style="color: var(--text-primary); font-size: 0.9rem;">Se analizó el error en tu script Luau. La causa probable es una llamada/indexación inválida o la falta de espera por un objeto no replicado.</p>
          <pre style="background: #06040a; padding: 10px; border-radius: 6px; margin-top: 10px; font-family: var(--font-mono); color: #00e676; font-size: 0.85rem;"><code>-- Solución Sugerida
local element = parent:WaitForChild("TargetName", 5)
if element then
    -- Operación segura
end</code></pre>
        </div>
      `;
    });
  }
}
