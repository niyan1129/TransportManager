import React, { useEffect, useState } from 'react';
import {
  Container, Title, TextInput, Button, Group,
  Table, Loader, Pagination, Alert, Select, ScrollArea,
} from '@mantine/core';
import { IconSearch, IconPlus } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import TripFormModal from '../components/Trip/TripFormModal';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Trip = () => {
  const location = useLocation();

  // Input states (user's raw input for search)
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [tripId, setTripId] = useState('');

  // — Applied filters used in API requests —
  const [filterStart, setFilterStart] = useState('');
  const [filterEnd, setFilterEnd] = useState('');
  const [filterTripId, setFilterTripId] = useState('');

  // — Pagination & Sorting —
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);

  // Data and status states
  const [trips, setTrips] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // — Modal State —
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  // — Fetch trips (either by ID or list) —
  const fetchTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      // If Trip ID filter is set, fetch by ID
      if (filterTripId) {
        const res = await fetch(`${API_BASE_URL}/trips/${filterTripId}`);
        if (res.status === 400) {
          const body = await res.json().catch(() => ({}));
          alert(body.message || 'Invalid Trip ID format.');
          setTrips([]);
          setTotalPages(1);
          return;
        }
        if (res.status === 204) {
          setTrips([]);
          setTotalPages(1);
          return;
        }
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`);
        const data = await res.json();
        setTrips([data]);
        setTotalPages(1);
        return;
      }

      // Otherwise, fetch list with filters/pagination
      const qs = new URLSearchParams();
      qs.set('page', page);
      qs.set('limit', 5);
      if (filterStart) qs.set('startLocation', filterStart);
      if (filterEnd)   qs.set('endLocation',   filterEnd);
      if (sortField)   qs.set('sortField',     sortField);
      if (sortOrder)   qs.set('sortOrder',     sortOrder);

      const res = await fetch(`${API_BASE_URL}/trips?${qs.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setTrips(data.data);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
      setTrips([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters when user submits search
  const handleSearch = e => {
    e.preventDefault();
    setFilterTripId(tripId.trim());
    setFilterStart(startLocation.trim());
    setFilterEnd(endLocation.trim());
    setSortField('');
    setSortOrder('');
    setPage(1);
  };

  // Reset filters when navigating back to this page
  useEffect(() => {
    if (location.pathname === '/trips') {
      setStartLocation('');
      setEndLocation('');
      setTripId('');
      setFilterStart('');
      setFilterEnd('');
      setFilterTripId('');
      setSortField('');
      setSortOrder('');
      setPage(1);
      setTrips([]);
      setError(null);
    }
  }, [location.pathname, location.key]);

  //  Re-fetch data when filters/sort/page changes
  useEffect(() => {
    if (location.pathname === '/trips') {
      fetchTrips();
    }
  }, [
    location.pathname,
    filterStart,
    filterEnd,
    filterTripId,
    page,
    sortField,
    sortOrder,
  ]);

  // Handle form submit for adding/editing trips
  const handleAddOrEditTrip = async tripData => {
    try {
      const url = selectedTrip
        ? `${API_BASE_URL}/trips/${selectedTrip._id}`
        : `${API_BASE_URL}/trips`;
      const method = selectedTrip ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      if (res.status === 409) {
        const body = await res.json().catch(() => ({}));
        alert(body.message || 'Trip already exists.');
        return;
      }
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      setModalOpened(false);
      setSelectedTrip(null);
      fetchTrips();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async id => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/trips/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      fetchTrips();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container size="md" px="sm" py="xl">
      <Title order={2}>Trip Management</Title>

      <Group position="right" mb="sm" wrap="wrap">
        <Button
          leftSection={<IconPlus size={16} />}
          styles={{ root: { backgroundColor:'#1c76c4', color:'#fff' } }}
          onClick={() => { setSelectedTrip(null); setModalOpened(true); }}
        >
          Add Trip
        </Button>
      </Group>

      {/* Filter form */}
      <form onSubmit={handleSearch}>
        <Group mb="sm" grow wrap="wrap">
          <TextInput
            label="Start Location"
            aria-label="Search by start location"
            placeholder="e.g., Brisbane"
            value={startLocation}
            onChange={e => setStartLocation(e.target.value)}
            icon={<IconSearch size={16} />}
          />
          <TextInput
            label="End Location"
            aria-label="Search by end location"
            placeholder="e.g., Sydney"
            value={endLocation}
            onChange={e => setEndLocation(e.target.value)}
          />
        </Group>
        <Group mb="md" grow wrap="wrap">
          <TextInput
            label="Trip ID"
            aria-label="Search by Trip ID"
            placeholder="24-character MongoDB ObjectId"
            value={tripId}
            onChange={e => setTripId(e.target.value)}
          />
          <Button
            type="submit"
            aria-label="Search trips"
            styles={{ root: { backgroundColor:'#1c76c4', color:'#fff' } }}
          >
            Search
          </Button>
        </Group>
      </form>

      {/* Sorting */}
      <Group mb="md" grow >
        <Select
          label="Sort By"
          placeholder="Select filed"
          value={sortField}
          onChange={val => { setSortField(val); setPage(1); }}
          data={[
            { value:'startLocation', label:'Start Location' },
            { value:'endLocation',   label:'End Location' },
          ]}
        />
        <Select
          label="Order"
          value={sortOrder}
          placeholder="Select order"
          onChange={val => { setSortOrder(val); setPage(1); }}
          data={[
            { value:'asc',  label:'Ascending' },
            { value:'desc', label:'Descending' },
          ]}
        />
      </Group>

      {/* table*/}

      {loading ? (
        <Loader />
      ) : error ? (
        <Alert color="red">{error}</Alert>
      ) : (
        <>
          <ScrollArea>
            <Table striped highlightOnHover>
              <thead>
                <tr>
                  <th>Driver</th>
                  <th>Vehicle</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.length > 0 ? trips.map(t => (
                  <tr key={t._id}>
                    <td>{t.driver ? `${t.driver.firstName} ${t.driver.lastName}` : 'N/A'}</td>
                    <td>{t.vehicle?.plateNumber || 'N/A'}</td>
                    <td>{t.startLocation}</td>
                    <td>{t.endLocation}</td>
                    <td>{t.startTime?.slice(0,10) || '-'}</td>
                    <td>{t.endTime?.slice(0,10) || '-'}</td>
                    <td>
                      <Group spacing="xs">
                        <Button
                          size="xs"
                          styles={{ root:{ backgroundColor:'#0c8560', color:'#fff' } }}
                          onClick={() => { setSelectedTrip(t); setModalOpened(true); }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          styles={{ root:{ backgroundColor:'#ca4141', color:'#fff' } }}
                          onClick={() => handleDeleteTrip(t._id)}
                        >
                          Delete
                        </Button>
                      </Group>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={7}>No trips found</td></tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>
          
          <Group position="center" mt="md">
            <Pagination
              value={page}
              onChange={setPage}
              total={Math.max(totalPages,1)}
              color="blue"
            />
          </Group>
        </>
      )}

      {/* Modal for add/edit */}
      <TripFormModal
        opened={modalOpened}
        onClose={() => { setModalOpened(false); setSelectedTrip(null); }}
        onSubmit={handleAddOrEditTrip}
        selectedTrip={selectedTrip}
      />
    </Container>
  );
};

export default Trip;
