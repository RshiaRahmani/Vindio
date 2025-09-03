import React, { useState } from 'react';
import { TextInput, Button, Text } from 'react-native-paper';

export default function PaperSharingForm({ onPaperFetched }) {
  const [doi, setDoi] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const validateDOI = (doi) => /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i.test(doi);

  const fetchPaperDetails = async (doi) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.crossref.org/works/${doi}`);
      const data = await response.json();
      setLoading(false);

      if (data.status === 'ok') {
        const item = data.message;
        onPaperFetched({
          title: item.title?.[0] || 'No title found',
          authors: item.author?.map(a => `${a.given} ${a.family}`).join(', ') || 'No authors found',
          doi: item.DOI,
          category: '',
        });
        setError(null);
      } else {
        setError('Paper not found');
      }
    } catch {
      setError('Error fetching paper details');
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!validateDOI(doi)) {
      setError("Invalid DOI format");
      return;
    }
    setError(null);
    fetchPaperDetails(doi);
  };

  return (
    <>
      <TextInput
        label="Enter DOI"
        value={doi}
        onChangeText={text => setDoi(text)}
        error={!!error}
        mode="outlined"
        disabled={loading}
      />
      {error && <Text style={{ color: 'red', marginTop: 4 }}>{error}</Text>}
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={{ marginTop: 10 }}
        loading={loading}
        disabled={loading}
      >
        Fetch Paper Details
      </Button>
    </>
  );
}
