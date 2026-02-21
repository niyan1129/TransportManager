// src/pages/Layout.jsx

import { useState } from 'react';
import {
  AppShell,
  Container,
  Group,
  Anchor,
  Text,
  Button,
} from '@mantine/core';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Define navigation links
const links = [
  { link: '/', label: 'Home' },
  { link: '/drivers', label: 'Drivers' },
  { link: '/vehicles', label: 'Vehicles' },
  { link: '/trips', label: 'Trips' },
  { link: '/about', label: 'About' },
];

const Layout = () => {
  const [active, setActive] = useState(links[0].link);
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();

  // Generate navigation items
  const items = links.map((link) => {
    const isActive = active === link.link;
    const linkColor = isActive ? '#1c76c4' : '#1c76c4'; // Use high contrast color

    if (link.link === '/trips') {
      return (
        <Anchor
          key={link.label}
          component="button"
          aria-label={link.label}
          onClick={() => {
            navigate('/trips', { replace: true });
            setActive(link.link);
          }}
          style={{
            marginRight: '15px',
            cursor: 'pointer',
            color: linkColor,
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
          }}
        >
          {link.label}
        </Anchor>
      );
    } else {
      return (
        <Anchor
          key={link.label}
          component={Link}
          to={link.link}
          aria-label={link.label}
          onClick={() => setActive(link.link)}
          style={{
            marginRight: '15px',
            color: linkColor,
            textDecoration: 'none',
            fontWeight: isActive ? 'bold' : 'normal',
          }}
        >
          {link.label}
        </Anchor>
      );
    }
  });

  return (
    <AppShell header={{ height: 50, padding: 'md' }} padding="md">
      {/* Navigation Bar */}
      <AppShell.Header>
        <Container size="md" px="sm">
          <Group position="apart" wrap="wrap">
            <Text 
              size="xl" 
              sx={{ fontWeight: 900, color: '#FF0000' }}
            >Transport Manager</Text>
            <Group spacing="xs" align="center" wrap="wrap">
              {items}
              <Button
                size="xs"
                variant="light"
                styles={{ root: { color: '#1a70ba', backgroundColor: '#e9f3fd' } }}
                onClick={() => setLang((prev) => (prev === 'en' ? 'zh' : 'en'))}
                aria-label="Switch Language"
              >
                {lang === 'en' ? '中文' : 'English'}
              </Button>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* Main content area */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Layout;
