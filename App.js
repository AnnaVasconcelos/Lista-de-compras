import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginScreen from './screens/Login';
import CadastroScreen from './screens/Cadastro';
import RecuperarSenhaScreen from './screens/RecuperarSenha';
import ListasScreen from './screens/Listas';
import ProdutosScreen from './screens/Produtos';

const Stack = createNativeStackNavigator();

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Fica "escutando" o login/logout do usuário
  useEffect(() => {
    const cancelar = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return cancelar;
  }, []);

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#2e7d32' },
          headerTintColor: '#fff',
        }}
      >
        {usuario ? (
          // Telas para quem está logado
          <>
            <Stack.Screen
              name="Listas"
              component={ListasScreen}
              options={{ title: 'Minhas Listas' }}
            />
            <Stack.Screen
              name="Produtos"
              component={ProdutosScreen}
              options={({ route }) => ({ title: route.params.nome })}
            />
          </>
        ) : (
          // Telas para quem NÃO está logado
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'SmartMarket' }}
            />
            <Stack.Screen
              name="Cadastro"
              component={CadastroScreen}
              options={{ title: 'Criar conta' }}
            />
            <Stack.Screen
              name="RecuperarSenha"
              component={RecuperarSenhaScreen}
              options={{ title: 'Recuperar senha' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

