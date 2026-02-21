// src/components/Trip/TripFormModal.jsx

import {
  Modal,
  TextInput,
  Button,
  Group,
  Select,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useEffect, useState } from 'react';

const TripFormModal = ({ opened, onClose, onSubmit, selectedTrip }) => {
  // Form input state
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [driver, setDriver] = useState('');
  const [vehicle, setVehicle] = useState('');

  // Dropdown options
  const [driverOptions, setDriverOptions] = useState([]);
  const [vehicleOptions, setVehicleOptions] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Load driver and vehicle options on modal open
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const resDrivers = await fetch(`${API_BASE_URL}/drivers`);
        const resVehicles = await fetch(`${API_BASE_URL}/vehicles`);
        const driversData = await resDrivers.json();
        const vehiclesData = await resVehicles.json();
 
        // Format options for <Select>
        setDriverOptions(
          (driversData?.data || [])
            .filter(d => d && d._id && d.firstName && d.lastName) 
            .map(d => ({
              value: d._id,
              label: `${d.firstName} ${d.lastName}`,
            }))
        );

        setVehicleOptions(
          (vehiclesData?.data || [])
            .filter(v => v && v._id && v.plateNumber) 
            .map(v => ({
              value: v._id,
              label: v.plateNumber,
            }))
        );
      } catch (err) {
        console.error('Failed to load options:', err);
      }
    };

    if (opened) {
      fetchOptions();
    }
  }, [opened]);

  // populate form 
  useEffect(() => {
    if (selectedTrip) {
      setStartLocation(selectedTrip.startLocation || '');
      setEndLocation(selectedTrip.endLocation || '');
      setStartTime(selectedTrip.startTime ? new Date(selectedTrip.startTime) : null);
      setEndTime(selectedTrip.endTime ? new Date(selectedTrip.endTime) : null);
      setDriver(selectedTrip.driver?._id || '');
      setVehicle(selectedTrip.vehicle?._id || '');
    } else {
      setStartLocation('');
      setEndLocation('');
      setStartTime(null);
      setEndTime(null);
      setDriver('');
      setVehicle('');
    }
  }, [selectedTrip]);

  //handle submission, input validation
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startLocation || !endLocation || !startTime || !endTime || !driver || !vehicle) {
      alert('Please fill in all required fields.');
      return;
    }

    const tripData = { startLocation, endLocation, startTime, endTime, driver, vehicle };
    onSubmit(tripData);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={selectedTrip ? "Edit Trip" : "Add New Trip"} centered>
      <form onSubmit={handleSubmit}>
        <TextInput
          label="Start Location"
          value={startLocation}
          onChange={(e) => setStartLocation(e.target.value)}
          required
          mb="sm"
        />
        <TextInput
          label="End Location"
          value={endLocation}
          onChange={(e) => setEndLocation(e.target.value)}
          required
          mb="sm"
        />
        <DateTimePicker
          label="Start Time"
          value={startTime}
          onChange={setStartTime}
          required
          mb="sm"
        />
        <DateTimePicker
          label="End Time"
          value={endTime}
          onChange={setEndTime}
          required
          mb="sm"
        />
        <Select
          label="Driver"
          value={driver}
          onChange={setDriver}
          data={driverOptions}
          placeholder="Select driver"
          searchable
          required
          mb="sm"
        />
        <Select
          label="Vehicle"
          value={vehicle}
          onChange={setVehicle}
          data={vehicleOptions}
          placeholder="Select vehicle"
          searchable
          required
          mb="md"
        />
        <Group position="right">
          <Button type="submit">{selectedTrip ? "Update" : "Create"}</Button>
        </Group>
      </form>
    </Modal>
  );
};

export default TripFormModal;
