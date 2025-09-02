const os = require('os');

function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const interface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      if (interface.family === 'IPv4' && !interface.internal) {
        return interface.address;
      }
    }
  }
  
  return 'localhost';
}

const ipAddress = getLocalIPAddress();
console.log('Your computer\'s IP address is:', ipAddress);
console.log('Update your API configuration to use:');
console.log(`http://${ipAddress}:5000/api`);
console.log('\nFor Android emulator, use: http://10.0.2.2:5000/api');
console.log('For iOS simulator, use: http://localhost:5000/api');
