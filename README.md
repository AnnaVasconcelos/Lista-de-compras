# SmartMarket – AP08 Lista de Compras

App de lista de compras em React Native (Expo) com Firebase Authentication e Cloud Firestore.

## Como rodar no VS Code

Pré-requisito: Node.js LTS instalado (https://nodejs.org).

1. Abra esta pasta no VS Code (Arquivo > Abrir Pasta).
2. Abra o terminal do VS Code (Ctrl + ').
3. Instale as dependências:

   ```
   npm install
   ```

4. Inicie o projeto:

   ```
   npx expo start
   ```

5. Escolha onde abrir:
   - **Celular:** abra o app Expo Go (atualizado) e leia o QR Code que aparece no terminal.
     O celular e o computador precisam estar na mesma rede Wi-Fi.
   - **Navegador:** aperte `w` no terminal.
   - **Emulador Android:** aperte `a` no terminal.

Se der algum erro de cache, rode: `npx expo start -c`

## Estrutura

- `App.js` – navegação e controle de login/logout
- `firebaseConfig.js` – conexão com o Firebase (Auth + Firestore)
- `utils.js` – alertas, formatação em reais e mensagens de erro
- `screens/` – telas (Login, Cadastro, Recuperar senha, Listas, Produtos)
- `firestore.rules` – regras de segurança do Firestore
