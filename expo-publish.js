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

// Check for EAS CLI and install if needed
console.log('\n📦 Checking for EAS CLI...');
try {
  execSync('npx eas --version', { stdio: 'ignore' });
  console.log('✓ EAS CLI is available');
} catch (error) {
  console.error('✗ EAS CLI is not installed. Installing...');
  try {
    execSync('npm install -g eas-cli', { stdio: 'inherit' });
    console.log('✓ EAS CLI installed successfully');
  } catch (installError) {
    console.error('Failed to install EAS CLI:', installError.message);
    process.exit(1);
  }
}

// Create eas.json if it doesn't exist
const easJsonPath = path.join(__dirname, 'eas.json');
if (!fs.existsSync(easJsonPath)) {
  console.log('\n📄 Creating eas.json configuration...');
  const easJson = {
    "cli": {
      "version": ">= 0.60.0"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "preview": {
        "distribution": "internal"
      },
      "production": {}
    },
    "submit": {
      "production": {}
    },
    "updates": {
      "preview": {
        "channel": "preview"
      },
      "production": {
        "channel": "production"
      }
    }
  };
  
  fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));
  console.log('✓ Created eas.json');
}

// Initialize the project with EAS
console.log('\n🔧 Initializing EAS project...');
try {
  execSync('npx eas build:configure', { stdio: 'inherit' });
  console.log('✓ EAS project initialized');
} catch (error) {
  console.warn('⚠️ EAS project configuration skipped or failed:', error.message);
  // Continue anyway as this might be optional
}

// Create and deploy an update
console.log('\n🚀 Creating and deploying an update...');
try {
  execSync('npx eas update --auto', { stdio: 'inherit' });
  console.log('✓ Update created and deployed successfully!');
  
  // Get the project info to display the URL
  const appJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8'));
  const projectSlug = appJson.expo.slug;
  console.log(`\n📱 You can now open the app on your device with Expo Go using the link:`);
  console.log(`\n   exp://exp.host/@your-username/${projectSlug}\n`);
  console.log('   (Replace "your-username" with your actual Expo username)\n');
  console.log('   Or open Expo Go app and scan the QR code from your Expo dashboard:');
  console.log('   https://expo.dev/accounts/your-username/projects\n');
} catch (error) {
  console.error('Failed to create and deploy update:', error.message);
  process.exit(1);
}