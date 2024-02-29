import { TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Loader from '../../components/Loader';
import Scans from './Scans';
import axios from 'axios';
import Layout from '../components/Layout';


// ... (import statements remain the same)

function Homescreen() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [duplicatescans, setDuplicatescans] = useState([]);
  const [filteredScans, setFilteredScans] = useState([]); // New state for filtered scans
  const [searchkey, setSearchkey] = useState('');
  const [type, setType] = useState('all');
  const [scanTypes, setScanTypes] = useState([]);

  const user = JSON.parse(localStorage.getItem('currentuser'));

  if (!user) {
    window.location.href = '/userlog';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const scanData = (await axios.get('http://localhost:3500/scans/getallscans')).data;
        const typeData = (await axios.get('http://localhost:3500/stypes')).data;

        setScans(scanData);
        setDuplicatescans(scanData);
        setFilteredScans(scanData); // Initialize filteredScans with all scans
        setLoading(false);
        setScanTypes(typeData);
      } catch (error) {
        setError(true);
        console.log(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function filterBySearch() {
    const tempScans = duplicatescans.filter((scan) =>
      scan.sname.toLowerCase().includes(searchkey.toLowerCase())
    );
    setFilteredScans(tempScans); // Update filteredScans instead of scans
  }

  function filterByType(selectedType) {
    setType(selectedType);

    if (selectedType.toLowerCase() !== 'all') {
      const tempScans = duplicatescans.filter((scan) => scan.stype.toLowerCase() === selectedType.toLowerCase());
      setFilteredScans(tempScans);
    } else {
      setFilteredScans(duplicatescans);
    }
  }

  return (
    <>
      <Layout>
        <div className='col-md-3'>
          <TextField
            fullWidth
            type='text'
            label='Search Rooms'
            value={searchkey}
            onChange={(e) => setSearchkey(e.target.value)}
            onKeyUp={filterBySearch}
          />
        </div>

        <div className='col-md-2'>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => filterByType(e.target.value)}
              label='Type'
            >
              <MenuItem value='all'>All</MenuItem>
              {scanTypes.map((scanType) => (
                <MenuItem key={scanType._id} value={scanType.stype}>
                  {scanType.stype}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className='row justify-content-center mt-5'>
          {loading ? (
            <Loader />
          ) : (
            filteredScans.map((scan) => (
              <div className='col-md-9 mt-2' key={scan._id}>
                <Scans scan={scan} />
              </div>
            ))
          )}
        </div>
      </Layout>
    </>
  );
}

export default Homescreen;
