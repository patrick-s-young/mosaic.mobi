import { 
  createAsyncThunk
} from '@reduxjs/toolkit';
const axios = require('axios');

export const renderMosaic = createAsyncThunk(
  'render/renderMosaic',
  async (url: string) => {
    const response = await axios({
      url,
      method: 'GET',
       responseType: 'blob'
     });
    return { renderBlob: response.data };
  }
);
