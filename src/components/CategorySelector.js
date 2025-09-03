import React, { useState } from 'react';
import { Menu, Button, Chip } from 'react-native-paper';

const categories = ['Engineering', 'Social Sciences', 'Computer Science', 'Biology'];

export default function CategorySelector({ selectedCategory, onSelectCategory }) {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <>
      <Button onPress={openMenu} mode="outlined" style={{ marginTop: 10 }}>
        {selectedCategory || 'Select Category'}
      </Button>

      <Menu visible={visible} onDismiss={closeMenu} anchor={<></>}>
        {categories.map(cat => (
          <Menu.Item
            key={cat}
            title={cat}
            onPress={() => {
              onSelectCategory(cat);
              closeMenu();
            }}
          />
        ))}
      </Menu>

      {/* Alternatively, show as chips */}
      {categories.map(cat => (
        <Chip
          key={cat}
          selected={selectedCategory === cat}
          onPress={() => onSelectCategory(cat)}
          style={{ margin: 4 }}
        >
          {cat}
        </Chip>
      ))}
    </>
  );
}
