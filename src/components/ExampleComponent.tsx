import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// Define interface for props (if component accepts props)
interface ExampleComponentProps {
  title?: string; // ? means optional prop
  count: number;  // required prop
}

// Create functional component with TypeScript
const ExampleComponent: React.FC<ExampleComponentProps> = ({title = 'Default Title', count}) => {
  // State example with type
  const [counter, setCounter] = React.useState<number>(count);

  // Function example with type
  const handleIncrement = (): void => {
    setCounter(prev => prev + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.counter}>Count: {counter}</Text>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  counter: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
  },
});

export default ExampleComponent;
