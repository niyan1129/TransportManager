// src/pages/About.jsx

import { Container, Title, Text } from '@mantine/core';

const About = () => {
  return (
    <Container size="md" px="sm" py="xl">
      <Title order={2} mb="md">About</Title>
      <Text mb="sm">
        This is a transport management web application designed to manage drivers, vehicles, and trips. It is built using Node.js, Express.js, MongoDB (via Mongoose), React, and Mantine UI.
      </Text>
      <Text>
        Developed by Ni Yan for IFN666 Web and Mobile Application Development at Queensland University of Technology.
      </Text>
    </Container>
  );
};

export default About;
