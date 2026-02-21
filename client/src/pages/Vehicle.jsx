import React, { useEffect, useState } from 'react';
import {
  Container,
  Title,
  Loader,
  Table,
  TextInput,
  NumberInput,
  Button,
  Group,
  Pagination,
  Alert,
  Select,
  ScrollArea,
} from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useLocation } from 'react-router-dom';
import VehicleFormModal from '../components/Vehicle/VehicleFormModal';
import { useLanguage } from '../contexts/LanguageContext';

const Vehicle = () => {
  // get current language from context
  const { lang } = useLanguage();
  const location = useLocation();

  // Multilingual text strings for the UI
  const text = {
    en: {
      title: "Vehicle Management",
      add: "Add Vehicle",
      search: "Search",
      make: "Make",
      model: "Model",
      year: "Year",
      noVehicles: "No vehicles found",
      make1: "Make",
      model1: "Model",
      year1: "Year",
      plateNumber1: "Plate Number",
      edit: "Edit",
      delete: "Delete",
      sortBy: "Sort By",
      order: "Order",
      action: "Actions",
      invalidId: "Invalid ID format. Please enter a valid 24-character MongoDB ObjectId."
    },
    zh: {
      title: "车辆管理",
      add: "新增车辆",
      search: "搜索",
      make: "品牌",
      model: "型号",
      year: "年份",
      noVehicles: "没有找到车辆",
      make1: "品牌",
      model1: "型号",
      year1: "年份",
      plateNumber1: "车牌号",
      edit: "编辑",
      delete: "删除",
      sortBy: "排序字段",
      order: "排序顺序",
      action: "操作",
      invalidId: "ID 格式无效，请输入 24 位有效的 MongoDB ObjectId。"
    }
  };

  //  State for raw search inputs (not applied until search is clicked)
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(null);
  const [searchId, setSearchId] = useState('');

  // applied filters
  const [filterMake, setFilterMake] = useState('');
  const [filterModel, setFilterModel] = useState('');
  const [filterYear, setFilterYear] = useState(null);
  const [filterId, setFilterId] = useState('');

  // sort & pagination
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [page, setPage] = useState(1);

  // data & status
  const [vehicles, setVehicles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // submission-time error
  const [submitError, setSubmitError] = useState(null);

  // modal
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;

  // Fetch paginated list according to filters & sort
  const fetchVehicles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterMake) params.set('make', filterMake);
      if (filterModel) params.set('model', filterModel);
      if (filterYear) params.set('year', filterYear);
      params.set('page', page);
      params.set('limit', 5);
      if (sortField) params.set('sortField', sortField);
      if (sortOrder) params.set('sortOrder', sortOrder);

      const res = await fetch(`${API_URL}/vehicles?${params.toString()}`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const { data, totalPages: tp } = await res.json();
      setVehicles(data);
      setTotalPages(tp);
    } catch {
      setError(text[lang].noVehicles);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission from search bar
  const handleSearch = async e => {
        e.preventDefault();
        const id = searchId.trim();
     
        if (id) {
          // Search by ID
          setVehicles([]);
          setTotalPages(1);
          setLoading(true);
          setError(null);
     
          try {
            const res = await fetch(`${API_URL}/vehicles/${id}`);
            if (res.status === 400) {
              alert(text[lang].invalidId);
            }
            else if (res.status === 204) {
            }
            else if (res.ok) {
              const data = await res.json();
              setVehicles([data]);
              setTotalPages(1);
            }
            else {
              throw new Error(`Unexpected status ${res.status}`);
            }
          } catch (err) {
            alert(err.message);
          } finally {
            setLoading(false);
          }
        } else {
          setFilterId('');
          setFilterMake(make.trim());
          setFilterModel(model.trim());
          setFilterYear(year);
          setPage(1);
        }
      };

  // Reset everything when navigating back to '/vehicles'
  useEffect(() => {
    if (location.pathname === '/vehicles') {
      setMake('');
      setModel('');
      setYear(null);
      setSearchId('');
      setFilterMake('');
      setFilterModel('');
      setFilterYear(null);
      setFilterId('');
      setSortField('');
      setSortOrder('');
      setPage(1);
    }
  }, [location.key, location.pathname]);

  // Trigger fetch when any filter/sort/page changes
  useEffect(() => {
    if (location.pathname !== '/vehicles') return;

    if (filterId) {
      // Fetch single vehicle by ID
      setLoading(true);
      fetch(`${API_URL}/vehicles/${filterId}`)
        .then(res => {
          if (res.status === 204 || res.status === 400) {
            setVehicles([]);
            setTotalPages(1);
            return null;
          }
          return res.json();
        })
        .then(data => data && setVehicles([data]))
        .catch(() => {
          setVehicles([]);
          setTotalPages(1);
        })
        .finally(() => setLoading(false));
    } else {
      fetchVehicles();
    }
  }, [
    location.pathname,
    location.key,
    page,
    filterMake,
    filterModel,
    filterYear,
    filterId,
    sortField,
    sortOrder,
  ]);

  // Handle form submission (create or update vehicle)
  const handleAddVehicle = async vehicleData => {
    setSubmitError(null);
    try {
      let url = `${API_URL}/vehicles`;
      let method = 'POST';
      if (selectedVehicle) {
        url = `${API_URL}/vehicles/${selectedVehicle._id}`;
        method = 'PUT';
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          
          alert(data.message || 'Vehicle with this plate number already exists.');
          return;
        }
        throw new Error(data.message || `Server returned ${res.status}`);
      }
      
      setModalOpened(false);
      setSelectedVehicle(null);
      fetchVehicles();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async id => {
    if (!window.confirm('Confirm delete?')) return;
    try {
      const res = await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setPage(1);
      fetchVehicles();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <Container size="md" px="sm" py="xl">
      <Title order={2}>{text[lang].title}</Title>

      <Group position="right" mb="sm" wrap="wrap">
        <Button
          styles={{ root: { backgroundColor: '#1c76c4', color: '#fff' } }}
          onClick={() => { setSelectedVehicle(null); setModalOpened(true); }}
        >
          {text[lang].add}
        </Button>
      </Group>

      {/* Search form */}
      <form onSubmit={handleSearch}>
        <Group mb="md" grow wrap="wrap">
          <TextInput
            label={text[lang].make}
            aria-label="Search by vehicle make"
            placeholder="e.g., Toyota"
            value={make}
            onChange={e => setMake(e.target.value)}
            icon={<IconSearch size={16} />}
          />
          <TextInput
            label={text[lang].model}
            aria-label="Search by vehicle model"
            placeholder="e.g., Corolla"
            value={model}
            onChange={e => setModel(e.target.value)}
          />
          <NumberInput
            label={text[lang].year}
            aria-label="Search by vehicle year"
            placeholder="e.g., 2020"
            value={year}
            onChange={setYear}
            min={1900}
            max={2100}
          />
          <TextInput
            label="Search by ID"
            aria-label="Search vehicles"
            placeholder="24-char ObjectId"
            value={searchId}
            onChange={e => setSearchId(e.target.value)}
          />
          <Button type="submit" styles={{ root: { backgroundColor: '#1c76c4', color: '#fff' } }}>
            {text[lang].search}
          </Button>
        </Group>

        {/* Sort options */}
        <Group mb="md" grow wrap="wrap">
          <Select
            label={text[lang].sortBy}
            placeholder="Select field"
            value={sortField}
            onChange={val => { setSortField(val); setFilterId(''); setPage(1); }}
            data={[
              { value: 'make', label: 'Make' },
              { value: 'year', label: 'Year' },
              { value: 'plateNumber', label: 'Plate Number' },
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

      {submitError && (
        <Alert color="red" mb="md">
          {submitError}
        </Alert>
      )}

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
                  <th>{text[lang].make1}</th>
                  <th>{text[lang].model1}</th>
                  <th>{text[lang].year1}</th>
                  <th>{text[lang].plateNumber1}</th>
                  <th>{text[lang].action}</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length > 0 ? vehicles.map(v => (
                  <tr key={v._id}>
                    <td>{v.make}</td>
                    <td>{v.model}</td>
                    <td>{v.year || '-'}</td>
                    <td>{v.plateNumber}</td>
                    <td>
                      <Group spacing="xs">
                        <Button
                          size="xs"
                          styles={{ root: { backgroundColor: '#0c8560', color: '#fff' } }}
                          onClick={() => { setSelectedVehicle(v); setModalOpened(true); }}
                        >
                          {text[lang].edit}
                        </Button>
                        <Button
                          size="xs"
                          styles={{ root: { backgroundColor: '#ca4141', color: '#fff' } }}
                          onClick={() => handleDeleteVehicle(v._id)}
                        >
                          {text[lang].delete}
                        </Button>
                      </Group>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5}>{text[lang].noVehicles}</td>
                  </tr>
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

      {/* Modal component for create/edit */}
      <VehicleFormModal
        opened={modalOpened}
        onClose={() => {
          setModalOpened(false);
          setSelectedVehicle(null);
        }}
        onSubmit={handleAddVehicle}
        selectedVehicle={selectedVehicle}
      />
    </Container>
  );
};

export default Vehicle;
