document.addEventListener('DOMContentLoaded', () => {

  const AppState = {
    currentChatId: 'chat_default',
    attachedFiles: [],
    chats: [
      {
        id: 'chat_default',
        title: 'Interfaz al unirse',
        messages: [
          {
            sender: 'ai',
            text: '¡Hola! Soy NovaForge. ¿Qué sistema o script Luau necesitas construir hoy para tu juego de Roblox?'
          }
        ]
      }
    ]
  };

  const DOM = {
    chatMessages: document.getElementById('chat-messages'),
    chatInput: document.getElementById('chat-input'),
    btnSend: document.getElementById('btn-send'),
    btnAttach: document.getElementById('btn-attach'),
    fileInput: document.getElementById('file-input'),
    attachmentsPreview: document.getElementById('attachments-preview'),
    historyList: document.getElementById('history-list'),
    btnNewChat: document.getElementById('btn-new-chat'),
    mobileToggle: document.getElementById('mobile-toggle'),
    sidebar: document.getElementById('sidebar'),
    toolItems: document.querySelectorAll('.tool-item'),
    viewPanels: document.querySelectorAll('.view-panel'),
    currentViewTitle: document.getElementById('current-view-title'),
    btnFixError: document.getElementById('btn-fix-error'),
    errorInput: document.getElementById('error-input'),
    errorSolution: document.getElementById('error-solution')
  };

  function init() {
    renderHistory();
    loadChat(AppState.currentChatId);
    setupEventListeners();
  }

  function setupEventListeners() {
    DOM.chatInput.addEventListener('input', () => {
      DOM.chatInput.style.height = 'auto';
      DOM.chatInput.style.height = DOM.chatInput.scrollHeight + 'px';
    });

    DOM.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    DOM.btnSend.addEventListener('click', sendMessage);
    DOM.btnAttach.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', handleFileAttachment);
    DOM.btnNewChat.addEventListener('click', createNewChat);

    if (DOM.mobileToggle) {
      DOM.mobileToggle.addEventListener('click', () => DOM.sidebar.classList.toggle('open'));
    }

    // Selector de Menús
    DOM.toolItems.forEach(item => {
      item.addEventListener('click', () => {
        DOM.toolItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const viewName = item.getAttribute('data-view');
        switchView(viewName);
      });
    });

    // Fixer Handler
    if (DOM.btnFixError) {
      DOM.btnFixError.addEventListener('click', processErrorFixing);
    }
  }

  function switchView(viewName) {
    DOM.viewPanels.forEach(panel => panel.classList.remove('active'));
    
    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    const titles = {
      'chat': 'Chat Assistant (Luau Engine)',
      'library': 'Librería de Componentes',
      'scripts': 'Gestor de Scripts',
      'favorites': 'Snippets Favoritos',
      'error-fixer': 'Roblox Error Fixer',
      'settings': 'Configuración'
    };

    DOM.currentViewTitle.innerText = titles[viewName] || 'NovaForge';
  }

  function renderHistory() {
    DOM.historyList.innerHTML = '';
    AppState.chats.forEach(chat => {
      const li = document.createElement('li');
      li.className = `history-item ${chat.id === AppState.currentChatId ? 'active' : ''}`;
      li.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        <span class="item-title">${chat.title}</span>
      `;
      li.addEventListener('click', () => {
        AppState.currentChatId = chat.id;
        renderHistory();
        loadChat(chat.id);
        switchView('chat');
        DOM.toolItems.forEach(i => i.classList.remove('active'));
        document.querySelector('[data-view="chat"]').classList.add('active');
      });
      DOM.historyList.appendChild(li);
    });
  }

  function loadChat(chatId) {
    const chat = AppState.chats.find(c => c.id === chatId);
    if (!chat) return;

    DOM.chatMessages.innerHTML = '';
    chat.messages.forEach(msg => {
      appendMessageToDOM(msg.sender, msg.text, msg.files || []);
    });
    scrollToBottom();
  }

  function sendMessage() {
    const text = DOM.chatInput.value.trim();
    if (!text && AppState.attachedFiles.length === 0) return;

    const currentChat = AppState.chats.find(c => c.id === AppState.currentChatId);
    currentChat.messages.push({ sender: 'user', text: text, files: [...AppState.attachedFiles] });
    appendMessageToDOM('user', text, AppState.attachedFiles);

    DOM.chatInput.value = '';
    DOM.chatInput.style.height = 'auto';
    AppState.attachedFiles = [];
    DOM.attachmentsPreview.innerHTML = '';
    scrollToBottom();

    simulateSmartAIResponse(text);
  }

  function appendMessageToDOM(sender, text, files = []) {
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `message-wrapper ${sender}`;

    const avatarSvg = sender === 'user' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff"/></svg>`;

    const formattedText = parseCodeBlocks(text);

    let filesHTML = files.length > 0
      ? `<div class="attached-files-list">` + files.map(f => `<span class="file-chip">📄 ${f}</span>`).join('') + `</div>`
      : '';

    msgWrapper.innerHTML = `
      <div class="message-avatar">${avatarSvg}</div>
      <div class="message-body">
        ${filesHTML}
        <div>${formattedText}</div>
      </div>
    `;

    DOM.chatMessages.appendChild(msgWrapper);

    msgWrapper.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement.nextElementSibling.innerText;
        navigator.clipboard.writeText(code);
        btn.innerText = '¡Copiado!';
        setTimeout(() => btn.innerText = 'Copiar', 2000);
      });
    });
  }

  function parseCodeBlocks(text) {
    const regex = /```(luau|lua)?([\s\S]*?)```/g;
    return text.replace(regex, (match, lang, code) => {
      return `
        <div class="code-block">
          <div class="code-header">
            <span>${lang || 'luau'}</span>
            <button class="btn-copy-code">Copiar</button>
          </div>
          <pre class="code-content"><code>${escapeHtml(code.trim())}</code></pre>
        </div>
      `;
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* GENERADOR INTELIGENTE SEGÚN LA SOLICITUD DEL USUARIO */
  function simulateSmartAIResponse(query) {
    setTimeout(() => {
      let aiText = "";
      const q = query.toLowerCase();

      if (q.includes("interfaz") || q.includes("gui") || q.includes("unirse") || q.includes("pantalla")) {
        aiText = `Aquí tienes un **LocalScript** completo en Luau. Colócalo en \`StarterPlayer -> StarterPlayerScripts\` o dentro de un \`ScreenGui\` en \`StarterGui\` para activar la interfaz cuando el jugador entre al servidor:

\`\`\`luau
-- LocalScript: Gestor de Interfaz al Unirse
local Players = game:GetService("Players")
local TweenService = game:GetService("TweenService")

local localPlayer = Players.LocalPlayer
local playerGui = localPlayer:WaitForChild("PlayerGui")

-- Referencia al ScreenGui de Bienvenida
local mainGui = playerGui:WaitForChild("MainScreenGui")
local welcomeFrame = mainGui:WaitForChild("WelcomeFrame")

local function onPlayerLoaded()
    welcomeFrame.Visible = true
    welcomeFrame.BackgroundTransparency = 1
    
    -- Animación de entrada suave (Fade In)
    local tweenInfo = TweenInfo.new(1.2, Enum.EasingStyle.Quart, Enum.EasingDirection.Out)
    local tween = TweenService:Create(welcomeFrame, tweenInfo, {BackgroundTransparency = 0.1})
    tween:Play()
    
    print("Interfaz cargada con éxito para: " .. localPlayer.Name)
end

onPlayerLoaded()
\`\`\``;
      } else if (q.includes("datastore") || q.includes("guardar")) {
        aiText = `Para guardar los datos de los jugadores en Roblox, utiliza este **Script** en \`ServerScriptService\`:

\`\`\`luau
-- ServerScript: DataStore System
local DataStoreService = game:GetService("DataStoreService")
local playerDataStore = DataStoreService:GetDataStore("NovaForge_Data_v1")

game.Players.PlayerAdded:Connect(function(player)
    local userKey = "User_" .. player.UserId
    local data = nil
    
    local success, err = pcall(function()
        data = playerDataStore:GetAsync(userKey)
    end)
    
    if success and data then
        print("Datos cargados para " .. player.Name)
    else
        print("Nuevo jugador registrado.")
    end
end)
\`\`\``;
      } else {
        aiText = `He procesado tu consulta sobre Roblox Studio. Aquí tienes el código base en **Luau**:

\`\`\`luau
-- Script General Luau (ServerScriptService)
local Workspace = game:GetService("Workspace")

local function initSystem()
    print("Sistema NovaForge inicializado en Roblox Studio.")
end

initSystem()
\`\`\``;
      }

      const currentChat = AppState.chats.find(c => c.id === AppState.currentChatId);
      currentChat.messages.push({ sender: 'ai', text: aiText });
      appendMessageToDOM('ai', aiText);
      scrollToBottom();
    }, 1000);
  }

  function processErrorFixing() {
    const errorText = DOM.errorInput.value.trim();
    if (!errorText) return;

    DOM.errorSolution.innerHTML = `
      <div class="glass-card" style="border-color: var(--status-success); margin-top: 15px;">
        <h4 style="color: var(--status-success);">✔ Análisis Finalizado</h4>
        <p style="margin-top: 8px;">El error se debe a un intento de indexar un objeto inexistente antes de que cargue.</p>
        <div class="code-block" style="margin-top: 10px;">
          <pre class="code-content"><code>-- Solución recomendada: Usa WaitForChild()
local frame = playerGui:WaitForChild("MainFrame")</code></pre>
        </div>
      </div>
    `;
  }

  function handleFileAttachment(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      AppState.attachedFiles.push(file.name);
      const chip = document.createElement('span');
      chip.className = 'file-chip';
      chip.innerText = `📄 ${file.name}`;
      DOM.attachmentsPreview.appendChild(chip);
    });
  }

  function scrollToBottom() {
    DOM.chatMessages.scrollTop = DOM.chatMessages.scrollHeight;
  }

  function createNewChat() {
    const newId = 'chat_' + Date.now();
    const newChat = {
      id: newId,
      title: 'Nueva Sesión Luau',
      messages: [{ sender: 'ai', text: 'Nueva sesión de código activa.' }]
    };
    AppState.chats.unshift(newChat);
    AppState.currentChatId = newId;
    renderHistory();
    loadChat(newId);
    switchView('chat');
  }

  init();
});
