import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const mapBoxToken = process.env.MAPBOX_TOKEN;
// const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// export const findGeocode = async (location: string) => {
//   const geoData = await geocoder
//     .forwardGeocode({
//       query: location,
//       limit: 1,
//     })
//     .send();
//   console.log(geoData.body.features[0].geometry);
//   return geoData.body.features[0].geometry;
// };
interface geoData {
  data: any;
}
export const findGeocode = async (location: string) => {
  try {
    const geoData: geoData = await axios.post(
      "https://maps.googleapis.com/maps/api/geocode/json",
      null,
      {
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          address: location,
          key: process.env.GGMAP_API,
        },
      }
    );
    // console.log(geoData.data.results[0], "geoData.data.results.geometry.");
    const coordinate = geoData.data.results[0].geometry.location;
    const res = {
      type: "Point",
      coordinates: [coordinate.lng, coordinate.lat],
    };
    return res;
  } catch (error: any) {
    console.log("retrieve geodata error", error);
  }
};
