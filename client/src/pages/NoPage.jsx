// src/pages/NoPage.jsx

import { Title, Text, Container, Button, Group } from '@mantine/core';
import { Link } from 'react-router-dom';

const NoPage = () => {
  return (
    <Container size="sm" px="sm" py="xl" style={{ textAlign: 'center' }}>
      <Title order={1} mb="md">404 - Page Not Found</Title>
      <Text color="dimmed" mb="lg">
        Sorry, the page you're looking for doesn't exist.
      </Text>
      <Group position="center" wrap="wrap">
        <Button component={Link} to="/" color="blue">
          Back to Home
        </Button>
      </Group>
    </Container>
  );
};

export default NoPage;
