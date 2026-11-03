import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { avisar, confirmar } from '../utils';

export default function ListasScreen({ navigation }) {
  const [listas, setListas] = useState([]);
  const [nomeLista, setNomeLista] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => signOut(auth)}>
          <Text style={{ color: '#fff', fontSize: 16 }}>Sair</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    const refColecao = collection(db, 'users', auth.currentUser.uid, 'listas');
    const q = query(refColecao, orderBy('dataCriacao'));
    const cancelar = onSnapshot(
      q,
      (snapshot) => {
        setListas(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (erro) => console.log(erro.message)
    );
    return cancelar;
  }, []);

  const criarLista = async () => {
    if (nomeLista.trim() === '') {
      avisar('Atenção', 'Digite o nome da lista.');
      return;
    }
    try {
      const refColecao = collection(db, 'users', auth.currentUser.uid, 'listas');
      await addDoc(refColecao, {
        nome: nomeLista.trim(),
        dataCriacao: serverTimestamp(),
      });
      setNomeLista('');
    } catch (erro) {
      avisar('Erro', 'Não foi possível criar a lista.');
    }
  };

  const excluirLista = (lista) => {
    confirmar(`Excluir a lista "${lista.nome}" e todos os produtos dela?`, async () => {
      try {
        const produtos = await getDocs(
          collection(db, 'users', auth.currentUser.uid, 'listas', lista.id, 'produtos')
        );
        for (const p of produtos.docs) {
          await deleteDoc(p.ref);
        }
        await deleteDoc(doc(db, 'users', auth.currentUser.uid, 'listas', lista.id));
      } catch (erro) {
        avisar('Erro', 'Não foi possível excluir a lista.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.linhaNova}>
        <TextInput
          style={styles.input}
          placeholder="Nova lista (ex: Compras do mês)"
          value={nomeLista}
          onChangeText={setNomeLista}
        />
        <TouchableOpacity style={styles.botaoAdd} onPress={criarLista}>
          <Text style={styles.textoBotao}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listas}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.vazio}>Nenhuma lista ainda. Crie a primeira acima!</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() =>
                navigation.navigate('Produtos', { listaId: item.id, nome: item.nome })
              }
            >
              <Text style={styles.nomeLista}>{item.nome}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluirLista(item)}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  linhaNova: { flexDirection: 'row', marginBottom: 15 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  botaoAdd: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginLeft: 10,
  },
  textoBotao: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  nomeLista: { fontSize: 18 },
  excluir: { color: '#c62828', fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: '#888', marginTop: 30 },
});