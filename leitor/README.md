# 📚 Leitor Digital - Ortona

Um leitor HTML elegante para o romance histórico "Ortona" com funcionalidades modernas de leitura.

## 🚀 Como Usar

### Opção 1: Servidor Local (Recomendado)
```bash
# No diretório do projeto
python -m http.server 8000
# ou
npx serve .
```

Depois acesse: `http://localhost:8000`

### Opção 2: Abrir Diretamente
Abra o arquivo `index.html` diretamente no navegador (algumas funcionalidades podem não funcionar devido a restrições CORS).

## ✨ Funcionalidades

### 📖 Leitura
- **Navegação fluida** entre capítulos
- **Carregamento automático** dos arquivos .md
- **Progresso visual** da leitura
- **Design responsivo** (funciona no celular)

### 🎨 Personalização
- **Tema claro/escuro** com persistência
- **Controle de tamanho da fonte** (14px - 24px)
- **Tipografia otimizada** para leitura (Crimson Text + Inter)

### 🔧 Controles
- **Navegação por teclado:**
  - `←` / `→` - Capítulos anterior/próximo
  - `Esc` - Fechar sidebar
  - `Ctrl+B` - Marcar/desmarcar página
  - `Ctrl+R` - Recarregar capítulo atual
- **Botão ↻** - Recarregar capítulo atual
- **Sidebar** com lista de capítulos
- **Bookmarks** persistentes
- **Compartilhamento** de capítulos

### 📱 Responsivo
- **Mobile-first** design
- **Sidebar adaptativa** em telas pequenas
- **Navegação otimizada** para touch

## 📁 Estrutura

```
leitor/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos principais
├── js/
│   └── reader.js       # Lógica do leitor
├── assets/             # Imagens e recursos
└── README.md           # Este arquivo
```

## ⚙️ Configuração

### Alterar Caminho dos Capítulos
Edite o arquivo `js/reader.js` na linha 3:
```javascript
chaptersPath: '../capitulos-finais V2 - Story/',
```

### Adicionar/Remover Capítulos
Edite o array `chapters` no arquivo `js/reader.js`:
```javascript
chapters: [
    { number: 1, file: 'Capitulo_01.md', title: 'Título', date: '1943' },
    // ...
]
```

## 🎯 Recursos Técnicos

- **Marked.js** para conversão Markdown → HTML
- **CSS Variables** para temas dinâmicos
- **LocalStorage** para persistência de preferências
- **Fetch API** para carregamento de arquivos
- **Responsive Design** com CSS Grid/Flexbox

## 🔧 Desenvolvimento

### Recarregamento Automático
Em ambiente de desenvolvimento (localhost), o leitor verifica mudanças nos arquivos .md a cada 5 segundos e recarrega automaticamente.

### Debug
Abra o Console do navegador (F12) para ver logs de debug e erros.

## 📝 Notas

- **CORS**: Para funcionar completamente, use um servidor local
- **Markdown**: Suporta sintaxe padrão do Markdown
- **Performance**: Capítulos são carregados sob demanda
- **Acessibilidade**: Navegação por teclado e contraste adequado

## 🎨 Customização

### Cores
Edite as variáveis CSS em `css/style.css`:
```css
:root {
    --accent: #8b4513;        /* Cor principal */
    --bg-primary: #fafafa;    /* Fundo */
    --text-primary: #2c2c2c;  /* Texto */
}
```

### Fontes
Altere as fontes em `css/style.css`:
```css
--font-serif: 'Crimson Text', serif;
--font-sans: 'Inter', sans-serif;
```

---

**Desenvolvido para o projeto Ortona**  
*Romance Histórico sobre a Batalha de Ortona (1943)*
