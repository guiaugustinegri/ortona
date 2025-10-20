# 📚 Leitor Digital - Ortona

Um leitor digital moderno e interativo para o romance histórico "Ortona - A Batalha que Mudou Tudo".

## 🚀 Funcionalidades

### ✨ **Recursos Principais**
- **Capa Interativa**: Página de abertura com design militar autêntico
- **Índice Completo**: Navegação visual por todos os capítulos
- **Player de Música**: Trilha sonora configurável por capítulos
- **Temas**: Modo claro e escuro com cores militares autênticas
- **Responsivo**: Funciona perfeitamente em desktop e mobile
- **Navegação Intuitiva**: Controles de teclado e mouse

### 🎵 **Sistema de Música**
- **Música por Capítulos**: Configure diferentes músicas para diferentes capítulos
- **Controles Completos**: Play, pause, stop, mute, volume
- **Auto-play**: Reprodução automática ao mudar de capítulo
- **Loop**: Repetição contínua da música
- **Configuração Persistente**: Suas preferências são salvas

### 🎨 **Personalização**
- **Tamanho da Fonte**: Ajustável de 14px a 24px
- **Tema Militar**: Cores autênticas da Segunda Guerra Mundial
- **Bookmarks**: Marque capítulos favoritos
- **Progresso**: Acompanhe sua leitura

## 📁 Estrutura de Arquivos

```
leitor/
├── index.html          # Página principal do leitor
├── capa.html           # Página de capa
├── indice.html         # Página de índice
├── config.js           # Configurações do leitor
├── css/
│   └── style.css       # Estilos do leitor
├── js/
│   └── reader.js       # Lógica do leitor
└── README.md           # Este arquivo
```

## ⚙️ Configuração

### 📖 **Configurar Capítulos**

Edite o arquivo `config.js` para alterar:

1. **Diretório dos Capítulos**:
   ```javascript
   chaptersPath: '../Final/',  // Caminho para os capítulos
   ```

2. **Lista de Capítulos**:
   ```javascript
   chapters: [
       { number: 1, file: 'Capitulo_01_O_Cerco_de_Ortona.md', title: 'O Cerco de Ortona', date: '1943' },
       // Adicione mais capítulos aqui
   ]
   ```

### 🎵 **Configurar Música**

No arquivo `config.js`, na seção `musicConfig`:

```javascript
musicConfig: {
    enabled: true,
    musicPath: '../trilha sonora/',
    tracks: [
        { 
            file: '../trilha sonora/Chamas.mp3', 
            chapters: [1, 2, 3], 
            name: 'Chamas',
            description: 'Música de abertura'
        },
        // Adicione mais músicas aqui
    ]
}
```

#### **Exemplos de Configuração de Música**:

- **Uma música para capítulos 1-3**:
  ```javascript
  { file: '../trilha sonora/Abertura.mp3', chapters: [1, 2, 3], name: 'Abertura' }
  ```

- **Uma música apenas para o capítulo 10**:
  ```javascript
  { file: '../trilha sonora/Climax.mp3', chapters: [10], name: 'Clímax' }
  ```

- **Uma música para capítulos 20-21 (final)**:
  ```javascript
  { file: '../trilha sonora/Final.mp3', chapters: [20, 21], name: 'Final' }
  ```

## 🎮 Como Usar

### **Navegação**
- **Setas do Teclado**: ← → para navegar entre capítulos
- **Botões**: Use os botões "Anterior" e "Próximo"
- **Índice**: Clique no ícone 📖 no header para ver todos os capítulos
- **Capa**: Clique no título "Ortona" para voltar à capa

### **Player de Música**
- **Abrir Player**: Clique no botão ♪ no header
- **Controles**: Play, pause, stop, mute
- **Volume**: Use o slider para ajustar o volume
- **Configurações**: 
  - ☑️ Tocar automaticamente
  - ☑️ Repetir música

### **Personalização**
- **Tema**: Clique no botão L/D para alternar tema claro/escuro
- **Fonte**: Use A+ e A- para ajustar o tamanho da fonte
- **Bookmarks**: Use Ctrl+B para marcar/desmarcar capítulo

## 🔧 Requisitos

- **Navegador Moderno**: Chrome, Firefox, Safari, Edge
- **Arquivos MP3**: Para a trilha sonora (opcional)
- **Servidor Web**: Para funcionar corretamente (não funciona abrindo arquivo diretamente)

## 🚀 Como Executar

1. **Coloque os arquivos** em um servidor web
2. **Configure** o arquivo `config.js` conforme necessário
3. **Adicione músicas** na pasta `trilha sonora/` (opcional)
4. **Abra** `capa.html` no navegador

### **Servidor Local (Desenvolvimento)**
```bash
# Python 3
python -m http.server 8000

# Node.js (com http-server)
npx http-server

# PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000/leitor/capa.html`

## 🎨 Temas e Cores

O leitor usa um esquema de cores autêntico da Segunda Guerra Mundial:

- **Olive Drab**: Verde militar principal
- **Khaki**: Bege militar
- **Navy Blue**: Azul marinho
- **Panzer Gray**: Cinza dos tanques alemães
- **Luftwaffe Blue**: Azul da força aérea alemã

## 📱 Responsividade

O leitor é totalmente responsivo e funciona em:
- **Desktop**: Experiência completa
- **Tablet**: Layout adaptado
- **Mobile**: Interface otimizada para toque

## 🔒 Armazenamento Local

O leitor salva automaticamente:
- **Capítulo atual**: Para continuar de onde parou
- **Tema**: Preferência de tema claro/escuro
- **Tamanho da fonte**: Configuração de legibilidade
- **Configurações de música**: Volume, auto-play, loop
- **Bookmarks**: Capítulos marcados

## 🆘 Solução de Problemas

### **Música não toca**
- Verifique se o arquivo MP3 existe no caminho correto
- Certifique-se de que o navegador suporta MP3
- Verifique as configurações de música no `config.js`

### **Capítulos não carregam**
- Verifique se o caminho `chaptersPath` está correto
- Certifique-se de que os arquivos .md existem
- Verifique se está executando em um servidor web

### **Estilos não aparecem**
- Verifique se o arquivo `style.css` está no local correto
- Limpe o cache do navegador (Ctrl+F5)

## 📝 Licença

Este leitor foi desenvolvido especificamente para o projeto "Ortona - A Batalha que Mudou Tudo".

---

**Desenvolvido com ❤️ para uma experiência de leitura imersiva e autêntica.**