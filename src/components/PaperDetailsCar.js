import React from 'react';
import { Card, Paragraph, Title } from 'react-native-paper';

export default function PaperDetailsCard({ paper }) {
  if (!paper) return null;

  return (
    <Card style={{ marginTop: 20 }}>
      <Card.Title title={paper.title} subtitle={`Authors: ${paper.authors}`} />
      <Card.Content>
        <Paragraph>DOI: <a href={`https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer">{paper.doi}</a></Paragraph>
        <Paragraph>Category: {paper.category || 'Not tagged'}</Paragraph>
      </Card.Content>
    </Card>
  );
}
