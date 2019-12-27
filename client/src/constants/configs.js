import {
  accesskey
} from './../../../config/production.json';

const CONFIGS = {
  // url: './public/resource/localdata.json'
  URL: 'http://13.125.91.246/v1',

  HEADER: new Headers({
    'x-access-token': accesskey,
    'Content-Type': 'application/json'
  })
};

export default CONFIGS;