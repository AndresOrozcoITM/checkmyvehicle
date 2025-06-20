const soap = require('soap');
const { SOAP_USER, SOAP_PASSWORD, SOAP_FLEET_ID, SOAP_WSDL_MOBILELIST, SOAP_WSDL_LASTLOCATION } = process.env;

// Function to get mobile list from SOAP service
async function getMobileList() {
  return new Promise((resolve, reject) => {
    soap.createClient(SOAP_WSDL_MOBILELIST, (err, client) => {
      if (err) {
        console.error("Error creating SOAP client for MobileList:", err.message);
        return reject(new Error(`Failed to create SOAP client: ${err.message}`));
      }

      const args = {
        User: SOAP_USER,
        Password: SOAP_PASSWORD,
        FleetId: SOAP_FLEET_ID
      };

      client.GET_MobileList(args, (err, result) => {
        if (err) {
          console.error("Error calling GET_MobileList:", err.message);
          return reject(new Error(`SOAP call failed: ${err.message}`));
        }
        // The result structure can be complex; inspect it to find the actual list
        // Assuming result.GET_MobileListResult.diffgram.NewDataSet.Table
        if (result && result.GET_MobileListResult && result.GET_MobileListResult.diffgram && result.GET_MobileListResult.diffgram.NewDataSet && result.GET_MobileListResult.diffgram.NewDataSet.Table) {
            console.log("Successfully fetched mobile list from SOAP.");
            // Ensure the result is always an array, even if it's a single item
            const vehicles = Array.isArray(result.GET_MobileListResult.diffgram.NewDataSet.Table) ?
                             result.GET_MobileListResult.diffgram.NewDataSet.Table :
                             [result.GET_MobileListResult.diffgram.NewDataSet.Table];
            resolve(vehicles);
        } else {
            console.warn("Unexpected SOAP response structure for GET_MobileList:", JSON.stringify(result, null, 2));
            resolve([]); // Resolve with empty array if structure is not as expected
        }
      });
    });
  });
}

// Function to get last location from SOAP service
async function getLastLocation(mId) {
  return new Promise((resolve, reject) => {
    soap.createClient(SOAP_WSDL_LASTLOCATION, (err, client) => {
      if (err) {
        console.error("Error creating SOAP client for LastLocation:", err.message);
        return reject(new Error(`Failed to create SOAP client: ${err.message}`));
      }

      const args = {
        User: SOAP_USER,
        Password: SOAP_PASSWORD,
        mId: mId
      };

      client.GET_LastLocation(args, (err, result) => {
        if (err) {
          console.error("Error calling GET_LastLocation:", err.message);
          return reject(new Error(`SOAP call failed: ${err.message}`));
        }
        // Assuming result.GET_LastLocationResult.diffgram.NewDataSet.Table
        if (result && result.GET_LastLocationResult && result.GET_LastLocationResult.diffgram && result.GET_LastLocationResult.diffgram.NewDataSet && result.GET_LastLocationResult.diffgram.NewDataSet.Table) {
            console.log(`Successfully fetched location for mId: ${mId}`);
            const locationData = result.GET_LastLocationResult.diffgram.NewDataSet.Table;
            // The locationData could be an array if multiple results, but usually single for last location
            const singleLocation = Array.isArray(locationData) ? locationData[0] : locationData;
            if (singleLocation && singleLocation.Latitude && singleLocation.Longitude) {
                resolve({
                    latitude: parseFloat(singleLocation.Latitude),
                    longitude: parseFloat(singleLocation.Longitude)
                });
            } else {
                console.warn("Unexpected or incomplete location data:", JSON.stringify(singleLocation, null, 2));
                reject(new Error("Location data not found or incomplete."));
            }
        } else {
            console.warn("Unexpected SOAP response structure for GET_LastLocation:", JSON.stringify(result, null, 2));
            reject(new Error("No location data found in SOAP response."));
        }
      });
    });
  });
}

module.exports = {
  getMobileList,
  getLastLocation
};