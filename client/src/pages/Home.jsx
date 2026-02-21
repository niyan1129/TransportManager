import { Container, Title, Text, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container size="md" px="sm" py="xl">
      <Title order={2} mb="md">Welcome to Driving Tasks Management System</Title>
      <Text mb="lg">
        This is a web application that manages drivers, vehicles, and trips. You can search, add, edit, and delete this information.
      </Text>

      <Group wrap="wrap" spacing="md">
        <Button
          component={Link}
          to="/drivers"
          aria-label="Check Drivers"
          styles={{ root: { backgroundColor: '#1c76c4', color: '#ffffff' } }}
        >
          Check Drivers
        </Button>
        <Button
          component={Link}
          to="/vehicles"
          aria-label="Check Vehicles"
          styles={{ root: { backgroundColor: '#0c8560', color: '#ffffff' } }}
        >
          Check Vehicles
        </Button>
        <Button
          component={Link}
          to="/trips"
          aria-label="Check Trips"
          styles={{ root: { backgroundColor: '#ca4141', color: '#ffffff' } }}
        >
          Check Trips
        </Button>
      </Group>
    </Container>
  );
};

export default Home;
