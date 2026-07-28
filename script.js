// BANCO DE DATOS DE LA LIBRERÍA
var libraryData = [
  {
    id: 'lib-1',
    title: 'Shift to Sprint (Correr)',
    category: 'Movimiento',
    desc: 'Aumenta la velocidad del jugador al mantener pulsado LeftShift.',
    code: '-- LocalScript: Shift to Sprint\nlocal UserInputService = game:GetService("UserInputService")\nlocal Players = game:GetService("Players")\n\nlocal player = Players.LocalPlayer\nlocal character = player.Character or player.CharacterAdded:Wait()\nlocal humanoid = character:WaitForChild("Humanoid")\n\nUserInputService.InputBegan:Connect(function(input, gpe)\n    if gpe then return end\n    if input.KeyCode == Enum.KeyCode.LeftShift then\n        humanoid.WalkSpeed = 28\n    end\nend)\n\nUserInputService.InputEnded:Connect(function(input)\n    if input.KeyCode == Enum.KeyCode.LeftShift then\n        humanoid.WalkSpeed = 16\n    end\nend)'
  },
  {
    id: 'lib-2',
    title: 'Leaderstats & Coins Base',
    category: 'Databases',
    desc: 'Crea el marcador global de monedas al unirse un jugador.',
    code: '-- ServerScript: Leaderstats\nlocal Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(player)\n    local leaderstats = Instance.new("Folder")\n    leaderstats.Name = "leaderstats"\n    leaderstats.Parent = player\n\n    local coins = Instance.new("IntValue")\n    coins.Name = "Coins"\n    coins.Value = 100\n    coins.Parent = leaderstats\nend)'
  },
  {
    id: 'lib-3',
    title: 'Abrir/Cerrar Interfaz (UI)',
    category: 'UI / Gui',
    desc: 'Muestra u oculta una pantalla GUI al pulsar un botón.',
    code: '-- LocalScript (Dentro del TextButton)\nlocal button = script.Parent\nlocal frame = button.Parent:WaitForChild("Frame")\n\nbutton.MouseButton1Click:Connect(function()\n    frame.Visible = not frame.Visible\nend)'
  }
];

// LISTA DE SCRIPTS GUARDADOS
var savedScripts = [
  {
    title: 'UI_OnPlayerJoin.client.luau',
    desc: 'Gestor de interfaz de bienvenida al jugador.',
    code: '-- LocalScript: Inicio\nprint("Jugador conectado con éxito")'
  }
];

// COPIAR SCRIPT AL PORTAPAPELES
window.copySnippet = function(elementId) {
  var el = document.getElementById(elementId);
  if (!el) return;
  var text = el.innerText || el.textContent;
  navigator.clipboard.writeText(text).then(function() {
    alert("📋 ¡Código Luau copiado al portapapeles!");
  });
};

// GUARDAR NUEVO SCRIPT DINÁMICAMENTE
window.saveNewScript = function(title, desc, code) {
  savedScripts.push({
    title: title || 'NuevoScript.luau',
    desc: desc || 'Script personalizado guardado desde el asistente.',
    code: code
  });
  renderSavedScripts();
  alert('💾 ¡Script guardado con éxito en la pestaña Scripts!');
};

