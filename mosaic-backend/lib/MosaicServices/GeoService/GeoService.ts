import axios from 'axios';

export interface GeoLocation {
  country: string | null;
  region: string | null;
  city: string | null;
}

export default class GeoService {
  public async lookupLocation(ip: string): Promise<GeoLocation> {
    const empty: GeoLocation = { country: null, region: null, city: null };

    // private/loopback addresses (local dev, internal health checks) aren't geolocatable
    if (!ip || ip === '::1' || ip === '127.0.0.1' || /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.)/.test(ip)) {
      return empty;
    }

    try {
      const response = await axios.get(`http://ip-api.com/json/${ip}`, {
        params: { fields: 'status,country,regionName,city' },
        timeout: 3000
      });
      if (response.data?.status !== 'success') {
        return empty;
      }
      return {
        country: response.data.country ?? null,
        region: response.data.regionName ?? null,
        city: response.data.city ?? null
      };
    } catch (err) {
      console.log(`GeoService.lookupLocation err: ${err}`);
      return empty;
    }
  }
}
