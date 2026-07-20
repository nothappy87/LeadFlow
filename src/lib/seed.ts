import getDb from "./db";

const CATEGORIES = [
  { name: "Real Estate", slug: "real-estate" },
  { name: "B2B Services", slug: "b2b-services" },
  { name: "Insurance", slug: "insurance" },
  { name: "Local Trades", slug: "local-trades" },
  { name: "Healthcare", slug: "healthcare" },
  { name: "Tech/IT", slug: "tech-it" },
  { name: "Legal", slug: "legal" },
  { name: "Finance", slug: "finance" },
  { name: "Education", slug: "education" },
  { name: "Other", slug: "other" },
];

interface LeadSeed {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  description: string;
  score: number;
}

const LEADS_BY_CATEGORY: Record<string, LeadSeed[]> = {
  "real-estate": [
    { company_name: "Skyline Properties", contact_name: "Michael Torres", email: "mtorres@skylineprop.example.com", phone: "+1-415-555-0101", description: "Looking for off-market multifamily deals in the Bay Area. Has closed 3 deals this quarter.", score: 87 },
    { company_name: "Greenleaf Realty Group", contact_name: "Sarah Chen", email: "schen@greenleaf.example.com", phone: "+1-303-555-0102", description: "Boutique brokerage expanding into commercial real estate. Needs lead generation for office spaces.", score: 72 },
    { company_name: "Coastal Homes LLC", contact_name: "David Park", email: "dpark@coastalhomes.example.com", phone: "+1-858-555-0103", description: "San Diego-based residential developer seeking buyers for new luxury townhome project.", score: 65 },
    { company_name: "Metro Property Management", contact_name: "Angela Russo", email: "arusso@metroprop.example.com", phone: "+1-312-555-0104", description: "Manages 500+ units across Chicago. Looking for tenant placement leads and property acquisition opportunities.", score: 58 },
    { company_name: "Evergreen Estates", contact_name: "James Woodward", email: "jwoodward@evergreen.example.com", phone: "+1-503-555-0105", description: "Pacific Northwest eco-friendly home builder. Seeking qualified buyers interested in sustainable housing.", score: 91 },
  ],
  "b2b-services": [
    { company_name: "Nexus Consulting Partners", contact_name: "Priya Kapoor", email: "pkapoor@nexus.example.com", phone: "+1-212-555-0201", description: "Management consulting firm targeting mid-market manufacturing companies for digital transformation projects.", score: 83 },
    { company_name: "CloudBridge Solutions", contact_name: "Tom Fletcher", email: "tfletcher@cloudbridge.example.com", phone: "+1-408-555-0202", description: "Cloud migration and DevOps consultancy. Currently pitching to 3 Fortune 500 prospects.", score: 76 },
    { company_name: "MarketReach Agency", contact_name: "Lisa Nguyen", email: "lnguyen@marketreach.example.com", phone: "+1-617-555-0203", description: "B2B demand generation agency looking to partner with SaaS companies for lead gen campaigns.", score: 69 },
    { company_name: "Apex HR Solutions", contact_name: "Robert Kim", email: "rkim@apexhr.example.com", phone: "+1-512-555-0204", description: "HR outsourcing for small businesses. Expanding into payroll and compliance services.", score: 54 },
    { company_name: "Vertex Supply Chain", contact_name: "Carla Mendez", email: "cmendez@vertexsc.example.com", phone: "+1-404-555-0205", description: "Logistics and supply chain optimization firm. Recently won a major retail distribution contract.", score: 77 },
  ],
  "insurance": [
    { company_name: "Guardian Life & Health", contact_name: "Steven O'Brien", email: "sobrien@guardianlh.example.com", phone: "+1-215-555-0301", description: "Independent agency expanding commercial lines. Actively seeking small business owner leads.", score: 71 },
    { company_name: "Pinnacle Insurance Brokers", contact_name: "Diana Walsh", email: "dwalsh@pinnacleins.example.com", phone: "+1-602-555-0302", description: "Specializes in high-net-worth personal lines. Needs qualified leads for luxury home and auto policies.", score: 88 },
    { company_name: "SafeHarbor Underwriters", contact_name: "Marcus Johnson", email: "mjohnson@safeharbor.example.com", phone: "+1-214-555-0303", description: "Cyber insurance MGA looking for distribution partners in the tech sector.", score: 63 },
    { company_name: "Allied Benefits Group", contact_name: "Rachel Torres", email: "rtorres@alliedbenefits.example.com", phone: "+1-813-555-0304", description: "Employee benefits broker targeting companies with 50-200 employees in Florida.", score: 59 },
    { company_name: "FirstGuard Insurance", contact_name: "Kevin Patel", email: "kpatel@firstguard.example.com", phone: "+1-916-555-0305", description: "Fast-growing auto insurer entering new state markets. Needs agency appointment leads.", score: 80 },
  ],
  "local-trades": [
    { company_name: "Apex Electrical Services", contact_name: "Jake Morrison", email: "jmorrison@apexelectric.example.com", phone: "+1-720-555-0401", description: "Residential and commercial electrician serving the Denver metro area. Looking for home renovation leads.", score: 66 },
    { company_name: "GreenScape Landscaping", contact_name: "Maria Flores", email: "mflores@greenscape.example.com", phone: "+1-407-555-0402", description: "Full-service landscaping company in Orlando. Seeking HOA and commercial property contracts.", score: 73 },
    { company_name: "Precision Plumbing Co", contact_name: "Dan Sullivan", email: "dsullivan@precisionplumb.example.com", phone: "+1-617-555-0403", description: "Emergency plumbing and HVAC. Expanding service area to include greater Boston suburbs.", score: 52 },
    { company_name: "TimberCraft Builders", contact_name: "Chris Hammond", email: "chammond@timbercraft.example.com", phone: "+1-503-555-0404", description: "Custom home builder and renovation specialist. Looking for homeowners planning major remodels.", score: 85 },
    { company_name: "FreshCoat Painting", contact_name: "Elena Vasquez", email: "evasquez@freshcoat.example.com", phone: "+1-702-555-0405", description: "Interior and exterior painting for residential and commercial clients in Las Vegas.", score: 48 },
  ],
  "healthcare": [
    { company_name: "MedCore Health Systems", contact_name: "Dr. Nina Shah", email: "nshah@medcore.example.com", phone: "+1-415-555-0501", description: "Multi-specialty medical group expanding into urgent care. Looking for partnership opportunities.", score: 79 },
    { company_name: "VitalPath Diagnostics", contact_name: "Alan Price", email: "aprice@vitalpath.example.com", phone: "+1-919-555-0502", description: "Lab services provider targeting independent physician practices in the Research Triangle area.", score: 62 },
    { company_name: "Springwell Senior Living", contact_name: "Janet Crosby", email: "jcrosby@springwell.example.com", phone: "+1-561-555-0503", description: "Assisted living and memory care facilities in South Florida. Seeking resident referral partners.", score: 74 },
    { company_name: "OrthoPro Physical Therapy", contact_name: "Mike Davidson", email: "mdavidson@orthopro.example.com", phone: "+1-312-555-0504", description: "Chain of PT clinics across the Midwest. Needs patient referral leads from orthopedic surgeons.", score: 56 },
    { company_name: "Nova Behavioral Health", contact_name: "Dr. Karen Liu", email: "kliu@novabh.example.com", phone: "+1-206-555-0505", description: "Mental health practice expanding telehealth services. Seeking corporate wellness program partnerships.", score: 90 },
  ],
  "tech-it": [
    { company_name: "QuantumLeap AI", contact_name: "Alex Rogan", email: "arogan@quantumleap.example.com", phone: "+1-650-555-0601", description: "Early-stage AI startup building conversational agents for customer service. Raising Series A.", score: 93 },
    { company_name: "NetSecure Corp", contact_name: "Diane Foster", email: "dfoster@netsecure.example.com", phone: "+1-703-555-0602", description: "Cybersecurity firm specializing in zero-trust architecture for government contractors.", score: 81 },
    { company_name: "DataPulse Analytics", contact_name: "Raj Mehta", email: "rmehta@datapulse.example.com", phone: "+1-512-555-0603", description: "Big data platform for e-commerce companies. Recently launched self-serve analytics product.", score: 68 },
    { company_name: "ShiftLeft DevOps", contact_name: "Yuki Tanaka", email: "ytanaka@shiftleft.example.com", phone: "+1-408-555-0604", description: "DevOps tooling company. Looking for enterprise accounts to pilot new CI/CD security scanner.", score: 75 },
    { company_name: "OmniNet Communications", contact_name: "Frank Wilson", email: "fwilson@omninet.example.com", phone: "+1-404-555-0605", description: "Managed IT services provider for SMBs in the Southeast. Expanding fiber network footprint.", score: 57 },
  ],
  "legal": [
    { company_name: "Harding & Associates LLP", contact_name: "Patricia Harding", email: "pharding@hardinglaw.example.com", phone: "+1-212-555-0701", description: "Corporate law firm specializing in M&A for tech companies. Seeking deal flow in SaaS sector.", score: 84 },
    { company_name: "Coastal Legal Group", contact_name: "Tony Ramirez", email: "tramirez@coastallegal.example.com", phone: "+1-305-555-0702", description: "Personal injury firm in Miami. Running ad campaigns and needs plaintiff lead qualification.", score: 67 },
    { company_name: "Evergreen IP Law", contact_name: "Helen Cho", email: "hcho@evergreenip.example.com", phone: "+1-206-555-0703", description: "IP boutique serving startups and inventors. Seeking patent filing leads in biotech and software.", score: 73 },
    { company_name: "NorthStar Immigration", contact_name: "Gabriel Santos", email: "gsantos@northstarimm.example.com", phone: "+1-619-555-0704", description: "Immigration law practice near the border. Needs corporate clients for H-1B and employment visas.", score: 61 },
    { company_name: "Civitas Family Law", contact_name: "Rachel Bloom", email: "rbloom@civitas.example.com", phone: "+1-312-555-0705", description: "Family law and divorce mediation in Chicago. Expanding mediation services for high-conflict cases.", score: 55 },
  ],
  "finance": [
    { company_name: "Meridian Wealth Advisors", contact_name: "Jonathan Blake", email: "jblake@meridianwealth.example.com", phone: "+1-203-555-0801", description: "RIA managing $500M+ AUM. Seeking HNW individuals in Connecticut and Westchester County.", score: 86 },
    { company_name: "Catalyst Venture Capital", contact_name: "Sofia Reyes", email: "sreyes@catalystvc.example.com", phone: "+1-650-555-0802", description: "Seed-stage VC focused on climate tech. Reviewing pitch decks and looking for founder referrals.", score: 78 },
    { company_name: "Harbor Mortgage Group", contact_name: "Paul Nguyen", email: "pnguyen@harbormtg.example.com", phone: "+1-714-555-0803", description: "Direct mortgage lender in Southern California. Needs first-time homebuyer leads.", score: 64 },
    { company_name: "Crescent Tax Advisors", contact_name: "Linda Park", email: "lpark@crescenttax.example.com", phone: "+1-972-555-0804", description: "Tax planning and preparation for small businesses. Looking for new clients ahead of tax season.", score: 71 },
    { company_name: "Atlas Financial Consulting", contact_name: "Derek Holmes", email: "dholmes@atlasfin.example.com", phone: "+1-617-555-0805", description: "Fractional CFO services for startups. Currently serving 12 clients, capacity for 5 more.", score: 59 },
  ],
  "education": [
    { company_name: "BrightPath Learning", contact_name: "Amanda Foster", email: "afoster@brightpath.example.com", phone: "+1-512-555-0901", description: "EdTech platform for K-12 STEM education. Piloting in 20 school districts across Texas.", score: 82 },
    { company_name: "SkillBridge Academy", contact_name: "Omar Hassan", email: "ohassan@skillbridge.example.com", phone: "+1-415-555-0902", description: "Online coding bootcamp. Seeking corporate training partnerships with tech companies.", score: 70 },
    { company_name: "Premier Tutoring Services", contact_name: "Grace Lee", email: "glee@premiertutor.example.com", phone: "+1-917-555-0903", description: "In-home and online tutoring matching platform. Expanding from NYC to tri-state area.", score: 58 },
    { company_name: "CampusConnect", contact_name: "Brian Okonkwo", email: "bokonkwo@campusconnect.example.com", phone: "+1-404-555-0904", description: "College recruitment platform connecting universities with prospective international students.", score: 76 },
    { company_name: "NextGen Learning Labs", contact_name: "Samantha Wu", email: "swu@nextgenlearning.example.com", phone: "+1-310-555-0905", description: "VR-based corporate training solution. Piloting with 3 Fortune 500 HR departments.", score: 89 },
  ],
  "other": [
    { company_name: "GreenEarth Nonprofit", contact_name: "David Nakamura", email: "dnakamura@greenearth.example.com", phone: "+1-802-555-1001", description: "Environmental advocacy org seeking corporate sponsors for annual fundraising gala.", score: 45 },
    { company_name: "UrbanEats Food Truck", contact_name: "Maria Santos", email: "msantos@urbaneats.example.com", phone: "+1-512-555-1002", description: "Popular Austin food truck looking to expand into catering for corporate events.", score: 53 },
    { company_name: "Pawsitive Pet Care", contact_name: "Jenny McAllister", email: "jmcallister@pawsitive.example.com", phone: "+1-503-555-1003", description: "Dog walking and pet sitting service in Portland. Seeking clients in new neighborhoods.", score: 39 },
    { company_name: "Studio 7 Photography", contact_name: "Carlos Mendez", email: "cmendez@studio7.example.com", phone: "+1-305-555-1004", description: "Wedding and event photography. Looking to partner with wedding planners and venues.", score: 61 },
    { company_name: "Peak Fitness Coaching", contact_name: "Tanya Brooks", email: "tbrooks@peakfitness.example.com", phone: "+1-720-555-1005", description: "Online personal training and nutrition coaching. Launching group program and needs enrollees.", score: 47 },
  ],
};

function seed() {
  const db = getDb();

  // Insert categories
  const insertCategory = db.prepare("INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)");
  for (const cat of CATEGORIES) {
    insertCategory.run(cat.name, cat.slug);
  }

  // Get category IDs
  const categories = db.prepare("SELECT id, slug FROM categories").all() as { id: number; slug: string }[];
  const catMap = new Map(categories.map((c) => [c.slug, c.id]));

  // Clear existing leads and re-seed
  db.prepare("DELETE FROM leads").run();

  const insertLead = db.prepare(`
    INSERT INTO leads (category_id, company_name, contact_name, email, phone, description, score, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'new', datetime('now', '-' || ? || ' days'))
  `);

  let totalLeads = 0;
  for (const [slug, leads] of Object.entries(LEADS_BY_CATEGORY)) {
    const catId = catMap.get(slug);
    if (!catId) continue;
    for (const lead of leads) {
      const daysAgo = Math.floor(Math.random() * 30);
      insertLead.run(catId, lead.company_name, lead.contact_name, lead.email, lead.phone, lead.description, lead.score, daysAgo);
      totalLeads++;
    }
  }

  console.log(`Seed complete: ${totalLeads} leads across ${CATEGORIES.length} categories.`);
}

seed();
