// src/components/Vehicle/VehicleFormModal.jsx

import {
  Modal,
  TextInput,
  NumberInput,
  Button,
  Group,
} from '@mantine/core';
import { useState, useEffect } from 'react';

const VehicleFormModal = ({ opened, onClose, onSubmit, selectedVehicle }) => {
  // Form input states
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(null);
  const [plateNumber, setPlateNumber] = useState('');

  // populate
  useEffect(() => {
    if (selectedVehicle) {
      setMake(selectedVehicle.make || '');
      setModel(selectedVehicle.model || '');
      setYear(selectedVehicle.year || null);
      setPlateNumber(selectedVehicle.plateNumber || '');
    } else {
      setMake('');
      setModel('');
      setYear(null);
      setPlateNumber('');
    }
  }, [selectedVehicle]);

  // Handle form submission, input validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!make || !model || !plateNumber) {
      alert('Please fill in Make, Model, and Plate Number.');
      return;
    }

    const vehicleData = { make, model, year, plateNumber };
    onSubmit(vehicleData);
  };

  //return to frontend
  return (
    <Modal opened={opened} onClose={onClose} title={selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"} centered>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Make"
          placeholder="e.g., Toyota"
          value={make}
          onChange={(e) => setMake(e.target.value)}
          required
          mb="sm"
        />
        <TextInput
          label="Model"
          placeholder="e.g., Corolla"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          mb="sm"
        />
        <NumberInput
          label="Year"
          placeholder="e.g., 2020"
          value={year}
          onChange={setYear}
          min={1900}
          max={2100}
          mb="sm"
        />
        <TextInput
          label="Plate Number"
          placeholder="Unique plate number"
          value={plateNumber}
          onChange={(e) => setPlateNumber(e.target.value)}
          required
          disabled={!!selectedVehicle} 
          mb="md"
        />
        <Group position="right">
          <Button type="submit">{selectedVehicle ? "Update" : "Create"}</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default VehicleFormModal;
