// Test to verify the exact GitHub issue format matches our parser
import { extractProjectDataFromIssue } from './helpers/repo-extraction.js';

// This simulates the exact format that GitHub would generate from the issue template
const githubGeneratedIssueBody = `### Repository URL

https://github.com/test/sample-project

### Additional Tags (Optional)

architecture
bim
sustainability

### Supported Platforms

windows
linux
macos

### Frameworks/Technologies Used

react
threejs
electron

### Project Requirements

- [x] The project is hosted on GitHub
- [x] It has a clear open-source license (check your repo for a LICENSE file)
- [x] It is directly connected to the AEC (Architecture, Engineering, Construction) industry
- [x] The repository has a README file with project description`;

try {
    console.log('🧪 Testing GitHub issue format parsing...');
    console.log('Issue body:', githubGeneratedIssueBody);
    console.log('\n---\n');
    
    const result = extractProjectDataFromIssue(githubGeneratedIssueBody);
    console.log('✅ Parsing successful!');
    console.log('Extracted data:', JSON.stringify(result, null, 2));
    
    // Verify expected fields
    const checks = [
        { field: 'url', expected: 'https://github.com/test/sample-project', actual: result.url },
        { field: 'tags', expected: ['architecture', 'bim', 'sustainability'], actual: result.tags },
        { field: 'platforms', expected: ['windows', 'linux', 'macos'], actual: result.platforms },
        { field: 'frameworks', expected: ['react', 'threejs', 'electron'], actual: result.frameworks }
    ];
    
    checks.forEach(check => {
        if (JSON.stringify(check.actual) === JSON.stringify(check.expected)) {
            console.log(`✅ ${check.field}: ${JSON.stringify(check.actual)}`);
        } else {
            console.log(`❌ ${check.field}: Expected ${JSON.stringify(check.expected)}, got ${JSON.stringify(check.actual)}`);
        }
    });
    
} catch (error) {
    console.error('❌ Test failed:', error.message);
}