// GENERADOR DINO-LÓGICO DE RESPUESTAS LUAU
function generateLuauResponse(userText) {
  var query = userText.toLowerCase();

  if (query.indexOf("interfaz") !== -1 || query.indexOf("gui") !== -1 || query.indexOf("ui") !== -1 || query.indexOf("pantalla") !== -1) {
    return '¡Claro! Aquí tienes un script en Luau para manejar una interfaz de usuario (**ScreenGui**).\n\n**Tipo:** LocalScript (StarterGui)\n\n```lua\n-- LocalScript: Interfaz de Usuario\nlocal Players = game:GetService("Players")\nlocal player = Players.LocalPlayer\nlocal playerGui = player:WaitForChild("PlayerGui")\n\nlocal screenGui = Instance.new("ScreenGui")\nscreenGui.Name = "CustomUI"\nscreenGui.Parent = playerGui\n\nlocal frame = Instance.new("Frame")\nframe.Size = UDim2.new(0, 300, 0, 200)\nframe.Position = UDim2.new(0.5, -150, 0.5, -100)\nframe.BackgroundColor3 = Color3.fromRGB(35, 30, 50)\nframe.BorderSizePixel = 0\nframe.Parent = screenGui\n\nlocal textLabel = Instance.new("TextLabel")\ntextLabel.Size = UDim2.new(1, 0, 1, 0)\ntextLabel.Text = "¡Interfaz Cambiada con Éxito!"\ntextLabel.TextColor3 = Color3.fromRGB(255, 255, 255)\ntextLabel.BackgroundTransparency = 1\ntextLabel.TextSize = 18\ntextLabel.Parent = frame\n```\n¿Te gustaría añadir alguna animación o conectar esta interfaz a un evento del servidor?';
  }

  if (query.indexOf("server") !== -1 || query.indexOf("serverscript") !== -1) {
    return 'Entendido. Para manejar eventos desde el servidor en Roblox Studio:\n\n**Tipo:** ServerScript (\`ServerScriptService\`)\n\n```lua\n-- ServerScriptService: Manejador del Servidor\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\nlocal Players = game:GetService("Players")\n\nPlayers.PlayerAdded:Connect(function(player)\n    print("Servidor: Jugador registrado -> " + player.Name)\nend)\n```\n¿Necesitas comunicar este script con la UI mediante un RemoteEvent?';
  }

  return 'He procesado tu solicitud para Roblox Studio. Aquí tienes el código Luau base:\n\n```lua\n-- Script Luau Optimizado\nlocal ReplicatedStorage = game:GetService("ReplicatedStorage")\nlocal Players = game:GetService("Players")\n\nlocal function initializeSystem()\n    print("ForgerNova Engine: Sistema inicializado correctamente.")\nend\n\ninitializeSystem()\n```\n¿Quieres ajustar algún parámetro específico de tu juego?';
}

// DIBUJAR LISTA DE SCRIPTS GUARDADOS
function renderSavedScripts() {
  var savedContainer = document.getElementById('saved-scripts-list');
  if (!savedContainer) return;
  
  savedContainer.innerHTML = '';
  savedScripts.forEach(function(s, idx) {
    var card = document.createElement('div');
    card.className = 'glass-card';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    card.style.marginBottom = '10px';
    
    var codeId = 'saved-code-' + idx;
    
    card.innerHTML = 
      '<div>' +
        '<strong style="color:var(--accent-pink);">' + s.title + '</strong>' +
        '<p style="font-size:0.85rem; color:var(--text-secondary); margin-top:2px;">' + s.desc + '</p>' +
        '<pre id="' + codeId + '" style="display:none;">' + escapeHtml(s.code) + '</pre>' +
      '</div>' +
      '<div style="display:flex; gap:8px;">' +
        '<button class="btn-secondary" onclick="copySnippet(\'' + codeId + '\')">📋 Copiar</button>' +
      '</div>';
    
    savedContainer.appendChild(card);
  });
}

