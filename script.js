/* ==========================================================================
   NovaForge - Frontend Architecture & Chat Engine
   Modular Plain JS Application Handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------------
     1. APPLICATION STATE & DATA MODEL
     ------------------------------------------------------------------------ */
  const AppState = {
    currentChatId: 'chat_default',
    attachedFiles: [],
    chats: [
      {
        id: 'chat_default',
        title: 'Sistema de Guardado DataStore',
        messages: [
          {
            sender: 'ai',
            text: '¡Hola! Soy NovaForge, tu asistente especialista en Roblox Studio. ¿En qué sistema o script Luau puedo ayudarte hoy?'
          }
        ]
      },
      {
        id: 'chat_02',
        title: 'Pet Follower Handler',
        messages: [
          { sender: 'user', text: '¿Cómo hago para que las mascotas sigan al jugador suavemente?' },
          { sender: 'ai', text: 'Puedes usar BodyPosition o BodyGyro combinados con Lerp en el RenderStepped.' }
        ]
      }
    ]
  };

  /* ------------------------------------------------------------------------
     2. DOM ELEMENTS CACHE
     ------------------------------------------------------------------------ */
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
    viewChat: document.getElementById('view-chat'),
    viewPanel: document.getElementById('view-panel'),
    panelTitle: document.getElementById('panel-title'),
    panelContent: document.getElementById('panel-content'),
    currentViewTitle: document.getElementById('current-view-title')
  };

  /* ------------------------------------------------------------------------
     3. INITIALIZATION
     ------------------------------------------------------------------------ */
  function init() {
    renderHistory();
    loadChat(AppState.currentChatId);
    setupEventListeners();
  }

  /* ------------------------------------------------------------------------
     4. EVENT LISTENERS SETUP
     ------------------------------------------------------------------------ */
  function setupEventListeners() {
    // Ajuste automático del Textarea
    DOM.chatInput.addEventListener('input', autoResizeTextarea);

    // Enviar con Enter (sin Shift)
    DOM.chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Clic en enviar
    DOM.btnSend.addEventListener('click', sendMessage);

    // Manejo de adjuntos
    DOM.btnAttach.addEventListener('click', () => DOM.fileInput.click());
    DOM.fileInput.addEventListener('change', handleFileAttachment);

    // Nuevo chat
    DOM.btnNewChat.addEventListener('click', createNewChat);

    // Mobile Sidebar Toggle
    if (DOM.mobileToggle) {
      DOM.mobileToggle.addEventListener('click', () => {
        DOM.sidebar.classList.toggle('open');
      });
    }

    // Navegación de Herramientas
    DOM.toolItems.forEach(item => {
      item.addEventListener('click', () => {
        DOM.toolItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const viewName = item.getAttribute('data-view');
        switchView(viewName);
      });
    });
  }

  /* ------------------------------------------------------------------------
     5. CHAT & MESSAGE RENDERING ENGINE
     ------------------------------------------------------------------------ */
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
    
    // Guardar mensaje de usuario
    const userMsg = {
      sender: 'user',
      text: text,
      files: [...AppState.attachedFiles]
    };
    currentChat.messages.push(userMsg);
    appendMessageToDOM('user', text, AppState.attachedFiles);

    // Resetear Input
    DOM.chatInput.value = '';
    DOM.chatInput.style.height = 'auto';
    AppState.attachedFiles = [];
    DOM.attachmentsPreview.innerHTML = '';
    scrollToBottom();

    // Generar Respuesta IA Simula
    simulateAIResponse(text);
  }

  function appendMessageToDOM(sender, text, files = []) {
    const msgWrapper = document.createElement('div');
    msgWrapper.className = `message-wrapper ${sender}`;

    const avatarSvg = sender === 'user' 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff"/></svg>`;

    // Formatear Bloques de Código Luau si existen
    const formattedText = parseCodeBlocks(text);

    let filesHTML = '';
    if (files.length > 0) {
      filesHTML = `<div class="attached-files-list">` + 
        files.map(f => `<span class="file-chip">📄 ${f}</span>`).join('') + 
        `</div>`;
    }

    msgWrapper.innerHTML = `
      <div class="message-avatar">${avatarSvg}</div>
      <div class="message-body">
        ${filesHTML}
        <div>${formattedText}</div>
      </div>
    `;

    DOM.chatMessages.appendChild(msgWrapper);

    // Event listener para botones de copiar código
    msgWrapper.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const code = btn.parentElement.nextElementSibling.innerText;
        navigator.clipboard.writeText(code);
        btn.innerText = '¡Copiado!';
        setTimeout(() => btn.innerText = 'Copiar', 2000);
      });
    });
  }

  /* ------------------------------------------------------------------------
     6. PARSER & AI RESPONSE SIMULATOR
     ------------------------------------------------------------------------ */
  function parseCodeBlocks(text) {
    // Transforma ```luau ... ``` en tarjetas de código con resaltado y botón copiar
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

  function simulateAIResponse(userQuery) {
    // Respuestas realistas estructuradas para desarrolladores de Roblox
    setTimeout(() => {
      let aiText = "He analizado tu petición. Aquí tienes la solución estructurada en Luau para Roblox Studio:";

      if (userQuery.toLowerCase().includes('datastore') || userQuery.toLowerCase().includes('guardar')) {
        aiText += `\n\n\`\`\`luau
local DataStoreService = game:GetService("DataStoreService")
local myDataStore = DataStoreService:GetDataStore("PlayerSavedStats")

game.Players.PlayerRemoving:Connect(function(player)
    local userId = "Player_" .. player.UserId
    local dataToSave = { Coins = 100, Level = 5 }
    
    local success, err = pcall(function()
        myDataStore:SetAsync(userId, dataToSave)
    end)
    
    if not success then
        warn("Error guardando datos: " .. tostring(err))
    end
end)
\`\`\``;
      } else {
        aiText += `\n\n\`\`\`luau
-- Script de prueba generado en Luau
local Workspace = game:GetService("Workspace")

local function createPart()
    local part = Instance.new("Part")
    part.Size = Vector3.new(4, 1, 2)
    part.Anchored = true
    part.BrickColor = BrickColor.new("Royal purple")
    part.Parent = Workspace
end

createPart()
\`\`\``;
      }

      const currentChat = AppState.chats.find(c => c.id === AppState.currentChatId);
      currentChat.messages.push({ sender: 'ai', text: aiText });
      appendMessageToDOM('ai', aiText);
      scrollToBottom();
    }, 1000);
  }

  /* ------------------------------------------------------------------------
     7. UTILITIES & ATTACHMENTS
     ------------------------------------------------------------------------ */
  function autoResizeTextarea() {
    DOM.chatInput.style.height = 'auto';
    DOM.chatInput.style.height = DOM.chatInput.scrollHeight + 'px';
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
      title: 'Nueva Consulta Luau',
      messages: [
        { sender: 'ai', text: 'Nueva sesión lista. ¿En qué script trabajaremos ahora?' }
      ]
    };
    AppState.chats.unshift(newChat);
    AppState.currentChatId = newId;
    renderHistory();
    loadChat(newId);
    switchView('chat');
  }

  function switchView(viewName) {
    if (viewName === 'chat') {
      DOM.viewChat.classList.add('active');
      DOM.viewPanel.classList.remove('active');
      DOM.currentViewTitle.innerText = "Chat Assistant (Luau Engine)";
    } else {
      DOM.viewChat.classList.remove('active');
      DOM.viewPanel.classList.add('active');
      DOM.currentViewTitle.innerText = viewName.toUpperCase() + " Module";
      DOM.panelTitle.innerText = viewName.toUpperCase();
      DOM.panelContent.innerText = `Módulo de ${viewName} activado. Listo para integraciones avanzadas con tu flujo de trabajo de Roblox Studio.`;
    }
  }

  // Ejecutar inicialización
  init();
});
