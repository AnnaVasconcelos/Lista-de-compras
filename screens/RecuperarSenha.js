import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { avisar, mensagemErro } from '../utils';

export default function RecuperarSenhaScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);

  const enviar = async () => {
    if (email.trim() === '') {
      avisar('Atenção', 'Digite o seu e-mail.');
      return;
    }

    setCarregando(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      avisar('E-mail enviado', 'Verifique sua caixa de entrada (e o spam) para redefinir a senha.');
      navigation.goBack();
    } catch (erro) {
      avisar('Erro', mensagemErro(erro.code));
    }
    setCarregando(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.texto}>
        Digite o e-mail da sua conta. Vamos enviar um link para você criar uma nova senha.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity style={styles.botao} onPress={enviar} disabled={carregando}>
        <Text style={styles.textoBotao}>{carregando ? 'Enviando...' : 'Enviar link'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25 },
  texto: { marginBottom: 20, fontSize: 15, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  botao: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center' },
  textoBotao: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
