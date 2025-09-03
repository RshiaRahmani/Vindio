import React, { useState } from 'react';
import { ScrollView, View, Alert } from 'react-native';
import PaperSharingForm from '../components/PaperSharingForm';
import PaperDetailsCard from '../components/PaperDetailsCard';
import CategorySelector from '../components/CategorySelector';
import { Button } from 'react-native-paper';

export default function PaperShareScreen() {
  const [paper, setPaper] = useState(null);

  const handleSelectCategory = (category) => {
    setPaper(prev => ({ ...prev, category }));
  };

  const handleShare = async () => {
    if (!paper) {
      Alert.alert('No paper data to share');
      return;
    }
    try {
      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paper),
      });
      if (response.ok) {
        Alert.alert('Paper shared successfully');
      } else {
        Alert.alert('Failed to share paper');
      }
    } catch {
      Alert.alert('Network error');
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <PaperSharingForm onPaperFetched={setPaper} />
      <PaperDetailsCard paper={paper} />
      {paper && (
        <CategorySelector selectedCategory={paper.category} onSelectCategory={handleSelectCategory} />
      )}
      {paper && (
        <Button mode="contained" onPress={handleShare} style={{ marginTop: 20 }}>
          Share Paper
        </Button>
      )}
    </ScrollView>
  );
}
