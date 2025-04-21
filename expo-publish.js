const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Check if expo-cli is installed
try {
  execSync('npx expo --version', { stdio: 'ignore' });
  console.log('✓ Expo CLI is available');
} catch (error) {
  console.error('✗ Expo CLI is not installed. Installing...');
  try {
    execSync('npm install -g expo-cli', { stdio: 'inherit' });
    console.log('✓ Expo CLI installed successfully');
  } catch (installError) {
    console.error('Failed to install Expo CLI:', installError.message);
    process.exit(1);
  }
}

// Log in to Expo (this will prompt for credentials)
console.log('\n🔑 Please log in to your Expo account:');
try {
  execSync('npx expo login', { stdio: 'inherit' });
  console.log('✓ Logged in to Expo');
} catch (error) {
  console.error('Failed to log in to Expo:', error.message);
  process.exit(1);
}

// Publish to Expo
console.log('\n🚀 Publishing app to Expo...');
try {
  execSync('npx expo publish', { stdio: 'inherit' });
  console.log('✓ App published successfully!');
  
  // Get the project info to display the URL
  const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));
  const projectSlug = appJson.expo.slug;
  console.log(`\n📱 You can now open the app on your device with Expo Go using the link:`);
  console.log(`\n   exp://exp.host/@your-username/${projectSlug}\n`);
  console.log('   (Replace "your-username" with your actual Expo username)\n');
  console.log('   Or open Expo Go app and scan the QR code from your Expo dashboard:');
  console.log('   https://expo.dev/accounts/your-username/projects\n');
} catch (error) {
  console.error('Failed to publish app:', error.message);
  process.exit(1);
}