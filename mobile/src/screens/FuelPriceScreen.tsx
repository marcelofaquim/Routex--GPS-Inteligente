import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { colors } from '../constants/colors';
import { useFuelPrice } from '../context/FuelPriceContext';

export default function FuelPriceScreen({ navigation }: any) {
    const { diesel, gasolina, etanol, setDiesel, setGasolina, setEtanol } = useFuelPrice();

    const [dieselInput, setDieselInput] = useState(diesel.toString());
    const [gasolinaInput, setGasolinaInput] = useState(gasolina.toString());
    const [etanolInput, setEtanolInput] = useState(etanol.toString());

    const handleSave = () => {
        const newDiesel = parseFloat(dieselInput);
        const newGasolina = parseFloat(gasolinaInput);
        const newEtanol = parseFloat(etanolInput);

        if(isNaN(newDiesel) || isNaN(newGasolina) || isNaN(newEtanol)) {
            Alert.alert('Erro', 'Digite valores validos');
            return;
        }

        setDiesel(newDiesel);
        setGasolina(newGasolina);
        setEtanol(newEtanol);

        Alert.alert('Sucesso', 'Preço atualizados!');
        navigation.goBack();
    }

         return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.label}>🛢️ Diesel (R$/L)</Text>
                <TextInput
                    style={styles.input}
                    value={dieselInput}
                    onChangeText={setDieselInput}
                    keyboardType="decimal-pad"
                    placeholder="5.60"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>⛽ Gasolina (R$/L)</Text>
                <TextInput
                    style={styles.input}
                    value={gasolinaInput}
                    onChangeText={setGasolinaInput}
                    keyboardType="decimal-pad"
                    placeholder="6.20"
                />
            </View>

            <View style={styles.card}>
                <Text style={styles.label}>🌽 Etanol (R$/L)</Text>
                <TextInput
                    style={styles.input}
                    value={etanolInput}
                    onChangeText={setEtanolInput}
                    keyboardType="decimal-pad"
                    placeholder="4.30"
                />
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>💾 Salvar preços</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.dark, padding: 20 },
    card: { backgroundColor: colors.black, borderRadius: 12, padding: 16, marginBottom: 16 },
    label: { fontSize: 16, color: colors.white, marginBottom: 8 },
    input: { backgroundColor: colors.dark, borderRadius: 8, padding: 12, color: colors.white, fontSize: 18, borderWidth: 1, borderColor: colors.gray },
    saveButton: { backgroundColor: colors.secondary, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 20 },
    saveButtonText: { color: colors.black, fontWeight: 'bold', fontSize: 16 },
});
