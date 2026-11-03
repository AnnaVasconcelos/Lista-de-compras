import { Alert, Platform } from 'react-native';

// Alert.alert não funciona na versão Web, então usamos window.alert nela
export function avisar(titulo, mensagem) {
  if (Platform.OS === 'web') {
    window.alert(titulo + '\n\n' + mensagem);
  } else {
    Alert.alert(titulo, mensagem);
  }
}

// Pergunta antes de excluir (também funciona na Web)
export function confirmar(mensagem, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (window.confirm(mensagem)) aoConfirmar();
  } else {
    Alert.alert('Confirmar', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
    ]);
  }
}

// Formata número como dinheiro: 12.5 -> "R$ 12,50"
export function formatarReais(valor) {
  return 'R$ ' + valor.toFixed(2).replace('.', ',');
}

// Traduz os códigos de erro do Firebase Authentication
const erros = {
  'auth/invalid-email': 'E-mail inválido.',
  'auth/missing-password': 'Digite a senha.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/user-not-found': 'Usuário não encontrado.',
  'auth/wrong-password': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
  'auth/network-request-failed': 'Sem conexão com a internet.',
};

export function mensagemErro(codigo) {
  return erros[codigo] || 'Ocorreu um erro. Tente novamente.';
}
