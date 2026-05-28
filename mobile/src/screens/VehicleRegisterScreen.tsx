import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { veiculoService } from '../services/api';

interface Props {
    navigation: any;
    route?: any;
}

export default function VehicleRegisterScreen ({ navigation, route }: Props) {
    const veiculoEdit = route?.params?.veiculo;
    const isEdit = !!veiculoEdit;

     const [placa, setPlaca] = useState(veiculoEdit?.placa || '');
    const [marca, setMarca] = useState(veiculoEdit?.marca || '');
    const [modelo, setModelo] = useState(veiculoEdit?.modelo || '');
    const [ano, setAno] = useState(veiculoEdit?.ano?.toString() || '');
    const [tipo, setTipo] = useState(veiculoEdit?.tipo || 'carro');
    const [combustivel, setCombustivel] = useState(veiculoEdit?.combustivel || 'gasolina');
    const [consumo, setConsumo] = useState(veiculoEdit?.consumo_medio?.toString() || '');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        //validação
        if(!placa || !marca || !modelo || !ano || !consumo) {
            Alert.alert('Erro', 'Preencha todos os campos obrigatorios');
            return;
        
        }

         const veiculoData = {
            usuario_id: 1,
            placa: placa.toUpperCase(),
            marca,
            modelo,
            ano: parseInt(ano),
            tipo,
            combustivel,
            consumo_medio: parseFloat(consumo),
        };


         setLoading(true);
        try {
            if (isEdit) {
                await veiculoService.atualizar(veiculoEdit.id, veiculoData);
                Alert.alert('Sucesso', 'Veículo atualizado!');
            } else {
                await veiculoService.cadastrar(veiculoData);
                Alert.alert('Sucesso', 'Veículo cadastrado!');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar o veículo');
        } finally {
            setLoading(false);
        }

    };



    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.label}>Placa *</Text>
                <TextInput
                    style={styles.input}
                    value={placa}
                    onChangeText={setPlaca}
                    placeholder="ABC1234"
                    placeholderTextColor={colors.gray}
                    autoCapitalize="characters"
                />

                <Text style={styles.label}>Marca *</Text>
                <TextInput
                    style={styles.input}
                    value={marca}
                    onChangeText={setMarca}
                    placeholder="Ex: Fiat, Honda, Volvo"
                    placeholderTextColor={colors.gray}
                />

                <Text style={styles.label}>Modelo *</Text>
                <TextInput
                    style={styles.input}
                    value={modelo}
                    onChangeText={setModelo}
                    placeholder="Ex: Toro, CB500, FH540"
                    placeholderTextColor={colors.gray}
                />

                <Text style={styles.label}>Ano *</Text>
                <TextInput
                    style={styles.input}
                    value={ano}
                    onChangeText={setAno}
                    placeholder="2022"
                    placeholderTextColor={colors.gray}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Tipo de veículo</Text>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'carro' && styles.tipoButtonActive]}
                        onPress={() => setTipo('carro')}
                    >
                        <Text style={styles.tipoButtonText}>🚗 Carro</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'moto' && styles.tipoButtonActive]}
                        onPress={() => setTipo('moto')}
                    >
                        <Text style={styles.tipoButtonText}>🏍️ Moto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tipoButton, tipo === 'caminhao' && styles.tipoButtonActive]}
                        onPress={() => setTipo('caminhao')}
                    >
                        <Text style={styles.tipoButtonText}>🚚 Caminhão</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Combustível</Text>
                <View style={styles.rowButtons}>
                    <TouchableOpacity
                        style={[styles.combButton, combustivel === 'gasolina' && styles.combButtonActive]}
                        onPress={() => setCombustivel('gasolina')}
                    >
                        <Text style={styles.combButtonText}>⛽ Gasolina</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.combButton, combustivel === 'etanol' && styles.combButtonActive]}
                        onPress={() => setCombustivel('etanol')}
                    >
                        <Text style={styles.combButtonText}>🌽 Etanol</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.combButton, combustivel === 'diesel' && styles.combButtonActive]}
                        onPress={() => setCombustivel('diesel')}
                    >
                        <Text style={styles.combButtonText}>🛢️ Diesel</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.label}>Consumo médio (km/l) *</Text>
                <TextInput
                    style={styles.input}
                    value={consumo}
                    onChangeText={setConsumo}
                    placeholder="10.5"
                    placeholderTextColor={colors.gray}
                    keyboardType="numeric"
                />

                <TouchableOpacity
                    style={[styles.submitButton, loading && styles.submitButtonDisabled]}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.dark,
    },
    form: {
        padding: 20,
    },
    label: {
        color: colors.white,
        fontSize: 14,
        marginBottom: 8,
        marginTop: 12,
    },
    input: {
        backgroundColor: colors.black,
        borderRadius: 8,
        padding: 12,
        color: colors.white,
        fontSize: 16,
        borderWidth: 1,
        borderColor: colors.gray,
    },
    rowButtons: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 8,
    },
    tipoButton: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
    },
    tipoButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.secondary,
    },
    tipoButtonText: {
        color: colors.white,
    },
    combButton: {
        flex: 1,
        backgroundColor: colors.black,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.gray,
    },
    combButtonActive: {
        backgroundColor: colors.primary,
    },
    combButtonText: {
        color: colors.white,
    },
    submitButton: {
        backgroundColor: colors.secondary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
    },
    submitButtonDisabled: {
        opacity: 0.5,
    },
    submitButtonText: {
        color: colors.black,
        fontSize: 18,
        fontWeight: 'bold',
    },
});



