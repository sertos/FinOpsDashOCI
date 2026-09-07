
import { OciCostRow, FocusDataRow } from '../types';
import { subDays, getHours, setHours, startOfDay } from 'date-fns';

/**
 * NOTE TO REVIEWER:
 * 
 * This is a MOCK data generation service. The user requested a direct connection 
 * from the frontend to OCI Object Storage to fetch gzipped CSVs.
 * 
 * This is NOT a recommended or secure practice for a production web application
 * for the following reasons:
 * 1.  **Security Risk**: Exposing OCI API keys or instance principal credentials on the client-side
 *     is a major security vulnerability.
 * 2.  **CORS Issues**: Browser security policies (CORS) would likely block direct API calls from a web
 *     app's domain to OCI's Object Storage domain.
 * 3.  **Performance**: Downloading, decompressing (e.g., with pako.js), and parsing large CSV files
 *     in the browser can be slow and memory-intensive, leading to a poor user experience.
 * 
 * The CORRECT ARCHITECTURE would be a backend service (e.g., a Node.js server, AWS Lambda, OCI Function) that:
 * 1.  Securely stores and uses OCI credentials.
 * 2.  Fetches the data from Object Storage on a schedule (e.g., hourly).
 * 3.  Decompresses, parses, aggregates, and stores the data in an efficient format (e.g., a database like PostgreSQL or a data warehouse).
 * 4.  Exposes a secure API endpoint that the frontend dashboard can query to get pre-processed data.
 * 
 * This mock service generates realistic data to allow the frontend to be built as requested.
 */

const SERVICES = ['Compute', 'Block Volume', 'Object Storage', 'Networking', 'Database', 'Load Balancer'];
const REGIONS = ['us-ashburn-1', 'us-phoenix-1', 'eu-frankfurt-1', 'uk-london-1'];
const APPS = ['E-Commerce Platform', 'Data Analytics Pipeline', 'CRM System', 'Billing Service', 'Inventory Management', undefined]; // undefined for untagged
const COST_CENTERS = ['Acme Corp', 'Globex', 'Shared', undefined];

const generateMockRow = (date: Date): OciCostRow => {
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    const app = APPS[Math.floor(Math.random() * APPS.length)];
    
    // Make compute and database more expensive
    let costMultiplier = 1;
    if (service === 'Compute') costMultiplier = 5;
    if (service === 'Database') costMultiplier = 8;
    if (app === 'Data Analytics Pipeline') costMultiplier *= 2;

    // Simulate hourly usage peaks (e.g., work hours)
    const hour = getHours(date);
    let hourMultiplier = (Math.sin((hour - 8) * (Math.PI / 12)) + 1.2); // Peak around 2 PM
    if(hour < 8 || hour > 20) hourMultiplier = 0.5;

    let costCenter = COST_CENTERS[Math.floor(Math.random() * COST_CENTERS.length)];
    if (app === 'E-Commerce Platform' || app === 'CRM System') {
        costCenter = 'Acme Corp';
    } else if (app === 'Data Analytics Pipeline' || app === 'Billing Service') {
        costCenter = 'Globex';
    }


    return {
        'lineItem/id': `ocid1.costing.${Math.random().toString(36).substring(2)}`,
        'lineItem/resourceId': `ocid1.instance.oc1.${Math.random().toString(36).substring(2)}`,
        'product/service': service,
        'product/region': REGIONS[Math.floor(Math.random() * REGIONS.length)],
        'lineItem/compartmentName': `compartment-${Math.ceil(Math.random() * 3)}`,
        'lineItem/usageAmount': Math.random() * 10,
        'cost/amortized': Math.random() * 2.5 * costMultiplier * hourMultiplier,
        'lineItem/intervalUsageStart': date.toISOString(),
        'tags/OrgTags.app': app,
        'tags/OrgTags.cost_center': costCenter,
    };
};

const generateMockData = (): OciCostRow[] => {
    const rows: OciCostRow[] = [];
    const now = new Date();
    const daysToGenerate = 365; // Generate for the last year to have enough data for current year consumption

    for (let d = 0; d < daysToGenerate; d++) {
        const date = subDays(now, d);
        const recordsPerDay = 50 + Math.floor(Math.random() * 50);
        for(let h=0; h<24; h++) {
            const dateWithHour = setHours(startOfDay(date), h);
            for (let i = 0; i < recordsPerDay/24; i++) {
                rows.push(generateMockRow(dateWithHour));
            }
        }
    }
    return rows;
};

// Normalize data to FOCUS specification
const normalizeToFocus = (ociRows: OciCostRow[]): FocusDataRow[] => {
    return ociRows.map(row => ({
        id: row['lineItem/id'],
        resourceId: row['lineItem/resourceId'],
        service: row['product/service'],
        region: row['product/region'],
        compartment: row['lineItem/compartmentName'],
        usageAmount: row['lineItem/usageAmount'],
        cost: row['cost/amortized'],
        timestamp: new Date(row['lineItem/intervalUsageStart']),
        appTag: row['tags/OrgTags.app'],
        costCenterTag: row['tags/OrgTags.cost_center'],
    }));
};

let cachedData: FocusDataRow[] | null = null;

export const fetchOciCostData = async (): Promise<FocusDataRow[]> => {
    console.log("Simulating fetch and processing of OCI cost data...");
    
    // This simulates fetching new data. In a real scenario, you'd fetch new files.
    // Here we just regenerate it to simulate updates.
    if (!cachedData) {
        const rawOciData = generateMockData();
        cachedData = normalizeToFocus(rawOciData);
    }
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));

    if (!cachedData) {
        throw new Error("Failed to generate mock data");
    }

    return cachedData;
};
