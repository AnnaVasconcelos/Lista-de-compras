import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { avisar, confirmar, formatarReais } from '../utils';

export default function ProdutosScreen({ route }) {
  const { listaId } = route.params;
  const [produtos, setProdutos] = useState([]);
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  // Escuta os produtos em tempo real: qualquer mudança atualiza a tela e o total
  useEffect(() => {
    const refColecao = collection(
      db,
      'users',
      auth.currentUser.uid,
      'listas',
      listaId,
      'produtos'
    );
    const q = query(refColecao, orderBy('dataAdicao'));

    const cancelar = onSnapshot(
      q,
      (snapshot) => {
        setProdutos(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
      (erro) => console.log(erro.message)
    );
    return cancelar;
  }, [listaId]);

  // Cálculo automático: soma de (quantidade * preço) de cada produto
  const totalGeral = produtos.reduce(
    (soma, p) => soma + p.quantidade * p.precoUnitario,
    0
  );

  const limparFormulario = () => {
    setNomeProduto('');
    setQuantidade('');
    setPrecoUnitario('');
    setEditandoId(null);
  };

  const salvarProduto = async () => {
    const qtd = Number(quantidade.replace(',', '.'));
    const preco = Number(precoUnitario.replace(',', '.'));

    if (nomeProduto.trim() === '') {
      avisar('Atenção', 'Digite o nome do produto.');
      return;
    }
    if (quantidade === '' || isNaN(qtd) || qtd <= 0) {
      avisar('Atenção', 'Digite uma quantidade válida.');
      return;
    }
    if (precoUnitario === '' || isNaN(preco) || preco < 0) {
      avisar('Atenção', 'Digite um preço válido.');
      return;
    }

    const dados = {
      nomeProduto: nomeProduto.trim(),
      quantidade: qtd,
      precoUnitario: preco,
    };

    try {
      if (editandoId) {
        await updateDoc(
          doc(db, 'users', auth.currentUser.uid, 'listas', listaId, 'produtos', editandoId),
          dados
        );
      } else {
        const refColecao = collection(
          db,
          'users',
          auth.currentUser.uid,
          'listas',
          listaId,
          'produtos'
        );
        await addDoc(refColecao, { ...dados, dataAdicao: serverTimestamp() });
      }
      limparFormulario();
    } catch (erro) {
      avisar('Erro', 'Não foi possível salvar o produto.');
    }
  };

  const editarProduto = (produto) => {
    setEditandoId(produto.id);
    setNomeProduto(produto.nomeProduto);
    setQuantidade(String(produto.quantidade));
    setPrecoUnitario(String(produto.precoUnitario));
  };

  const excluirProduto = (produto) => {
    confirmar(`Excluir "${produto.nomeProduto}"?`, async () => {
      try {
        await deleteDoc(
          doc(db, 'users', auth.currentUser.uid, 'listas', listaId, 'produtos', produto.id)
        );
        if (editandoId === produto.id) limparFormulario();
      } catch (erro) {
        avisar('Erro', 'Não foi possível excluir o produto.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formulario}>
        <TextInput
          style={styles.input}
          placeholder="Nome do produto"
          value={nomeProduto}
          onChangeText={setNomeProduto}
        />
        <View style={styles.linha}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Quantidade"
            value={quantidade}
            onChangeText={setQuantidade}
            keyboardType="numeric"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Preço unitário"
            value={precoUnitario}
            onChangeText={setPrecoUnitario}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.linha}>
          <TouchableOpacity style={[styles.botao, { flex: 1 }]} onPress={salvarProduto}>
            <Text style={styles.textoBotao}>
              {editandoId ? 'Salvar alteração' : 'Adicionar produto'}
            </Text>
          </TouchableOpacity>
          {editandoId && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={limparFormulario}
            >
              <Text style={styles.textoBotao}>Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum produto nesta lista.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nomeProduto}>{item.nomeProduto}</Text>
              <Text style={styles.detalhe}>
                {item.quantidade} x {formatarReais(item.precoUnitario)}
              </Text>
              <Text style={styles.totalItem}>
                Total: {formatarReais(item.quantidade * item.precoUnitario)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => editarProduto(item)}>
              <Text style={styles.editar}>Editar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => excluirProduto(item)}>
              <Text style={styles.excluir}>Excluir</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.rodape}>
        <Text style={styles.textoRodape}>Total da lista: {formatarReais(totalGeral)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  formulario: { padding: 15, backgroundColor: '#f5f5f5' },
  linha: { flexDirection: 'row' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#2e7d32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botaoCancelar: { backgroundColor: '#757575', marginLeft: 8 },
  textoBotao: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 15,
    marginTop: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  nomeProduto: { fontSize: 17, fontWeight: 'bold' },
  detalhe: { color: '#555' },
  totalItem: { color: '#2e7d32', fontWeight: 'bold' },
  editar: { color: '#1565c0', fontWeight: 'bold', marginRight: 12 },
  excluir: { color: '#c62828', fontWeight: 'bold' },
  vazio: { textAlign: 'center', color: '#888', marginTop: 30 },
  rodape: { backgroundColor: '#2e7d32', padding: 16, alignItems: 'center' },
  textoRodape: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});