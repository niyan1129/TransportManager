import React, { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Loader,
  Table,
  TextInput,
  Button,
  Group,
  Pagination,
  Alert,
  Select,
  ScrollArea,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import DriverFormModal from '../components/Driver/DriverFormModal';
import { useLanguage } from '../contexts/LanguageContext';

const Driver = () => {
  // get current language from context
  const { lang } = useLanguage();
  const location = useLocation();

  //Multilingual text strings for the UI
  const text = {
    en: {
      title: "Driver Management",
      add: "Add Driver",
      search: "Search",
      firstName: "Search by First Name",
      licence: "Licence Number",
      id: "Search by ID",
      noDrivers: "No drivers found",
      firstName1: "First Name",
      lastName: "Last Name",
      licenceNumber1: "Licence Number",
      edit: "Edit",
      delete: "Delete",
      sortBy: "Sort By",
      order: "Order",
      action: "Actions",
      invalidId: "Invalid ID format. Please enter a valid 24-character MongoDB ObjectId."
    },
    zh: {
      title: "司机管理",
      add: "新增司机",
      search: "搜索",
      firstName: "按名字搜索",
      licence: "驾驶证号",
      id: "按ID搜索",
      noDrivers: "没有找到司机",
      firstName1: "名",
      lastName: "姓",
      licenceNumber1: "驾照号码",
      edit: "编辑",
      delete: "删除",
      sortBy: "排序字段",
      order: "排序顺序",
      action: "操作",
      invalidId: "ID 格式无效，请输入 24 位有效的 MongoDB ObjectId。"
    }
  };

  //  State for raw search inputs (not applied until search is clicked)
  const [searchName, setSearchName] = useState('');
  const [licenceNumber, setLicenceNumber] = useState('');
  const [searchId, setSearchId] = useState('');

  // applied filters (only updated on Search click)
  const [filterName, setFilterName] = useState('');
  const [filterLicence, setFilterLicence] = useState('');
  const [filterId, setFilterId] = useState('');

  // sort & pagination
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);

  // data & status
  const [drivers, setDrivers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // modal
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch paginated driver list according to filters & sort
  const fetchDrivers = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const params = new URLSearchParams();
      if (filterName) params.set('firstName', filterName);
      if (filterLicence) params.set('licenceNumber', filterLicence);
      params.set('page', page);
      params.set('limit', 5);
      if (sortField) params.set('sortField', sortField);
      if (sortOrder) params.set('sortOrder', sortOrder);
  
      const res = await fetch(`${API_URL}/drivers?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
  
      const resJson = await res.json();
      
  
      setDrivers(resJson.data || []);
      setTotalPages(resJson.totalPages || 1);
  
      // If no drivers found, show error message
      if ((resJson.data || []).length === 0) {
        setDrivers([]);
        setTotalPages(1);
        return;
      }
  
    } catch (err) {
      console.error(err);
      setError(text[lang].noDrivers);
    } finally {
      setLoading(false);
    }
  };

  // Search button handler, to click
  const handleSearch = async e => {
    e.preventDefault();
    const id = searchId.trim();

    if (id) {
      // ID-based search
      setDrivers([]);
      setTotalPages(1);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`${API_URL}/drivers/${id}`);
        const body = await res.json().catch(() => ({}));

        // input validation
        if (res.status === 400) {
          // invalid ObjectId format
          alert(text[lang].invalidId);
        } else if (res.status === 204) {
          // no driver found
        } else if (res.ok) {
          // single driver found
          setDrivers([body]);
          setTotalPages(1);
        } else {
          throw new Error(`Unexpected status ${res.status}`);
        }
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Standard query-based search
      setFilterName(searchName.trim());
      setFilterLicence(licenceNumber.trim());
      setFilterId('');
      setPage(1);
    }
  };

  // Reset filters when navigating back
  useEffect(() => {
    if (location.pathname === '/drivers') {
      setSearchName('');
      setLicenceNumber('');
      setSearchId('');
      setFilterName('');
      setFilterLicence('');
      setFilterId('');
      setSortField('');
      setSortOrder('');
      setPage(1);
    }
  }, [location.key, location.pathname]);

   // Fetch data when filters/sort/page change
  useEffect(() => {
    if (location.pathname !== '/drivers') return;

    if (filterId) {
      setLoading(true);
      fetch(`${API_URL}/drivers/${filterId}`)
        .then(res => {
          if (res.status === 204 || res.status === 400) {
            setDrivers([]);
            setTotalPages(1);
            return null;
          }
          return res.json();
        })
        .then(data => data && setDrivers([data]))
        .catch(() => {
          setDrivers([]);
          setTotalPages(1);
        })
        .finally(() => setLoading(false));
    } else {
      fetchDrivers();
    }
  }, [
    location.pathname,
    location.key,
    page,
    filterName,
    filterLicence,
    filterId,
    sortField,
    sortOrder,
  ]);

  // Add or update driver
  const handleAddDriver = async driverData => {
    try {
      const url = selectedDriver
        ? `${API_URL}/drivers/${selectedDriver._id}`
        : `${API_URL}/drivers`;
      const method = selectedDriver ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(driverData),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 409) {
          // 409
          alert(errData.message || 'Driver already exists.');
          return;
        }
        // other errors
        throw new Error(errData.message || `Server returned ${res.status}`);
      }
  
      // refresh the list after successful  submission
      setModalOpened(false);
      setSelectedDriver(null);
      fetchDrivers();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete driver by ID
  const handleDeleteDriver = async id => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      const res = await fetch(`${API_URL}/drivers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setPage(1);
      fetchDrivers();
    } catch {
      alert('Delete failed');
    }
  };

  
  return (
    <Container size="md" px="sm" py="xl">
      <Title order={2}>{text[lang].title}</Title>

      {/* Add driver button */}
      <Group position="right" mb="md" wrap="wrap">
        <Button
          type="button"
          styles={{ root: { backgroundColor: '#1c76c4', color: '#fff' } }}
          onClick={() => { setSelectedDriver(null); setModalOpened(true); }}
        >
          {text[lang].add}
        </Button>
      </Group>

      {/* Search form */}
      <form onSubmit={handleSearch}>
        <Group mb="sm" grow wrap="wrap">
          <TextInput
            aria-label="Search by first name"
            label={text[lang].firstName}
            placeholder="e.g., John"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            icon={<IconSearch size={16} />}
          />
          <TextInput
          aria-label="Search by licence number"
            label={text[lang].licence}
            placeholder="e.g., ABC123456"
            value={licenceNumber}
            onChange={e => setLicenceNumber(e.target.value)}
          />
          <TextInput
            aria-label="Search by MongoDB ObjectId"
            label={text[lang].id}
            placeholder="24-char ObjectId"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
          />
          <Button aria-label="Search drivers" type="submit" styles={{ root: { backgroundColor: '#1c76c4', color: '#fff' } }}>
            {text[lang].search}
          </Button>
        </Group>

        {/* Sort controls */}
        <Group mb="md" grow wrap="wrap">
          <Select
            label={text[lang].sortBy}
            placeholder="Select field"
            value={sortField}
            onChange={val => { setSortField(val); setFilterId(''); setPage(1); }}
            data={[
              { value: 'firstName', label: 'First Name' },
              { value: 'lastName', label: 'Last Name' },
              { value: 'licenceNumber', label: 'Licence Number' },
            ]}
          />
          <Select
            label={text[lang].order}
            placeholder="Select order"
            value={sortOrder}
            onChange={val => { setSortOrder(val); setFilterId(''); setPage(1); }}
            data={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
          />
        </Group>
      </form>

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
                  <th>{text[lang].firstName1}</th>
                  <th>{text[lang].lastName}</th>
                  <th>{text[lang].licenceNumber1}</th>
                  <th>{text[lang].action}</th>
                </tr>
              </thead>
              <tbody>
                {drivers.length > 0 ? drivers.map(d => (
                  <tr key={d._id}>
                    <td>{d.firstName}</td>
                    <td>{d.lastName}</td>
                    <td>{d.licenceNumber}</td>
                    <td>
                      <Group spacing="xs">
                        <Button
                          size="xs"
                          styles={{ root: { backgroundColor: '#0c8560', color: '#fff' } }}
                          onClick={() => { setSelectedDriver(d); setModalOpened(true); }}
                        >
                          {text[lang].edit}
                        </Button>
                        <Button
                          size="xs"
                          styles={{ root: { backgroundColor: '#ca4141', color: '#fff' } }}
                          onClick={() => handleDeleteDriver(d._id)}
                        >
                          {text[lang].delete}
                        </Button>
                      </Group>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan={4}>{text[lang].noDrivers}</td></tr>
                )}
              </tbody>
            </Table>
          </ScrollArea>

          <Pagination
            value={page}
            onChange={setPage}
            total={Math.max(totalPages, 1)}
            position="center"
            mt="md"
          />
        </>
      )}

      {/* Modal for Add / Edit */}
      <DriverFormModal
        opened={modalOpened}
        onClose={() => { setModalOpened(false); setSelectedDriver(null); }}
        onSubmit={handleAddDriver}
        selectedDriver={selectedDriver}
      />
    </Container>
  );
};

export default Driver;
