// src/components/Driver/DriverFormModal.jsx

import { Modal, TextInput, Button, Group } from '@mantine/core';
import { useState, useEffect } from 'react';

const DriverFormModal = ({ opened, onClose, onSubmit, selectedDriver }) => {
  // State to hold form input values
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  
  // Populate form if editing an existing driver
  useEffect(() => {
    if (selectedDriver) {
      setFirstName(selectedDriver.firstName || '');
      setLastName(selectedDriver.lastName || '');
      setLicenceNumber(selectedDriver.licenceNumber || '');
    } else {
      // Reset form when adding new driver
      setFirstName('');
      setLastName('');
      setLicenceNumber('');
    }
  }, [selectedDriver]);

  // Handle form submission， input validator
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !licenceNumber) {
      alert('Please fill in First Name, Last Name, and Licence Number.');
      return;
    }

    const driverData = { firstName, lastName, licenceNumber };
    onSubmit(driverData);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={selectedDriver ? "Edit Driver" : "Add New Driver"} centered>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          mb="sm"
        />
        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          mb="sm"
        />
        <TextInput
          label="Licence Number"
          placeholder="Enter unique licence number"
          value={licenceNumber}
          onChange={(e) => setLicenceNumber(e.target.value)}
          required
          disabled={!!selectedDriver} 
          mb="md"
        />
        <Group position="right">
          <Button type="submit">{selectedDriver ? "Update" : "Create"}</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default DriverFormModal;
