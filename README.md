# 🌐 Visualizador de Grafos Interativo

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![D3.js](https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)

Um projeto desenvolvido para criar, visualizar e interagir com grafos de forma dinâmica e intuitiva no navegador. Utilizando a biblioteca D3.js, a aplicação simula um layout de força (force-directed graph), onde os nós se repelem e as arestas agem como molas, criando uma visualização orgânica e fluida.

---

> **⚠️ Aviso de Compatibilidade**
> Para uma experiência completa e acesso a todas as funcionalidades interativas (como arrastar nós e utilizar o zoom), **recomenda-se o uso de um computador (desktop ou notebook)**. A visualização em dispositivos móveis é limitada.

## ✨ Funcionalidades Principais

- **Visualização Dinâmica**: Renderiza grafos com nós e arestas em um canvas SVG.
- **Layout de Força**: Os nós são posicionados automaticamente por um algoritmo de simulação de força (D3-force), evitando sobreposições e organizando a estrutura de forma clara.
- **Interatividade Total**:
  - **Adicionar e Remover Nós**: Adicione novos nós ao grafo ou remova nós existentes com um clique.
  - **Arrastar Nós (Drag and Drop)**: Mova os nós pelo canvas para reorganizar a visualização.
  - **Zoom e Pan**: Aumente ou diminua o zoom e navegue pelo grafo com facilidade.
- **Tipos de Nós**: O sistema suporta diferentes categorias de nós, cada uma representada por um ícone SVG distinto, facilitando a identificação visual.
- **Controles da Simulação**: Reinicie a simulação de força a qualquer momento para reorganizar os nós.

---

## 🚀 Projeto Online

Você pode testar a aplicação em tempo real no seguinte link:

- 🔗 **https://grafo-zeta.vercel.app/**

---

## 📸 Demonstração Visual

_(Recomendação: adicione aqui um screenshot ou um GIF do seu projeto em ação para impressionar os visitantes!)_

![grafo-demonstration-gif](https://github.com/alissoncipriano/grafo/tree/main/public/demo.gif)

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com um conjunto de tecnologias modernas para o desenvolvimento web:

- **React**: Biblioteca para a construção da interface de usuário.
- **TypeScript**: Superset do JavaScript que adiciona tipagem estática ao código, aumentando a robustez e a manutenibilidade.
- **D3.js**: Biblioteca JavaScript para manipulação de documentos baseada em dados.
- **CSS**: Para a estilização dos componentes e da interface.

---

## ⚙️ Como Executar o Projeto Localmente

Siga os passos abaixo para rodar a aplicação no seu ambiente de desenvolvimento.

### **Pré-requisitos**

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/)

### **Passos**

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/alissoncipriano/grafo](https://github.com/alissoncipriano/grafo)
    ```

2.  **Navegue até o diretório do projeto:**

    ```bash
    cd grafo
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm start
    ```

5.  Abra seu navegador e acesse `http://localhost:3000` para ver a aplicação em funcionamento.

### **Scripts Disponíveis**

- `npm start`: Roda a aplicação em modo de desenvolvimento.
- `npm run build`: Compila a aplicação para produção na pasta `build/`.
- `npm test`: Executa os testes automatizados.

---