// INICIALIZADOR PRINCIPAL
document.addEventListener('DOMContentLoaded', function() {

  // 1. NAVEGACIÓN SIDEBAR
  var tools = document.querySelectorAll('.tool-item');
  var panels = document.querySelectorAll('.view-panel');
  var titleHeader = document.getElementById('current-view-title');

  tools.forEach(function(btn) {
    btn.addEventListener('click', function() {
      tools.forEach(function(t) { t.classList.remove('active'); });
      btn.classList.add('active');
      
      var target = btn.getAttribute('data-view');
      panels.forEach(function(p) {
        p.classList.remove('active');
        if (p.id === 'view-' + target) {
          p.classList.add('active');
        }
      });
      
      if (titleHeader) {
        titleHeader.textContent = btn.textContent.trim() + ' (ForgerNova Engine)';
      }
    });
  });

  // 2. CHAT Y MENSAJES
  var btnSend = document.getElementById('btn-send-message');
  var inputChat = document.getElementById('chat-input');
  var messagesBox = document.getElementById('chat-messages');

  function sendMessage() {
    if (!inputChat) return;
    var text = inputChat.value.trim();
    if (!text) return;

    var uCard = document.createElement('div');
    uCard.className = 'message-card';
    uCard.style.background = 'rgba(123, 60, 255, 0.18)';
    uCard.style.border = '1px solid rgba(196, 60, 255, 0.4)';
    uCard.style.alignSelf = 'flex-end';
    uCard.innerHTML = '<strong>Tú</strong><p style="margin-top:4px;">' + escapeHtml(text) + '</p>';
    messagesBox.appendChild(uCard);

    inputChat.value = '';
    messagesBox.scrollTop = messagesBox.scrollHeight;

    setTimeout(function() {
      var aiCard = document.createElement('div');
      aiCard.className = 'message-card';
      
      var rawResponse = generateLuauResponse(text);
      aiCard.innerHTML = '<strong>ForgerNova AI</strong><div style="margin-top:6px;">' + formatMarkdownCode(rawResponse) + '</div>';
      
      messagesBox.appendChild(aiCard);
      messagesBox.scrollTop = messagesBox.scrollHeight;
    }, 500);
  }

  if (btnSend) btnSend.addEventListener('click', sendMessage);

  if (inputChat) {
    inputChat.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  // 3. RENDER LIBRERÍA
  var libGrid = document.getElementById('library-grid');
  if (libGrid) {
    libGrid.innerHTML = '';
    libraryData.forEach(function(item, idx) {
      var card = document.createElement('div');
      card.className = 'glass-card';
      var codeId = 'lib-code-' + idx;
      
      card.innerHTML = 
        '<span style="font-size:0.75rem; color:var(--accent-pink); font-weight:bold;">' + item.category + '</span>' +
        '<h3 style="margin:5px 0;">' + item.title + '</h3>' +
        '<p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:12px;">' + item.desc + '</p>' +
        '<pre id="' + codeId + '" style="display:none;">' + escapeHtml(item.code) + '</pre>' +
        '<button class="btn-primary" style="width:100%;" onclick="copySnippet(\'' + codeId + '\')">📋 Copiar Script</button>';
      
      libGrid.appendChild(card);
    });
  }

  // 4. RENDER SCRIPTS GUARDADOS INICIAL
  renderSavedScripts();

  // 5. ERROR FIXER
  var btnFix = document.getElementById('btn-fix-error');
  if (btnFix) {
    btnFix.addEventListener('click', function() {
      var inputEl = document.getElementById('error-input');
      var solutionEl = document.getElementById('error-solution');
      if (!inputEl || !solutionEl || !inputEl.value.trim()) return;

      solutionEl.innerHTML = 
        '<div class="glass-card" style="border-color:#00e676; margin-top:15px;">' +
          '<h4 style="color:#00e676;">✔ Solución Sugerida</h4>' +
          '<p style="font-size:0.85rem; margin-top:5px;">Sustituye llamadas directas por <code>WaitForChild()</code> en scripts de cliente.</p>' +
        '</div>';
    });
  }
});

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function formatMarkdownCode(text) {
  var counter = 0;
  return text.replace(/```(?:lua)?\n([\s\S]*?)```/g, function(match, code) {
    counter++;
    var id = 'chat-code-' + counter;
    return '<div style="background:var(--code-bg); border:1px solid var(--glass-border); border-radius:8px; margin:10px 0;">' +
             '<div style="background:rgba(255,255,255,0.05); padding:6px 12px; display:flex; justify-content:space-between; align-items:center;">' +
               '<span style="font-size:0.75rem; color:var(--text-secondary);">Luau Script</span>' +
               '<button class="btn-secondary" style="padding:2px 8px; font-size:0.75rem;" onclick="copySnippet(\'' + id + '\')">📋 Copiar</button>' +
             '</div>' +
             '<pre id="' + id + '" style="padding:12px; margin:0; color:#00e676; font-family:var(--font-mono); font-size:0.85rem;">' + escapeHtml(code.trim()) + '</pre>' +
           '</div>';
  });
}
