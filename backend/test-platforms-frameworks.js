// Quick test script to verify platform/framework extraction works
import { extractProjectDataFromIssue } from './helpers/repo-extraction.js';

const sampleIssueBody = `
### Repository URL
https://github.com/test/sample-project

### Additional Tags (Optional)
bim
architecture

### Supported Platforms
windows
linux
web

### Frameworks/Technologies Used
react
threejs
electron

### Project Requirements
- [x] The project is hosted on GitHub
- [x] It has a clear open-source license (check your repo for a LICENSE file)
- [x] It is directly connected to the AEC (Architecture, Engineering, Construction) industry
- [x] The repository has a README file with project description
`;

try {
    const result = extractProjectDataFromIssue(sampleIssueBody);
    console.log('✅ Platform/Framework extraction test passed!');
    console.log('Extracted data:', JSON.stringify(result, null, 2));
    
    // Verify the extracted data has the expected fields
    if (result.platforms && result.platforms.includes('windows') && result.platforms.includes('linux') && result.platforms.includes('web')) {
        console.log('✅ Platforms extracted correctly');
    } else {
        console.log('❌ Platforms not extracted correctly');
    }
    
    if (result.frameworks && result.frameworks.includes('react') && result.frameworks.includes('threejs') && result.frameworks.includes('electron')) {
        console.log('✅ Frameworks extracted correctly');
    } else {
        console.log('❌ Frameworks not extracted correctly');
    }
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
}
